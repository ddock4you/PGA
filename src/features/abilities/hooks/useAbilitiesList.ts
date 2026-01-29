"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDexCsvData } from "@/hooks/useDexCsvData";
import { transformAbilitiesForDex } from "@/utils/dataTransforms";
import { useLoadMore } from "@/hooks/useLoadMore";
import { useListRestoration } from "@/hooks/useListRestoration";
import { saveListState } from "@/lib/listState";
import { DEFAULT_LIST_PAGE_SIZE } from "@/lib/pagination";
import type { DexAbilitySummary } from "@/utils/dataTransforms";
import { useNavigationType } from "@/hooks/useNavigationType";
import { matchesAnySearchText, normalizeSearchQuery } from "@/utils/searchText";

export function useAbilitiesList() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const { navigationType, markPush } = useNavigationType();

  const {
    abilitiesData,
    abilityNamesData,
    isLoading: isCsvLoading,
    isError: isCsvError,
  } = useDexCsvData();

  const allAbilities = useMemo(() => {
    if (!abilitiesData || !abilityNamesData) return [];
    return transformAbilitiesForDex(abilitiesData, abilityNamesData, 3, 9);
  }, [abilitiesData, abilityNamesData]);

  const filteredAbilities = useMemo(() => {
    if (!allAbilities.length) return [];
    const normalizedQuery = normalizeSearchQuery(searchQuery);
    if (!normalizedQuery) return allAbilities;
    return allAbilities.filter((ability) =>
      matchesAnySearchText([ability.name, ability.identifier], normalizedQuery)
    );
  }, [allAbilities, searchQuery]);

  const chunkQueryKey = useMemo(() => ["abilities", searchQuery.trim()], [searchQuery]);

  const {
    items,
    totalPages,
    totalCount,
    currentPage,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isError: loadMoreError,
  } = useLoadMore<DexAbilitySummary>({
    queryKey: chunkQueryKey,
    enabled: !isCsvLoading && !isCsvError,
    fetchPage: async (pageParam = 1) => {
      const pageSize = DEFAULT_LIST_PAGE_SIZE;
      const count = filteredAbilities.length;
      const totalPagesOfResults = Math.max(1, Math.ceil(count / pageSize));
      const start = (pageParam - 1) * pageSize;
      return {
        page: pageParam,
        totalPages: totalPagesOfResults,
        totalCount: count,
        items: filteredAbilities.slice(start, start + pageSize),
      };
    },
  });

  useListRestoration({
    pathname,
    currentPage,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    navigationType,
  });

  const handleRowClick = useCallback(
    (id: number) => {
      if (typeof window !== "undefined") {
        saveListState(pathname, { pageCount: Math.max(1, currentPage), scrollY: window.scrollY });
      }
      markPush();
      router.push(`/abilities/${id}`);
    },
    [currentPage, markPush, pathname, router]
  );

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return {
    searchQuery,
    handleSearchChange,
    isCsvLoading,
    isCsvError,
    totalCount,
    items,
    totalPages,
    currentPage,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    loadMoreError,
    handleRowClick,
  };
}
