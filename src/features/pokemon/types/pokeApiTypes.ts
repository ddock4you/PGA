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
  species: PokeApiNamedResource;
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
    min_happiness?: number | null;
    time_of_day?: string | null;
    item?: PokeApiNamedResource | null;
    trigger: PokeApiNamedResource;
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
