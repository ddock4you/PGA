import "server-only";

import { fetchFromPokeApi } from "@/lib/pokeapi";
import { fetchPokemon } from "@/features/pokemon/api/pokemonApi.server";
import type { PokeApiPokemonSpecies } from "@/features/pokemon/types/pokeApiTypes";

export async function getKoreanPokemonNameFromPokeApi(
  pokemonIdOrName: number | string
): Promise<string> {
  try {
    const pokemon = await fetchPokemon(pokemonIdOrName);
    const speciesUrl = pokemon.species.url;

    const species = await fetchFromPokeApi<PokeApiPokemonSpecies>(speciesUrl, {
      absoluteUrl: speciesUrl,
    });

    const koreanNameEntry = species.names.find((name) => name.language.name === "ko");
    if (koreanNameEntry) return koreanNameEntry.name;

    return pokemon.name;
  } catch {
    return String(pokemonIdOrName);
  }
}
