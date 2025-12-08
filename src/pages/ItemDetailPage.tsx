import { useParams, useNavigate } from "react-router-dom";
import { useItem } from "@/features/items/hooks/useItemsQueries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: item, isLoading, isError } = useItem(id ?? "");

  if (isLoading) return <div className="p-4">로딩 중...</div>;
  if (isError || !item) return <div className="p-4">정보를 불러올 수 없습니다.</div>;

  const getEffectText = (entries: typeof item.effect_entries) => {
    const ko = entries.find((e) => e.language.name === "ko");
    const en = entries.find((e) => e.language.name === "en");
    return {
      effect: ko?.effect || en?.effect || "-",
      short_effect: ko?.short_effect || en?.short_effect || "-",
    };
  };

  const { effect, short_effect } = getEffectText(item.effect_entries);

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-2">
        뒤로 가기
      </Button>

      <header className="flex items-start gap-4">
        <div className="size-16 flex items-center justify-center border rounded-md bg-muted">
          {item.sprites.default && (
            <img src={item.sprites.default} alt={item.name} className="size-12 object-contain" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{item.name}</h1>
            <Badge>{item.category.name}</Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-1">{short_effect}</p>
          <p className="text-sm font-medium mt-1">가격: {item.cost}원</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">효과 상세</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{effect}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">속성 (Attributes)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {item.attributes.map((attr) => (
                <Badge key={attr.name} variant="outline">
                  {attr.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">던지기 효과</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <div>위력: {item.fling_power ?? "-"}</div>
            <div>효과: {item.fling_effect?.name ?? "-"}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
