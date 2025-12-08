import { useQuery, useQueries } from "@tanstack/react-query";
import { fetchAbility } from "../api/abilitiesApi";
import { fetchGeneration } from "@/features/generation/api/generationApi";

// 세대별 특성 목록(이름/URL)을 가져오는 훅
export function useAbilitiesListByGeneration(generationId: number | string) {
  return useQuery({
    queryKey: ["generation", "abilities", generationId],
    queryFn: async () => {
      const gen = await fetchGeneration(generationId);
      return gen.abilities; // NamedAPIResource[]
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
}

// 여러 특성의 상세 정보를 가져오는 훅 (페이지네이션용)
export function useAbilitiesDetails(names: string[]) {
  return useQueries({
    queries: names.map((name) => ({
      queryKey: ["ability", name],
      queryFn: () => fetchAbility(name),
      staleTime: 1000 * 60 * 60 * 24,
    })),
  });
}

export function useAbility(idOrName: string | number) {
  return useQuery({
    queryKey: ["ability", idOrName],
    queryFn: () => fetchAbility(idOrName),
    enabled: !!idOrName,
  });
}
