import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function HomePage() {
  return (
    <section className="flex flex-col items-center gap-6 pt-10">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">포켓몬 게임 어시스턴트</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          플레이 중인 게임/세대를 선택하고 포켓몬·기술·특성·도구를 검색해 보세요.
        </p>
      </div>

      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">빠른 검색</CardTitle>
          <CardDescription>
            지금 플레이 중인 게임/세대를 선택하고 검색어를 입력해 검색을 시작할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              게임/세대
            </label>
            <select className="h-9 w-full rounded-md border bg-background px-2 text-sm">
              <option>게임/세대 선택</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              검색어
            </label>
            <Input placeholder="포켓몬 / 기술 / 특성 / 도구 이름" />
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        예: 피카츄, 번개, 위협, 생명의구슬 ...
      </p>
    </section>
  );
}
