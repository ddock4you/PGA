import "server-only";

import { cache } from "react";
import { fetchFromPokeApi } from "@/lib/pokeapi.server";
import type { MoveDetail } from "@/types/pokeapi";

export type PokeApiMove = MoveDetail;

export const fetchMove = cache(async (idOrName: number | string): Promise<MoveDetail> => {
  return fetchFromPokeApi<MoveDetail>(`/move/${idOrName}`);
});
