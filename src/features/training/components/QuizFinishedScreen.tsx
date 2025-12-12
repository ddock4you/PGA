import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuizContext } from "../store";
import { useQuizNavigation } from "../hooks/useQuizNavigation";

export function QuizFinishedScreen() {
  const { state } = useQuizContext();
  const { resetQuiz } = useQuizNavigation();

  const totalQuestions = state.options.totalQuestions;
  const correctAnswers = state.score;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  const getResultMessage = () => {
    if (percentage >= 90) return { message: "완벽해요! 🎉", color: "text-green-600" };
    if (percentage >= 80) return { message: "훌륭합니다! 👍", color: "text-blue-600" };
    if (percentage >= 70) return { message: "잘했어요! 😊", color: "text-yellow-600" };
    if (percentage >= 60) return { message: "괜찮아요! 💪", color: "text-orange-600" };
    return { message: "더 연습해보세요! 📚", color: "text-red-600" };
  };

  const result = getResultMessage();

  const handleRestart = () => {
    resetQuiz();
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">퀴즈 완료!</CardTitle>
        <CardDescription>
          {state.mode === "attack" ? "공격 상성 맞추기" : "방어 상성 맞추기"} Lv.{state.level} 결과
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <div className={`text-3xl font-bold ${result.color}`}>
              {correctAnswers} / {totalQuestions}
            </div>
            <div className="text-lg text-muted-foreground">{percentage}% 정답률</div>
          </div>

          <div className={`text-lg font-medium ${result.color}`}>{result.message}</div>
        </div>

        <div className="bg-muted rounded-lg p-4 text-center space-y-2">
          <div className="text-sm text-muted-foreground">퀴즈 설정</div>
          <div className="flex justify-center gap-2 flex-wrap">
            <Badge variant="secondary">{state.mode === "attack" ? "공격 상성" : "방어 상성"}</Badge>
            <Badge variant="secondary">Lv.{state.level}</Badge>
            <Badge variant="secondary">{totalQuestions}문제</Badge>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleRestart} variant="outline" className="flex-1">
            다시 하기
          </Button>
          <Button
            onClick={() => window.location.reload()} // 임시로 페이지 리로드
            className="flex-1"
          >
            다른 퀴즈 하기
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          배틀 트레이닝을 통해 타입 상성 실력을 키워보세요!
        </div>
      </CardContent>
    </Card>
  );
}
