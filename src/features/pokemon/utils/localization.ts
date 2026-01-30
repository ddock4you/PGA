const DAMAGE_CLASS_TO_KOREAN: Record<string, string> = {
  physical: "물리",
  special: "특수",
  status: "변화",
};

const EVOLUTION_TRIGGER_TO_KOREAN: Record<string, string> = {
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

const TIME_OF_DAY_TO_KOREAN: Record<string, string> = {
  day: "낮",
  night: "밤",
  dusk: "황혼",
};

const EGG_GROUP_TO_KOREAN: Record<string, string> = {
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

const GROWTH_RATE_TO_KOREAN: Record<string, string> = {
  slow: "늦은",
  medium: "중간",
  fast: "빠른",
  medium_slow: "중간 느린",
  slow_then_very_fast: "처음 느린 후 매우 빠른",
  fast_then_very_slow: "처음 빠른 후 매우 느린",
};

const STAT_NAME_TO_KOREAN: Record<string, string> = {
  hp: "HP",
  attack: "공격",
  defense: "방어",
  "special-attack": "특수공격",
  "special-defense": "특수방어",
  speed: "스피드",
};

export function getDamageClassKorean(damageClass: string): string {
  return DAMAGE_CLASS_TO_KOREAN[damageClass] || damageClass;
}

export function getEvolutionTriggerKorean(trigger: string): string {
  return EVOLUTION_TRIGGER_TO_KOREAN[trigger] || trigger;
}

export function getTimeOfDayKorean(timeOfDay: string): string {
  return TIME_OF_DAY_TO_KOREAN[timeOfDay] || timeOfDay;
}

export function getEggGroupKorean(eggGroup: string): string {
  return EGG_GROUP_TO_KOREAN[eggGroup] || eggGroup;
}

export function getGrowthRateKorean(growthRate: string): string {
  return GROWTH_RATE_TO_KOREAN[growthRate] || growthRate;
}

export function getStatNameKorean(statName: string): string {
  return STAT_NAME_TO_KOREAN[statName] || statName;
}
