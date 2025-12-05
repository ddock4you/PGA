import { fetchFromPokeApi } from "@/lib/pokeapi";
import type { PokeApiNamedResource } from "@/features/generation/api/generationApi";

export interface PokeApiPokemonSpecies {
  id: number;
  name: string;
  url?: string;
  generation: PokeApiNamedResource;
  evolution_chain?: {
    url: string;
  };
  flavor_text_entries: {
    flavor_text: string;
    language: PokeApiNamedResource;
    version: PokeApiNamedResource;
  }[];
  names: {
    name: string;
    language: PokeApiNamedResource;
  }[];
  genera: {
    genus: string;
    language: PokeApiNamedResource;
  }[];
  base_happiness?: number;
  capture_rate?: number;
  hatch_counter?: number;
  gender_rate?: number;
  growth_rate?: PokeApiNamedResource;
  egg_groups?: PokeApiNamedResource[];
}

export interface PokeApiPokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other?: {
      "official-artwork": {
        front_default: string;
      };
      home: {
        front_default: string;
      };
    };
  };
  types: {
    slot: number;
    type: PokeApiNamedResource;
  }[];
  stats: {
    base_stat: number;
    effort: number;
    stat: PokeApiNamedResource;
  }[];
  abilities: {
    is_hidden: boolean;
    slot: number;
    ability: PokeApiNamedResource;
  }[];
  moves: {
    move: PokeApiNamedResource;
    version_group_details: {
      level_learned_at: number;
      move_learn_method: PokeApiNamedResource;
      version_group: PokeApiNamedResource;
    }[];
  }[];
  height: number;
  weight: number;
  held_items: {
    item: PokeApiNamedResource;
    version_details: {
      rarity: number;
      version: PokeApiNamedResource;
    }[];
  }[];
}

export interface PokeApiEvolutionChainLink {
  species: PokeApiNamedResource;
  evolves_to: PokeApiEvolutionChainLink[];
  evolution_details: {
    min_level?: number | null;
    item?: PokeApiNamedResource | null;
    trigger: PokeApiNamedResource;
    // ... add other evolution details as needed
  }[];
}

export interface PokeApiEvolutionChain {
  id: number;
  chain: PokeApiEvolutionChainLink;
}

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
  return fetchFromPokeApi<PokeApiPokemon>(`/pokemon/${idOrName}`);
}

export async function fetchPokemonSpecies(
  idOrName: number | string
): Promise<PokeApiPokemonSpecies> {
  return fetchFromPokeApi<PokeApiPokemonSpecies>(`/pokemon-species/${idOrName}`);
}

export async function fetchEvolutionChain(url: string): Promise<PokeApiEvolutionChain> {
  return fetchFromPokeApi<PokeApiEvolutionChain>(url, { absoluteUrl: url });
}
