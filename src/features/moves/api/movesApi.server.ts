import { fetchFromPokeApi } from "@/lib/pokeapi.server";
import type { MoveDetail } from "@/types/pokeapi";

export type PokeApiMove = MoveDetail;

export async function fetchMove(idOrName: number | string): Promise<MoveDetail> {
  return fetchFromPokeApi<MoveDetail>(`/move/${idOrName}`);
}
