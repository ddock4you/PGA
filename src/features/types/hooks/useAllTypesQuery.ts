import { useQuery } from "@tanstack/react-query";
import { fetchAllTypes, type PokeApiType } from "@/features/types/api/typeApi";

export function useAllTypesQuery() {
  return useQuery<PokeApiType[]>({
    queryKey: ["types", "all"],
    queryFn: fetchAllTypes,
    meta: {
      persist: true,
    },
    staleTime: 1000 * 60 * 60 * 24, // 24시간
  });
}
