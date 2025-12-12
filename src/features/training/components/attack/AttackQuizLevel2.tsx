import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuizContext } from "../../store";
import { useQuizNavigation } from "../../hooks/useQuizNavigation";
import { QuizQuestionCard } from "../QuizQuestionCard";
import { QuizAnswerButtons } from "../QuizAnswerButtons";
import { useAllTypesQuery } from "@/features/types/hooks/useAllTypesQuery";
import { usePokemonSpeciesByGeneration } from "@/features/pokemon/hooks/usePokemonQueries";
import {
  buildTypeMap,
  computeAttackMultiplier,
  type TypeMap,
} from "@/features/types/utils/typeEffectiveness";
import { fetchPokemon, type PokeApiPokemon } from "@/features/pokemon/api/pokemonApi";

export function AttackQuizLevel2() {
  const { state, actions } = useQuizContext();
  const { nextQuestion } = useQuizNavigation();

  const { data: types, isLoading: typesLoading, isError: typesError } = useAllTypesQuery();

  // 세대 선택에 따른 포켓몬 종족 데이터
  const generationId =
    state.options.generationSelection?.type === "single"
      ? state.options.generationSelection.generation
      : null; // 범위 선택 시 모든 세대 사용

  const {
    data: speciesList,
    isLoading: speciesLoading,
    isError: speciesError,
  } = usePokemonSpeciesByGeneration(generationId);

  const [typeMap, setTypeMap] = useState<TypeMap | null>(null);
  const [choices, setChoices] = useState<string[]>([]);

  // 타입 데이터 로딩 및 맵 생성
  useEffect(() => {
    if (types && !typeMap) {
      setTypeMap(buildTypeMap(types));
    }
  }, [types, typeMap]);

  // 문제 생성
  useEffect(() => {
    if (
      !state.isLoading ||
      !typeMap ||
      !types ||
      !speciesList ||
      speciesList.length === 0 ||
      state.question
    )
      return;

    const generateQuestion = async () => {
      const typeNames = types.map((t) => t.name);

      // 랜덤 포켓몬 선택
      let pickedPokemon: PokeApiPokemon | null = null;
      let defenderTypes: string[] = [];
      const attemptsLimit = 15;
      let attempts = 0;

      while (!pickedPokemon && attempts < attemptsLimit) {
        const candidate = speciesList[Math.floor(Math.random() * speciesList.length)];
        const detail = await fetchPokemon(candidate.name);
        const typeNames = detail.types.map((entry) => entry.type.name);

        pickedPokemon = detail;
        defenderTypes = typeNames;
        attempts += 1;
      }

      if (!pickedPokemon) {
        actions.setError("조건을 만족하는 포켓몬을 찾을 수 없습니다.");
        return;
      }

      // 효과적인 공격 타입들 계산
      const scoredTypes = typeNames.map((type) => ({
        type,
        multiplier: computeAttackMultiplier(type, defenderTypes, typeMap),
      }));

      const sortedByMultiplier = [...scoredTypes].sort((a, b) => b.multiplier - a.multiplier);
      const highestMultiplier = sortedByMultiplier[0].multiplier;
      const bestTypes = sortedByMultiplier.filter(
        (entry) => entry.multiplier === highestMultiplier
      );

      const correctAttackType = bestTypes[Math.floor(Math.random() * bestTypes.length)].type;

      // 보기 생성 (정답 포함 + 다른 타입들)
      const choiceSet = new Set<string>();
      choiceSet.add(correctAttackType);

      while (choiceSet.size < 4) {
        const randomType = typeNames[Math.floor(Math.random() * typeNames.length)];
        choiceSet.add(randomType);
      }

      const shuffledChoices = Array.from(choiceSet).sort(() => Math.random() - 0.5);

      // 스프라이트 URL 생성
      const sprite =
        pickedPokemon.sprites.other?.["official-artwork"]?.front_default ??
        pickedPokemon.sprites.other?.home?.front_default ??
        pickedPokemon.sprites.front_default ??
        null;

      // 문제 생성
      const question = {
        id: `attack-lv2-${Date.now()}`,
        text: `${pickedPokemon.name.replace(/-/g, " ")}에게 효과적인 공격 타입은?`,
        choices: shuffledChoices,
        correctAnswer: correctAttackType,
        pokemonData: {
          id: pickedPokemon.id,
          name: pickedPokemon.name,
          sprite,
          types: defenderTypes, // 실제로는 숨겨져야 하지만 데이터 구조상 포함
        },
      };

      actions.setQuestion(question);
      setChoices(shuffledChoices);
    };

    generateQuestion();
  }, [typeMap, types, speciesList, state.question, state.isLoading, actions]);

  const handleChoiceSelect = (choiceId: string) => {
    actions.submitAnswer(choiceId);
  };

  const handleNextQuestion = () => {
    nextQuestion();
  };

  // 로딩 상태
  if (typesLoading || speciesLoading || state.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">공격 상성 맞추기 Lv.2</CardTitle>
          <CardDescription className="text-xs">
            포켓몬을 보고 효과적인 공격 타입을 맞춰보세요 (타입 숨김)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">문제를 준비하는 중입니다...</p>
        </CardContent>
      </Card>
    );
  }

  // 에러 상태
  if (typesError || speciesError || state.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">공격 상성 맞추기 Lv.2</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-destructive">
            {state.error || "데이터를 불러오는 중 오류가 발생했습니다."}
          </p>
        </CardContent>
      </Card>
    );
  }

  // 문제 없음
  if (!state.question) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">공격 상성 맞추기 Lv.2</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">다음 문제를 준비하는 중입니다...</p>
        </CardContent>
      </Card>
    );
  }

  const questionChoices = state.question
    ? choices.map((choice) => ({
        id: choice,
        label: choice,
        isCorrect: choice === state.question.correctAnswer,
        isSelected: choice === state.selectedChoice,
      }))
    : [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">공격 상성 맞추기 Lv.2</CardTitle>
          <CardDescription className="text-xs">
            포켓몬을 보고 효과적인 공격 타입을 맞춰보세요 (타입 숨김)
          </CardDescription>
        </CardHeader>
      </Card>

      <QuizQuestionCard
        question={state.question}
        currentQuestion={state.currentQuestion}
        totalQuestions={state.options.totalQuestions}
        showPokemonTypes={false} // 타입 숨김
      />

      <QuizAnswerButtons
        choices={questionChoices}
        selectedChoice={state.selectedChoice}
        isCorrect={state.isCorrect}
        onChoiceSelect={handleChoiceSelect}
        disabled={state.selectedChoice !== null}
      />

      {/* 결과 및 다음 버튼 */}
      <Card>
        <CardContent className="pt-4">
          <div className="space-y-3">
            {state.isCorrect === true && (
              <p className="text-sm text-green-600 text-center">
                정답입니다! {state.question.correctAnswer} 타입이 효과적입니다.
              </p>
            )}
            {state.isCorrect === false && (
              <p className="text-sm text-red-600 text-center">
                아쉽네요. 정답은 {state.question.correctAnswer} 타입입니다.
              </p>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                점수: {state.score} / {state.currentQuestion}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextQuestion}
                disabled={state.selectedChoice === null}
              >
                다음 문제
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
