// useMoveNameResolver: CSV 데이터를 기반으로 기술 ID/identifier를 한국어명으로 해결하는 훅입니다.
"use client";

import { useCallback, useMemo } from "react";
import { useDexCsvData } from "@/hooks/useDexCsvData";
import type { CsvMove, CsvMoveName } from "@/types/csvTypes";

interface UseLocalizedMoveNameOptions {
  movesData?: CsvMove[];
  moveNamesData?: CsvMoveName[];
}

export function useMoveNameResolver(options: UseLocalizedMoveNameOptions = {}) {
  const { movesData: defaultMovesData, moveNamesData: defaultMoveNamesData } = useDexCsvData();

  const movesData = options.movesData ?? defaultMovesData;
  const moveNamesData = options.moveNamesData ?? defaultMoveNamesData;

  // CSV의 move_names 데이터를 한국어 전용 맵으로 캐싱합니다.
  const moveIdToKoreanName = useMemo(() => {
    const map = new Map<number, string>();
    moveNamesData.forEach((name) => {
      if (name.local_language_id === 3) {
        map.set(name.move_id, name.name);
      }
    });
    return map;
  }, [moveNamesData]);

  // move ID → identifier 맵은 영문 identifier fallback용으로 사용합니다.
  const moveIdToIdentifier = useMemo(() => {
    const map = new Map<number, string>();
    movesData?.forEach((move) => map.set(move.id, move.identifier));
    return map;
  }, [movesData]);

  // identifier → ID 맵은 identifier로 이름을 조회할 때 활용됩니다.
  const identifierToMoveId = useMemo(() => {
    const map = new Map<string, number>();
    movesData?.forEach((move) => map.set(move.identifier, move.id));
    return map;
  }, [movesData]);

  // 입력값이 ID, identifier, 혹은 move 객체인 경우에도 일관된 한국어/공백 처리된 이름을 반환합니다.
  const getMoveName = useCallback(
    (input?: number | string) => {
      if (input === undefined || input === null) return "";

      let moveId: number | undefined;

      if (typeof input === "number") {
        moveId = input;
      } else if (/^\d+$/.test(input)) {
        moveId = Number(input);
      } else {
        moveId = identifierToMoveId.get(input);
      }

      if (moveId !== undefined) {
        const korean = moveIdToKoreanName.get(moveId);
        if (korean) return korean;

        const identifier = moveIdToIdentifier.get(moveId);
        if (identifier) return identifier.replace(/-/g, " ");
      }

      if (typeof input === "string") {
        return input.replace(/-/g, " ");
      }

      return String(input);
    },
    [identifierToMoveId, moveIdToIdentifier, moveIdToKoreanName]
  );

  return { getMoveName };
}
