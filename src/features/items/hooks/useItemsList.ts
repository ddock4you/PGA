"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDexCsvData } from "@/hooks/useDexCsvData";
import { transformItemsForDex } from "@/utils/dataTransforms";
import { useLoadMore } from "@/hooks/useLoadMore";
import { useListRestoration } from "@/hooks/useListRestoration";
import { saveListState } from "@/lib/listState";
import type { DexItemSummary } from "@/utils/dataTransforms";

const ITEMS_PER_PAGE = 30;

export function useItemsList() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [navigationType, setNavigationType] = useState<"push" | "pop">("push");

  const { itemsData, isLoading: isCsvLoading, isError: isCsvError } = useDexCsvData();

  const allItems = useMemo(() => {
    if (!itemsData) return [];
    return transformItemsForDex(itemsData);
  }, [itemsData]);

  const filteredItems = useMemo(() => {
    if (!allItems.length) return [];
    if (!searchQuery.trim()) return allItems;
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return allItems.filter((item) => item.name.toLowerCase().includes(normalizedQuery));
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
      const pageSize = ITEMS_PER_PAGE;
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
      router.push(`/items/${id}`);
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
  };
}
