"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useUnifiedSearchIndex } from "@/features/search/hooks/useUnifiedSearchIndex";
import { useSearchQueryParams } from "@/features/search/hooks/useSearchQueryParams";
import { useSyncSearchPreferences } from "@/features/search/hooks/useSyncSearchPreferences";
import { useUnifiedSearchResults } from "@/features/search/hooks/useUnifiedSearchResults";

export type TabType = "all" | "pokemon" | "moves" | "abilities" | "items";

export function useSearchPageState() {
  const router = useRouter();
  const { parsed, buildQueryString } = useSearchQueryParams();
  useSyncSearchPreferences(parsed);
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const { data: unifiedSearchIndex, isLoading, isError } = useUnifiedSearchIndex();

  const results = useUnifiedSearchResults(unifiedSearchIndex ?? undefined, parsed.q);

  const handleSearchSubmit = useCallback(
    (nextQuery: string) => {
      const trimmed = nextQuery.trim();
      if (!trimmed) return;
      const searchQuery = buildQueryString({
        q: trimmed,
        generationId: "unified",
        gameId: null,
      });
      router.push(`/search?${searchQuery}`);
    },
    [buildQueryString, router]
  );

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
