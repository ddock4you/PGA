"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDexCsvData } from "@/hooks/useDexCsvData";
import { useLocalizedMoveName } from "@/hooks/useLocalizedMoveName";
import { usePreferences } from "@/features/preferences";
import { DEFAULT_LIST_PAGE_SIZE } from "@/lib/pagination";
import { useLoadMore } from "@/hooks/useLoadMore";
import { useListRestoration } from "@/hooks/useListRestoration";
import { saveListState } from "@/lib/listState";
import { useNavigationType } from "@/hooks/useNavigationType";
import type { DexMoveListItem } from "@/features/moves/types";
import { transformMovesForList } from "@/features/moves/utils/transformMovesForList";
import { matchesAnySearchText, normalizeSearchQuery } from "@/utils/searchText";

export function useMovesList() {
  const router = useRouter();
  const pathname = usePathname();
  const { state } = usePreferences();
  const [searchQuery, setSearchQuery] = useState("");
  const { navigationType, markPush } = useNavigationType();

  const effectiveGenerationId = state.selectedGenerationId ?? "1";

  const {
    movesData,
    moveNamesData,
    isLoading: isCsvLoading,
    isError: isCsvError,
  } = useDexCsvData();
  const { getLocalizedMoveName } = useLocalizedMoveName({ movesData, moveNamesData });

  const allMoves = useMemo(() => {
    if (!movesData) return [];
    return transformMovesForList(movesData, effectiveGenerationId);
  }, [movesData, effectiveGenerationId]);

  const localizedMoves = useMemo(() => {
    if (!allMoves.length) return [];
    return allMoves.map((move) => ({
      ...move,
      displayName: getLocalizedMoveName(move.id),
    }));
  }, [allMoves, getLocalizedMoveName]);

  const filteredMoves = useMemo(() => {
    if (!localizedMoves.length) return [];
    const normalizedQuery = normalizeSearchQuery(searchQuery);
    if (!normalizedQuery) return localizedMoves;
    return localizedMoves.filter((move) =>
      matchesAnySearchText([move.name, move.displayName], normalizedQuery)
    );
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
  } = useLoadMore<DexMoveListItem>({
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
      router.push(`/moves/${id}`);
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
    effectiveGenerationId,
  };
}
