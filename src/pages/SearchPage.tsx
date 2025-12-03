import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function SearchSummaryHeader() {
  return (
    <header className="space-y-2 border-b pb-3">
      <div className="flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">검색 결과</h2>
          <p>
            검색어와 선택한 게임/세대에 따라 포켓몬, 기술, 특성, 도구를 표시합니다. (현재는 더미
            데이터만 표시됩니다)
          </p>
        </div>
        <p className="text-xs">
          검색어: <span className="font-medium text-foreground">"피카"</span> · 9세대
          (스칼렛/바이올렛) · 한국어
        </p>
      </div>

      <div className="mt-3 flex flex-col gap-3 text-xs sm:flex-row sm:items-center">
        <div className="flex-1">
          <label className="mb-1 block font-medium text-muted-foreground">검색어</label>
          <Input placeholder="검색어를 수정해 다시 검색 (추후 구현)" />
        </div>
        <div className="flex flex-1 gap-2">
          <div className="flex-1">
            <label className="mb-1 block font-medium text-muted-foreground">게임/세대</label>
            <select className="h-9 w-full rounded-md border bg-background px-2 text-xs">
              <option>9세대 (스칼렛/바이올렛)</option>
            </select>
          </div>
          <div className="w-28">
            <label className="mb-1 block font-medium text-muted-foreground">언어</label>
            <select className="h-9 w-full rounded-md border bg-background px-2 text-xs">
              <option>한국어</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}

interface SearchResultSectionProps {
  title: string;
  count: number;
  children: React.ReactNode;
}

function SearchResultSection({ title, count, children }: SearchResultSectionProps) {
  return (
    <section className="space-y-2">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold">
          {title} <span className="text-xs text-muted-foreground">({count})</span>
        </h3>
        <button
          type="button"
          className="text-xs text-muted-foreground underline-offset-4 hover:underline"
        >
          더 보기
        </button>
      </div>
      <Card>
        <CardContent className="space-y-2 py-3 text-xs text-muted-foreground">
          {children}
        </CardContent>
      </Card>
    </section>
  );
}

export function SearchPage() {
  return (
    <section className="space-y-6">
      <SearchSummaryHeader />

      <nav className="flex flex-wrap gap-2 text-xs">
        <button
          type="button"
          className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary-foreground/90"
        >
          포켓몬 (3)
        </button>
        <button
          type="button"
          className="rounded-full bg-muted px-3 py-1 text-muted-foreground hover:bg-muted/80"
        >
          기술 (5)
        </button>
        <button
          type="button"
          className="rounded-full bg-muted px-3 py-1 text-muted-foreground hover:bg-muted/80"
        >
          특성 (1)
        </button>
        <button
          type="button"
          className="rounded-full bg-muted px-3 py-1 text-muted-foreground hover:bg-muted/80"
        >
          도구 (0)
        </button>
      </nav>

      <div className="space-y-6">
        <SearchResultSection title="포켓몬" count={3}>
          <p>피카츄 · 전기 · 1세대 (레드/그린)</p>
          <p>피츄 · 전기 · 2세대 (골드/실버)</p>
          <p>라이츄 · 전기 · 1세대 (레드/그린)</p>
        </SearchResultSection>

        <SearchResultSection title="기술" count={5}>
          <p>10만볼트 · 전기 · 특수 · 위력 90 · 명중 100</p>
          <p>볼트태클 · 전기 · 물리 · 위력 120 · 명중 100</p>
        </SearchResultSection>

        <SearchResultSection title="특성" count={1}>
          <p>정전기 · 접촉한 상대를 마비시킬 때가 있다</p>
        </SearchResultSection>

        <SearchResultSection title="도구" count={0}>
          <p>해당 검색어에 해당하는 도구 결과가 없습니다.</p>
        </SearchResultSection>
      </div>
    </section>
  );
}
