import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import type { PokeApiEvolutionChain, PokeApiPokemon } from "../api/pokemonApi";
import { fetchPokemon } from "../api/pokemonApi";

function walkEvolutionPath(
  node: PokeApiEvolutionChain["chain"],
  targetName: string,
  path: string[] = []
): string[] | null {
  const currentPath = [...path, node.species.name];

  if (node.species.name === targetName) {
    return currentPath;
  }

  for (const next of node.evolves_to) {
    const result = walkEvolutionPath(next, targetName, currentPath);
    if (result) {
      return result;
    }
  }

  return null;
}

export interface PreviousStagePokemon {
  speciesName: string;
  pokemon?: PokeApiPokemon;
  isLoading: boolean;
  isError: boolean;
}

export function usePreviousStagePokemons(
  evolutionChain?: PokeApiEvolutionChain,
  currentSpeciesName?: string
) {
  const previousSpecies = useMemo(() => {
    if (!evolutionChain || !currentSpeciesName) return [];
    const path = walkEvolutionPath(evolutionChain.chain, currentSpeciesName);
    if (!path || path.length <= 1) return [];
    return path.slice(0, -1);
  }, [evolutionChain, currentSpeciesName]);

  const queries = useQueries({
    queries: previousSpecies.map((speciesName) => ({
      queryKey: ["pokemon", speciesName],
      queryFn: () => fetchPokemon(speciesName),
      enabled: !!speciesName,
      staleTime: 1000 * 60 * 60,
      cacheTime: 1000 * 60 * 60 * 24,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    })),
  });

  const stages: PreviousStagePokemon[] = previousSpecies.map((name, index) => ({
    speciesName: name,
    pokemon: queries[index]?.data,
    isLoading: queries[index]?.isLoading ?? false,
    isError: queries[index]?.isError ?? false,
  }));

  const isLoading = queries.some((query) => query.isLoading);
  const isError = queries.some((query) => query.isError);

  return { stages, isLoading, isError };
}
