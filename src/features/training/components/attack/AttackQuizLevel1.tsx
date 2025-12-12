import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuizContext } from "../../store";
import { useQuizNavigation } from "../../hooks/useQuizNavigation";
import { QuizQuestionCard } from "../QuizQuestionCard";
import { QuizAnswerButtons } from "../QuizAnswerButtons";
import { useAllTypesQuery } from "@/features/types/hooks/useAllTypesQuery";
import {
  buildTypeMap,
  computeAttackMultiplier,
  type TypeMap,
} from "@/features/types/utils/typeEffectiveness";

export function AttackQuizLevel1() {
  const { state, actions } = useQuizContext();
  const { nextQuestion } = useQuizNavigation();

  const { data: types, isLoading: typesLoading, isError: typesError } = useAllTypesQuery();

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
    if (!state.isLoading || !typeMap || !types || state.question) return;

    const typeNames = types.map((t) => t.name);
    if (typeNames.length === 0) return;

    // 공격 타입 (랜덤) - 사용하지 않음

    // 방어 타입들 (듀얼 타입 고려)
    const allowDualType = state.options.allowDualType ?? true;
    let defenderTypes: string[];

    if (allowDualType && Math.random() > 0.5) {
      // 듀얼 타입
      const type1 = typeNames[Math.floor(Math.random() * typeNames.length)];
      let type2 = typeNames[Math.floor(Math.random() * typeNames.length)];
      if (type2 === type1 && typeNames.length > 1) {
        type2 = typeNames[(typeNames.indexOf(type2) + 1) % typeNames.length];
      }
      defenderTypes = [type1, type2];
    } else {
      // 단일 타입
      defenderTypes = [typeNames[Math.floor(Math.random() * typeNames.length)]];
    }

    // 효과적인 공격 타입들 계산
    const scoredTypes = typeNames.map((type) => ({
      type,
      multiplier: computeAttackMultiplier(type, defenderTypes, typeMap),
    }));

    const sortedByMultiplier = [...scoredTypes].sort((a, b) => b.multiplier - a.multiplier);
    const highestMultiplier = sortedByMultiplier[0].multiplier;
    const bestTypes = sortedByMultiplier.filter((entry) => entry.multiplier === highestMultiplier);

    const correctAttackType = bestTypes[Math.floor(Math.random() * bestTypes.length)].type;

    // 보기 생성 (정답 포함 + 다른 타입들)
    const choiceSet = new Set<string>();
    choiceSet.add(correctAttackType);

    while (choiceSet.size < 4) {
      const randomType = typeNames[Math.floor(Math.random() * typeNames.length)];
      choiceSet.add(randomType);
    }

    const shuffledChoices = Array.from(choiceSet).sort(() => Math.random() - 0.5);

    // 문제 생성
    const questionText =
      defenderTypes.length === 1
        ? `${defenderTypes[0]} 타입 포켓몬에게 효과적인 공격 타입은?`
        : `${defenderTypes[0]}/${defenderTypes[1]} 타입 포켓몬에게 효과적인 공격 타입은?`;

    const question = {
      id: `attack-lv1-${Date.now()}`,
      text: questionText,
      choices: shuffledChoices,
      correctAnswer: correctAttackType,
      defenderTypes,
    };

    actions.setQuestion(question);
    actions.setLoading(false);
    setChoices(shuffledChoices);
  }, [typeMap, types, state.question, state.isLoading, state.options.allowDualType, actions]);

  const handleChoiceSelect = (choiceId: string) => {
    actions.submitAnswer(choiceId);
  };

  const handleNextQuestion = () => {
    nextQuestion();
  };

  // 로딩 상태
  if (typesLoading || state.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">공격 상성 맞추기 Lv.1</CardTitle>
          <CardDescription className="text-xs">
            포켓몬 타입을 보고 효과적인 공격 타입을 맞춰보세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">문제를 준비하는 중입니다...</p>
        </CardContent>
      </Card>
    );
  }

  // 에러 상태
  if (typesError || state.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">공격 상성 맞추기 Lv.1</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-destructive">타입 데이터를 불러오는 중 오류가 발생했습니다.</p>
        </CardContent>
      </Card>
    );
  }

  // 문제 없음
  if (!state.question) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">공격 상성 맞추기 Lv.1</CardTitle>
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
          <CardTitle className="text-sm">공격 상성 맞추기 Lv.1</CardTitle>
          <CardDescription className="text-xs">
            포켓몬 타입을 보고 효과적인 공격 타입을 맞춰보세요
          </CardDescription>
        </CardHeader>
      </Card>

      <QuizQuestionCard
        question={state.question}
        currentQuestion={state.currentQuestion}
        totalQuestions={state.options.totalQuestions}
        showPokemonTypes={false}
      />

      {/* 방어 타입 표시 */}
      <Card>
        <CardContent className="pt-4">
          <div className="text-center space-y-2">
            <div className="text-sm text-muted-foreground">방어 포켓몬 타입</div>
            <div className="flex gap-2 justify-center">
              {state.question?.defenderTypes?.map((type) => (
                <Badge key={type} variant="secondary" className="capitalize">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

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
            {state.isCorrect === true && state.question && (
              <p className="text-sm text-green-600 text-center">
                정답입니다! {state.question.correctAnswer} 타입이 효과적입니다.
              </p>
            )}
            {state.isCorrect === false && state.question && (
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
