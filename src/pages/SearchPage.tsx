export function SearchPage() {
  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold">검색 결과</h2>
        <p className="text-sm text-muted-foreground">
          검색어와 선택한 게임/세대에 따라 포켓몬, 기술, 특성, 도구를 표시합니다.
        </p>
      </header>

      <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
        아직 검색 로직이 연결되지 않았습니다. 이후 세대/언어별 검색 인덱스를 사용해 실제 결과를
        렌더링합니다.
      </div>
    </section>
  );
}
