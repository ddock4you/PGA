"use client";
import { useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDexCsvData } from "@/hooks/useDexCsvData";
import { useDexFilters } from "../contexts/DexFilterContext";
import type { DexPokemonSummary } from "@/lib/csvTransforms/pokemonSummary";
import { DexFilterBar } from "./DexFilterBar";
import { DexPokemonCard } from "./DexPokemonCard";
import { LoadMoreButton } from "@/components/ui/load-more-button";
import { useLoadMore } from "@/hooks/useLoadMore";
import { useListRestoration } from "@/hooks/useListRestoration";
import { saveListState } from "@/lib/listState";
import { useNavigationType } from "@/hooks/useNavigationType";
import { useDexPokemonIndexes } from "../hooks/useDexPokemonIndexes";
import { getFilteredPokemonSummaries } from "../utils/getFilteredPokemonSummaries";
import { buildDexPokemonQueryKey } from "../utils/buildDexPokemonQueryKey";

export function DexPokemonTab() {
  const router = useRouter();
  const { filters, searchQuery, updateFilters, updateSearchQuery, resetFilters } = useDexFilters();
  const pathname = usePathname();
  const { navigationType, markPush } = useNavigationType();

  const {
    pokemonData,
    pokemonTypesData,
    pokemonAbilitiesData,
    pokemonSpeciesNamesData,
    isLoading,
    isError,
  } = useDexCsvData();

  const { pokemonTypesById, pokemonAbilitiesById, pokemonById } = useDexPokemonIndexes({
    pokemonData,
    pokemonTypesData,
    pokemonAbilitiesData,
  });

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
    () => buildDexPokemonQueryKey(filters, searchQuery),
    [filters, searchQuery]
  );

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
    markPush();
    router.push(`/dex/${pokemon.id}`);
  };

  return (
    <div className="space-y-4">
      <DexFilterBar
        filters={filters}
        searchQuery={searchQuery}
        onFiltersChange={updateFilters}
        onSearchQueryChange={updateSearchQuery}
        onReset={resetFilters}
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
