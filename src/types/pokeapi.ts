export interface NamedAPIResource {
  name: string;
  url: string;
}

// Common alias used across features.
export type PokeApiNamedResource = NamedAPIResource;

export interface PokemonTypeSlot {
  slot: number;
  type: NamedAPIResource;
}

export interface PokemonStatEntry {
  base_stat: number;
  effort: number;
  stat: NamedAPIResource;
}

export interface PokemonAbilityEntry {
  is_hidden: boolean;
  slot: number;
  ability: NamedAPIResource;
}

export interface PokemonMoveDetail {
  move: NamedAPIResource;
  version_group_details: {
    level_learned_at: number;
    move_learn_method: NamedAPIResource;
    version_group: NamedAPIResource;
  }[];
}

export interface PokemonSprites {
  front_default: string | null;
  other?: {
    "official-artwork"?: {
      front_default: string | null;
    };
  };
}

export interface Pokemon {
  id: number;
  name: string;
  sprites: PokemonSprites;
  types: PokemonTypeSlot[];
  stats: PokemonStatEntry[];
  abilities: PokemonAbilityEntry[];
  moves: PokemonMoveDetail[];
  species: NamedAPIResource;
  weight?: number;
  height?: number;
}

export interface PokemonSpeciesFlavorText {
  flavor_text: string;
  language: NamedAPIResource;
  version_group: NamedAPIResource;
}

export interface PokemonSpeciesName {
  name: string;
  language: NamedAPIResource;
}

export interface PokemonSpecies {
  id: number;
  name: string;
  flavor_text_entries: PokemonSpeciesFlavorText[];
  names: PokemonSpeciesName[];
  evolution_chain?: { url: string };
  generation?: NamedAPIResource;
}

export interface PokemonEncounter {
  location_area: NamedAPIResource;
  version_details: {
    version: NamedAPIResource;
    max_chance: number;
    encounter_details: unknown[];
  }[];
}

export interface AbilityEffectEntry {
  effect: string;
  short_effect: string;
  language: NamedAPIResource;
}

export interface AbilityFlavorTextEntry {
  flavor_text: string;
  language: NamedAPIResource;
  version_group: NamedAPIResource;
}

export interface AbilityPokemonEntry {
  is_hidden: boolean;
  pokemon: NamedAPIResource;
}

export interface Ability {
  id: number;
  name: string;
  is_main_series: boolean;
  generation: NamedAPIResource;
  effect_entries: AbilityEffectEntry[];
  flavor_text_entries: AbilityFlavorTextEntry[];
  pokemon: AbilityPokemonEntry[];
  names?: {
    name: string;
    language: NamedAPIResource;
  }[];
}

export interface ItemEffectEntry {
  effect: string;
  short_effect: string;
  language: NamedAPIResource;
}

export interface ItemHoldPokemon {
  pokemon: NamedAPIResource;
  version_details: {
    rarity: number;
    version: NamedAPIResource;
  }[];
}

export interface ItemFlingEffect {
  name: string;
}

export interface Item {
  id: number;
  name: string;
  sprites: {
    default: string | null;
  };
  effect_entries: ItemEffectEntry[];
  attributes: { name: string }[];
  fling_power: number | null;
  fling_effect?: ItemFlingEffect | null;
  category?: NamedAPIResource;
  cost: number;
  held_by_pokemon?: ItemHoldPokemon[];
}

export interface MoveEffectEntry {
  effect: string;
  short_effect: string;
  language: NamedAPIResource;
}

export interface Move {
  id: number;
  name: string;
  type: NamedAPIResource;
  power: number | null;
  accuracy: number | null;
  pp: number;
  priority: number;
  damage_class: NamedAPIResource;
  effect_entries: MoveEffectEntry[];
}
