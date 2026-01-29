"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDexCsvData } from "@/hooks/useDexCsvData";
import { useLocalizedMoveName } from "@/hooks/useLocalizedMoveName";
import { usePreferences } from "@/features/preferences";
import { DEFAULT_LIST_PAGE_SIZE } from "@/lib/pagination";
import { useLoadMore } from "@/hooks/useLoadMore";
import { useListRestoration } from "@/hooks/useListRestoration";
import { saveListState } from "@/lib/listState";
import type { DexMoveSummary } from "@/features/moves/types";
import { transformMovesForDex } from "@/features/moves/utils/transformMovesForDex";

export function useMovesList() {
  const router = useRouter();
  const pathname = usePathname();
  const { state } = usePreferences();
  const [searchQuery, setSearchQuery] = useState("");
  const [navigationType, setNavigationType] = useState<"push" | "pop">("push");

  const effectiveGenerationId = state.selectedGenerationId ?? "1";

  const {
    movesData,
    moveNamesData,
    machinesData,
    isLoading: isCsvLoading,
    isError: isCsvError,
  } = useDexCsvData();
  const { getLocalizedMoveName } = useLocalizedMoveName({ movesData, moveNamesData });

  const allMoves = useMemo(() => {
    if (!movesData || !machinesData) return [];
    return transformMovesForDex(movesData, machinesData, effectiveGenerationId);
  }, [movesData, machinesData, effectiveGenerationId]);

  const localizedMoves = useMemo(() => {
    if (!allMoves.length) return [];
    return allMoves.map((move) => ({
      ...move,
      displayName: getLocalizedMoveName(move.id),
    }));
  }, [allMoves, getLocalizedMoveName]);

  const filteredMoves = useMemo(() => {
    if (!localizedMoves.length) return [];
    if (!searchQuery.trim()) return localizedMoves;
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return localizedMoves.filter((move) => {
      const englishMatch = move.name.toLowerCase().includes(normalizedQuery);
      const koreanMatch = move.displayName?.toLowerCase().includes(normalizedQuery);
      return englishMatch || koreanMatch;
    });
  }, [localizedMoves, searchQuery]);

  const chunkQueryKey = useMemo(
    () => ["moves", effectiveGenerationId, searchQuery.trim()],
    [effectiveGenerationId, searchQuery]
  );

  const {
    items,
    totalPages,
    totalCount,
    currentPage,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isError: loadMoreError,
  } = useLoadMore<DexMoveSummary>({
    queryKey: chunkQueryKey,
    enabled: !isCsvLoading && !isCsvError,
    fetchPage: async (pageParam = 1) => {
      const pageSize = DEFAULT_LIST_PAGE_SIZE;
      const count = filteredMoves.length;
      const calculatedTotalPages = Math.max(1, Math.ceil(count / pageSize));
      const start = (pageParam - 1) * pageSize;
      return {
        page: pageParam,
        totalPages: calculatedTotalPages,
        totalCount: count,
        items: filteredMoves.slice(start, start + pageSize),
      };
    },
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handlePop = () => setNavigationType("pop");
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  useEffect(() => {
    if (navigationType === "pop") {
      const id = window.setTimeout(() => setNavigationType("push"), 0);
      return () => window.clearTimeout(id);
    }
    return undefined;
  }, [navigationType]);

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
      setNavigationType("push");
      router.push(`/moves/${id}`);
    },
    [currentPage, pathname, router]
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
    effectiveGenerationId,
  };
}
