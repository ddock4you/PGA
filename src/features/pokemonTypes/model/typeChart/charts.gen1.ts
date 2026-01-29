import type { TypeDamageRelations, TypeNameEnGen1 } from "./types";

/**
 * Gen 1 기준(강철/악/페어리 없음).
 * 차이점:
 * - 벌레 ↔ 독: 서로 약점(공격: 벌레->독 2, 독->벌레 2)
 * - 얼음 -> 불꽃: 보통(1)
 * - 고스트 -> 에스퍼: 무효(0)
 */
export const TYPE_DAMAGE_RELATIONS_GEN1: Record<TypeNameEnGen1, TypeDamageRelations> = {
  normal: {
    double_damage_to: [],
    half_damage_to: ["rock"],
    no_damage_to: ["ghost"],
  },
  fighting: {
    double_damage_to: ["normal", "rock", "ice"],
    half_damage_to: ["flying", "poison", "bug", "psychic"],
    no_damage_to: ["ghost"],
  },
  flying: {
    double_damage_to: ["fighting", "bug", "grass"],
    half_damage_to: ["rock", "electric"],
    no_damage_to: [],
  },
  poison: {
    double_damage_to: ["grass", "bug"],
    half_damage_to: ["poison", "ground", "rock", "ghost"],
    no_damage_to: [],
  },
  ground: {
    double_damage_to: ["poison", "rock", "fire", "electric"],
    half_damage_to: ["bug", "grass"],
    no_damage_to: ["flying"],
  },
  rock: {
    double_damage_to: ["flying", "bug", "fire", "ice"],
    half_damage_to: ["fighting", "ground"],
    no_damage_to: [],
  },
  bug: {
    double_damage_to: ["grass", "psychic", "poison"],
    half_damage_to: ["fighting", "flying", "ghost", "fire"],
    no_damage_to: [],
  },
  ghost: {
    double_damage_to: ["ghost"],
    half_damage_to: [],
    no_damage_to: ["normal", "psychic"],
  },
  fire: {
    double_damage_to: ["bug", "grass", "ice"],
    half_damage_to: ["rock", "fire", "water", "dragon"],
    no_damage_to: [],
  },
  water: {
    double_damage_to: ["ground", "rock", "fire"],
    half_damage_to: ["water", "grass", "dragon"],
    no_damage_to: [],
  },
  grass: {
    double_damage_to: ["ground", "rock", "water"],
    half_damage_to: ["flying", "poison", "bug", "fire", "grass", "dragon"],
    no_damage_to: [],
  },
  electric: {
    double_damage_to: ["flying", "water"],
    half_damage_to: ["grass", "electric", "dragon"],
    no_damage_to: ["ground"],
  },
  psychic: {
    double_damage_to: ["fighting", "poison"],
    half_damage_to: ["psychic"],
    no_damage_to: [],
  },
  ice: {
    double_damage_to: ["flying", "ground", "grass", "dragon"],
    half_damage_to: ["water", "ice"],
    no_damage_to: [],
  },
  dragon: {
    double_damage_to: ["dragon"],
    half_damage_to: [],
    no_damage_to: [],
  },
};
