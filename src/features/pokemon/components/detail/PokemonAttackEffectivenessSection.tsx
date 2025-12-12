import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAllTypesQuery } from "@/features/types/hooks/useAllTypesQuery";
import {
  buildTypeMap,
  computeOffenseEffectiveness,
} from "@/features/types/utils/typeEffectiveness";
import type { PokeApiNamedResource } from "@/features/generation/api/generationApi";

// 타입 이름(영문)으로부터 한글 이름을 찾는 매핑
const TYPE_NAME_TO_KOREAN: Record<string, string> = {
  normal: "노말",
  fighting: "격투",
  flying: "비행",
  poison: "독",
  ground: "땅",
  rock: "바위",
  bug: "벌레",
  ghost: "고스트",
  steel: "강철",
  fire: "불꽃",
  water: "물",
  grass: "풀",
  electric: "전기",
  psychic: "에스퍼",
  ice: "얼음",
  dragon: "드래곤",
  dark: "악",
  fairy: "페어리",
};

interface PokemonAttackEffectivenessSectionProps {
  types: { type: PokeApiNamedResource }[];
}

export function PokemonAttackEffectivenessSection({
  types,
}: PokemonAttackEffectivenessSectionProps) {
  const { data: allTypes, isLoading } = useAllTypesQuery();

  const typeMap = useMemo(() => {
    if (!allTypes) return {};
    return buildTypeMap(allTypes);
  }, [allTypes]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">공격 상성 (자속 보정)</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>상성 정보를 불러오는 중...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">공격 상성 (자속 보정)</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <p className="mb-4">이 포켓몬의 타입으로 공격할 때 유리한 상성입니다.</p>

        <div className="space-y-4">
          {types.map((t) => {
            const effectiveness = computeOffenseEffectiveness(t.type.name, typeMap);
            return (
              <div key={t.type.name}>
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="secondary" className="uppercase">
                    {TYPE_NAME_TO_KOREAN[t.type.name] || t.type.name}
                  </Badge>
                  <span className="text-xs font-medium text-foreground">타입 공격 시</span>
                </div>
                <div className="space-y-2 pl-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="w-12 text-xs font-semibold text-red-500">2배</span>
                    {effectiveness.double.length > 0 ? (
                      effectiveness.double.map((type) => {
                        const koreanName = TYPE_NAME_TO_KOREAN[type] || type;
                        return (
                          <Badge key={type} variant="outline" className="uppercase text-[10px]">
                            {koreanName}
                          </Badge>
                        );
                      })
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="w-12 text-xs font-semibold text-blue-500">0.5배</span>
                    {effectiveness.half.length > 0 ? (
                      effectiveness.half.map((type) => {
                        const koreanName = TYPE_NAME_TO_KOREAN[type] || type;
                        return (
                          <Badge key={type} variant="outline" className="uppercase text-[10px]">
                            {koreanName}
                          </Badge>
                        );
                      })
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="w-12 text-xs font-semibold text-gray-500">0배</span>
                    {effectiveness.zero.length > 0 ? (
                      effectiveness.zero.map((type) => {
                        const koreanName = TYPE_NAME_TO_KOREAN[type] || type;
                        return (
                          <Badge key={type} variant="outline" className="uppercase text-[10px]">
                            {koreanName}
                          </Badge>
                        );
                      })
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
