// 도감 필터 관련 타입 정의
import type { GameVersion } from "@/features/generation/types/generationTypes";

export interface DexFilters {
  // 1행 - 게임/세대 선택
  dexGenerationId: string; // 도감용 세대 ID
  selectedGameVersion?: GameVersion; // 선택된 게임 버전 정보
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
  selectedGameVersion: undefined,
  includeSubGenerations: false,
  onlyDefaultForms: false, // 메가/거다이맥스/리전폼 등 모든 변형 포켓몬이 기본적으로 표시되도록 변경
  selectedTypes: [],
  selectedAbilityId: undefined,
  sortByWeight: false,
  weightOrder: "desc",
  sortByHeight: false,
  heightOrder: "desc",
  sortByDexNumber: false,
  dexNumberOrder: "asc",
};
