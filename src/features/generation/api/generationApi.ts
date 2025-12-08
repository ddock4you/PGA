import { fetchFromPokeApi } from "@/lib/pokeapi";

export interface PokeApiNamedResource {
  name: string;
  url: string;
}

export interface PokeApiGeneration {
  id: number;
  name: string;
  pokemon_species: PokeApiNamedResource[];
  moves: PokeApiNamedResource[];
  abilities: PokeApiNamedResource[];
  types: PokeApiNamedResource[];
  version_groups: PokeApiNamedResource[];
}

interface PokeApiGenerationListResponse {
  results: PokeApiNamedResource[];
}

export async function fetchGenerationList(): Promise<PokeApiNamedResource[]> {
  const data = await fetchFromPokeApi<PokeApiGenerationListResponse>("/generation");
  return data.results;
}

export async function fetchGeneration(idOrName: number | string): Promise<PokeApiGeneration> {
  return fetchFromPokeApi<PokeApiGeneration>(`/generation/${idOrName}`);
}
