import "server-only";

import { cache } from "react";
import { fetchFromPokeApi } from "@/lib/pokeapi.server";
import type { PokeApiNamedResource } from "@/types/pokeapi";
import type { Item } from "@/types/pokeapi";

interface PokeApiItemListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokeApiNamedResource[];
}

export const fetchItem = cache(async (idOrName: number | string): Promise<Item> => {
  return fetchFromPokeApi<Item>(`/item/${idOrName}`);
});

export async function fetchItemList(limit = 10000, offset = 0): Promise<PokeApiNamedResource[]> {
  const data = await fetchFromPokeApi<PokeApiItemListResponse>(
    `/item?limit=${limit}&offset=${offset}`
  );
  return data.results;
}
