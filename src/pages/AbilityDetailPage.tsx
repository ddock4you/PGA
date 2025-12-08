import { useParams, useNavigate } from "react-router-dom";
import { useAbility } from "@/features/abilities/hooks/useAbilitiesQueries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function AbilityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: ability, isLoading, isError } = useAbility(id ?? "");

  if (isLoading) return <div className="p-4">로딩 중...</div>;
  if (isError || !ability) return <div className="p-4">정보를 불러올 수 없습니다.</div>;

  const getEffectText = (entries: typeof ability.effect_entries) => {
    const ko = entries.find((e) => e.language.name === "ko");
    const en = entries.find((e) => e.language.name === "en");
    return {
      effect: ko?.effect || en?.effect || "-",
      short_effect: ko?.short_effect || en?.short_effect || "-",
    };
  };

  const { effect, short_effect } = getEffectText(ability.effect_entries);

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-2">
        뒤로 가기
      </Button>

      <header>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{ability.name}</h1>
          <Badge variant={ability.is_main_series ? "default" : "secondary"}>
            {ability.is_main_series ? "본가 시리즈" : "외전"}
          </Badge>
          <Badge variant="outline">{ability.generation.name}</Badge>
        </div>
        <p className="text-muted-foreground text-sm mt-1">{short_effect}</p>
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
            <CardTitle className="text-base">보유 포켓몬 ({ability.pokemon.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {ability.pokemon.map((p) => (
                <Badge
                  key={p.pokemon.name}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => {
                    // 포켓몬 ID 추출 시도
                    const match = p.pokemon.url.match(/\/pokemon\/(\d+)\//);
                    if (match) {
                      navigate(`/dex/${match[1]}`);
                    }
                  }}
                >
                  {p.pokemon.name} {p.is_hidden && "(숨겨진 특성)"}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
