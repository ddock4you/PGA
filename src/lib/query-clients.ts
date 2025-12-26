import { QueryClient } from "@tanstack/react-query";

// 서버 사이드 Query Client (캐시 공유됨)
export const serverQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1분
      gcTime: 1000 * 60 * 5, // 5분
      retry: 1,
    },
  },
});

// 클라이언트 사이드 Query Client (IndexedDB persist)
export const clientQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 60 * 24, // 24시간
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
