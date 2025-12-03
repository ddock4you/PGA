import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">도감 준비 중</CardTitle>
          <CardDescription>
            아직 도감 데이터 연동 전입니다. 이후 PokéAPI와 연동하여 세대별 포켓몬 리스트와 상세 정보를
            표시할 예정입니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          먼저 타입/세대 필터와 카드 그리드 UI를 완성한 뒤, 세대별 포켓몬 species 리스트와 개별 상세를
          단계적으로 연결하게 됩니다.
        </CardContent>
      </Card>
    </section>
  );
}
