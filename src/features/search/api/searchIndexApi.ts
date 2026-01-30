import "server-only";

import { fetchPokemonSpeciesListByGeneration } from "@/features/pokemon/api/pokemonApi.server";
import { fetchGeneration } from "@/features/generation/api/generationApi.server";
import { fetchItemList } from "@/features/items/api/itemsApi.server";

export interface SearchEntry {
  id: number;
  name: string;
}

export interface SearchIndex {
  pokemon: SearchEntry[];
  moves: SearchEntry[];
  abilities: SearchEntry[];
  items: SearchEntry[];
}

// URL에서 ID 추출하는 헬퍼
function extractId(url: string, resourceName: string): number {
  const regex = new RegExp(`/${resourceName}/(\\d+)/`);
  const match = url.match(regex);
  return match ? Number.parseInt(match[1] ?? "0", 10) : 0;
}

export async function buildFullSearchIndex(generationId: number | string): Promise<SearchIndex> {
  // 병렬 호출
  const [speciesList, generationData, itemList] = await Promise.all([
    fetchPokemonSpeciesListByGeneration(generationId),
    fetchGeneration(generationId),
    fetchItemList(10000), // 도구는 전체
  ]);

  const pokemon = speciesList.map((s) => ({
    id: extractId(s.url || "", "pokemon-species"),
    name: s.name,
  }));

  const moves = generationData.moves.map((m) => ({
    id: extractId(m.url, "move"),
    name: m.name,
  }));

  const abilities = generationData.abilities.map((a) => ({
    id: extractId(a.url, "ability"),
    name: a.name,
  }));

  // 도구는 세대 구분이 없으므로 전체 포함
  const items = itemList.map((i) => ({
    id: extractId(i.url, "item"),
    name: i.name,
  }));

  return { pokemon, moves, abilities, items };
}

export function filterEntriesByQuery(entries: SearchEntry[], query: string): SearchEntry[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];
  return entries.filter((e) => e.name.toLowerCase().includes(trimmed));
}
