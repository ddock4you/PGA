"use client";

import { useMemo } from "react";
import { filterUnifiedEntriesByQuery } from "@/features/search/utils/searchLogic";
import type {
  UnifiedSearchEntry,
  UnifiedSearchIndex,
} from "@/features/search/types/unifiedSearchTypes";

interface UnifiedSearchResults {
  pokemon: UnifiedSearchEntry[];
  moves: UnifiedSearchEntry[];
  abilities: UnifiedSearchEntry[];
  items: UnifiedSearchEntry[];
}

const EMPTY_RESULTS: UnifiedSearchResults = {
  pokemon: [],
  moves: [],
  abilities: [],
  items: [],
};

export function useUnifiedSearchResults(
  index: UnifiedSearchIndex | undefined,
  query: string | null
) {
  return useMemo<UnifiedSearchResults>(() => {
    if (!index || !query) {
      return EMPTY_RESULTS;
    }

    const allResults = filterUnifiedEntriesByQuery(index, query);
    const categorized: UnifiedSearchResults = {
      pokemon: [],
      moves: [],
      abilities: [],
      items: [],
    };

    for (const entry of allResults) {
      switch (entry.category) {
        case "pokemon":
          categorized.pokemon.push(entry);
          break;
        case "move":
          categorized.moves.push(entry);
          break;
        case "ability":
          categorized.abilities.push(entry);
          break;
        case "item":
          categorized.items.push(entry);
          break;
        default:
          break;
      }
    }

    return categorized;
  }, [index, query]);
}
