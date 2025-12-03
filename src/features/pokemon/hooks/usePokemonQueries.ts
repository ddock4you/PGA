import { useQuery } from "@tanstack/react-query";
import {
  fetchPokemon,
  fetchPokemonSpeciesListByGeneration,
  type PokeApiPokemon,
  type PokeApiPokemonSpecies,
} from "@/features/pokemon/api/pokemonApi";

export function usePokemonSpeciesByGeneration(generationId: number | string | null) {
  return useQuery<PokeApiPokemonSpecies[]>({
    queryKey: ["pokemonSpecies", generationId],
    queryFn: () => {
      if (generationId == null) {
        return Promise.resolve([]);
      }
      return fetchPokemonSpeciesListByGeneration(generationId);
    },
    enabled: generationId != null,
    meta: {
      persist: true,
    },
  });
}

export function usePokemonDetail(idOrName: number | string | null) {
  return useQuery<PokeApiPokemon>({
    queryKey: ["pokemon", idOrName],
    queryFn: () => {
      if (idOrName == null) {
        throw new Error("pokemon idOrName is required");
      }
      return fetchPokemon(idOrName);
    },
    enabled: idOrName != null,
  });
}
