import type {
  PokeApiPokemon,
  PokeApiPokemonSpecies,
  PokeApiEvolutionChain,
} from "@/features/pokemon/api/pokemonApi";

export interface PokemonMovesSectionProps {
  moves: PokeApiPokemon["moves"];
  species: PokeApiPokemonSpecies;
  evolutionChain?: PokeApiEvolutionChain;
}

export interface MoveMeta {
  name: string;
  type: string;
  category: string;
  power: number | null;
  accuracy: number | null;
  pp: number;
}

export interface MoveRow extends MoveMeta {
  level?: number;
  tmNumber?: number;
  isHm?: boolean;
  versionGroups?: string;
  method?: string;
  stageName?: string;
  generationLabel?: string;
}
