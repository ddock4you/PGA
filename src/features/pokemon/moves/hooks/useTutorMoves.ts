"use client";

import { useMemo } from "react";
import type { PokeApiPokemon } from "@/features/pokemon/types/pokeApiTypes";
import type { MoveRow } from "@/features/pokemon/moves/types/moveTypes";

export function useTutorMoves({
  moves,
  buildRowFromDetail,
  targetVersionGroup,
  selectedGenerationNumber,
}: {
  moves: PokeApiPokemon["moves"];
  buildRowFromDetail: (
    move: PokeApiPokemon["moves"][number],
    detail: PokeApiPokemon["moves"][number]["version_group_details"][number]
  ) => MoveRow;
  targetVersionGroup: string;
  selectedGenerationNumber: number;
}) {
  return useMemo(() => {
    if (selectedGenerationNumber < 3) return [];

    return moves
      .flatMap((move) =>
        move.version_group_details
          .filter(
            (detail) =>
              detail.move_learn_method.name === "tutor" &&
              detail.version_group.name === targetVersionGroup
          )
          .map((detail) => buildRowFromDetail(move, detail))
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [moves, buildRowFromDetail, targetVersionGroup, selectedGenerationNumber]);
}
