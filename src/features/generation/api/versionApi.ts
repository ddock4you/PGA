import { fetchFromPokeApi } from "@/lib/pokeapi";
import type { PokeApiNamedResource } from "./generationApi";

export interface PokeApiVersion {
  id: number;
  name: string;
  version_group: PokeApiNamedResource;
}

export interface PokeApiVersionGroup {
  id: number;
  name: string;
  generation: PokeApiNamedResource;
  versions: PokeApiNamedResource[];
}

interface PokeApiVersionListResponse {
  results: PokeApiNamedResource[];
}

export async function fetchVersion(idOrName: number | string): Promise<PokeApiVersion> {
  return fetchFromPokeApi<PokeApiVersion>(`/version/${idOrName}`);
}

export async function fetchVersionGroup(idOrName: number | string): Promise<PokeApiVersionGroup> {
  return fetchFromPokeApi<PokeApiVersionGroup>(`/version-group/${idOrName}`);
}

/**
 * 모든 게임 버전에 대한 "버전 → 세대" 매핑 테이블을 구성한다.
 * (초기 버전에서는 1회 로딩 후 메모리/React Query에 캐시해두고 재사용하는 것을 전제로 한다.)
 */
export async function buildGameGenerationMap(): Promise<
  Record<string, { generationName: string; versionGroupName: string }>
> {
  const list = await fetchFromPokeApi<PokeApiVersionListResponse>("/version");

  const entries = await Promise.all(
    list.results.map(async (v) => {
      const version = await fetchVersion(v.name);
      const group = await fetchVersionGroup(version.version_group.name);

      return [
        version.name,
        {
          generationName: group.generation.name,
          versionGroupName: group.name,
        },
      ] as const;
    })
  );

  return Object.fromEntries(entries);
}
