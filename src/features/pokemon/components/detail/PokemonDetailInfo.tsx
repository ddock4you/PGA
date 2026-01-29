"use client";
import { usePreferences } from "@/features/preferences";
import { usePreviousStagePokemons } from "../../hooks/usePreviousStagePokemons";
import { useDexCsvData } from "@/hooks/useDexCsvData";
import { getKoreanPokemonNameFromCsv } from "@/features/pokemon/utils/pokemonName";
import { PhysicalInfoCard } from "./info/PhysicalInfoCard";
import { AbilitiesCard } from "./info/AbilitiesCard";
import { BreedingInfoCard } from "./info/BreedingInfoCard";
import { HeldItemsCard } from "./info/HeldItemsCard";
import { ObtainingMethodsCard } from "./info/ObtainingMethodsCard";
import type {
  PokeApiPokemon,
  PokeApiPokemonSpecies,
  PokeApiEncounter,
  PokeApiEvolutionChain,
} from "../../types/pokeApiTypes";

interface PokemonDetailInfoProps {
  pokemon: PokeApiPokemon;
  species: PokeApiPokemonSpecies;
  encounters?: PokeApiEncounter[];
  evolutionChain?: PokeApiEvolutionChain;
  onTabChange?: (value: string) => void;
}

export function PokemonDetailInfo({
  pokemon,
  species,
  encounters,
  evolutionChain,
  onTabChange,
}: PokemonDetailInfoProps) {
  const { state } = usePreferences();
  const selectedGameId = state.selectedGameId;
  const { pokemonData, pokemonSpeciesNamesData } = useDexCsvData();

  // 진화 이전 단계 포켓몬 정보
  const { stages: previousStages } = usePreviousStagePokemons(evolutionChain, species.name);

  const getKoreanPokemonName = (speciesName: string) =>
    getKoreanPokemonNameFromCsv(speciesName, pokemonData, pokemonSpeciesNamesData);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <PhysicalInfoCard pokemon={pokemon} species={species} />
      <AbilitiesCard pokemon={pokemon} />
      <BreedingInfoCard pokemon={pokemon} species={species} />
      <HeldItemsCard pokemon={pokemon} selectedGameId={selectedGameId ?? undefined} />
      <ObtainingMethodsCard
        species={species}
        encounters={encounters}
        selectedGameId={selectedGameId ?? undefined}
        previousStages={previousStages}
        getKoreanPokemonName={getKoreanPokemonName}
        onTabChange={onTabChange}
      />
    </div>
  );
}
