"use client";

import { useRouter } from "next/navigation";
import { useMove } from "@/features/moves/hooks/useMovesQueries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

interface MoveDetailClientProps {
  initialMove: any;
  moveId: string;
}

export function MoveDetailClient({ initialMove, moveId }: MoveDetailClientProps) {
  const router = useRouter();
  const { data: move, isLoading, isError } = useMove(moveId, {
    initialData: initialMove,
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">기술 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (isError || !move) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-destructive">기술 정보를 불러오지 못했습니다.</p>
        <Button variant="outline" onClick={() => router.back()}>
          뒤로 가기
        </Button>
      </div>
    );
  }

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
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="-ml-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <span className="text-sm font-medium text-muted-foreground">기술 상세</span>
      </div>

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



