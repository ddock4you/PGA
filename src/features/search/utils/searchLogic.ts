import type { UnifiedSearchEntry, UnifiedSearchIndex } from "../types/unifiedSearchTypes";

// 검색 우선순위 점수
const SEARCH_SCORES = {
  EXACT: 100, // 완전 일치
  STARTS: 80, // 시작 부분 일치
  CONTAINS: 60, // 포함
} as const;

// 단일 엔트리에 대한 검색 점수 계산
function calculateSearchScore(entry: UnifiedSearchEntry, query: string): number {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return 0;

  const name = entry.name?.toLowerCase() || "";

  // 완전 일치 (최고 우선순위)
  if (name === normalizedQuery) return SEARCH_SCORES.EXACT;
  if (name.startsWith(normalizedQuery)) return SEARCH_SCORES.STARTS;
  if (name.includes(normalizedQuery)) return SEARCH_SCORES.CONTAINS;

  return 0; // 일치하지 않음
}

// 통합 검색 필터링 함수
export function filterUnifiedEntriesByQuery(
  index: UnifiedSearchIndex,
  query: string
): UnifiedSearchEntry[] {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return [];

  // 모든 카테고리의 엔트리를 하나의 배열로 합침
  const allEntries = [...index.pokemon, ...index.moves, ...index.abilities, ...index.items];

  // 각 엔트리에 대해 검색 점수 계산
  const scoredEntries = allEntries
    .map((entry) => ({
      entry,
      score: calculateSearchScore(entry, trimmedQuery),
    }))
    .filter((item) => item.score > 0); // 일치하는 결과만 필터링

  // 점수 내림차순, 점수가 같으면 ID 오름차순으로 정렬
  return scoredEntries
    .sort((a, b) => {
      if (a.score !== b.score) {
        return b.score - a.score; // 점수 내림차순
      }
      return a.entry.id - b.entry.id; // ID 오름차순
    })
    .map((item) => item.entry);
}

// 카테고리별 검색 함수
export function filterEntriesByCategoryAndQuery(
  entries: UnifiedSearchEntry[],
  query: string
): UnifiedSearchEntry[] {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return [];

  const scoredEntries = entries
    .map((entry) => ({
      entry,
      score: calculateSearchScore(entry, trimmedQuery),
    }))
    .filter((item) => item.score > 0);

  return scoredEntries
    .sort((a, b) => {
      if (a.score !== b.score) {
        return b.score - a.score;
      }
      return a.entry.id - b.entry.id;
    })
    .map((item) => item.entry);
}

// 검색 결과 요약 함수
export function getSearchSummary(index: UnifiedSearchIndex, query: string) {
  const allResults = filterUnifiedEntriesByQuery(index, query);

  const summary = {
    total: allResults.length,
    pokemon: allResults.filter((e) => e.category === "pokemon").length,
    moves: allResults.filter((e) => e.category === "move").length,
    abilities: allResults.filter((e) => e.category === "ability").length,
    items: allResults.filter((e) => e.category === "item").length,
  };

  return { summary, results: allResults };
}
