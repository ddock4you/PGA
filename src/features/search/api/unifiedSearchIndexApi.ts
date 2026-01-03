import {
  loadPokemonCsv,
  loadMovesCsv,
  loadAbilitiesCsv,
  loadItemsCsv,
  loadMoveNamesCsv,
  loadAbilityNamesCsv,
  loadItemNamesCsv,
  loadPokemonSpeciesNamesCsv,
} from "@/data/csvLoader";
import type {
  CsvPokemon,
  CsvMove,
  CsvAbility,
  CsvItem,
  CsvMoveName,
  CsvAbilityName,
  CsvItemName,
} from "@/types/csvTypes";
import type { UnifiedSearchIndex, UnifiedSearchEntry } from "../types/unifiedSearchTypes";
import { groupNamesById, getLocalizedNamesForId } from "../utils/nameMappingUtils";

export interface UnifiedSearchIndexBuildOptions {
  progress?: (chunk: Partial<UnifiedSearchIndex>) => void;
}

// 통합 검색 인덱스 생성 함수 (chunked preload 지원)
export async function buildUnifiedSearchIndex(
  options?: UnifiedSearchIndexBuildOptions
): Promise<UnifiedSearchIndex> {
  const index: UnifiedSearchIndex = {
    pokemon: [],
    moves: [],
    abilities: [],
    items: [],
  };

  const pokemonData = await loadPokemonCsv();
  const pokemonNames = await loadPokemonSpeciesNamesCsv();
  const pokemonNameGroups = groupNamesById(
    pokemonData,
    pokemonNames.map((name) => ({
      ...name,
      id: name.pokemon_species_id,
    }))
  );
  const pokemonEntries = createPokemonEntries(pokemonData, pokemonNameGroups);
  index.pokemon = pokemonEntries;
  options?.progress?.({ pokemon: pokemonEntries });

  const movesData = await loadMovesCsv();
  const moveNames = await loadMoveNamesCsv();
  const moves = createMoveEntries(movesData, moveNames);
  index.moves = moves;
  options?.progress?.({ moves });

  const abilitiesData = await loadAbilitiesCsv();
  const abilityNames = await loadAbilityNamesCsv();
  const abilities = createAbilityEntries(abilitiesData, abilityNames);
  index.abilities = abilities;
  options?.progress?.({ abilities });

  const itemsData = await loadItemsCsv();
  const itemNames = await loadItemNamesCsv();
  const items = createItemEntries(itemsData, itemNames);
  index.items = items;
  options?.progress?.({ items });

  return index;
}

// 포켓몬 엔트리 생성
function createPokemonEntries(
  pokemonData: CsvPokemon[],
  nameGroups: Map<number, Array<{ local_language_id: number; name: string }>>
): UnifiedSearchEntry[] {
  return pokemonData.map((pokemon) => {
    const name = getLocalizedNamesForId(pokemon.species_id, nameGroups);
    return {
      id: pokemon.id,
      category: "pokemon" as const,
      name,
      // metadata: 추가적인 메타데이터가 필요하면 여기에 추가
    };
  });
}

// 기술 엔트리 생성
function createMoveEntries(movesData: CsvMove[], moveNames: CsvMoveName[]): UnifiedSearchEntry[] {
  // move_id 기준으로 이름 그룹화
  const moveNameGroups = groupNamesById(
    movesData,
    moveNames.map((name) => ({ ...name, id: name.move_id }))
  );

  return movesData.map((move) => {
    const name = getLocalizedNamesForId(move.id, moveNameGroups);
    return {
      id: move.id,
      category: "move" as const,
      name,
      metadata: {
        power: move.power ?? undefined,
        // 다른 메타데이터 추가 가능
      },
    };
  });
}

// 특성 엔트리 생성
function createAbilityEntries(
  abilitiesData: CsvAbility[],
  abilityNames: CsvAbilityName[]
): UnifiedSearchEntry[] {
  // ability_id 기준으로 이름 그룹화
  const abilityNameGroups = groupNamesById(
    abilitiesData,
    abilityNames.map((name) => ({ ...name, id: name.ability_id }))
  );

  return abilitiesData.map((ability) => {
    const name = getLocalizedNamesForId(ability.id, abilityNameGroups);
    return {
      id: ability.id,
      category: "ability" as const,
      name,
    };
  });
}

// 도구 엔트리 생성
function createItemEntries(itemsData: CsvItem[], itemNames: CsvItemName[]): UnifiedSearchEntry[] {
  // item_id 기준으로 이름 그룹화
  const itemNameGroups = groupNamesById(
    itemsData,
    itemNames.map((name) => ({ ...name, id: name.item_id }))
  );

  return itemsData.map((item) => {
    const name = getLocalizedNamesForId(item.id, itemNameGroups);
    return {
      id: item.id,
      category: "item" as const,
      name,
      metadata: {
        category: item.category_id?.toString(),
        cost: item.cost,
      },
    };
  });
}
