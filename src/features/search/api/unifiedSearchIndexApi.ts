import {
  loadPokemonCsv,
  loadMovesCsv,
  loadAbilitiesCsv,
  loadItemsCsv,
  loadMoveNamesCsv,
  loadAbilityNamesCsv,
  loadItemNamesCsv,
  loadPokemonSpeciesNamesCsv,
} from "@/features/dex/api/csvLoader";
import type {
  CsvPokemon,
  CsvMove,
  CsvAbility,
  CsvItem,
  CsvMoveName,
  CsvAbilityName,
  CsvItemName,
} from "@/features/dex/types/csvTypes";
import type { UnifiedSearchIndex, UnifiedSearchEntry } from "../types/unifiedSearchTypes";
import { groupNamesById, getLocalizedNamesForId } from "../utils/nameMappingUtils";

// 통합 검색 인덱스 생성 함수
export async function buildUnifiedSearchIndex(): Promise<UnifiedSearchIndex> {
  // 모든 CSV 데이터를 병렬로 로드
  const [
    pokemonData,
    pokemonNames,
    movesData,
    moveNames,
    abilitiesData,
    abilityNames,
    itemsData,
    itemNames,
  ] = await Promise.all([
    loadPokemonCsv(),
    loadPokemonSpeciesNamesCsv(),
    loadMovesCsv(),
    loadMoveNamesCsv(),
    loadAbilitiesCsv(),
    loadAbilityNamesCsv(),
    loadItemsCsv(),
    loadItemNamesCsv(),
  ]);

  // 포켓몬 이름 그룹화 (species_id 기준)
  const pokemonNameGroups = groupNamesById(
    pokemonData,
    pokemonNames.map((name) => ({
      ...name,
      id: name.pokemon_species_id, // species_id를 id로 매핑
    }))
  );

  // 각 카테고리별로 UnifiedSearchEntry 생성
  const pokemon = createPokemonEntries(pokemonData, pokemonNameGroups);
  const moves = createMoveEntries(movesData, moveNames);
  const abilities = createAbilityEntries(abilitiesData, abilityNames);
  const items = createItemEntries(itemsData, itemNames);

  return { pokemon, moves, abilities, items };
}

// 포켓몬 엔트리 생성
function createPokemonEntries(
  pokemonData: CsvPokemon[],
  nameGroups: Map<number, Array<{ local_language_id: number; name: string }>>
): UnifiedSearchEntry[] {
  return pokemonData.map((pokemon) => {
    const names = getLocalizedNamesForId(pokemon.species_id, nameGroups);
    return {
      id: pokemon.id,
      category: "pokemon" as const,
      names,
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
    const names = getLocalizedNamesForId(move.id, moveNameGroups);
    return {
      id: move.id,
      category: "move" as const,
      names,
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
    const names = getLocalizedNamesForId(ability.id, abilityNameGroups);
    return {
      id: ability.id,
      category: "ability" as const,
      names,
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
    const names = getLocalizedNamesForId(item.id, itemNameGroups);
    return {
      id: item.id,
      category: "item" as const,
      names,
      metadata: {
        category: item.category_id?.toString(),
        cost: item.cost,
      },
    };
  });
}
