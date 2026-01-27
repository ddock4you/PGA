import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchPokemon, type PokeApiPokemon } from "@/features/pokemon/api/pokemonApi";
import { usePokemonSpeciesByGeneration } from "@/features/pokemon/hooks/usePokemonQueries";
import { useAllTypesQuery } from "@/features/pokemonTypes/hooks/useAllTypesQuery";
import {
  buildTypeMap,
  computeAttackMultiplier,
  type TypeMap,
} from "@/features/pokemonTypes/utils/typeEffectiveness";
import type { PokemonQuizQuestion, UsePokemonQuizOptions, UsePokemonQuizResult } from "../types/quiz";

function shuffleArray<T>(array: T[]): T[] {
  const cloned = [...array];
  for (let i = cloned.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
}

export function usePokemonQuiz(options: UsePokemonQuizOptions): UsePokemonQuizResult {
  const {
    generationId,
    totalQuestions = 10,
    allowDualType = true,
    choicesPerQuestion = 4,
  } = options;

  const {
    data: speciesList,
    isLoading: speciesLoading,
    isError: speciesError,
  } = usePokemonSpeciesByGeneration(generationId);

  const { data: types, isLoading: typesLoading, isError: typesError } = useAllTypesQuery();

  const typeMap: TypeMap | null = useMemo(() => {
    if (!types) return null;
    return buildTypeMap(types);
  }, [types]);

  const [questionIndex, setQuestionIndex] = useState(1);
  const [question, setQuestion] = useState<PokemonQuizQuestion | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isPreparing, setIsPreparing] = useState(false);
  const [preparationError, setPreparationError] = useState<string | null>(null);

  const generateQuestion = useCallback(async () => {
    if (!speciesList || speciesList.length === 0 || !typeMap) {
      return;
    }

    setPreparationError(null);
    setIsPreparing(true);

    try {
      let pickedPokemon: PokeApiPokemon | null = null;
      let defenderTypes: string[] = [];
      const attemptsLimit = 15;
      let attempts = 0;

      while (!pickedPokemon && attempts < attemptsLimit) {
        const candidate = speciesList[Math.floor(Math.random() * speciesList.length)];
        const detail = await fetchPokemon(candidate.name);
        const typeNames = detail.types.map((entry) => entry.type.name);

        if (!allowDualType && typeNames.length > 1) {
          attempts += 1;
          continue;
        }

        pickedPokemon = detail;
        defenderTypes = allowDualType ? typeNames : [typeNames[0]];
      }

      if (!pickedPokemon) {
        throw new Error("조건을 만족하는 포켓몬을 찾을 수 없습니다.");
      }

      const attackTypeNames = Object.keys(typeMap);
      if (attackTypeNames.length === 0) {
        throw new Error("타입 정보를 찾을 수 없습니다.");
      }

      const scoredTypes = attackTypeNames.map((type) => ({
        type,
        multiplier: computeAttackMultiplier(type, defenderTypes, typeMap),
      }));

      const sortedByMultiplier = [...scoredTypes].sort((a, b) => b.multiplier - a.multiplier);
      const highestMultiplier = sortedByMultiplier[0].multiplier;
      const bestTypes = sortedByMultiplier.filter(
        (entry) => entry.multiplier === highestMultiplier
      );
      const correctAttackType = bestTypes[Math.floor(Math.random() * bestTypes.length)].type;

      const maxChoices = Math.min(choicesPerQuestion, attackTypeNames.length);
      const choiceSet = new Set<string>();
      choiceSet.add(correctAttackType);

      while (choiceSet.size < maxChoices) {
        const randomType = attackTypeNames[Math.floor(Math.random() * attackTypeNames.length)];
        choiceSet.add(randomType);
      }

      const choices = shuffleArray(Array.from(choiceSet));

      const sprite =
        pickedPokemon.sprites.other?.["official-artwork"]?.front_default ??
        pickedPokemon.sprites.other?.home?.front_default ??
        pickedPokemon.sprites.front_default ??
        null;

      setQuestion({
        pokemon: {
          id: pickedPokemon.id,
          name: pickedPokemon.name,
          sprite,
          types: pickedPokemon.types.map((entry) => entry.type.name),
        },
        defenderTypes,
        correctAttackType,
        correctMultiplier: highestMultiplier,
        choices,
        index: questionIndex,
        total: totalQuestions,
      });

      setSelectedChoice(null);
      setIsCorrect(null);
    } catch (error) {
      setPreparationError(
        error instanceof Error ? error.message : "퀴즈 문제를 준비하는 중 오류가 발생했습니다."
      );
    } finally {
      setIsPreparing(false);
    }
  }, [speciesList, typeMap, allowDualType, choicesPerQuestion, questionIndex, totalQuestions]);

  useEffect(() => {
    if (!question && !isPreparing && !typesError && !speciesError) {
      void generateQuestion();
    }
  }, [generateQuestion, isPreparing, question, typesError, speciesError]);

  useEffect(() => {
    setQuestionIndex(1);
    setQuestion(null);
    setSelectedChoice(null);
    setIsCorrect(null);
    setScore(0);
  }, [generationId, totalQuestions, allowDualType]);

  const submitChoice = useCallback(
    (choice: string) => {
      if (!question || selectedChoice != null) return;

      setSelectedChoice(choice);
      const correct = choice === question.correctAttackType;
      setIsCorrect(correct);
      if (correct) {
        setScore((prev) => prev + 1);
      }
    },
    [question, selectedChoice]
  );

  const nextQuestion = useCallback(() => {
    const shouldReset = questionIndex >= totalQuestions;
    setQuestionIndex((prev) => (shouldReset ? 1 : prev + 1));
    if (shouldReset) {
      setScore(0);
    }
    setQuestion(null);
    setSelectedChoice(null);
    setIsCorrect(null);
  }, [questionIndex, totalQuestions]);

  return {
    question,
    selectedChoice,
    isCorrect,
    score,
    isPreparing,
    preparationError,
    typesLoading,
    typesError,
    speciesLoading,
    speciesError,
    submitChoice,
    nextQuestion,
  };
}
