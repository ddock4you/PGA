import "server-only";

import { fetchFromPokeApi } from "@/lib/pokeapi.server";
import type {
  PokeApiEncounter,
  PokeApiEvolutionChain,
  PokeApiPokemon,
  PokeApiPokemonSpecies,
} from "@/features/pokemon/types/pokeApiTypes";

interface PokeApiPokemonSpeciesListResponse {
  pokemon_species: PokeApiPokemonSpecies[];
}

/**
 * 세대 ID 기준 포켓몬 species 리스트 로딩.
 */
export async function fetchPokemonSpeciesListByGeneration(
  generationId: number | string
): Promise<PokeApiPokemonSpecies[]> {
  const data = await fetchFromPokeApi<PokeApiPokemonSpeciesListResponse>(
    `/generation/${generationId}`
  );
  return data.pokemon_species;
}

export async function fetchPokemon(idOrName: number | string): Promise<PokeApiPokemon> {
  return fetchFromPokeApi<PokeApiPokemon>(`/pokemon/${idOrName}`, {
    next: {
      revalidate: 3600,
      tags: [`pokemon-${idOrName}`],
    },
  });
}

export async function fetchPokemonSpecies(
  idOrName: number | string
): Promise<PokeApiPokemonSpecies> {
  return fetchFromPokeApi<PokeApiPokemonSpecies>(`/pokemon-species/${idOrName}`, {
    next: {
      revalidate: 3600,
      tags: [`pokemon-species-${idOrName}`],
    },
  });
}

export async function fetchEvolutionChain(url: string): Promise<PokeApiEvolutionChain> {
  return fetchFromPokeApi<PokeApiEvolutionChain>(url, {
    absoluteUrl: url,
    next: {
      revalidate: 3600,
      tags: [`evolution-chain-${url}`],
    },
  });
}

export async function fetchPokemonEncounters(
  idOrName: number | string
): Promise<PokeApiEncounter[]> {
  return fetchFromPokeApi<PokeApiEncounter[]>(`/pokemon/${idOrName}/encounters`, {
    next: {
      revalidate: 3600 * 24,
      tags: [`pokemon-encounters-${idOrName}`],
    },
  });
}
