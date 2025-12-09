// 도감 필터 관련 타입 정의

export interface DexFilters {
  // 1행 - 게임/세대 선택
  dexGenerationId: string; // 도감용 세대 ID
  includeSubGenerations: boolean; // 하위세대 포함

  // 1행 - 기본 포켓몬 필터
  onlyDefaultForms: boolean; // 기본 포켓몬만 보기

  // 2행 - 타입 필터
  selectedTypes: number[]; // 선택된 타입 ID 배열

  // 2행 - 특성 필터 (3세대 이상일 때만 활성화)
  selectedAbilityId?: number; // 선택된 특성 ID

  // 3행 - 몸무게 정렬
  sortByWeight: boolean;
  weightOrder: "asc" | "desc";

  // 4행 - 키 정렬
  sortByHeight: boolean;
  heightOrder: "asc" | "desc";

  // 5행 - 도감번호 정렬
  sortByDexNumber: boolean;
  dexNumberOrder: "asc" | "desc";
}

// 정렬 옵션 타입
export type SortOrder = "asc" | "desc";

// 필터 초기값
export const DEFAULT_DEX_FILTERS: DexFilters = {
  dexGenerationId: "9",
  includeSubGenerations: false,
  onlyDefaultForms: false,
  selectedTypes: [],
  selectedAbilityId: undefined,
  sortByWeight: false,
  weightOrder: "desc",
  sortByHeight: false,
  heightOrder: "desc",
  sortByDexNumber: false,
  dexNumberOrder: "asc",
};
