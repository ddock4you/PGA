"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDexCsvData } from "@/hooks/useDexCsvData";
import { transformItemsForList } from "@/features/items/utils/transformItemsForList";
import { useLoadMore } from "@/hooks/useLoadMore";
import { useListRestoration } from "@/hooks/useListRestoration";
import { saveListState } from "@/lib/listState";
import { DEFAULT_LIST_PAGE_SIZE } from "@/lib/pagination";
import type { DexItemSummary } from "@/features/items/types/itemList";
import { useNavigationType } from "@/hooks/useNavigationType";
import { includesSearchText, normalizeSearchQuery } from "@/utils/searchText";

export function useItemsList() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const { navigationType, markPush } = useNavigationType();

  const { itemsData, isLoading: isCsvLoading, isError: isCsvError } = useDexCsvData();

  const allItems = useMemo(() => {
    if (!itemsData) return [];
    return transformItemsForList(itemsData);
  }, [itemsData]);

  const filteredItems = useMemo(() => {
    if (!allItems.length) return [];
    const normalizedQuery = normalizeSearchQuery(searchQuery);
    if (!normalizedQuery) return allItems;
    return allItems.filter((item) => includesSearchText(item.name, normalizedQuery));
  }, [allItems, searchQuery]);

  const chunkQueryKey = useMemo(() => ["items", searchQuery.trim()], [searchQuery]);

  const {
    items,
    totalPages,
    totalCount,
    currentPage,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isError: loadMoreError,
  } = useLoadMore<DexItemSummary>({
    queryKey: chunkQueryKey,
    enabled: !isCsvLoading && !isCsvError,
    fetchPage: async (pageParam = 1) => {
      const pageSize = DEFAULT_LIST_PAGE_SIZE;
      const count = filteredItems.length;
      const totalPagesOfResults = Math.max(1, Math.ceil(count / pageSize));
      const start = (pageParam - 1) * pageSize;
      return {
        page: pageParam,
        totalPages: totalPagesOfResults,
        totalCount: count,
        items: filteredItems.slice(start, start + pageSize),
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
      router.push(`/items/${id}`);
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
