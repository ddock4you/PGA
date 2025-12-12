import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuizContext } from "../../store";
import { useQuizNavigation } from "../../hooks/useQuizNavigation";
import { useQuizGenerator } from "../../hooks/useQuizGenerator";
import { QuizQuestionCard } from "../QuizQuestionCard";
import { QuizAnswerButtons } from "../QuizAnswerButtons";

export function AttackQuizLevel3() {
  const { state, actions } = useQuizContext();
  const { nextQuestion } = useQuizNavigation();

  useQuizGenerator();

  const handleChoiceSelect = (choiceId: string) => {
    actions.submitAnswer(choiceId);
  };

  const handleNextQuestion = () => {
    nextQuestion();
  };

  if (state.isLoading && !state.question) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">공격 상성 맞추기 Lv.3</CardTitle>
          <CardDescription className="text-xs">
            포켓몬을 보고 가장 효과적인 기술을 맞춰보세요 (기술 타입 숨김)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">문제를 준비하는 중입니다...</p>
        </CardContent>
      </Card>
    );
  }

  if (state.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">공격 상성 맞추기 Lv.3</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-destructive">
            {state.error || "데이터를 불러오는 중 오류가 발생했습니다."}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!state.question) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">공격 상성 맞추기 Lv.3</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">다음 문제를 준비하는 중입니다...</p>
        </CardContent>
      </Card>
    );
  }

  const questionChoices = state.question.choices.map((choice) => ({
    id: choice.id,
    label: choice.label,
    type: choice.type,
    multiplier: choice.multiplier,
    isCorrect: choice.id === state.question!.correctAnswer,
    isSelected: choice.id === state.selectedChoice,
  }));

  const correctChoice = state.question.choices.find((c) => c.id === state.question?.correctAnswer);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">공격 상성 맞추기 Lv.3</CardTitle>
          <CardDescription className="text-xs">
            포켓몬을 보고 가장 효과적인 기술을 맞춰보세요 (기술 타입 숨김)
          </CardDescription>
        </CardHeader>
      </Card>

      <QuizQuestionCard
        question={state.question}
        currentQuestion={state.currentQuestion}
        totalQuestions={state.options.totalQuestions}
        showPokemonTypes={state.selectedChoice !== null}
      />

      <QuizAnswerButtons
        choices={questionChoices}
        selectedChoice={state.selectedChoice}
        isCorrect={state.isCorrect}
        onChoiceSelect={handleChoiceSelect}
        disabled={state.selectedChoice !== null}
        showTypeBadge={false} // 문제 풀 때는 타입 숨김
        showTypeOnResult={true} // 결과 확인 시에는 타입 표시 (기본값 true)
      />

      <Card>
        <CardContent className="pt-4">
          <div className="space-y-3">
            {state.isCorrect === true && (
              <p className="text-sm text-green-600 text-center font-bold">
                정답입니다! {correctChoice?.label} 기술이 효과적입니다.
              </p>
            )}
            {state.isCorrect === false && (
              <p className="text-sm text-red-600 text-center font-bold">
                아쉽네요. 정답은 {correctChoice?.label} 입니다.
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

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { useTrainingMoves } from "../../hooks/useTrainingMoves";
import { generateMoveChoicesLv3 } from "../../utils/moveSelection";
import { getKoreanTypeName, TYPE_COLORS } from "@/features/dex/utils/dataTransforms";
import type { MoveChoice } from "../../store/types";

export function AttackQuizLevel3() {
  const { state, actions } = useQuizContext();
  const { nextQuestion } = useQuizNavigation();

  const { data: types, isLoading: typesLoading, isError: typesError } = useAllTypesQuery();
  const { moves, isLoading: movesLoading, isError: movesError } = useTrainingMoves();

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
  const [choices, setChoices] = useState<MoveChoice[]>([]);

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
      !moves ||
      moves.length === 0 ||
      !speciesList ||
      speciesList.length === 0 ||
      state.question
    )
      return;

    const generateQuestion = async () => {
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

      // Lv.3: 모든 배율의 기술이 등장하되, 가장 높은 배율의 기술만 정답
      const { choices: moveChoices, correctAnswer: correctMoveId } = generateMoveChoicesLv3(
        moves,
        defenderTypes,
        typeMap,
        computeAttackMultiplier
      );

      // 스프라이트 URL 생성
      const sprite =
        pickedPokemon.sprites.other?.["official-artwork"]?.front_default ??
        pickedPokemon.sprites.other?.home?.front_default ??
        pickedPokemon.sprites.front_default ??
        null;

      // 문제 생성
      const question = {
        id: `attack-lv3-${Date.now()}`,
        text: `${pickedPokemon.name.replace(/-/g, " ")}에게 효과적인 공격 타입은?`,
        choices: moveChoices,
        correctAnswer: correctMoveId,
        pokemonData: {
          id: pickedPokemon.id,
          name: pickedPokemon.name,
          sprite,
          types: defenderTypes, // 실제로는 숨겨져야 하지만 데이터 구조상 포함
        },
      };

      actions.setQuestion(question);
      setChoices(moveChoices);
    };

    generateQuestion();
  }, [typeMap, types, moves, speciesList, state.question, state.isLoading, actions]);

  const handleChoiceSelect = (choiceId: string) => {
    actions.submitAnswer(choiceId);
  };

  const handleNextQuestion = () => {
    nextQuestion();
  };

  // 로딩 상태
  if (typesLoading || movesLoading || speciesLoading || state.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">공격 상성 맞추기 Lv.3</CardTitle>
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
  if (typesError || movesError || speciesError || state.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">공격 상성 맞추기 Lv.3</CardTitle>
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
          <CardTitle className="text-sm">공격 상성 맞추기 Lv.3</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">다음 문제를 준비하는 중입니다...</p>
        </CardContent>
      </Card>
    );
  }

  // MoveChoice를 직접 사용 (UI 컴포넌트에서 처리)
  const questionChoices = state.question ? choices : [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">공격 상성 맞추기 Lv.3</CardTitle>
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
            {state.isCorrect === true && state.question?.pokemonData && (
              <div className="text-center space-y-2">
                <p className="text-sm text-green-600">
                  정답입니다!{" "}
                  {questionChoices.find((c) => c.id === state.question!.correctAnswer)?.name ||
                    state.question!.correctAnswer}{" "}
                  기술이 효과적입니다.
                </p>
                <div className="flex justify-center gap-1">
                  {state.question.pokemonData.types.map((type) => {
                    const koreanType = getKoreanTypeName(type);
                    return (
                      <Badge
                        key={type}
                        className={`text-xs text-white ${
                          TYPE_COLORS[koreanType as keyof typeof TYPE_COLORS] || "bg-gray-500"
                        }`}
                      >
                        {koreanType}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
            {state.isCorrect === false && state.question?.pokemonData && (
              <div className="text-center space-y-2">
                <p className="text-sm text-red-600">
                  아쉽네요. 정답은{" "}
                  {questionChoices.find((c) => c.id === state.question!.correctAnswer)?.name ||
                    state.question!.correctAnswer}{" "}
                  기술입니다.
                </p>
                <div className="flex justify-center gap-1">
                  {state.question.pokemonData.types.map((type) => {
                    const koreanType = getKoreanTypeName(type);
                    return (
                      <Badge
                        key={type}
                        className={`text-xs text-white ${
                          TYPE_COLORS[koreanType as keyof typeof TYPE_COLORS] || "bg-gray-500"
                        }`}
                      >
                        {koreanType}
                      </Badge>
                    );
                  })}
                </div>
              </div>
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
