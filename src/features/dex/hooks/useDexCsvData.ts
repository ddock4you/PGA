import { useQuery } from "@tanstack/react-query";
import {
  loadPokemonCsv,
  loadMovesCsv,
  loadMoveNamesCsv,
  loadMachinesCsv,
  loadVersionGroupsCsv,
  loadNaturesCsv,
  loadItemsCsv,
  loadItemNamesCsv,
  loadAbilitiesCsv,
  loadAbilityNamesCsv,
  loadPokemonSpeciesNamesCsv,
  loadPokemonTypesCsv,
  loadPokemonAbilitiesCsv,
} from "../api/csvLoader";
import type {
  CsvPokemon,
  CsvMove,
  CsvMoveName,
  CsvMachine,
  CsvVersionGroup,
  CsvNature,
  CsvItem,
  CsvItemName,
  CsvAbility,
  CsvAbilityName,
  CsvPokemonSpeciesName,
  CsvPokemonType,
  CsvPokemonAbility,
} from "../types/csvTypes";

// CSV 데이터를 로드하는 커스텀 훅
// 모든 CSV 데이터를 한 번에 로드하고 캐시
export function useDexCsvData() {
  const pokemonQuery = useQuery({
    queryKey: ["dex-csv", "pokemon"],
    queryFn: loadPokemonCsv,
    staleTime: Infinity, // 정적 데이터이므로 무한 캐시
    gcTime: Infinity,
    refetchOnWindowFocus: false, // 윈도우 포커스 시 리페치 불필요
    refetchOnReconnect: false, // 재연결 시 리페치 불필요
    refetchOnMount: false, // 마운트 시 리페치 불필요 (이미 캐시됨)
  });

  const movesQuery = useQuery({
    queryKey: ["dex-csv", "moves"],
    queryFn: loadMovesCsv,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const moveNamesQuery = useQuery({
    queryKey: ["dex-csv", "move-names"],
    queryFn: loadMoveNamesCsv,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const machinesQuery = useQuery({
    queryKey: ["dex-csv", "machines"],
    queryFn: loadMachinesCsv,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const versionGroupsQuery = useQuery({
    queryKey: ["dex-csv", "version-groups"],
    queryFn: loadVersionGroupsCsv,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const naturesQuery = useQuery({
    queryKey: ["dex-csv", "natures"],
    queryFn: loadNaturesCsv,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const abilitiesQuery = useQuery({
    queryKey: ["dex-csv", "abilities"],
    queryFn: loadAbilitiesCsv,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const abilityNamesQuery = useQuery({
    queryKey: ["dex-csv", "ability-names"],
    queryFn: loadAbilityNamesCsv,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const pokemonTypesQuery = useQuery({
    queryKey: ["dex-csv", "pokemon-types"],
    queryFn: loadPokemonTypesCsv,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const pokemonAbilitiesQuery = useQuery({
    queryKey: ["dex-csv", "pokemon-abilities"],
    queryFn: loadPokemonAbilitiesCsv,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const pokemonSpeciesNamesQuery = useQuery({
    queryKey: ["dex-csv", "pokemon-species-names"],
    queryFn: loadPokemonSpeciesNamesCsv,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const itemsQuery = useQuery({
    queryKey: ["dex-csv", "items"],
    queryFn: loadItemsCsv,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const itemNamesQuery = useQuery({
    queryKey: ["dex-csv", "item-names"],
    queryFn: loadItemNamesCsv,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  // 모든 쿼리가 로딩 중인지 확인
  const isLoading =
    pokemonQuery.isLoading ||
    movesQuery.isLoading ||
    moveNamesQuery.isLoading ||
    machinesQuery.isLoading ||
    versionGroupsQuery.isLoading ||
    naturesQuery.isLoading ||
    abilitiesQuery.isLoading ||
    abilityNamesQuery.isLoading ||
    itemsQuery.isLoading ||
    itemNamesQuery.isLoading ||
    pokemonTypesQuery.isLoading ||
    pokemonAbilitiesQuery.isLoading ||
    pokemonSpeciesNamesQuery.isLoading;

  // 모든 쿼리가 에러인지 확인
  const isError =
    pokemonQuery.isError ||
    movesQuery.isError ||
    moveNamesQuery.isError ||
    machinesQuery.isError ||
    versionGroupsQuery.isError ||
    naturesQuery.isError ||
    abilitiesQuery.isError ||
    abilityNamesQuery.isError ||
    itemsQuery.isError ||
    itemNamesQuery.isError ||
    pokemonTypesQuery.isError ||
    pokemonAbilitiesQuery.isError ||
    pokemonSpeciesNamesQuery.isError;

  // 에러 메시지들 수집
  const errors = [
    pokemonQuery.error,
    movesQuery.error,
    moveNamesQuery.error,
    machinesQuery.error,
    versionGroupsQuery.error,
    naturesQuery.error,
    abilitiesQuery.error,
    abilityNamesQuery.error,
    itemsQuery.error,
    itemNamesQuery.error,
    pokemonTypesQuery.error,
    pokemonAbilitiesQuery.error,
    pokemonSpeciesNamesQuery.error,
  ].filter(Boolean);

  return {
    // 데이터
    pokemonData: pokemonQuery.data ?? [],
    movesData: movesQuery.data ?? [],
    moveNamesData: moveNamesQuery.data ?? [],
    machinesData: machinesQuery.data ?? [],
    versionGroupsData: versionGroupsQuery.data ?? [],
    naturesData: naturesQuery.data ?? [],
    abilitiesData: abilitiesQuery.data ?? [],
    abilityNamesData: abilityNamesQuery.data ?? [],
    pokemonSpeciesNamesData: pokemonSpeciesNamesQuery.data ?? [],
    itemsData: itemsQuery.data ?? [],
    itemNamesData: itemNamesQuery.data ?? [],
    pokemonTypesData: pokemonTypesQuery.data ?? [],
    pokemonAbilitiesData: pokemonAbilitiesQuery.data ?? [],

    // 상태
    isLoading,
    isError,
    errors,

    // 개별 쿼리 상태 (디버깅용)
    pokemonQuery,
    movesQuery,
    moveNamesQuery,
    machinesQuery,
    versionGroupsQuery,
    naturesQuery,
    abilitiesQuery,
    abilityNamesQuery,
    pokemonSpeciesNamesQuery,
    itemsQuery,
    itemNamesQuery,
    pokemonTypesQuery,
    pokemonAbilitiesQuery,
  };
}
