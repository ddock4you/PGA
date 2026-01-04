import { useMemo } from "react";
import { useDexCsvData } from "@/hooks/useDexCsvData";
import { TYPE_ID_TO_KOREAN_NAME } from "@/utils/dataTransforms";
import type { MoveChoice } from "../store/types";
import type { CsvMove } from "@/types/csvTypes";
import type { TypeMap } from "@/features/types/utils/typeEffectiveness";

/**
 * 퀴즈에서 사용할 기술 데이터를 로드하고 매핑하는 훅
 */
export function useTrainingMoves() {
  const { movesData, moveNamesData, isLoading, isError } = useDexCsvData();

  // 한국어 기술명 매핑 생성 (move_id -> name)
  const koreanMoveNames = useMemo(() => {
    const map = new Map<number, string>();
    if (moveNamesData) {
      moveNamesData.forEach((nameEntry) => {
        if (nameEntry.local_language_id === 3) {
          // 한국어
          map.set(nameEntry.move_id, nameEntry.name);
        }
      });
    }
    return map;
  }, [moveNamesData]);

  // 공격 기술만 필터링 (power > 0)
  const attackMoves = useMemo(() => {
    if (!movesData || !koreanMoveNames.size) return [];

    return movesData
      .filter((move) => move.power && move.power > 0) // 위력이 있는 기술만
      .map((move): CsvMove & { koreanName: string } => ({
        ...move,
        koreanName: koreanMoveNames.get(move.id) || move.identifier, // 한국어 없으면 영문 사용
      }));
  }, [movesData, koreanMoveNames]);

  return {
    moves: attackMoves,
    koreanMoveNames,
    isLoading,
    isError,
  };
}

/**
 * 특정 타입의 기술들을 MoveChoice[] 형태로 변환
 */
export function createMoveChoicesForType(
  moves: (CsvMove & { koreanName: string })[],
  typeId: number,
  defenderTypes: string[],
  typeMap: TypeMap,
  computeAttackMultiplier: (attackType: string, defenderTypes: string[], typeMap: TypeMap) => number
): MoveChoice[] {
  const typeMoves = moves.filter((move) => move.type_id === typeId);

  return typeMoves
    .map((move) => {
      const englishTypeName = Object.keys(TYPE_ID_TO_KOREAN_NAME).find(
        (key) => Number(key) === move.type_id
      );

      if (!englishTypeName) {
        console.warn(`Unknown type ID: ${move.type_id}`);
        return null;
      }

      const multiplier = computeAttackMultiplier(englishTypeName, defenderTypes, typeMap);

      return {
        id: move.id.toString(),
        name: move.koreanName,
        typeId: move.type_id,
        typeName: TYPE_ID_TO_KOREAN_NAME[move.type_id] || "unknown",
        multiplier,
        power: move.power || 0,
      };
    })
    .filter(Boolean) as MoveChoice[];
}
