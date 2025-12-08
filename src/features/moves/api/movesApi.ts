import { fetchFromPokeApi } from "@/lib/pokeapi";
import type { PokeApiNamedResource } from "@/features/generation/api/generationApi";

export interface PokeApiMove {
  id: number;
  name: string;
  accuracy: number | null;
  effect_chance: number | null;
  pp: number;
  priority: number;
  power: number | null;
  damage_class: PokeApiNamedResource;
  type: PokeApiNamedResource;
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
  meta: {
    ailment: PokeApiNamedResource;
    category: PokeApiNamedResource;
    min_hits: number | null;
    max_hits: number | null;
    min_turns: number | null;
    max_turns: number | null;
    drain: number;
    healing: number;
    crit_rate: number;
    ailment_chance: number;
    flinch_chance: number;
    stat_chance: number;
  } | null;
}

export async function fetchMove(idOrName: number | string): Promise<PokeApiMove> {
  return fetchFromPokeApi<PokeApiMove>(`/move/${idOrName}`);
}
