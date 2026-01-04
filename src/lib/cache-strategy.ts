export type CacheStrategy = "server" | "client" | "both";

export interface CacheMeta {
  cacheStrategy: CacheStrategy;
  persist?: boolean;
  revalidate?: number;
  maxAge?: number;
}

export function getCacheMeta(queryKey: readonly unknown[]): CacheMeta {
  const namespace = queryKey[0];

  switch (namespace) {
    case "static":
    case "seo":
    case "metadata":
      return { cacheStrategy: "server", revalidate: 3600 * 24 };
    case "user":
    case "session":
    case "client":
      return { cacheStrategy: "client", persist: true, maxAge: 3600 * 24 * 7 };
    case "pokemon":
    case "pokemon-species":
    case "evolution-chain":
    case "move":
    case "ability":
    case "item":
    case "type":
      return { cacheStrategy: "both", persist: true, revalidate: 3600 };
    case "search":
    case "unified-search":
      return { cacheStrategy: "both", persist: true, revalidate: 1800 };
    case "pokemon-encounters":
      return {
        cacheStrategy: "client",
        persist: true,
        maxAge: 3600 * 24 * 30,
      };
    case "dynamic":
    case "encounters":
      return { cacheStrategy: "client", persist: true, maxAge: 3600 * 24 * 30 };
    default:
      return { cacheStrategy: "both", persist: false };
  }
}
