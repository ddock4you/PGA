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
  species: PokeApiNamedResource; // 추가: species 정보 (메가/거다이맥스 포켓몬에서 species_id 추출용)
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

export interface PokeApiEncounter {
  location_area: PokeApiNamedResource;
  version_details: {
    max_chance: number;
    encounter_details: {
      min_level: number;
      max_level: number;
      condition_values: PokeApiNamedResource[];
      chance: number;
      method: PokeApiNamedResource;
    }[];
    version: PokeApiNamedResource;
  }[];
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

/**
 * 포켓몬의 한국어 이름을 가져오는 함수
 */
export async function getKoreanPokemonName(pokemonIdOrName: number | string): Promise<string> {
  try {
    // 포켓몬 기본 정보에서 species URL을 얻음
    const pokemon = await fetchPokemon(pokemonIdOrName);
    const speciesUrl = pokemon.species.url;

    // species 정보에서 한국어 이름을 찾음
    const species = await fetchFromPokeApi<PokeApiPokemonSpecies>(speciesUrl, {
      absoluteUrl: speciesUrl,
    });

    // 한국어 이름 찾기 (language id 3 = Korean)
    const koreanNameEntry = species.names.find((name) => name.language.name === "ko");
    if (koreanNameEntry) {
      return koreanNameEntry.name;
    }

    // 한국어 이름이 없으면 영어 이름 반환
    return pokemon.name;
  } catch (error) {
    console.warn(`Failed to get Korean name for ${pokemonIdOrName}:`, error);
    // 에러 시 영어 이름 반환
    return String(pokemonIdOrName);
  }
}
