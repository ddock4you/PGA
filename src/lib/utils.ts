import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 검색 페이지(`/search`)에서 사용하는 쿼리 파라미터 스키마.
 *
 * - q   : 검색어
 * - gen : 세대 ID (예: "1")
 * - ver : 게임 ID (예: "sword")
 * - lang: 1차 언어 코드 (예: "ko")
 */
export interface SearchQueryParamsInput {
  q: string;
  generationId?: string | null;
  gameId?: string | null;
  language?: string | null;
}

export interface ParsedSearchQueryParams {
  q: string;
  generationId: string | null;
  gameId: string | null;
  language: string | null;
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

  if (params.language) {
    searchParams.set("lang", params.language);
  }

  return searchParams.toString();
}

export function parseSearchQueryString(search: string): ParsedSearchQueryParams {
  const raw = search.startsWith("?") ? search.slice(1) : search;
  const searchParams = new URLSearchParams(raw);

  const q = (searchParams.get("q") ?? "").trim();
  const generationId = searchParams.get("gen");
  const gameId = searchParams.get("ver");
  const language = searchParams.get("lang");

  return {
    q,
    generationId,
    gameId,
    language,
  };
}

