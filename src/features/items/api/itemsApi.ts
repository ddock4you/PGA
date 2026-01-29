import { fetchFromPokeApi } from "@/lib/pokeapi";
import type { PokeApiNamedResource } from "@/types/pokeapi";

export interface PokeApiItem {
  id: number;
  name: string;
  cost: number;
  fling_power: number | null;
  fling_effect: PokeApiNamedResource | null;
  attributes: PokeApiNamedResource[];
  category: PokeApiNamedResource;
  effect_entries: {
    effect: string;
    short_effect: string;
    language: PokeApiNamedResource;
  }[];
  flavor_text_entries: {
    text: string;
    version_group: PokeApiNamedResource;
    language: PokeApiNamedResource;
  }[];
  sprites: {
    default: string;
  };
}

interface PokeApiItemListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokeApiNamedResource[];
}

export async function fetchItemList(limit = 10000, offset = 0): Promise<PokeApiNamedResource[]> {
  const data = await fetchFromPokeApi<PokeApiItemListResponse>(
    `/item?limit=${limit}&offset=${offset}`
  );
  return data.results;
}

export async function fetchItem(idOrName: number | string): Promise<PokeApiItem> {
  return fetchFromPokeApi<PokeApiItem>(`/item/${idOrName}`);
}
