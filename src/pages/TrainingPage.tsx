import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTypeQuiz } from "@/features/training/hooks/useTypeQuiz";

function TrainingModeSelector() {
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      <Button variant="outline" size="sm" type="button">
        타입 상성 퀴즈
      </Button>
      <Button variant="ghost" size="sm" type="button" disabled>
        포켓몬 기반 퀴즈 (준비 중)
      </Button>
    </div>
  );
}

function TypeQuizCard() {
  const {
    typesLoading,
    typesError,
    question,
    choices,
    selectedChoice,
    isCorrect,
    score,
    submitChoice,
    nextQuestion,
  } = useTypeQuiz({ totalQuestions: 10 });

  const renderContent = () => {
    if (typesLoading) {
      return <p className="text-xs text-muted-foreground">타입 데이터를 불러오는 중입니다...</p>;
    }

    if (typesError) {
      return (
        <p className="text-xs text-destructive">
          타입 데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
        </p>
      );
    }

    if (!question) {
      return <p className="text-xs text-muted-foreground">다음 문제를 준비하는 중입니다...</p>;
    }

    return (
      <>
        <div className="space-y-1">
          <p className="font-medium text-foreground">
            문제 {question.index} / {question.total}
          </p>
          <p className="text-sm">
            <span className="font-semibold text-foreground">{question.attackType}</span> 타입 기술은{" "}
            <span className="rounded-full bg-muted px-2 py-0.5 text-foreground">
              {question.defenderType}
            </span>{" "}
            타입 포켓몬에게 어느 정도의 대미지를 줄까요?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {choices.map((choice) => {
            const isSelected = selectedChoice === choice;
            const correct = isCorrect && question.multiplier === choice;

            let variant: "outline" | "default" | "destructive" = "outline";
            if (isSelected && isCorrect != null) {
              variant = correct ? "default" : "destructive";
            }

            const label =
              choice === "2"
                ? "2배 (효과가 굉장하다)"
                : choice === "1"
                ? "1배 (보통)"
                : choice === "0.5"
                ? "0.5배 (효과가 별로이다)"
                : "0배 (효과가 없다)";

            return (
              <Button
                key={choice}
                variant={variant}
                size="sm"
                type="button"
                onClick={() => submitChoice(choice)}
                disabled={selectedChoice != null}
              >
                {label}
              </Button>
            );
          })}
        </div>

        <div className="rounded-md bg-muted px-3 py-2 text-[11px] text-muted-foreground">
          {isCorrect == null && <p>보기를 하나 선택해 정답을 확인해 보세요.</p>}
          {isCorrect === true && (
            <p>
              정답입니다! {question.attackType} → {question.defenderType} 조합은{" "}
              {question.multiplier === "2"
                ? "효과가 굉장한 상성입니다."
                : question.multiplier === "1"
                ? "보통 상성입니다."
                : question.multiplier === "0.5"
                ? "효과가 별로인 상성입니다."
                : "효과가 없는 상성입니다."}
            </p>
          )}
          {isCorrect === false && (
            <p>
              아쉽네요. 정답은{" "}
              {question.multiplier === "2"
                ? "2배 (효과가 굉장하다)"
                : question.multiplier === "1"
                ? "1배 (보통)"
                : question.multiplier === "0.5"
                ? "0.5배 (효과가 별로이다)"
                : "0배 (효과가 없다)"}{" "}
              입니다.
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <p>
            점수: {score} / {question.total}
          </p>
          <Button
            variant="outline"
            size="sm"
            type="button"
            className="h-7 px-2 text-[11px]"
            onClick={nextQuestion}
          >
            다음 문제
          </Button>
        </div>
      </>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">타입 상성 퀴즈</CardTitle>
        <CardDescription className="text-xs">
          랜덤 타입 조합에 대해 상성을 맞추는 연습용 퀴즈입니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-xs">{renderContent()}</CardContent>
    </Card>
  );
}

export function TrainingPage() {
  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold">배틀 트레이닝</h2>
        <p className="text-sm text-muted-foreground">
          타입 상성 퀴즈와 포켓몬 기반 퀴즈로 상성을 연습할 수 있는 공간입니다.
        </p>
        <TrainingModeSelector />
      </header>

      <TypeQuizCard />
    </section>
  );
}
