import type {
  CsvPokemon,
  CsvMove,
  CsvMachine,
  CsvNature,
  CsvItem,
  CsvAbility,
  CsvAbilityName,
  CsvPokemonSpeciesName,
  CsvPokemonType,
} from "@/types/csvTypes";

// 타입 ID와 이름 매핑 (PokéAPI 기준)
export const TYPE_ID_TO_NAME: Record<number, string> = {
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

// 타입별 색상 도메인 (Tailwind CSS 클래스)
export const TYPE_COLORS: Record<string, string> = {
  normal: "bg-gray-400 text-white",
  fighting: "bg-red-600 text-white",
  flying: "bg-indigo-400 text-white",
  poison: "bg-purple-600 text-white",
  ground: "bg-yellow-600 text-white",
  rock: "bg-yellow-800 text-white",
  bug: "bg-green-500 text-white",
  ghost: "bg-purple-800 text-white",
  steel: "bg-gray-500 text-white",
  fire: "bg-red-500 text-white",
  water: "bg-blue-500 text-white",
  grass: "bg-green-600 text-white",
  electric: "bg-yellow-400 text-black",
  psychic: "bg-pink-500 text-white",
  ice: "bg-cyan-400 text-black",
  dragon: "bg-indigo-600 text-white",
  dark: "bg-gray-800 text-white",
  fairy: "bg-pink-400 text-black",
};

// 타입 ID와 한글 이름 매핑
export const TYPE_ID_TO_KOREAN_NAME: Record<number, string> = {
  1: "노말",
  2: "격투",
  3: "비행",
  4: "독",
  5: "땅",
  6: "바위",
  7: "벌레",
  8: "고스트",
  9: "강철",
  10: "불꽃",
  11: "물",
  12: "풀",
  13: "전기",
  14: "에스퍼",
  15: "얼음",
  16: "드래곤",
  17: "악",
  18: "페어리",
};

// 한글 타입 이름을 영문으로 변환하는 함수
export function getEnglishTypeName(koreanTypeName: string): string {
  const koreanToEnglish: Record<string, string> = {
    노말: "normal",
    격투: "fighting",
    비행: "flying",
    독: "poison",
    땅: "ground",
    바위: "rock",
    벌레: "bug",
    고스트: "ghost",
    강철: "steel",
    불꽃: "fire",
    물: "water",
    풀: "grass",
    전기: "electric",
    에스퍼: "psychic",
    얼음: "ice",
    드래곤: "dragon",
    악: "dark",
    페어리: "fairy",
  };
  return koreanToEnglish[koreanTypeName] || koreanTypeName.toLowerCase();
}

// 영문 타입 이름을 한글로 변환하는 함수
export function getKoreanTypeName(englishTypeName: string): string {
  const englishToKorean: Record<string, string> = {
    normal: "노말",
    fighting: "격투",
    flying: "비행",
    poison: "독",
    ground: "땅",
    rock: "바위",
    bug: "벌레",
    ghost: "고스트",
    steel: "강철",
    fire: "불꽃",
    water: "물",
    grass: "풀",
    electric: "전기",
    psychic: "에스퍼",
    ice: "얼음",
    dragon: "드래곤",
    dark: "악",
    fairy: "페어리",
  };
  return englishToKorean[englishTypeName] || englishTypeName;
}

// 포켓몬 이름을 한국어로 변환하는 함수
export function getKoreanPokemonName(
  englishName: string,
  speciesNamesData?: Array<{ pokemon_species_id: number; local_language_id: number; name: string }>
): string {
  if (!speciesNamesData) return englishName;

  // 먼저 포켓몬 ID를 찾아야 하는데, 영어 이름으로 species ID를 찾는 것은 복잡하다.
  // 간단하게 영어 이름을 직접 매핑하는 방식을 사용하거나,
  // API에서 가져온 데이터에 이미 한국어 이름이 포함되어 있는지 확인해야 한다.

  // 우선은 영어 이름을 반환하되, 향후 개선 가능
  return englishName;
}

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

// 세대별 포켓몬 ID 범위 (시작 ID, 종료 ID)
// 메가/거다이맥스 포켓몬들은 도입된 세대의 범위에 포함시킴
export const GENERATION_POKEMON_RANGES: Record<string, [number, number]> = {
  "1": [1, 151],
  "2": [152, 251],
  "3": [252, 386],
  "4": [387, 493],
  "5": [494, 649],
  "6": [650, 10077], // 메가 포켓몬들 포함 (10033-10077)
  "7": [722, 10078], // 7세대 메가 포켓몬들 포함
  "8": [810, 10228], // 거다이맥스 포켓몬들 포함 (10195-10228)
  "9": [906, 1010], // 현재까지 알려진 9세대 범위
};

// 메가 진화가 가능한 게임 버전들
export const MEGA_EVOLUTION_SUPPORTED_VERSIONS = new Set([
  "x",
  "y", // 6세대
  "omega-ruby",
  "alpha-sapphire", // 6세대
  "sun",
  "moon", // 7세대 (일부)
  "ultra-sun",
  "ultra-moon", // 7세대
  "lets-go-pikachu",
  "lets-go-eevee", // 7세대
]);

// 거다이맥스 진화가 가능한 게임 버전들
export const GIGANTAMAX_SUPPORTED_VERSIONS = new Set([
  "sword",
  "shield", // 8세대
  "brilliant-diamond",
  "shining-pearl", // 8세대 리메이크
  "legends-arceus", // 8세대
]);

// 특정 게임 버전에서 메가/거다이맥스 포켓몬을 표시할지 결정하는 함수
export function shouldShowVariantPokemon(
  pokemonName: string,
  selectedGameVersionId?: string
): boolean {
  if (!selectedGameVersionId) return true; // 게임 버전 미선택 시 모두 표시

  const hasMega = pokemonName.includes("-mega");
  const hasGmax = pokemonName.includes("-gmax");

  if (hasMega) {
    return MEGA_EVOLUTION_SUPPORTED_VERSIONS.has(selectedGameVersionId);
  }

  if (hasGmax) {
    return GIGANTAMAX_SUPPORTED_VERSIONS.has(selectedGameVersionId);
  }

  // 기본 포켓몬이나 다른 변형은 항상 표시
  return true;
}

// 헬퍼 함수들
export function getTypeName(typeId: number): string {
  return TYPE_ID_TO_KOREAN_NAME[typeId] || "unknown";
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
  types: string[];
}

export function transformPokemonForDex(
  csvData: CsvPokemon[],
  pokemonTypesData: CsvPokemonType[],
  pokemonSpeciesNamesData: CsvPokemonSpeciesName[]
): DexPokemonSummary[] {
  return csvData
    .sort((a, b) => {
      // species_id로 우선 정렬 (같은 종족 그룹화)
      const speciesComparison = a.species_id - b.species_id;
      if (speciesComparison !== 0) return speciesComparison;

      // 같은 species_id 내에서는 is_default 우선 (기본 형태가 먼저), 그 다음 id 순
      const defaultComparison = b.is_default - a.is_default; // is_default=1이 먼저 오도록
      if (defaultComparison !== 0) return defaultComparison;

      return a.id - b.id; // 최종적으로 id 순 정렬
    })
    .map((p) => {
      // 한글 이름 찾기 (없으면 영문 사용)
      const koreanName =
        pokemonSpeciesNamesData.find(
          (name) => name.pokemon_species_id === p.species_id && name.local_language_id === 3 // 한국어
        )?.name || p.identifier;

      // 타입 정보 찾기
      const pokemonTypes = pokemonTypesData
        .filter((pt) => pt.pokemon_id === p.id)
        .sort((a, b) => a.slot - b.slot) // slot 순으로 정렬
        .map((pt) => TYPE_ID_TO_KOREAN_NAME[pt.type_id] || getTypeName(pt.type_id));

      return {
        id: p.id,
        name: koreanName,
        number: `No.${p.id.toString().padStart(4, "0")}`,
        types: pokemonTypes,
      };
    });
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
  displayName?: string;
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

// 특성 데이터 변환
export interface DexAbilitySummary {
  id: number;
  name: string;
  generation: number;
  description: string;
  identifier: string;
}

export function transformAbilitiesForDex(
  csvAbilities: CsvAbility[],
  csvAbilityNames: CsvAbilityName[],
  primaryLanguageId: number = 9, // 영어 기본값
  secondaryLanguageId: number = 3 // 한국어
): DexAbilitySummary[] {
  return csvAbilities
    .filter((ability) => ability.is_main_series === 1) // 메인 시리즈 특성만
    .map((ability) => {
      // 한국어 이름 찾기 (없으면 영어 사용)
      const primaryName =
        csvAbilityNames.find(
          (name) => name.ability_id === ability.id && name.local_language_id === primaryLanguageId
        )?.name || ability.identifier;

      const secondaryName = csvAbilityNames.find(
        (name) => name.ability_id === ability.id && name.local_language_id === secondaryLanguageId
      )?.name;

      // 특성 이름 구성 (영어 우선, 한국어 있으면 괄호 안에)
      const displayName = secondaryName ? `${primaryName} (${secondaryName})` : primaryName;

      return {
        id: ability.id,
        name: displayName,
        generation: ability.generation_id,
        description: "특성 효과 정보", // 추후 상세 설명으로 교체 가능
        identifier: ability.identifier,
      };
    })
    .sort((a, b) => a.id - b.id);
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

// === 추가 한글화 매핑 함수들 ===

// 기술 분류 한글화
export const DAMAGE_CLASS_TO_KOREAN: Record<string, string> = {
  physical: "물리",
  special: "특수",
  status: "변화",
};

// 진화 트리거 한글화
export const EVOLUTION_TRIGGER_TO_KOREAN: Record<string, string> = {
  level_up: "레벨업",
  trade: "통신교환",
  use_item: "아이템 사용",
  shed: "껍질",
  spin: "회전",
  tower_of_darkness: "어둠의 탑",
  tower_of_waters: "물의 탑",
  three_critical_hits: "크리티컬 3회",
  take_damage: "데미지 입음",
  other: "기타",
};

// 진화 시간대 한글화
export const TIME_OF_DAY_TO_KOREAN: Record<string, string> = {
  day: "낮",
  night: "밤",
  dusk: "황혼",
};

// 알 그룹 한글화
export const EGG_GROUP_TO_KOREAN: Record<string, string> = {
  monster: "괴물",
  water1: "물1",
  bug: "벌레",
  flying: "비행",
  ground: "땅",
  fairy: "요정",
  plant: "식물",
  humanshape: "인간형",
  water3: "물3",
  mineral: "광물",
  indeterminate: "부정형",
  water2: "물2",
  ditto: "메타몽",
  dragon: "드래곤",
  no_eggs: "무생식",
};

// 성장 곡선 한글화
export const GROWTH_RATE_TO_KOREAN: Record<string, string> = {
  slow: "늦은",
  medium: "중간",
  fast: "빠른",
  medium_slow: "중간 느린",
  slow_then_very_fast: "처음 느린 후 매우 빠른",
  fast_then_very_slow: "처음 빠른 후 매우 느린",
};

// 기술 분류를 한글로 변환하는 함수
export function getDamageClassKorean(damageClass: string): string {
  return DAMAGE_CLASS_TO_KOREAN[damageClass] || damageClass;
}

// 진화 트리거를 한글로 변환하는 함수
export function getEvolutionTriggerKorean(trigger: string): string {
  return EVOLUTION_TRIGGER_TO_KOREAN[trigger] || trigger;
}

// 시간대를 한글로 변환하는 함수
export function getTimeOfDayKorean(timeOfDay: string): string {
  return TIME_OF_DAY_TO_KOREAN[timeOfDay] || timeOfDay;
}

// 알 그룹을 한글로 변환하는 함수
export function getEggGroupKorean(eggGroup: string): string {
  return EGG_GROUP_TO_KOREAN[eggGroup] || eggGroup;
}

// 성장 곡선을 한글로 변환하는 함수
export function getGrowthRateKorean(growthRate: string): string {
  return GROWTH_RATE_TO_KOREAN[growthRate] || growthRate;
}

// 스탯 이름을 한글로 변환하는 함수
export const STAT_NAME_TO_KOREAN: Record<string, string> = {
  hp: "HP",
  attack: "공격",
  defense: "방어",
  "special-attack": "특수공격",
  "special-defense": "특수방어",
  speed: "스피드",
};

export function getStatNameKorean(statName: string): string {
  return STAT_NAME_TO_KOREAN[statName] || statName;
}
