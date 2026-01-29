import type { PokeApiPokemon, PokeApiPokemonSpecies } from "@/features/pokemon/types/pokeApiTypes";

const POKEAPI_PROXY_BASE = "/api/pokeapi";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    const message = text || response.statusText || "PokeAPI request failed.";
    throw new Error(`PokeAPI proxy error ${response.status}: ${message}`);
  }
  return (await response.json()) as T;
}

async function fetchFromPokeApiProxy<T>(path: string, init?: RequestInit): Promise<T> {
  const trimmed = path.startsWith("/") ? path.slice(1) : path;
  const url = `${POKEAPI_PROXY_BASE}/${trimmed}`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });
  return handleResponse<T>(response);
}

interface PokeApiPokemonSpeciesListResponse {
  pokemon_species: PokeApiPokemonSpecies[];
}

export async function fetchPokemonSpeciesListByGeneration(
  generationId: number | string
): Promise<PokeApiPokemonSpecies[]> {
  const data = await fetchFromPokeApiProxy<PokeApiPokemonSpeciesListResponse>(
    `/generation/${generationId}`
  );
  return data.pokemon_species;
}

export async function fetchPokemon(idOrName: number | string): Promise<PokeApiPokemon> {
  return fetchFromPokeApiProxy<PokeApiPokemon>(`/pokemon/${idOrName}`);
}
