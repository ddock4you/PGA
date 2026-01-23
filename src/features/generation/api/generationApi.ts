import { fetchFromPokeApi } from "@/lib/pokeapi";
import type { NamedAPIResource } from "@/types/pokeapi";

export interface PokeApiGeneration {
  id: number;
  name: string;
  pokemon_species: NamedAPIResource[];
  moves: NamedAPIResource[];
  abilities: NamedAPIResource[];
  types: NamedAPIResource[];
  version_groups: NamedAPIResource[];
}

interface PokeApiGenerationListResponse {
  results: NamedAPIResource[];
}

export async function fetchGenerationList(): Promise<PokeApiNamedResource[]> {
  const data = await fetchFromPokeApi<PokeApiGenerationListResponse>("/generation");
  return data.results;
}

export async function fetchGeneration(idOrName: number | string): Promise<PokeApiGeneration> {
  return fetchFromPokeApi<PokeApiGeneration>(`/generation/${idOrName}`);
}
