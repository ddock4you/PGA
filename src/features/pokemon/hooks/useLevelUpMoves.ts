"use client";

import { useMemo } from "react";
import type { PokeApiPokemon } from "@/features/pokemon/api/pokemonApi";
import type { MoveRow } from "@/features/pokemon/components/detail/moves/types/moveTypes";

export function useLevelUpMoves(
  moves: PokeApiPokemon["moves"],
  targetVersionGroup: string,
  buildRowFromDetail: (
    move: PokeApiPokemon["moves"][number],
    detail: PokeApiPokemon["moves"][number]["version_group_details"][number]
  ) => MoveRow
) {
  return useMemo(() => {
    const rows: MoveRow[] = [];
    for (const move of moves) {
      const detail = move.version_group_details.find(
        (versionDetail) =>
          versionDetail.move_learn_method.name === "level-up" &&
          versionDetail.version_group.name === targetVersionGroup
      );
      if (!detail) continue;
      const row = buildRowFromDetail(move, detail);
      rows.push({ ...row, level: detail.level_learned_at });
    }
    rows.sort((a, b) => (a.level ?? 0) - (b.level ?? 0));
    return rows;
  }, [moves, buildRowFromDetail, targetVersionGroup]);
}
