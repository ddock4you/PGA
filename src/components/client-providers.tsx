"use client";

import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import type { PersistedClient } from "@tanstack/react-query-persist-client";
import type { ReactNode } from "react";
import { clientQueryClient } from "@/lib/query-clients";
import localforage from "localforage";
import { getCacheMeta } from "@/lib/cache-strategy";

const CACHE_KEY_VERSION = 1;
const CURRENT_CACHE_KEY = `pga.react-query.cache.v${CACHE_KEY_VERSION}`;
const LEGACY_CACHE_KEYS = ["pga.react-query.cache.v0"];
const ALL_CACHE_KEYS = [...LEGACY_CACHE_KEYS, CURRENT_CACHE_KEY];

// IndexedDB persister 설정
const persister = {
  persistClient: async (client: PersistedClient) => {
    await localforage.setItem(CURRENT_CACHE_KEY, client);
  },
  restoreClient: async () => {
    for (const key of ALL_CACHE_KEYS) {
      const restored = await localforage.getItem<PersistedClient>(key);
      if (restored) {
        if (key !== CURRENT_CACHE_KEY) {
          await localforage.removeItem(key);
        }
        return restored;
      }
    }

    return undefined;
  },
  removeClient: async () => {
    await Promise.all(ALL_CACHE_KEYS.map((key) => localforage.removeItem(key)));
  },
};

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <PersistQueryClientProvider
      client={clientQueryClient}
      persistOptions={{
        persister,
        // 클라이언트 사이드 캐싱 대상만 persist, 로딩중인 쿼리는 제외
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            const cacheMeta = getCacheMeta(query.queryKey as readonly unknown[]);
            const isClientCache = cacheMeta.cacheStrategy !== "server";
            const isSuccess = query.state.status === "success";
            return isClientCache && isSuccess;
          },
        },
        // 최대 보관 기간: 7일
        maxAge: 1000 * 60 * 60 * 24 * 7,
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
