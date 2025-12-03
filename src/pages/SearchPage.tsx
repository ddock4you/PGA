import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SearchPage() {
  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold">검색 결과</h2>
        <p className="text-sm text-muted-foreground">
          검색어와 선택한 게임/세대에 따라 포켓몬, 기술, 특성, 도구를 표시합니다.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">검색 준비 중</CardTitle>
          <CardDescription>
            아직 검색 로직이 연결되지 않았습니다. 이후 세대/언어별 검색 인덱스를 사용해 실제 결과를
            렌더링합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          우선은 UI 뼈대만 구성해두고, 나중에 검색 인덱스와 필터 로직을 연결합니다.
        </CardContent>
      </Card>
    </section>
  );
}
