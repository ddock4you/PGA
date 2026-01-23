import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuizContext } from "@/features/training/contexts";
import { useQuizNavigation } from "@/features/training/hooks/useQuizNavigation";
import { useQuizGenerator } from "@/features/training/hooks/useQuizGenerator";
import { QuizQuestionCard } from "@/features/training/components/QuizQuestionCard";

export function TypeQuizLevel() {
  const { state, actions } = useQuizContext();
  const { nextQuestion } = useQuizNavigation();

  useQuizGenerator();

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const isDualType = state.question?.pokemonData?.types.length === 2;
  const isAnswerSubmitted = state.selectedChoice !== null;

  const handleTypeSelect = (typeId: string) => {
    if (isAnswerSubmitted) return;

    if (isDualType) {
      // 듀얼 타입: 다중 선택
      if (selectedTypes.includes(typeId)) {
        // 선택 해제
        setSelectedTypes(selectedTypes.filter((t) => t !== typeId));
      } else {
        // 선택 추가 (최대 2개까지만)
        if (selectedTypes.length < 2) {
          const newSelected = [...selectedTypes, typeId];
          setSelectedTypes(newSelected);

          // 2개 선택되면 자동 제출
          if (newSelected.length === 2) {
            actions.submitAnswer(newSelected.join(","));
          }
        }
      }
    } else {
      // 단일 타입: 클릭하면 바로 제출
      setSelectedTypes([typeId]);
      actions.submitAnswer(typeId);
    }
  };

  const handleNextQuestion = () => {
    setSelectedTypes([]); // 선택 초기화
    nextQuestion();
  };

  if (state.isLoading && !state.question) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">포켓몬 속성 맞추기</CardTitle>
          <CardDescription className="text-xs">포켓몬의 타입을 맞춰보세요</CardDescription>
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
          <CardTitle className="text-sm">포켓몬 속성 맞추기</CardTitle>
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
          <CardTitle className="text-sm">포켓몬 속성 맞추기</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">다음 문제를 준비하는 중입니다...</p>
        </CardContent>
      </Card>
    );
  }

  const correctTypes = state.question?.pokemonData?.types || [];
  const questionChoices = state.question?.choices || [];

  // 사용하지 않는 변수 제거
  // const isCorrect = ...

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">포켓몬 속성 맞추기</CardTitle>
          <CardDescription className="text-xs">포켓몬의 타입을 맞춰보세요</CardDescription>
        </CardHeader>
      </Card>

      <QuizQuestionCard
        question={state.question}
        currentQuestion={state.currentQuestion}
        totalQuestions={state.options.totalQuestions}
        showPokemonTypes={isAnswerSubmitted} // 정답 공개 후에만 타입 표시
      />

      {/* 타입 선택 버튼들 (4개) */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {!isAnswerSubmitted && isDualType && (
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground">
                  선택된 타입: {selectedTypes.length}/2
                </p>
                {selectedTypes.length > 0 && (
                  <div className="flex gap-2 justify-center mt-2">
                    {selectedTypes.map((type) => (
                      <Badge key={type} variant="secondary">
                        {type}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {questionChoices.map((choice) => {
                const isSelected = selectedTypes.includes(choice.id);
                const isCorrect = isAnswerSubmitted && correctTypes.includes(choice.id);
                const isIncorrect =
                  isAnswerSubmitted && isSelected && !correctTypes.includes(choice.id);

                return (
                  <Button
                    key={choice.id}
                    variant={
                      isCorrect
                        ? "default"
                        : isIncorrect
                        ? "destructive"
                        : isSelected
                        ? "secondary"
                        : "outline"
                    }
                    size="lg"
                    onClick={() => handleTypeSelect(choice.id)}
                    disabled={isAnswerSubmitted}
                    className={`h-16 text-base font-medium ${
                      isCorrect
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : isIncorrect
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : isSelected
                        ? "bg-blue-100 text-blue-800"
                        : ""
                    }`}
                  >
                    {choice.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 결과 및 다음 문제 */}
      <Card>
        <CardContent className="pt-4">
          <div className="space-y-3">
            {state.isCorrect === true && (
              <p className="text-sm text-green-600 text-center font-bold">
                정답입니다! {correctTypes.join("/")} 타입입니다.
              </p>
            )}
            {state.isCorrect === false && (
              <p className="text-sm text-red-600 text-center font-bold">
                아쉽네요. 정답은 {correctTypes.join("/")} 타입입니다.
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
                disabled={!isAnswerSubmitted}
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
