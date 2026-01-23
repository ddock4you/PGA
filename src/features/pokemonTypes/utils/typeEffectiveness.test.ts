import { describe, expect, it } from "vitest";
import {
  buildTypeMap,
  computeAttackMultiplier,
  computeDefenseEffectiveness,
  type TypeMap,
} from "./typeEffectiveness";
import type { PokeApiType } from "@/features/pokemonTypes/api/typeApi";

function createType(
  name: string,
  damageRelations: Partial<PokeApiType["damage_relations"]>
): PokeApiType {
  return {
    id: 0,
    name,
    damage_relations: {
      double_damage_to: [],
      half_damage_to: [],
      no_damage_to: [],
      double_damage_from: [],
      half_damage_from: [],
      no_damage_from: [],
      ...damageRelations,
    },
  };
}

function createTestTypeMap(): TypeMap {
  const fire = createType("fire", {
    double_damage_to: [{ name: "grass", url: "" }],
    half_damage_to: [{ name: "water", url: "" }],
    no_damage_to: [{ name: "ghost", url: "" }],
  });

  const water = createType("water", {
    double_damage_to: [{ name: "fire", url: "" }],
  });

  const grass = createType("grass", {
    double_damage_to: [{ name: "water", url: "" }],
  });

  return buildTypeMap([fire, water, grass]);
}

describe("computeAttackMultiplier", () => {
  it("단일 타입 상성 계산을 올바르게 수행한다", () => {
    const typeMap = createTestTypeMap();

    expect(computeAttackMultiplier("fire", ["grass"], typeMap)).toBe(2);
    expect(computeAttackMultiplier("fire", ["water"], typeMap)).toBe(0.5);
    expect(computeAttackMultiplier("fire", ["ghost"], typeMap)).toBe(0);
    expect(computeAttackMultiplier("water", ["fire"], typeMap)).toBe(2);
  });

  it("복합 타입 상성에서 배율을 곱해서 계산한다", () => {
    const typeMap = createTestTypeMap();

    // 불꽃 → (풀, 물) : 2배 * 0.5배 = 1배
    expect(computeAttackMultiplier("fire", ["grass", "water"], typeMap)).toBe(1);
  });
});

describe("computeDefenseEffectiveness", () => {
  it("단일 타입 방어 상성을 분류한다", () => {
    const typeMap = createTestTypeMap();

    const defense = computeDefenseEffectiveness("fire", null, typeMap);

    expect(defense.weakTo).toContain("water");
  });

  it("복합 타입 방어 상성을 타입 맵 기준으로 계산한다", () => {
    const typeMap = createTestTypeMap();

    const defense = computeDefenseEffectiveness("water", "fire", typeMap);

    // grass 타입 공격이 water 와 fire 모두에게 2배라고 가정하면, 최종 배율은 4배
    // 여기서는 multiplier > 1 인 타입이 weakTo 로 분류되는지만 확인한다.
    expect(defense.weakTo).toContain("grass");
  });
});

