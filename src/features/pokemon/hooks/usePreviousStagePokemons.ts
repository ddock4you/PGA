import { useMemo, useState, useEffect } from "react";
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

const pokemonCache = new Map<string, PokeApiPokemon>();
const pokemonPromises = new Map<string, Promise<PokeApiPokemon>>();

async function fetchPokemonWithCache(idOrName: string): Promise<PokeApiPokemon> {
  const key = idOrName.toString();
  if (pokemonCache.has(key)) {
    return pokemonCache.get(key)!;
  }

  if (pokemonPromises.has(key)) {
    return pokemonPromises.get(key)!;
  }

  const promise = fetchPokemon(idOrName);
  pokemonPromises.set(key, promise);

  try {
    const result = await promise;
    pokemonCache.set(key, result);
    return result;
  } finally {
    pokemonPromises.delete(key);
  }
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
  const [state, setState] = useState<{
    stages: PreviousStagePokemon[];
    isLoading: boolean;
    isError: boolean;
  }>({
    stages: previousSpecies.map((name) => ({
      speciesName: name,
      pokemon: undefined,
      isLoading: true,
      isError: false,
    })),
    isLoading: previousSpecies.length > 0,
    isError: false,
  });

  useEffect(() => {
    if (previousSpecies.length === 0) {
      setState({ stages: [], isLoading: false, isError: false });
      return;
    }

    let isMounted = true;
    setState({
      stages: previousSpecies.map((name) => ({
        speciesName: name,
        pokemon: undefined,
        isLoading: true,
        isError: false,
      })),
      isLoading: true,
      isError: false,
    });

    Promise.all(
      previousSpecies.map(async (speciesName) => {
        try {
          const pokemon = await fetchPokemonWithCache(speciesName);
          return { speciesName, pokemon, error: null };
        } catch (error) {
          return {
            speciesName,
            pokemon: undefined,
            error: error instanceof Error ? error : new Error(String(error)),
          };
        }
      })
    ).then((results) => {
      if (!isMounted) return;
      setState({
        stages: results.map((result) => ({
          speciesName: result.speciesName,
          pokemon: result.pokemon,
          isLoading: false,
          isError: Boolean(result.error),
        })),
        isLoading: false,
        isError: results.some((result) => result.error != null),
      });
    });

    return () => {
      isMounted = false;
    };
  }, [previousSpecies]);

  return state;
}
