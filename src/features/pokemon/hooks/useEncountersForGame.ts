"use client";

import { useMemo } from "react";
import type { PokeApiEncounter } from "@/features/pokemon/types/pokeApiTypes";

export function useEncountersForGame({
  encounters,
  selectedGameId,
}: {
  encounters?: PokeApiEncounter[];
  selectedGameId?: string;
}) {
  return useMemo(() => {
    if (!encounters || encounters.length === 0) {
      return { filteredEncounters: [], hasEncounters: false };
    }

    const filteredEncounters = encounters.filter((encounter) =>
      selectedGameId
        ? encounter.version_details.some((vd) => vd.version.name === selectedGameId)
        : true
    );

    return {
      filteredEncounters,
      hasEncounters: true,
    };
  }, [encounters, selectedGameId]);
}
