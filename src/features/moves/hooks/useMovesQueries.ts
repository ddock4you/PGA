import { useQuery, useQueries } from "@tanstack/react-query";
import { fetchMove } from "../api/movesApi";
import { fetchGeneration } from "@/features/generation/api/generationApi";

// 세대별 기술 목록(이름/URL)을 가져오는 훅
export function useMovesListByGeneration(generationId: number | string) {
  return useQuery({
    queryKey: ["generation", "moves", generationId],
    queryFn: async () => {
      const gen = await fetchGeneration(generationId);
      return gen.moves; // NamedAPIResource[]
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

// 여러 기술의 상세 정보를 가져오는 훅 (페이지네이션용)
export function useMovesDetails(names: string[]) {
  return useQueries({
    queries: names.map((name) => ({
      queryKey: ["move", name],
      queryFn: () => fetchMove(name),
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
    })),
  });
}

// 단일 기술 상세
export function useMove(
  idOrName: string | number,
  options?: { initialData?: Awaited<ReturnType<typeof fetchMove>> }
) {
  return useQuery({
    queryKey: ["move", idOrName],
    queryFn: () => fetchMove(idOrName),
    enabled: !!idOrName,
    initialData: options?.initialData,
  });
}
