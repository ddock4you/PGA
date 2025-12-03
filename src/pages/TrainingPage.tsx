export function TrainingPage() {
  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold">배틀 트레이닝</h2>
        <p className="text-sm text-muted-foreground">
          타입 상성 퀴즈와 포켓몬 기반 퀴즈로 상성을 연습할 수 있는 공간입니다.
        </p>
      </header>

      <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
        타입 상성 퀴즈 UI와 로직은 이후 단계에서 구현됩니다. 우선은 페이지 구조와 라우팅만 연결해
        둡니다.
      </div>
    </section>
  );
}
