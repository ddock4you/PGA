import { useQuery } from "@tanstack/react-query";
import type { PokeApiPokemon, PokeApiPokemonSpecies } from "../api/pokemonApi";
import {
  fetchPokemon,
  fetchPokemonSpecies,
  fetchEvolutionChain,
  fetchPokemonEncounters,
} from "../api/pokemonApi";

interface PokemonDetailInitialData {
  pokemon?: PokeApiPokemon;
  species?: PokeApiPokemonSpecies;
}

export function usePokemonDetail(
  idOrName: string | number | null,
  initialData?: PokemonDetailInitialData
) {
  // 1. Pokemon 기본 정보
  const pokemonQuery = useQuery<PokeApiPokemon>({
    queryKey: ["pokemon", idOrName],
    queryFn: () => fetchPokemon(idOrName),
    enabled: !!idOrName,
    initialData: initialData?.pokemon,
  });

  // Pokemon 데이터에서 species_id 추출
  const speciesId = pokemonQuery.data?.species?.url
    ? parseInt(pokemonQuery.data.species.url.split("/").filter(Boolean).pop() || "1", 10)
    : null;

  // 2. Pokemon Species 정보 (한글 이름, 도감 설명, 진화 체인 URL 등)
  const speciesQuery = useQuery({
    queryKey: ["pokemon-species", speciesId],
    queryFn: () => fetchPokemonSpecies(speciesId!),
    enabled: !!speciesId,
    initialData:
      speciesId && initialData?.species?.id === speciesId ? initialData.species : undefined,
  });

  // 3. Evolution Chain 정보 (Species에 있는 URL 사용)
  const evolutionChainUrl = speciesQuery.data?.evolution_chain?.url;
  const evolutionChainQuery = useQuery({
    queryKey: ["evolution-chain", evolutionChainUrl],
    queryFn: () => fetchEvolutionChain(evolutionChainUrl!),
    enabled: !!evolutionChainUrl,
  });

  // 4. Encounters 정보 (야생 출현 정보)
  const encountersQuery = useQuery({
    queryKey: ["pokemon-encounters", idOrName],
    queryFn: () => fetchPokemonEncounters(idOrName),
    enabled: !!idOrName,
  });

  return {
    pokemon: pokemonQuery.data,
    species: speciesQuery.data,
    evolutionChain: evolutionChainQuery.data,
    encounters: encountersQuery.data,
    isLoading:
      pokemonQuery.isLoading ||
      speciesQuery.isLoading ||
      (!!evolutionChainUrl && evolutionChainQuery.isLoading) ||
      encountersQuery.isLoading,
    isError:
      pokemonQuery.isError ||
      speciesQuery.isError ||
      evolutionChainQuery.isError ||
      encountersQuery.isError,
    error:
      pokemonQuery.error ||
      speciesQuery.error ||
      evolutionChainQuery.error ||
      encountersQuery.error,
  };
}
