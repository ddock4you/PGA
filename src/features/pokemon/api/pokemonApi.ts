import { fetchFromPokeApi } from "@/lib/pokeapi";
import type { PokeApiNamedResource } from "@/features/generation/api/generationApi";

export interface PokeApiPokemonSpecies {
  id: number;
  name: string;
  url?: string;
}

export interface PokeApiPokemon {
  id: number;
  name: string;
  types: {
    slot: number;
    type: PokeApiNamedResource;
  }[];
  stats: {
    base_stat: number;
    effort: number;
    stat: PokeApiNamedResource;
  }[];
}

interface PokeApiPokemonSpeciesListResponse {
  pokemon_species: PokeApiPokemonSpecies[];
}

/**
 * 세대 ID 기준 포켓몬 species 리스트 로딩.
 * (PokéAPI /generation/{id} 응답의 하위 필드를 다시 노출하는 래퍼)
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
  return fetchFromPokeApi<PokeApiPokemon>(`/pokemon/${idOrName}`);
}
