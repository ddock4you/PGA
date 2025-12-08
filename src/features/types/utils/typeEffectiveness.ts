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

export function computeDefenseEffectiveness(
  primary: TypeName,
  secondary: TypeName | null,
  typeMap: TypeMap
): TypeEffectiveness {
  const defenders = secondary ? [primary, secondary] : [primary];
  const result: TypeEffectiveness = {
    weakTo: [],
    resistantTo: [],
    immuneTo: [],
  };

  const allTypeNames = Object.keys(typeMap);

  for (const attackType of allTypeNames) {
    const multiplier = computeAttackMultiplier(attackType, defenders, typeMap);

    if (multiplier === 0) {
      result.immuneTo.push(attackType);
    } else if (multiplier > 1) {
      result.weakTo.push(attackType);
    } else if (multiplier < 1) {
      result.resistantTo.push(attackType);
    }
  }

  return result;
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
