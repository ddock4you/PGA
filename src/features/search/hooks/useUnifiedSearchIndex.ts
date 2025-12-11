import { useQuery } from "@tanstack/react-query";
import { buildUnifiedSearchIndex } from "../api/unifiedSearchIndexApi";
import type { UnifiedSearchIndex } from "../types/unifiedSearchTypes";

export function useUnifiedSearchIndex() {
  return useQuery<UnifiedSearchIndex>({
    queryKey: ["unifiedSearchIndex"],
    queryFn: buildUnifiedSearchIndex,
    meta: {
      persist: true,
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - CSV 데이터는 자주 변경되지 않음
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days - 메모리에 오래 유지
    refetchOnWindowFocus: false, // 윈도우 포커스 시 리페치 불필요
    refetchOnReconnect: false, // 재연결 시 리페치 불필요
    refetchOnMount: "always", // 마운트 시 항상 리페치 (캐시가 없으면 로드)
  });
}
