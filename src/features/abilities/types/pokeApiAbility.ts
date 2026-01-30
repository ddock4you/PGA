import type { Ability, NamedAPIResource } from "@/types/pokeapi";

export interface PokeApiAbility extends Ability {
  id: number;
  name: string;
  is_main_series: boolean;
  generation: NamedAPIResource;
  names: {
    name: string;
    language: NamedAPIResource;
  }[];
  effect_entries: {
    effect: string;
    short_effect: string;
    language: NamedAPIResource;
  }[];
  flavor_text_entries: {
    flavor_text: string;
    language: NamedAPIResource;
    version_group: NamedAPIResource;
  }[];
  pokemon: {
    is_hidden: boolean;
    slot: number;
    pokemon: NamedAPIResource;
  }[];
}
