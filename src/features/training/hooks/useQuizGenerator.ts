import { useEffect, useState } from "react";
import { useAllTypesQuery } from "@/features/pokemonTypes/hooks/useAllTypesQuery";
import { buildTypeMap, type TypeMap } from "@/features/pokemonTypes/utils/typeEffectiveness";
import { useQuizContext } from "../contexts";
import { loadQuizData, type QuizMove, type QuizPokemon } from "../api/quizData";
import type { QuizQuestion } from "../contexts/types";
import { generateAttackLv1 } from "../utils/generators/generateAttackLv1";
import { generateAttackLv2 } from "../utils/generators/generateAttackLv2";
import { generateAttackLv3 } from "../utils/generators/generateAttackLv3";
import { generateTypeQuiz } from "../utils/generators/generateTypeQuiz";

export function useQuizGenerator() {
  const { state, actions } = useQuizContext();
  const { data: allTypes } = useAllTypesQuery();
  const [quizData, setQuizData] = useState<{ pokemons: QuizPokemon[]; moves: QuizMove[] } | null>(
    null
  );
  const [typeMap, setTypeMap] = useState<TypeMap | null>(null);

  // 1. 초기 데이터 로드
  useEffect(() => {
    loadQuizData().then(setQuizData);
  }, []);

  // 2. 타입 맵 생성
  useEffect(() => {
    if (allTypes && !typeMap) {
      setTypeMap(buildTypeMap(allTypes));
    }
  }, [allTypes, typeMap]);

  // 3. 문제 생성 트리거
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (
      !quizData ||
      (state.mode !== "type" && !typeMap) ||
      state.screen !== "playing" ||
      state.question ||
      isGenerating
    ) {
      return;
    }

    const generate = async () => {
      setIsGenerating(true);
      actions.setLoading(true);
      try {
        let question: QuizQuestion | null = null;

        if (state.mode === "attack") {
          if (!typeMap) {
            throw new Error("타입 상성 데이터를 불러올 수 없습니다.");
          }

          if (state.level === 1) {
            question = generateAttackLv1(state.options, typeMap);
          } else if (state.level === 2) {
            question = generateAttackLv2(
              state.options,
              typeMap,
              quizData.pokemons,
              quizData.moves,
              state.askedPokemonIds
            );
          } else if (state.level === 3) {
            question = generateAttackLv3(
              state.options,
              typeMap,
              quizData.pokemons,
              quizData.moves,
              state.askedPokemonIds
            );
          }
        } else if (state.mode === "type") {
          question = generateTypeQuiz(state.options, quizData.pokemons, state.askedPokemonIds);
        }

        if (question) {
          if (question.pokemonData?.id) {
            actions.addAskedPokemon(question.pokemonData.id);
          }
          actions.setQuestion(question);
        } else {
          actions.setError("문제를 생성할 수 없습니다.");
        }
      } catch (error) {
        console.error(error);
        actions.setError("문제 생성 중 오류가 발생했습니다.");
      } finally {
        setIsGenerating(false);
      }
    };

    generate();
  }, [
    quizData,
    typeMap,
    state.screen,
    state.question,
    state.mode,
    state.level,
    state.options,
    isGenerating,
    state.askedPokemonIds,
    actions,
  ]);
}
