import "server-only";

import { fetchFromPokeApi } from "@/lib/pokeapi";
import type { PokeApiAbility } from "@/features/abilities/types/pokeApiAbility";

export async function fetchAbility(idOrName: number | string): Promise<PokeApiAbility> {
  return fetchFromPokeApi<PokeApiAbility>(`/ability/${idOrName}`);
}
