import type { CsvPokemon, CsvMove, CsvMachine, CsvNature, CsvItem } from "../types/csvTypes";

// 타입 ID와 이름 매핑 (PokéAPI 기준)
const TYPE_ID_TO_NAME: Record<number, string> = {
  1: "normal",
  2: "fighting",
  3: "flying",
  4: "poison",
  5: "ground",
  6: "rock",
  7: "bug",
  8: "ghost",
  9: "steel",
  10: "fire",
  11: "water",
  12: "grass",
  13: "electric",
  14: "psychic",
  15: "ice",
  16: "dragon",
  17: "dark",
  18: "fairy",
};

// 데미지 클래스 ID와 이름 매핑
const DAMAGE_CLASS_ID_TO_NAME: Record<number, string> = {
  2: "physical",
  3: "special",
  1: "status",
};

// 스탯 ID와 이름 매핑
const STAT_ID_TO_NAME: Record<number, string> = {
  1: "hp",
  2: "attack",
  3: "defense",
  4: "special-attack",
  5: "special-defense",
  6: "speed",
};

// 헬퍼 함수들
export function getTypeName(typeId: number): string {
  return TYPE_ID_TO_NAME[typeId] || "unknown";
}

export function getDamageClassName(damageClassId: number): string {
  return DAMAGE_CLASS_ID_TO_NAME[damageClassId] || "unknown";
}

export function getStatName(statId: number): string {
  return STAT_ID_TO_NAME[statId] || "unknown";
}

export function getGenerationIdFromVersionGroup(versionGroupId: number): number {
  // 버전 그룹 ID를 세대 ID로 변환하는 매핑
  // 실제로는 더 정확한 매핑이 필요하지만 간단히 구현
  const versionGroupToGeneration: Record<number, number> = {
    1: 1,
    2: 1,
    3: 1,
    4: 2,
    5: 2,
    6: 2,
    7: 3,
    8: 3,
    9: 3,
    10: 3,
    11: 4,
    12: 4,
    13: 4,
    14: 4,
    15: 5,
    16: 5,
    17: 5,
    18: 5,
    19: 6,
    20: 6,
    21: 6,
    22: 6,
    23: 6,
    24: 6,
    25: 7,
    26: 7,
    27: 7,
    28: 7,
    29: 7,
    30: 7,
    31: 7,
    32: 7,
    33: 8,
    34: 8,
    35: 8,
    36: 8,
    37: 9,
    38: 9,
    39: 9,
    40: 9,
  };
  return versionGroupToGeneration[versionGroupId] || 1;
}

// 포켓몬 데이터 변환
export interface DexPokemonSummary {
  id: number;
  name: string;
  number: string;
}

export function transformPokemonForDex(
  csvData: CsvPokemon[],
  generationId: string
): DexPokemonSummary[] {
  const genId = parseInt(generationId, 10);

  return csvData
    .filter((p) => p.is_default === 1) // 기본 형태만
    .sort((a, b) => a.order - b.order) // order 기준 정렬
    .map((p) => ({
      id: p.id,
      name: p.identifier, // 영문 이름 (나중에 다국어 매핑)
      number: `No.${p.id.toString().padStart(4, "0")}`,
    }));
}

// 기술 데이터 변환
export interface DexMoveSummary {
  id: number;
  name: string;
  type: string;
  damageClass: string;
  power: number | null;
  accuracy: number | null;
  pp: number;
  machines: CsvMachine[];
}

export function transformMovesForDex(
  csvMoves: CsvMove[],
  csvMachines: CsvMachine[],
  generationId: string
): DexMoveSummary[] {
  const genId = parseInt(generationId, 10);

  return csvMoves
    .filter((m) => m.generation_id <= genId)
    .map((move) => ({
      id: move.id,
      name: move.identifier,
      type: getTypeName(move.type_id),
      damageClass: getDamageClassName(move.damage_class_id),
      power: move.power,
      accuracy: move.accuracy,
      pp: move.pp,
      machines: csvMachines.filter((m) => m.move_id === move.id),
    }))
    .sort((a, b) => a.id - b.id);
}

// 특성 데이터 변환
export interface DexNatureSummary {
  id: number;
  name: string;
  increasedStat: string;
  decreasedStat: string;
}

export function transformNaturesForDex(csvNatures: CsvNature[]): DexNatureSummary[] {
  return csvNatures.map((nature) => ({
    id: nature.id,
    name: nature.identifier,
    increasedStat: getStatName(nature.increased_stat_id),
    decreasedStat: getStatName(nature.decreased_stat_id),
  }));
}

// 도구 데이터 변환
export interface DexItemSummary {
  id: number;
  name: string;
  category: string;
  cost: number;
}

export function transformItemsForDex(csvItems: CsvItem[]): DexItemSummary[] {
  return csvItems
    .map((item) => ({
      id: item.id,
      name: item.identifier,
      category: getItemCategoryName(item.category_id),
      cost: item.cost,
    }))
    .sort((a, b) => a.id - b.id);
}

// 아이템 카테고리 ID와 이름 매핑 (간단 버전)
function getItemCategoryName(categoryId: number): string {
  const categories: Record<number, string> = {
    1: "stat-boosts",
    2: "effort-drop",
    3: "medicine",
    4: "other",
    5: "in-a-pinch",
    6: "picky-healing",
    7: "type-protection",
    8: "baking-only",
    9: "collectibles",
    10: "evolution",
    11: "spelunking",
    12: "held-items",
    13: "choice",
    14: "effort-training",
    15: "bad-held-items",
    16: "training",
    17: "plates",
    18: "species-specific",
    19: "type-enhancement",
    20: "event-items",
    21: "gameplay",
    22: "plot-advancement",
    23: "unused",
    24: "loot",
    25: "all-mail",
    26: "vitamins",
    27: "healing",
    28: "pp-recovery",
    29: "revival",
    30: "status-cures",
    31: "mulch",
    32: "special-balls",
    33: "standard-balls",
    34: "dex-completion",
    35: "scarves",
    36: "all-machines",
    37: "flutes",
    38: "apricorn-balls",
    39: "apricorn-box",
    40: "data-cards",
    41: "jewels",
    42: "miracle-shooter",
    43: "mega-stones",
    44: "memories",
    45: "z-crystals",
    46: "species-candies",
    47: "dynamax-crystals",
    48: "nature-mints",
    49: "curry-ingredients",
    50: "catching-bonus",
  };
  return categories[categoryId] || "unknown";
}
