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
