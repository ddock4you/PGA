"use client";

import { useEffect, useState } from "react";
import type { UnifiedSearchIndex } from "../types/unifiedSearchTypes";
import { buildUnifiedSearchIndex } from "../api/unifiedSearchIndexApi";

let cachedUnifiedSearchIndex: UnifiedSearchIndex | null = null;
let unifiedSearchIndexPromise: Promise<UnifiedSearchIndex> | null = null;

async function loadUnifiedSearchIndex(): Promise<UnifiedSearchIndex> {
  if (cachedUnifiedSearchIndex) {
    return cachedUnifiedSearchIndex;
  }

  if (unifiedSearchIndexPromise) {
    return unifiedSearchIndexPromise;
  }

  unifiedSearchIndexPromise = buildUnifiedSearchIndex().then((index) => {
    cachedUnifiedSearchIndex = index;
    unifiedSearchIndexPromise = null;
    return index;
  });

  return unifiedSearchIndexPromise;
}

export function useUnifiedSearchIndex() {
  const [data, setData] = useState<UnifiedSearchIndex | null>(cachedUnifiedSearchIndex);
  const [isLoading, setIsLoading] = useState(!cachedUnifiedSearchIndex);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (cachedUnifiedSearchIndex) {
      return;
    }

    let isMounted = true;
    loadUnifiedSearchIndex()
      .then((index) => {
        if (!isMounted) return;
        setData(index);
        setIsLoading(false);
        setIsError(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setIsLoading(false);
        setIsError(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, isLoading, isError };
}
