// 통합 검색 관련 타입 정의

export interface UnifiedSearchEntry {
  id: number;
  category: "pokemon" | "move" | "ability" | "item";
  names: {
    ja: string;
    ko: string;
    en: string;
  };
  // 추가 메타데이터 (선택사항 - 검색 결과 표시 시 유용)
  metadata?: {
    type?: string; // 포켓몬 타입 (콤마 구분)
    power?: number | null; // 기술 위력
    category?: string; // 도구 카테고리
    isHidden?: boolean; // 특성 숨겨진 여부
  };
}

export interface UnifiedSearchIndex {
  pokemon: UnifiedSearchEntry[];
  moves: UnifiedSearchEntry[];
  abilities: UnifiedSearchEntry[];
  items: UnifiedSearchEntry[];
}

export interface SearchResult {
  entries: UnifiedSearchEntry[];
  totalCount: number;
  query: string;
}

// 언어 ID 매핑 (PokéAPI/Pokémon games 기준)
export const LANGUAGE_MAP = {
  1: "ja", // 일본어 (Japanese)
  3: "ko", // 한국어 (Korean)
  9: "en", // 영어 (English)
} as const;

export type LanguageCode = (typeof LANGUAGE_MAP)[keyof typeof LANGUAGE_MAP];
