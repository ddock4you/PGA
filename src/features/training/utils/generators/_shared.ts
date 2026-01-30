export { ALL_KOREAN_TYPE_NAMES } from "@/utils/pokemonTypes";
import { getEnglishTypeName } from "@/utils/pokemonTypes";
import type { QuizOptions } from "../../contexts/types";
import type { QuizPokemon } from "../../api/quizData";

export function toEnglishTypes(koreanTypes: string[]): string[] {
  return koreanTypes.map(getEnglishTypeName);
}

export function shuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function filterPokemonsByGenerationSelection(
  pokemons: QuizPokemon[],
  generationSelection: QuizOptions["generationSelection"]
): QuizPokemon[] {
  if (!generationSelection) return pokemons;

  if (generationSelection.type === "single") {
    const { generation: targetGen, includeSubGenerations } = generationSelection;
    return pokemons.filter((p) =>
      includeSubGenerations ? p.generationId <= targetGen : p.generationId === targetGen
    );
  }

  if (generationSelection.type === "range") {
    const { minGeneration, maxGeneration } = generationSelection;
    return pokemons.filter((p) => p.generationId >= minGeneration && p.generationId <= maxGeneration);
  }

  return pokemons;
}
