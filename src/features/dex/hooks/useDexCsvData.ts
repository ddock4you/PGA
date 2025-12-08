import { useQuery } from "@tanstack/react-query";
import {
  loadPokemonCsv,
  loadMovesCsv,
  loadMachinesCsv,
  loadNaturesCsv,
  loadItemsCsv,
} from "../api/csvLoader";
import type { CsvPokemon, CsvMove, CsvMachine, CsvNature, CsvItem } from "../types/csvTypes";

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

  const machinesQuery = useQuery({
    queryKey: ["dex-csv", "machines"],
    queryFn: loadMachinesCsv,
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

  const itemsQuery = useQuery({
    queryKey: ["dex-csv", "items"],
    queryFn: loadItemsCsv,
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
    machinesQuery.isLoading ||
    naturesQuery.isLoading ||
    itemsQuery.isLoading;

  // 모든 쿼리가 에러인지 확인
  const isError =
    pokemonQuery.isError ||
    movesQuery.isError ||
    machinesQuery.isError ||
    naturesQuery.isError ||
    itemsQuery.isError;

  // 에러 메시지들 수집
  const errors = [
    pokemonQuery.error,
    movesQuery.error,
    machinesQuery.error,
    naturesQuery.error,
    itemsQuery.error,
  ].filter(Boolean);

  return {
    // 데이터
    pokemonData: pokemonQuery.data ?? [],
    movesData: movesQuery.data ?? [],
    machinesData: machinesQuery.data ?? [],
    naturesData: naturesQuery.data ?? [],
    itemsData: itemsQuery.data ?? [],

    // 상태
    isLoading,
    isError,
    errors,

    // 개별 쿼리 상태 (디버깅용)
    pokemonQuery,
    movesQuery,
    machinesQuery,
    naturesQuery,
    itemsQuery,
  };
}
