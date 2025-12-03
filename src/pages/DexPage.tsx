export function DexPage() {
  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">포켓몬 도감</h2>
          <p className="text-sm text-muted-foreground">
            세대/게임과 타입을 선택해 포켓몬을 탐색할 수 있습니다.
          </p>
        </div>
      </header>

      <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 text-sm">
        <p className="text-muted-foreground">
          아직 도감 데이터 연동 전입니다. 이후 PokéAPI와 연동하여 세대별 포켓몬 리스트와 상세 정보를
          표시할 예정입니다.
        </p>
      </div>
    </section>
  );
}
