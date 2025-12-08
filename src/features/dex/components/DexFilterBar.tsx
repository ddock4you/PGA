import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface DexFilterBarProps {
  generationId: string;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  description?: string;
  showTypeFilter?: boolean;
}

export function DexFilterBar({
  searchQuery,
  onSearchQueryChange,
  description = "세대/게임과 이름으로 리스트를 좁혀볼 수 있습니다.",
  showTypeFilter = false,
}: DexFilterBarProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">필터</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-xs sm:flex-row sm:items-end">
        {showTypeFilter && (
          <div className="flex-1">
            <label className="mb-1 block font-medium text-muted-foreground">타입</label>
            <div className="h-9 rounded-md border bg-muted px-2 text-xs text-muted-foreground">
              <div className="flex h-full items-center">모든 타입 (추후 구현)</div>
            </div>
          </div>
        )}
        <div className="flex-1">
          <label className="mb-1 block font-medium text-muted-foreground">이름 검색</label>
          <Input
            placeholder="이름으로 검색"
            className="h-9 text-xs"
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
