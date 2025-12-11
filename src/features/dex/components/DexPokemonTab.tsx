import { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useDexCsvData } from "../hooks/useDexCsvData";
import { useDexFilters } from "../contexts/DexFilterContext";
import {
  transformPokemonForDex,
  GENERATION_POKEMON_RANGES,
  shouldShowVariantPokemon,
} from "../utils/dataTransforms";
import { DexFilterBar } from "./DexFilterBar";
import { DexPokemonCard, type DexPokemonSummary } from "./DexPokemonCard";

export function DexPokemonTab() {
  const navigate = useNavigate();
  const { filters, searchQuery, updateFilters, updateSearchQuery, updatePagination } =
    useDexFilters();

  const { pokemonData, pokemonTypesData, pokemonAbilitiesData, isLoading, isError } =
    useDexCsvData();

  const handleOpen = (pokemon: DexPokemonSummary) => {
    navigate(`/dex/${pokemon.id}`);
  };

  // 필터링된 포켓몬 목록 생성
  const pokemonSummaries: DexPokemonSummary[] = useMemo(() => {
    if (!pokemonData || !pokemonTypesData) return [];

    // 1. 세대 범위 필터링
    let filteredPokemon = pokemonData;
    let minId = 1;
    let maxId = 1010; // 9세대까지

    if (!filters.includeSubGenerations) {
      // 특정 세대만
      const range = GENERATION_POKEMON_RANGES[filters.dexGenerationId];
      if (range) {
        [minId, maxId] = range;
      }
    } else {
      // 하위세대 포함: 1세대부터 선택된 세대까지
      const range = GENERATION_POKEMON_RANGES[filters.dexGenerationId];
      if (range) {
        minId = 1; // 1세대부터
        maxId = range[1]; // 선택된 세대 끝까지
      }
    }

    filteredPokemon = filteredPokemon.filter((p) => p.id >= minId && p.id <= maxId);

    // 1.5. 게임 버전별 메가/거다이맥스 포켓몬 필터링
    if (filters.selectedGameVersion) {
      filteredPokemon = filteredPokemon.filter((p) =>
        shouldShowVariantPokemon(p.identifier, filters.selectedGameVersion!.id)
      );
    }

    // 2. 기본 포켓몬만 필터링
    // 체크 시: is_default = 1인 포켓몬만 표시
    // 체크 해제 시: 모든 포켓몬 표시 (is_default = 0, 1 모두)
    if (filters.onlyDefaultForms) {
      filteredPokemon = filteredPokemon.filter((p) => p.is_default === 1);
    }
    // 체크 해제 시에는 별도 필터링 없음 - 모든 포켓몬 표시

    // 3. 타입 필터링
    if (filters.selectedTypes.length > 0) {
      filteredPokemon = filteredPokemon.filter((p) => {
        const pokemonTypes = pokemonTypesData.filter((pt) => pt.pokemon_id === p.id);
        const pokemonTypeIds = pokemonTypes.map((pt) => pt.type_id);
        return filters.selectedTypes.some((typeId) => pokemonTypeIds.includes(typeId));
      });
    }

    // 4. 특성 필터링
    if (filters.selectedAbilityId) {
      filteredPokemon = filteredPokemon.filter((p) => {
        const pokemonAbilities = pokemonAbilitiesData.filter((pa) => pa.pokemon_id === p.id);
        return pokemonAbilities.some((pa) => pa.ability_id === filters.selectedAbilityId);
      });
    }

    // 5. DexPokemonSummary로 변환
    let summaries = transformPokemonForDex(filteredPokemon);

    // 6. 이름 검색 필터링
    if (searchQuery.trim()) {
      summaries = summaries.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
      );
    }

    // 7. 기본 정렬: species_id 우선 정렬 (항상 적용)
    if (!filters.sortByWeight && !filters.sortByHeight && !filters.sortByDexNumber) {
      summaries.sort((a, b) => {
        const aPokemon = pokemonData.find((p) => p.id === a.id);
        const bPokemon = pokemonData.find((p) => p.id === b.id);

        if (!aPokemon || !bPokemon) return 0;

        // species_id로 우선 정렬 (같은 종족 그룹화)
        const speciesComparison = aPokemon.species_id - bPokemon.species_id;
        if (speciesComparison !== 0) return speciesComparison;

        // 같은 species_id 내에서는 is_default 우선 (기본 형태가 먼저), 그 다음 id 순
        const defaultComparison = bPokemon.is_default - aPokemon.is_default; // is_default=1이 먼저 오도록
        if (defaultComparison !== 0) return defaultComparison;

        return aPokemon.id - bPokemon.id; // 최종적으로 id 순 정렬
      });
    }

    // 8. 사용자 지정 정렬 적용 (체중, 키, 도감번호)
    if (filters.sortByWeight) {
      summaries.sort((a, b) => {
        const aPokemon = pokemonData.find((p) => p.id === a.id);
        const bPokemon = pokemonData.find((p) => p.id === b.id);
        if (!aPokemon || !bPokemon) return 0;

        const comparison = aPokemon.weight - bPokemon.weight;
        return filters.weightOrder === "asc" ? comparison : -comparison;
      });
    } else if (filters.sortByHeight) {
      summaries.sort((a, b) => {
        const aPokemon = pokemonData.find((p) => p.id === a.id);
        const bPokemon = pokemonData.find((p) => p.id === b.id);
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
  }, [searchQuery, pokemonData, pokemonTypesData, pokemonAbilitiesData, filters]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(pokemonSummaries.length / filters.itemsPerPage);
  const paginatedPokemonSummaries = useMemo(() => {
    const start = (filters.currentPage - 1) * filters.itemsPerPage;
    return pokemonSummaries.slice(start, start + filters.itemsPerPage);
  }, [pokemonSummaries, filters.currentPage, filters.itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    updatePagination(page);
  };

  // 필터 변경 시 페이지네이션을 1페이지로 리셋
  useEffect(() => {
    updatePagination(1);
  }, [
    filters.dexGenerationId,
    filters.selectedGameVersion,
    filters.includeSubGenerations,
    filters.onlyDefaultForms,
    filters.selectedTypes,
    filters.selectedAbilityId,
    filters.sortByWeight,
    filters.weightOrder,
    filters.sortByHeight,
    filters.heightOrder,
    filters.sortByDexNumber,
    filters.dexNumberOrder,
    searchQuery,
    updatePagination,
  ]);

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

      {!isLoading && !isError && pokemonSummaries.length === 0 && (
        <p className="pt-2 text-xs text-muted-foreground">조건에 해당하는 포켓몬이 없습니다.</p>
      )}

      <section className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2 md:grid-cols-3">
        {paginatedPokemonSummaries.map((pokemon) => (
          <DexPokemonCard key={pokemon.id} {...pokemon} onClick={() => handleOpen(pokemon)} />
        ))}
      </section>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(filters.currentPage - 1)}
                className={
                  filters.currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                }
              />
            </PaginationItem>

            <PaginationItem>
              <div className="flex items-center px-4 text-sm">
                {filters.currentPage} / {totalPages}
              </div>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(filters.currentPage + 1)}
                className={
                  filters.currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
