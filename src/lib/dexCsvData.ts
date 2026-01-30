import { loadAbilitiesCsv, loadAbilityNamesCsv } from "@/lib/csv/abilities";
import { loadItemsCsv, loadItemNamesCsv } from "@/lib/csv/items";
import { loadMachinesCsv } from "@/lib/csv/machines";
import { loadMoveNamesCsv, loadMovesCsv } from "@/lib/csv/movesCore";
import { loadNaturesCsv } from "@/lib/csv/natures";
import { loadPokemonAbilitiesCsv } from "@/lib/csv/pokemonAbilities";
import { loadPokemonCsv, loadPokemonSpeciesNamesCsv } from "@/lib/csv/pokemonCore";
import { loadPokemonTypesCsv } from "@/lib/csv/pokemonTypes";
import { loadVersionGroupsCsv } from "@/lib/csv/versionGroups";

import type {
  CsvAbility,
  CsvAbilityName,
  CsvItem,
  CsvItemName,
  CsvMachine,
  CsvMove,
  CsvMoveName,
  CsvNature,
  CsvPokemon,
  CsvPokemonAbility,
  CsvPokemonSpeciesName,
  CsvPokemonType,
  CsvVersionGroup,
} from "@/types/csvTypes";

export interface DexCsvData {
  pokemonData: CsvPokemon[];
  movesData: CsvMove[];
  moveNamesData: CsvMoveName[];
  machinesData: CsvMachine[];
  versionGroupsData: CsvVersionGroup[];
  naturesData: CsvNature[];
  abilitiesData: CsvAbility[];
  abilityNamesData: CsvAbilityName[];
  pokemonSpeciesNamesData: CsvPokemonSpeciesName[];
  itemsData: CsvItem[];
  itemNamesData: CsvItemName[];
  pokemonTypesData: CsvPokemonType[];
  pokemonAbilitiesData: CsvPokemonAbility[];
}

const csvDataCache: { current: DexCsvData | null } = { current: null };
let csvDataPromise: Promise<DexCsvData> | null = null;

export async function loadDexCsvData(): Promise<DexCsvData> {
  if (csvDataCache.current) {
    return csvDataCache.current;
  }

  if (!csvDataPromise) {
    csvDataPromise = Promise.all([
      loadPokemonCsv(),
      loadMovesCsv(),
      loadMoveNamesCsv(),
      loadMachinesCsv(),
      loadVersionGroupsCsv(),
      loadNaturesCsv(),
      loadAbilitiesCsv(),
      loadAbilityNamesCsv(),
      loadPokemonSpeciesNamesCsv(),
      loadItemsCsv(),
      loadItemNamesCsv(),
      loadPokemonTypesCsv(),
      loadPokemonAbilitiesCsv(),
    ])
      .then(
        ([
          pokemonData,
          movesData,
          moveNamesData,
          machinesData,
          versionGroupsData,
          naturesData,
          abilitiesData,
          abilityNamesData,
          pokemonSpeciesNamesData,
          itemsData,
          itemNamesData,
          pokemonTypesData,
          pokemonAbilitiesData,
        ]) => {
          const data: DexCsvData = {
            pokemonData,
            movesData,
            moveNamesData,
            machinesData,
            versionGroupsData,
            naturesData,
            abilitiesData,
            abilityNamesData,
            pokemonSpeciesNamesData,
            itemsData,
            itemNamesData,
            pokemonTypesData,
            pokemonAbilitiesData,
          };
          csvDataCache.current = data;
          csvDataPromise = null;
          return data;
        }
      )
      .catch((error) => {
        csvDataPromise = null;
        throw error;
      });
  }

  return csvDataPromise;
}
