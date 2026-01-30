export interface SearchQueryParamsInput {
  q: string;
  generationId?: string | null;
  gameId?: string | null;
}

export interface ParsedSearchQueryParams {
  q: string;
  generationId: string | null;
  gameId: string | null;
}

export function buildSearchQueryString(params: SearchQueryParamsInput): string {
  const searchParams = new URLSearchParams();
  const trimmedQuery = params.q.trim();

  if (trimmedQuery) {
    searchParams.set("q", trimmedQuery);
  }

  if (params.generationId) {
    searchParams.set("gen", params.generationId);
  }

  if (params.gameId) {
    searchParams.set("ver", params.gameId);
  }

  return searchParams.toString();
}

export function parseSearchQueryString(search: string): ParsedSearchQueryParams {
  const raw = search.startsWith("?") ? search.slice(1) : search;
  const searchParams = new URLSearchParams(raw);

  const q = (searchParams.get("q") ?? "").trim();
  const generationId = searchParams.get("gen");
  const gameId = searchParams.get("ver");

  return {
    q,
    generationId,
    gameId,
  };
}
