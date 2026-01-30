import type { CsvMove } from "@/types/csvTypes";
import { getDamageClassName } from "@/utils/pokemonDataIds";
import { getKoreanTypeNameFromId } from "@/utils/pokemonTypes";

import type { DexMoveListItem } from "../types";

export function transformMovesForList(
  csvMoves: CsvMove[],
  generationId: string
): DexMoveListItem[] {
  const genId = parseInt(generationId, 10);

  const moves: DexMoveListItem[] = [];
  for (const move of csvMoves) {
    if (move.generation_id > genId) continue;

    moves.push({
      id: move.id,
      name: move.identifier,
      type: getKoreanTypeNameFromId(move.type_id),
      damageClass: getDamageClassName(move.damage_class_id),
      power: move.power,
      accuracy: move.accuracy,
      pp: move.pp,
    });
  }

  return [...moves].sort((a, b) => a.id - b.id);
}
