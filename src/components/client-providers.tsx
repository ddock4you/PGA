"use client";

import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { clientQueryClient } from "@/lib/query-clients";
import localforage from "localforage";
import { getCacheMeta } from "@/lib/cache-strategy";

// IndexedDB persister 설정
const persister = {
  persistClient: async (client: PersistedClient) => {
    await localforage.setItem("pga.react-query.cache.v1", client);
  },
  restoreClient: async () => {
    const restored = await localforage.getItem("pga.react-query.cache.v1");
    return restored ?? undefined;
  },
  removeClient: async () => {
    await localforage.removeItem("pga.react-query.cache.v1");
  },
};

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <PersistQueryClientProvider
      client={clientQueryClient}
      persistOptions={{
        persister,
        // 클라이언트 사이드 캐싱 대상만 persist
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => getCacheMeta(query.queryKey).cacheStrategy !== "server",
        },
        // 최대 보관 기간: 7일
        maxAge: 1000 * 60 * 60 * 24 * 7,
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
