import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function TrainingModeSelector() {
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      <Button variant="outline" size="sm" type="button">
        타입 상성 퀴즈
      </Button>
      <Button variant="ghost" size="sm" type="button">
        포켓몬 기반 퀴즈 (준비 중)
      </Button>
    </div>
  );
}

function TypeQuizCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">타입 상성 퀴즈</CardTitle>
        <CardDescription className="text-xs">
          랜덤 타입 조합에 대해 상성을 맞추는 연습용 퀴즈입니다. (현재는 더미 문제입니다)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-xs">
        <div className="space-y-1">
          <p className="font-medium text-foreground">문제 1 / 10</p>
          <p className="text-sm">
            불꽃 타입 기술은{" "}
            <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-orange-200">풀</span>{" "}
            타입 포켓몬에게 어느 정도의 대미지를 줄까요?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <Button variant="outline" size="sm" type="button">
            2배 (효과가 굉장하다)
          </Button>
          <Button variant="outline" size="sm" type="button">
            1배 (보통)
          </Button>
          <Button variant="outline" size="sm" type="button">
            0.5배 (효과가 별로이다)
          </Button>
          <Button variant="outline" size="sm" type="button">
            0배 (효과가 없다)
          </Button>
        </div>

        <div className="rounded-md bg-muted px-3 py-2 text-muted-foreground">
          <p>선택한 보기의 정답 여부와 간단한 설명이 여기에 표시될 예정입니다.</p>
        </div>

        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <p>점수: 3 / 10</p>
          <p>정답률: 30%</p>
        </div>
      </CardContent>
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
