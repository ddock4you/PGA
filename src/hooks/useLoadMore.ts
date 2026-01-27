"use client";

import { useMemo } from "react";
import type { InfiniteData, QueryKey } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";

export interface LoadMorePage<TItem> {
  page: number;
  totalPages: number;
  totalCount: number;
  items: TItem[];
}

export interface UseLoadMoreOptions<TItem> {
  queryKey: QueryKey;
  fetchPage: (pageParam: number) => Promise<LoadMorePage<TItem>>;
  enabled?: boolean;
  initialPageParam?: number;
  getNextPageParam?: (lastPage: LoadMorePage<TItem>) => number | undefined;
}

export function useLoadMore<TItem>(options: UseLoadMoreOptions<TItem>) {
  const { fetchPage, queryKey, enabled = true, initialPageParam = 1, getNextPageParam } = options;

  const defaultGetNextPageParam = (lastPage: LoadMorePage<TItem>) =>
    lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined;

  const query = useInfiniteQuery<
    LoadMorePage<TItem>,
    Error,
    InfiniteData<LoadMorePage<TItem>>,
    QueryKey,
    number
  >({
    queryKey,
    initialPageParam,
    queryFn: ({ pageParam = initialPageParam }) => fetchPage(pageParam),
    getNextPageParam: getNextPageParam ?? defaultGetNextPageParam,
    enabled,
  });

  const items = useMemo(() => query.data?.pages.flatMap((page) => page.items) ?? [], [query.data]);

  const currentPage = query.data?.pages.length ?? 0;
  const totalPages = query.data?.pages[0]?.totalPages ?? 0;
  const totalCount = query.data?.pages[0]?.totalCount ?? 0;

  return {
    ...query,
    items,
    currentPage,
    totalPages,
    totalCount,
  };
}
