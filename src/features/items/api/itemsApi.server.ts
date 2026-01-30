import "server-only";

import { fetchFromPokeApi } from "@/lib/pokeapi.server";
import type { PokeApiNamedResource } from "@/types/pokeapi";
import type { Item } from "@/types/pokeapi";

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

export async function fetchItem(idOrName: number | string): Promise<Item> {
  return fetchFromPokeApi<Item>(`/item/${idOrName}`);
}
