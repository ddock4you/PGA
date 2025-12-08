import { useParams, useNavigate } from "react-router-dom";
import { useMove } from "@/features/moves/hooks/useMovesQueries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function MoveDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: move, isLoading, isError } = useMove(id ?? "");

  if (isLoading) return <div className="p-4">로딩 중...</div>;
  if (isError || !move) return <div className="p-4">정보를 불러올 수 없습니다.</div>;

  const getEffectText = (entries: typeof move.effect_entries) => {
    const ko = entries.find((e) => e.language.name === "ko");
    const en = entries.find((e) => e.language.name === "en");
    return {
      effect: ko?.effect || en?.effect || "-",
      short_effect: ko?.short_effect || en?.short_effect || "-",
    };
  };

  const { effect, short_effect } = getEffectText(move.effect_entries);

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-2">
        뒤로 가기
      </Button>

      <header>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{move.name}</h1>
          <Badge>{move.type.name}</Badge>
          <Badge variant="outline">{move.damage_class.name}</Badge>
        </div>
        <p className="text-muted-foreground text-sm mt-1">{short_effect}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">위력</span>
              <span className="font-medium">{move.power ?? "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">명중률</span>
              <span className="font-medium">{move.accuracy ?? "-"}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">PP</span>
              <span className="font-medium">{move.pp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">우선도</span>
              <span className="font-medium">{move.priority}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">대상</span>
              <span className="font-medium">API 확인 필요</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">효과 상세</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{effect}</p>
          </CardContent>
        </Card>

        {move.meta && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">메타 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">상태이상</span>
                <span className="font-medium">{move.meta.ailment.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">카테고리</span>
                <span className="font-medium">{move.meta.category.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">급소율</span>
                <span className="font-medium">{move.meta.crit_rate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">드레인</span>
                <span className="font-medium">{move.meta.drain}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">플린치 확률</span>
                <span className="font-medium">{move.meta.flinch_chance}%</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
