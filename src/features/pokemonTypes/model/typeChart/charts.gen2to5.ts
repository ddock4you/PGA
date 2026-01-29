import type { TypeDamageRelations, TypeNameEnGen2To5 } from "./types";

/**
 * Gen 2~5 기준(강철/악 도입, 페어리 없음).
 * Gen 6+에서 변경된 포인트:
 * - 강철이 고스트/악을 반감한다 (공격: 고스트/악 -> 강철 0.5)
 */
export const TYPE_DAMAGE_RELATIONS_GEN2_TO_5: Record<TypeNameEnGen2To5, TypeDamageRelations> = {
  normal: {
    double_damage_to: [],
    half_damage_to: ["rock", "steel"],
    no_damage_to: ["ghost"],
  },
  fighting: {
    double_damage_to: ["normal", "rock", "steel", "ice", "dark"],
    half_damage_to: ["flying", "poison", "bug", "psychic"],
    no_damage_to: ["ghost"],
  },
  flying: {
    double_damage_to: ["fighting", "bug", "grass"],
    half_damage_to: ["rock", "steel", "electric"],
    no_damage_to: [],
  },
  poison: {
    double_damage_to: ["grass"],
    half_damage_to: ["poison", "ground", "rock", "ghost"],
    no_damage_to: ["steel"],
  },
  ground: {
    double_damage_to: ["poison", "rock", "steel", "fire", "electric"],
    half_damage_to: ["bug", "grass"],
    no_damage_to: ["flying"],
  },
  rock: {
    double_damage_to: ["flying", "bug", "fire", "ice"],
    half_damage_to: ["fighting", "ground", "steel"],
    no_damage_to: [],
  },
  bug: {
    double_damage_to: ["grass", "psychic", "dark"],
    half_damage_to: ["fighting", "flying", "poison", "ghost", "steel", "fire"],
    no_damage_to: [],
  },
  ghost: {
    double_damage_to: ["ghost", "psychic"],
    half_damage_to: ["dark", "steel"],
    no_damage_to: ["normal"],
  },
  steel: {
    double_damage_to: ["rock", "ice"],
    half_damage_to: ["steel", "fire", "water", "electric"],
    no_damage_to: [],
  },
  fire: {
    double_damage_to: ["bug", "steel", "grass", "ice"],
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
    half_damage_to: ["flying", "poison", "bug", "steel", "fire", "grass", "dragon"],
    no_damage_to: [],
  },
  electric: {
    double_damage_to: ["flying", "water"],
    half_damage_to: ["grass", "electric", "dragon"],
    no_damage_to: ["ground"],
  },
  psychic: {
    double_damage_to: ["fighting", "poison"],
    half_damage_to: ["steel", "psychic"],
    no_damage_to: ["dark"],
  },
  ice: {
    double_damage_to: ["flying", "ground", "grass", "dragon"],
    half_damage_to: ["steel", "fire", "water", "ice"],
    no_damage_to: [],
  },
  dragon: {
    double_damage_to: ["dragon"],
    half_damage_to: ["steel"],
    no_damage_to: [],
  },
  dark: {
    double_damage_to: ["ghost", "psychic"],
    half_damage_to: ["fighting", "dark", "steel"],
    no_damage_to: [],
  },
};
