import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type QuizResultFooterProps = {
  isCorrect: boolean | null;
  correctMessage: string;
  incorrectMessage: string;
  score: number;
  currentQuestion: number;
  onNext: () => void;
  nextDisabled: boolean;
  nextLabel?: string;
};

export function QuizResultFooter({
  isCorrect,
  correctMessage,
  incorrectMessage,
  score,
  currentQuestion,
  onNext,
  nextDisabled,
  nextLabel = "다음 문제",
}: QuizResultFooterProps) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {isCorrect === true ? (
            <p className="text-sm text-green-600 text-center font-bold">{correctMessage}</p>
          ) : null}
          {isCorrect === false ? (
            <p className="text-sm text-red-600 text-center font-bold">{incorrectMessage}</p>
          ) : null}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              점수: {score} / {currentQuestion}
            </span>
            <Button variant="outline" size="sm" onClick={onNext} disabled={nextDisabled}>
              {nextLabel}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
