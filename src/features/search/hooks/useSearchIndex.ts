import { useQuery } from "@tanstack/react-query";
import {
  buildPokemonOnlySearchIndex,
  type SearchIndex,
} from "@/features/search/api/searchIndexApi";

export function useSearchIndex(
  generationId: string | number | null,
  primaryLanguage: string | null
) {
  return useQuery<SearchIndex>({
    queryKey: ["searchIndex", generationId, primaryLanguage],
    queryFn: () => {
      if (generationId == null) {
        throw new Error("generationId is required to build search index");
      }
      const lang = primaryLanguage ?? "en";
      return buildPokemonOnlySearchIndex(generationId, lang);
    },
    enabled: generationId != null,
    meta: {
      persist: true,
    },
  });
}


