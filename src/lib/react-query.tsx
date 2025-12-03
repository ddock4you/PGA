import type { ReactNode } from "react";
import { QueryClient, type QueryClientConfig } from "@tanstack/react-query";
import {
  PersistQueryClientProvider,
  type PersistedClient,
  type Persister,
} from "@tanstack/react-query-persist-client";
import localforage from "localforage";

const QUERY_CACHE_KEY = "pga.react-query.cache.v1";

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      // PokéAPI 데이터 특성상 자주 변하지 않으므로 기본적으로 길게 캐싱
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 60 * 24, // 24시간
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
};

export const queryClient = new QueryClient(queryClientConfig);

// LocalForage(IndexedDB)에 React Query 캐시를 저장하기 위한 Persister
const persister: Persister = {
  persistClient: async (client: PersistedClient) => {
    await localforage.setItem<PersistedClient>(QUERY_CACHE_KEY, client);
  },
  restoreClient: async () => {
    const restored = await localforage.getItem<PersistedClient>(QUERY_CACHE_KEY);
    return restored ?? undefined;
  },
  removeClient: async () => {
    await localforage.removeItem(QUERY_CACHE_KEY);
  },
};

interface AppQueryProviderProps {
  children: ReactNode;
}

export function AppQueryProvider({ children }: AppQueryProviderProps) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        // 최대 보관 기간: 7일
        maxAge: 1000 * 60 * 60 * 24 * 7,
        // meta.persist === true 인 쿼리만 영속화 대상으로 선택
        dehydrateOptions: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          shouldDehydrateQuery: (query: any) => query.meta?.persist === true,
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
