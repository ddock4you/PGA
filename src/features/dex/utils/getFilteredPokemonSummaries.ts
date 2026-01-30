import {
  transformPokemonForDex,
  GENERATION_POKEMON_RANGES,
  shouldShowVariantPokemon,
} from "@/utils/dataTransforms";
import type { DexPokemonSummary } from "@/utils/dataTransforms";
import type {
  CsvPokemon,
  CsvPokemonSpeciesName,
  CsvPokemonType,
} from "@/types/csvTypes";
import type { DexFilters } from "../types/filterTypes";
import { matchesAnySearchText, normalizeSearchQuery } from "@/utils/searchText";

export function getFilteredPokemonSummaries({
  pokemonData,
  pokemonTypesData,
  pokemonSpeciesNamesData,
  pokemonTypesById,
  pokemonAbilitiesById,
  pokemonById,
  filters,
  searchQuery,
}: {
  pokemonData?: CsvPokemon[];
  pokemonTypesData?: CsvPokemonType[];
  pokemonSpeciesNamesData?: CsvPokemonSpeciesName[];
  pokemonTypesById: Map<number, number[]>;
  pokemonAbilitiesById: Map<number, number[]>;
  pokemonById: Map<number, CsvPokemon>;
  filters: DexFilters;
  searchQuery: string;
}): DexPokemonSummary[] {
  if (!pokemonData || !pokemonTypesData || !pokemonSpeciesNamesData) return [];

  let filteredPokemon = pokemonData;
  let minId = 1;
  let maxId = 1010;

  if (!filters.includeSubGenerations) {
    const range = GENERATION_POKEMON_RANGES[filters.dexGenerationId];
    if (range) {
      [minId, maxId] = range;
    }
  } else {
    const range = GENERATION_POKEMON_RANGES[filters.dexGenerationId];
    if (range) {
      minId = 1;
      maxId = range[1];
    }
  }

  filteredPokemon = filteredPokemon.filter((p) => p.id >= minId && p.id <= maxId);

  if (filters.selectedGameVersion) {
    const selectedGameVersionId = filters.selectedGameVersion.id;
    filteredPokemon = filteredPokemon.filter((p) =>
      shouldShowVariantPokemon(p.identifier, selectedGameVersionId)
    );
  }

  if (filters.onlyDefaultForms) {
    filteredPokemon = filteredPokemon.filter((p) => p.is_default === 1);
  }

  if (filters.selectedTypes.length > 0) {
    filteredPokemon = filteredPokemon.filter((p) => {
      const pokemonTypeIds = pokemonTypesById.get(p.id) ?? [];
      return filters.selectedTypes.some((typeId) => pokemonTypeIds.includes(typeId));
    });
  }

  if (filters.selectedAbilityId) {
    const selectedAbilityId = filters.selectedAbilityId;
    filteredPokemon = filteredPokemon.filter((p) => {
      const pokemonAbilityIds = pokemonAbilitiesById.get(p.id) ?? [];
      return pokemonAbilityIds.includes(selectedAbilityId);
    });
  }

  let summaries = transformPokemonForDex(filteredPokemon, pokemonTypesData, pokemonSpeciesNamesData);

  const normalizedQuery = normalizeSearchQuery(searchQuery);
  if (normalizedQuery) {
    summaries = summaries.filter((p) => {
      const pokemon = pokemonById.get(p.id);
      return matchesAnySearchText([p.name, pokemon?.identifier], normalizedQuery);
    });
  }

  if (!filters.sortByWeight && !filters.sortByHeight && !filters.sortByDexNumber) {
    summaries.sort((a, b) => {
      const aPokemon = pokemonById.get(a.id);
      const bPokemon = pokemonById.get(b.id);

      if (!aPokemon || !bPokemon) return 0;

      const speciesComparison = aPokemon.species_id - bPokemon.species_id;
      if (speciesComparison !== 0) return speciesComparison;

      const defaultComparison = bPokemon.is_default - aPokemon.is_default;
      if (defaultComparison !== 0) return defaultComparison;

      return aPokemon.id - bPokemon.id;
    });
  }

  if (filters.sortByWeight) {
    summaries.sort((a, b) => {
      const aPokemon = pokemonById.get(a.id);
      const bPokemon = pokemonById.get(b.id);
      if (!aPokemon || !bPokemon) return 0;

      const comparison = aPokemon.weight - bPokemon.weight;
      return filters.weightOrder === "asc" ? comparison : -comparison;
    });
  } else if (filters.sortByHeight) {
    summaries.sort((a, b) => {
      const aPokemon = pokemonById.get(a.id);
      const bPokemon = pokemonById.get(b.id);
      if (!aPokemon || !bPokemon) return 0;

      const comparison = aPokemon.height - bPokemon.height;
      return filters.heightOrder === "asc" ? comparison : -comparison;
    });
  } else if (filters.sortByDexNumber) {
    summaries.sort((a, b) => {
      const comparison = a.id - b.id;
      return filters.dexNumberOrder === "asc" ? comparison : -comparison;
    });
  }

  return summaries;
}
