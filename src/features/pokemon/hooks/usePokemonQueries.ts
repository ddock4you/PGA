import { useEffect, useMemo, useState } from "react";
import {
  fetchPokemonSpeciesListByGeneration,
  type PokeApiPokemonSpecies,
} from "@/features/pokemon/api/pokemonApi";

const pokemonSpeciesCache = new Map<string, PokeApiPokemonSpecies[]>();
const pokemonSpeciesPromise = new Map<string, Promise<PokeApiPokemonSpecies[]>>();

async function loadSpeciesList(generationId: string): Promise<PokeApiPokemonSpecies[]> {
  if (pokemonSpeciesCache.has(generationId)) {
    return pokemonSpeciesCache.get(generationId)!;
  }

  if (pokemonSpeciesPromise.has(generationId)) {
    return pokemonSpeciesPromise.get(generationId)!;
  }

  const promise = fetchPokemonSpeciesListByGeneration(generationId);
  pokemonSpeciesPromise.set(generationId, promise);

  try {
    const result = await promise;
    pokemonSpeciesCache.set(generationId, result);
    return result;
  } finally {
    pokemonSpeciesPromise.delete(generationId);
  }
}

export function usePokemonSpeciesByGeneration(generationId: number | string | null) {
  const [state, setState] = useState<{
    data: PokeApiPokemonSpecies[];
    isLoading: boolean;
    isError: boolean;
  }>({
    data: [],
    isLoading: generationId != null,
    isError: false,
  });

  useEffect(() => {
    if (!generationId) {
      setState({ data: [], isLoading: false, isError: false });
      return;
    }

    const key = String(generationId);

    if (pokemonSpeciesCache.has(key)) {
      setState({ data: pokemonSpeciesCache.get(key)!, isLoading: false, isError: false });
      return;
    }

    let isMounted = true;
    setState((prev) => ({ ...prev, isLoading: true, isError: false }));

    loadSpeciesList(key)
      .then((data) => {
        if (!isMounted) return;
        setState({ data, isLoading: false, isError: false });
      })
      .catch(() => {
        if (!isMounted) return;
        setState({ data: [], isLoading: false, isError: true });
      });

    return () => {
      isMounted = false;
    };
  }, [generationId]);

  return {
    data: state.data,
    isLoading: state.isLoading,
    isError: state.isError,
  };
}
