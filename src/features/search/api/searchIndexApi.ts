import { fetchPokemonSpeciesListByGeneration } from "@/features/pokemon/api/pokemonApi";
import type { PokeApiNamedResource } from "@/features/generation/api/generationApi";

export interface PokemonSearchEntry {
  id: number;
  name: string;
}

export interface SearchIndex {
  pokemon: PokemonSearchEntry[];
  // 이후 단계에서 moves/abilities/items 를 확장
}

/**
 * 1단계: 세대 기준 포켓몬 이름만 포함하는 간단한 검색 인덱스를 생성한다.
 */
export async function buildPokemonOnlySearchIndex(
  generationId: number | string,
  _primaryLanguage: string
): Promise<SearchIndex> {
  const species = await fetchPokemonSpeciesListByGeneration(generationId);

  const pokemon: PokemonSearchEntry[] = species.map((s) => {
    // url 에서 id를 추출할 수 있는 경우 활용하고, 없으면 0으로 둔다.
    let id = 0;
    if (s.url) {
      const match = s.url.match(/\/pokemon-species\/(\d+)\//);
      if (match) {
        id = Number.parseInt(match[1] ?? "0", 10);
      }
    }

    return {
      id,
      name: s.name,
    };
  });

  return { pokemon };
}

export function filterPokemonByQuery(index: SearchIndex, query: string): PokemonSearchEntry[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  return index.pokemon.filter((p) => p.name.toLowerCase().includes(trimmed));
}
