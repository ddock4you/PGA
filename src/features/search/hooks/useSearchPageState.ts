"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  GENERATION_VERSION_GROUP_MAP,
  getVersionGroupByGameId,
} from "@/features/generation/constants/generationData";
import { usePreferences } from "@/features/preferences/PreferencesContext";
import { useUnifiedSearchIndex } from "@/features/search/hooks/useUnifiedSearchIndex";
import { filterUnifiedEntriesByQuery } from "@/features/search/utils/searchLogic";
import type {
  UnifiedSearchEntry,
  UnifiedSearchIndex,
} from "@/features/search/types/unifiedSearchTypes";
import { buildSearchQueryString, parseSearchQueryString } from "@/lib/utils";

export type TabType = "all" | "pokemon" | "moves" | "abilities" | "items";

export function useSearchPageState() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state, setSelectedGenerationId, setSelectedGameId, setSelectedVersionGroup } =
    usePreferences();
  const { selectedGenerationId, selectedGameId, selectedVersionGroup } = state;
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const parsed = useMemo(() => {
    const search = searchParams.toString();
    return parseSearchQueryString(search ? `?${search}` : "");
  }, [searchParams]);

  useEffect(() => {
    if (parsed.generationId && parsed.generationId !== selectedGenerationId) {
      setSelectedGenerationId(parsed.generationId);
      if (!parsed.gameId) {
        setSelectedVersionGroup(GENERATION_VERSION_GROUP_MAP[parsed.generationId] ?? null);
      }
    }

    if (parsed.gameId && parsed.gameId !== selectedGameId) {
      setSelectedGameId(parsed.gameId);
      const versionGroup =
        getVersionGroupByGameId(parsed.gameId) ??
        (parsed.generationId
          ? GENERATION_VERSION_GROUP_MAP[parsed.generationId]
          : selectedVersionGroup);
      setSelectedVersionGroup(versionGroup ?? null);
    }
  }, [
    parsed,
    selectedGenerationId,
    selectedGameId,
    selectedVersionGroup,
    setSelectedGenerationId,
    setSelectedGameId,
    setSelectedVersionGroup,
  ]);

  const { data: unifiedSearchIndex, isLoading, isError } = useUnifiedSearchIndex();

  const results = useMemo(() => {
    if (!unifiedSearchIndex || !parsed.q)
      return { pokemon: [], moves: [], abilities: [], items: [] };

    const allResults = filterUnifiedEntriesByQuery(unifiedSearchIndex, parsed.q);

    const categorized = {
      pokemon: [] as UnifiedSearchEntry[],
      moves: [] as UnifiedSearchEntry[],
      abilities: [] as UnifiedSearchEntry[],
      items: [] as UnifiedSearchEntry[],
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
  }, [parsed.q, unifiedSearchIndex]);

  const handleSearchSubmit = (nextQuery: string) => {
    const trimmed = nextQuery.trim();
    if (!trimmed) return;
    const searchQuery = buildSearchQueryString({
      q: trimmed,
      generationId: "unified",
      gameId: null,
    });
    router.push(`/search?${searchQuery}`);
  };

  return {
    parsed,
    activeTab,
    setActiveTab,
    results,
    handleSearchSubmit,
    isLoading,
    isError,
  };
}
