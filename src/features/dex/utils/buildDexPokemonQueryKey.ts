import type { DexFilters } from "../types/filterTypes";

export function buildDexPokemonQueryKey(filters: DexFilters, searchQuery: string) {
  return [
    "dex-pokemon",
    filters.dexGenerationId,
    filters.includeSubGenerations,
    filters.onlyDefaultForms,
    filters.selectedGameVersion?.id ?? "default",
    filters.selectedTypes
      .slice()
      .sort((a, b) => a - b)
      .join(","),
    filters.selectedAbilityId ?? "none",
    filters.sortByWeight,
    filters.weightOrder,
    filters.sortByHeight,
    filters.heightOrder,
    filters.sortByDexNumber,
    filters.dexNumberOrder,
    filters.itemsPerPage,
    searchQuery.trim(),
  ];
}
