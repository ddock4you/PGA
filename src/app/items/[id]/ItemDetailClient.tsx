"use client";

import { useRouter } from "next/navigation";
import { useItem } from "@/features/items/hooks/useItemsQueries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

interface ItemDetailClientProps {
  initialItem: any;
  itemId: string;
}

export function ItemDetailClient({ initialItem, itemId }: ItemDetailClientProps) {
  const router = useRouter();
  const { data: item, isLoading, isError } = useItem(itemId, {
    initialData: initialItem,
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">도구 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-destructive">도구 정보를 불러오지 못했습니다.</p>
        <Button variant="outline" onClick={() => router.back()}>
          뒤로 가기
        </Button>
      </div>
    );
  }

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
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="-ml-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <span className="text-sm font-medium text-muted-foreground">도구 상세</span>
      </div>

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
