export function HomePage() {
  return (
    <section className="flex flex-col items-center gap-6 pt-10">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">포켓몬 게임 어시스턴트</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          플레이 중인 게임/세대를 선택하고 포켓몬·기술·특성·도구를 검색해 보세요.
        </p>
      </div>

      <div className="flex w-full flex-col gap-3 rounded-lg border bg-card px-4 py-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">게임/세대</label>
          <select className="w-full rounded-md border bg-background px-2 py-2 text-sm">
            <option>게임/세대 선택</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">검색어</label>
          <input
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="포켓몬 / 기술 / 특성 / 도구 이름"
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">예: 피카츄, 번개, 위협, 생명의구슬 ...</p>
    </section>
  );
}
