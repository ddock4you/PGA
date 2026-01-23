import { fetchFromPokeApi } from "@/lib/pokeapi";
import type { NamedAPIResource } from "@/types/pokeapi";

// PokéAPI type 리소스의 최소 타입 정의 (실제 스키마의 일부만 사용)
export interface PokeApiType {
  id: number;
  name: string;
  damage_relations: {
    double_damage_to: NamedAPIResource[];
    half_damage_to: NamedAPIResource[];
    no_damage_to: NamedAPIResource[];
    double_damage_from: NamedAPIResource[];
    half_damage_from: NamedAPIResource[];
    no_damage_from: NamedAPIResource[];
  };
}

interface PokeApiTypeListResponse {
  results: NamedAPIResource[];
}

/**
 * 모든 실전 타입(노말~페어리) 정보 로딩.
 * PokéAPI에는 shadow/unknown 타입도 포함되어 있어 필터링한다.
 */
export async function fetchAllTypes(): Promise<PokeApiType[]> {
  const list = await fetchFromPokeApi<PokeApiTypeListResponse>("/type");

  const realTypes = list.results.filter((t) => t.name !== "shadow" && t.name !== "unknown");

  const types = await Promise.all(
    realTypes.map((t) => fetchFromPokeApi<PokeApiType>(t.url, { absoluteUrl: t.url }))
  );

  return types;
}