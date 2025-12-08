import { fetchFromPokeApi } from "@/lib/pokeapi";
import type { PokeApiNamedResource } from "@/features/generation/api/generationApi";

export interface PokeApiAbility {
  id: number;
  name: string;
  is_main_series: boolean;
  generation: PokeApiNamedResource;
  names: {
    name: string;
    language: PokeApiNamedResource;
  }[];
  effect_entries: {
    effect: string;
    short_effect: string;
    language: PokeApiNamedResource;
  }[];
  flavor_text_entries: {
    flavor_text: string;
    language: PokeApiNamedResource;
    version_group: PokeApiNamedResource;
  }[];
  pokemon: {
    is_hidden: boolean;
    slot: number;
    pokemon: PokeApiNamedResource;
  }[];
}

export async function fetchAbility(idOrName: number | string): Promise<PokeApiAbility> {
  return fetchFromPokeApi<PokeApiAbility>(`/ability/${idOrName}`);
}
