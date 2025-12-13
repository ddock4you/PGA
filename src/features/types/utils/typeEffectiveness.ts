import type { PokeApiType } from "@/features/types/api/typeApi";

export type TypeName = string;

export interface TypeEffectiveness {
  /** 2배 이상 피해를 받는 타입들 */
  weakTo: TypeName[];
  /** 0.5배 이하 피해를 받는 타입들 */
  resistantTo: TypeName[];
  /** 0배 피해를 받는 타입들 */
  immuneTo: TypeName[];
}

export type TypeMap = Record<TypeName, PokeApiType>;

export function buildTypeMap(types: PokeApiType[]): TypeMap {
  return types.reduce<TypeMap>((acc, type) => {
    acc[type.name] = type;
    return acc;
  }, {});
}

function getAttackMultiplierAgainstSingle(
  attackType: TypeName,
  defenderType: TypeName,
  typeMap: TypeMap
): number {
  const attack = typeMap[attackType];
  if (!attack) return 1;

  const { double_damage_to, half_damage_to, no_damage_to } = attack.damage_relations;

  if (no_damage_to.some((t) => t.name === defenderType)) return 0;
  if (double_damage_to.some((t) => t.name === defenderType)) return 2;
  if (half_damage_to.some((t) => t.name === defenderType)) return 0.5;
  return 1;
}

export function computeAttackMultiplier(
  attackType: TypeName,
  defenderTypes: TypeName[],
  typeMap: TypeMap
): number {
  if (defenderTypes.length === 0) return 1;

  return defenderTypes
    .map((defender) => getAttackMultiplierAgainstSingle(attackType, defender, typeMap))
    .reduce((acc, value) => acc * value, 1);
}

export type PokemonQuizMultiplier = 0 | 0.25 | 0.5 | 1 | 2 | 4;

export interface TypeEffectivenessDetail {
  /** 4배 피해 */
  doubleWeak: TypeName[];
  /** 2배 피해 */
  weak: TypeName[];
  /** 1배 피해 (보통) */
  normal: TypeName[];
  /** 0.5배 피해 */
  resistant: TypeName[];
  /** 0.25배 피해 */
  doubleResistant: TypeName[];
  /** 0배 피해 */
  immune: TypeName[];
}

export function computeDefenseEffectivenessDetail(
  primary: TypeName,
  secondary: TypeName | null,
  typeMap: TypeMap
): TypeEffectivenessDetail {
  const defenders = secondary ? [primary, secondary] : [primary];
  const result: TypeEffectivenessDetail = {
    doubleWeak: [],
    weak: [],
    normal: [],
    resistant: [],
    doubleResistant: [],
    immune: [],
  };

  const allTypeNames = Object.keys(typeMap).filter((t) => t !== "stellar" && t !== "unknown");

  for (const attackType of allTypeNames) {
    const multiplier = computeAttackMultiplier(attackType, defenders, typeMap);

    if (multiplier === 0) {
      result.immune.push(attackType);
    } else if (multiplier >= 4) {
      result.doubleWeak.push(attackType);
    } else if (multiplier >= 2) {
      result.weak.push(attackType);
    } else if (multiplier <= 0.25) {
      result.doubleResistant.push(attackType);
    } else if (multiplier <= 0.5) {
      result.resistant.push(attackType);
    } else {
      result.normal.push(attackType);
    }
  }

  return result;
}

// 기존 함수 하위 호환성 유지 (필요하다면) 또는 대체
export function computeDefenseEffectiveness(
  primary: TypeName,
  secondary: TypeName | null,
  typeMap: TypeMap
): TypeEffectiveness {
  // ... 기존 로직 ...
  // 이번 개편에서는 사용하지 않을 예정이나 기존 코드 호환성을 위해 유지하거나 업데이트
  // 여기서는 간단히 위의 상세 함수를 호출해서 매핑
  const detail = computeDefenseEffectivenessDetail(primary, secondary, typeMap);
  return {
    weakTo: [...detail.doubleWeak, ...detail.weak],
    resistantTo: [...detail.doubleResistant, ...detail.resistant],
    immuneTo: detail.immune,
  };
}

export interface OffenseEffectiveness {
  double: TypeName[];
  half: TypeName[];
  zero: TypeName[];
}

export function computeOffenseEffectiveness(
  attackType: TypeName,
  typeMap: TypeMap
): OffenseEffectiveness {
  const typeInfo = typeMap[attackType];
  if (!typeInfo) {
    return { double: [], half: [], zero: [] };
  }

  const { double_damage_to, half_damage_to, no_damage_to } = typeInfo.damage_relations;

  return {
    double: double_damage_to.map((t) => t.name),
    half: half_damage_to.map((t) => t.name),
    zero: no_damage_to.map((t) => t.name),
  };
}
