"use client";

import { useEffect, useRef, useState } from "react";
import { clearListState, readListState } from "@/lib/listState";

interface UseListRestorationParams {
  pathname: string;
  currentPage: number;
  hasNextPage?: boolean;
  fetchNextPage: () => Promise<unknown>;
  isFetchingNextPage: boolean;
  navigationType: "push" | "replace" | "pop" | null;
}

export function useListRestoration({
  pathname,
  currentPage,
  hasNextPage = false,
  fetchNextPage,
  isFetchingNextPage,
  navigationType,
}: UseListRestorationParams) {
  const [targetPageCount, setTargetPageCount] = useState<number | null>(null);
  const [targetScroll, setTargetScroll] = useState(0);
  const hasRestoredRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (navigationType !== "pop") {
      clearListState(pathname);
      return;
    }
    const saved = readListState(pathname);
    if (!saved) {
      return;
    }
    setTargetPageCount(Math.max(1, saved.pageCount));
    setTargetScroll(saved.scrollY ?? 0);
    clearListState(pathname);
    hasRestoredRef.current = false;
  }, [pathname, navigationType]);

  useEffect(() => {
    if (targetPageCount === null) return;
    if (currentPage < targetPageCount) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
      if (!hasNextPage) {
        setTargetPageCount(null);
      }
      return;
    }

    if (!hasRestoredRef.current) {
      hasRestoredRef.current = true;
      if (typeof window !== "undefined") {
        window.requestAnimationFrame(() => {
          window.scrollTo({ top: targetScroll, behavior: "auto" });
        });
      }
      setTargetPageCount(null);
    }
  }, [currentPage, fetchNextPage, hasNextPage, isFetchingNextPage, targetPageCount, targetScroll]);
}
