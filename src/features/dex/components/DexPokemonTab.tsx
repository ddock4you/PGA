"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDexCsvData } from "@/hooks/useDexCsvData";
import { useDexFilters } from "../contexts/DexFilterContext";
import {
  transformPokemonForDex,
  GENERATION_POKEMON_RANGES,
  shouldShowVariantPokemon,
} from "@/utils/dataTransforms";
import { DexFilterBar } from "./DexFilterBar";
import { DexPokemonCard, type DexPokemonSummary } from "./DexPokemonCard";
import { LoadMoreButton } from "@/components/ui/load-more-button";
import { useLoadMore } from "@/hooks/useLoadMore";
import { useListRestoration } from "@/hooks/useListRestoration";
import type { DexFilters } from "../types/filterTypes";
import { saveListState } from "@/lib/listState";
import type { CsvPokemonSpeciesName, CsvPokemonType } from "@/types/csvTypes";

type CsvPokemonRow = Parameters<typeof transformPokemonForDex>[0][number];

export function DexPokemonTab() {
  const router = useRouter();
  const { filters, searchQuery, updateFilters, updateSearchQuery } = useDexFilters();
  const pathname = usePathname();
  const [navigationType, setNavigationType] = useState<"push" | "pop">("push");

  const {
    pokemonData,
    pokemonTypesData,
    pokemonAbilitiesData,
    pokemonSpeciesNamesData,
    isLoading,
    isError,
  } = useDexCsvData();

  const pokemonTypesById = useMemo(() => {
    const map = new Map<number, number[]>();
    pokemonTypesData?.forEach((type) => {
      const existing = map.get(type.pokemon_id);
      if (existing) {
        existing.push(type.type_id);
      } else {
        map.set(type.pokemon_id, [type.type_id]);
      }
    });
    return map;
  }, [pokemonTypesData]);

  const pokemonAbilitiesById = useMemo(() => {
    const map = new Map<number, number[]>();
    pokemonAbilitiesData?.forEach((ability) => {
      const existing = map.get(ability.pokemon_id);
      if (existing) {
        existing.push(ability.ability_id);
      } else {
        map.set(ability.pokemon_id, [ability.ability_id]);
      }
    });
    return map;
  }, [pokemonAbilitiesData]);

  const pokemonById = useMemo(() => {
    const map = new Map<number, CsvPokemonRow>();
    pokemonData?.forEach((pokemon) => {
      map.set(pokemon.id, pokemon);
    });
    return map;
  }, [pokemonData]);

  const filteredPokemonSummaries = useMemo(
    () =>
      getFilteredPokemonSummaries({
        pokemonData,
        pokemonTypesData,
        pokemonSpeciesNamesData,
        pokemonTypesById,
        pokemonAbilitiesById,
        pokemonById,
        filters,
        searchQuery,
      }),
    [
      pokemonData,
      pokemonTypesData,
      pokemonSpeciesNamesData,
      pokemonTypesById,
      pokemonAbilitiesById,
      pokemonById,
      filters,
      searchQuery,
    ]
  );

  const chunkQueryKey = useMemo(
    () => [
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
    ],
    [
      filters.dexGenerationId,
      filters.includeSubGenerations,
      filters.onlyDefaultForms,
      filters.selectedGameVersion,
      filters.selectedTypes,
      filters.selectedAbilityId,
      filters.sortByWeight,
      filters.weightOrder,
      filters.sortByHeight,
      filters.heightOrder,
      filters.sortByDexNumber,
      filters.dexNumberOrder,
      filters.itemsPerPage,
      searchQuery,
    ]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handlePop = () => setNavigationType("pop");
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  useEffect(() => {
    if (navigationType === "pop") {
      const id = window.setTimeout(() => setNavigationType("push"), 0);
      return () => window.clearTimeout(id);
    }
    return undefined;
  }, [navigationType]);

  const hasBaseData =
    Boolean(pokemonData) &&
    Boolean(pokemonTypesData) &&
    Boolean(pokemonAbilitiesData) &&
    Boolean(pokemonSpeciesNamesData);

  const {
    items,
    totalPages,
    totalCount,
    currentPage,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isError: loadMoreError,
  } = useLoadMore<DexPokemonSummary>({
    enabled: hasBaseData && !isLoading && !isError,
    queryKey: chunkQueryKey,
    fetchPage: async (pageParam = 1) => {
      const pageSize = filters.itemsPerPage;
      const count = filteredPokemonSummaries.length;
      const calculatedTotalPages = Math.max(1, Math.ceil(count / pageSize));
      const start = (pageParam - 1) * pageSize;
      const pageItems = filteredPokemonSummaries.slice(start, start + pageSize);
      return {
        page: pageParam,
        totalPages: calculatedTotalPages,
        totalCount: count,
        items: pageItems,
      };
    },
  });

  useListRestoration({
    pathname,
    currentPage,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    navigationType,
  });

  const handleOpen = (pokemon: DexPokemonSummary) => {
    if (typeof window !== "undefined") {
      saveListState(pathname, {
        pageCount: Math.max(1, currentPage),
        scrollY: window.scrollY,
      });
    }
    setNavigationType("push");
    router.push(`/dex/${pokemon.id}`);
  };

  return (
    <div className="space-y-4">
      <DexFilterBar
        filters={filters}
        searchQuery={searchQuery}
        onFiltersChange={updateFilters}
        onSearchQueryChange={updateSearchQuery}
        description="세대/게임과 다양한 조건으로 포켓몬을 탐색할 수 있습니다."
      />

      {isLoading && (
        <p className="pt-2 text-xs text-muted-foreground">포켓몬 리스트를 불러오는 중입니다...</p>
      )}

      {isError && (
        <p className="pt-2 text-xs text-destructive">
          포켓몬 리스트를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
        </p>
      )}

      {!isLoading && !isError && (
        <p className="text-sm text-muted-foreground">{totalCount}마리의 포켓몬을 볼 수 있습니다.</p>
      )}

      {!isLoading && !isError && totalCount === 0 && (
        <p className="pt-2 text-xs text-muted-foreground">조건에 해당하는 포켓몬이 없습니다.</p>
      )}

      {loadMoreError && (
        <p className="pt-2 text-xs text-destructive">
          추가 항목을 불러오는 중 오류가 발생했습니다. 다시 시도해 주세요.
        </p>
      )}

      <section className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2 md:grid-cols-3">
        {items.map((pokemon) => (
          <DexPokemonCard key={pokemon.id} {...pokemon} onClick={() => handleOpen(pokemon)} />
        ))}
      </section>

      {totalPages > 1 && (
        <LoadMoreButton
          currentPage={currentPage}
          totalPages={totalPages}
          hasNextPage={Boolean(hasNextPage)}
          isLoading={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        />
      )}
    </div>
  );
}

function getFilteredPokemonSummaries({
  pokemonData,
  pokemonTypesData,
  pokemonSpeciesNamesData,
  pokemonTypesById,
  pokemonAbilitiesById,
  pokemonById,
  filters,
  searchQuery,
}: {
  pokemonData?: CsvPokemonRow[];
  pokemonTypesData?: CsvPokemonType[];
  pokemonSpeciesNamesData?: CsvPokemonSpeciesName[];
  pokemonTypesById: Map<number, number[]>;
  pokemonAbilitiesById: Map<number, number[]>;
  pokemonById: Map<number, CsvPokemonRow>;
  filters: DexFilters;
  searchQuery: string;
}) {
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

  let summaries = transformPokemonForDex(
    filteredPokemon,
    pokemonTypesData,
    pokemonSpeciesNamesData
  );

  if (searchQuery.trim()) {
    const query = searchQuery.trim().toLowerCase();
    summaries = summaries.filter((p) => {
      const koreanMatch = p.name.toLowerCase().includes(query);
      const pokemon = pokemonById.get(p.id);
      const englishMatch = pokemon ? pokemon.identifier.toLowerCase().includes(query) : false;
      return koreanMatch || englishMatch;
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
