"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  buildSearchQueryString,
  parseSearchQueryString,
  type SearchQueryParamsInput,
} from "@/features/search/utils/queryString";

export function useSearchQueryParams() {
  const searchParams = useSearchParams();

  const parsed = useMemo(() => {
    const search = searchParams.toString();
    return parseSearchQueryString(search ? `?${search}` : "");
  }, [searchParams]);

  const buildQueryString = useCallback(
    (params: SearchQueryParamsInput) => buildSearchQueryString(params),
    []
  );

  return { parsed, buildQueryString };
}
