import { useQuery } from "@tanstack/react-query";
import { fetchPokemon, fetchPokemonSpecies, fetchEvolutionChain } from "../api/pokemonApi";

export function usePokemonDetail(idOrName: string | number) {
  // 1. Pokemon 기본 정보
  const pokemonQuery = useQuery({
    queryKey: ["pokemon", idOrName],
    queryFn: () => fetchPokemon(idOrName),
    enabled: !!idOrName,
  });

  // 2. Pokemon Species 정보 (한글 이름, 도감 설명, 진화 체인 URL 등)
  const speciesQuery = useQuery({
    queryKey: ["pokemon-species", idOrName],
    queryFn: () => fetchPokemonSpecies(idOrName),
    enabled: !!idOrName,
  });

  // 3. Evolution Chain 정보 (Species에 있는 URL 사용)
  const evolutionChainUrl = speciesQuery.data?.evolution_chain?.url;
  const evolutionChainQuery = useQuery({
    queryKey: ["evolution-chain", evolutionChainUrl],
    queryFn: () => fetchEvolutionChain(evolutionChainUrl!),
    enabled: !!evolutionChainUrl,
  });

  return {
    pokemon: pokemonQuery.data,
    species: speciesQuery.data,
    evolutionChain: evolutionChainQuery.data,
    isLoading:
      pokemonQuery.isLoading ||
      speciesQuery.isLoading ||
      (!!evolutionChainUrl && evolutionChainQuery.isLoading),
    isError: pokemonQuery.isError || speciesQuery.isError || evolutionChainQuery.isError,
    error: pokemonQuery.error || speciesQuery.error || evolutionChainQuery.error,
  };
}
