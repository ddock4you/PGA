const DAMAGE_CLASS_ID_TO_NAME: Record<number, string> = {
  1: "status",
  2: "physical",
  3: "special",
};

const STAT_ID_TO_NAME: Record<number, string> = {
  1: "hp",
  2: "attack",
  3: "defense",
  4: "special-attack",
  5: "special-defense",
  6: "speed",
};

export function getDamageClassName(damageClassId: number): string {
  return DAMAGE_CLASS_ID_TO_NAME[damageClassId] || "unknown";
}

export function getStatName(statId: number): string {
  return STAT_ID_TO_NAME[statId] || "unknown";
}
