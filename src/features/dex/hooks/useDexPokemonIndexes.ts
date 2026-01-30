"use client";

import { useMemo } from "react";
import type { CsvPokemon, CsvPokemonAbility, CsvPokemonType } from "@/types/csvTypes";

export function useDexPokemonIndexes({
  pokemonData,
  pokemonTypesData,
  pokemonAbilitiesData,
}: {
  pokemonData?: CsvPokemon[];
  pokemonTypesData?: CsvPokemonType[];
  pokemonAbilitiesData?: CsvPokemonAbility[];
}) {
  const pokemonTypesById = useMemo(() => {
    const map = new Map<number, number[]>();
    pokemonTypesData?.forEach((type) => {
      const existing = map.get(type.pokemon_id);
      if (existing) {
        existing.push(type.type_id);
      } else {
        map.set(type.pokemon_id, [type.type_id]);
      }
    });
    return map;
  }, [pokemonTypesData]);

  const pokemonAbilitiesById = useMemo(() => {
    const map = new Map<number, number[]>();
    pokemonAbilitiesData?.forEach((ability) => {
      const existing = map.get(ability.pokemon_id);
      if (existing) {
        existing.push(ability.ability_id);
      } else {
        map.set(ability.pokemon_id, [ability.ability_id]);
      }
    });
    return map;
  }, [pokemonAbilitiesData]);

  const pokemonById = useMemo(() => {
    const map = new Map<number, CsvPokemon>();
    pokemonData?.forEach((pokemon) => {
      map.set(pokemon.id, pokemon);
    });
    return map;
  }, [pokemonData]);

  return {
    pokemonTypesById,
    pokemonAbilitiesById,
    pokemonById,
  };
}
