import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAllTypes } from "@/features/pokemonTypes/hooks/useAllTypes";
import {
  buildTypeMap,
  computeOffenseEffectiveness,
} from "@/features/pokemonTypes/utils/typeEffectiveness";
import type { PokeApiNamedResource } from "@/features/generation/api/generationApi";
import { getKoreanTypeName } from "@/utils/dataTransforms";

interface PokemonAttackEffectivenessSectionProps {
  types: { type: PokeApiNamedResource }[];
}

export function PokemonAttackEffectivenessSection({
  types,
}: PokemonAttackEffectivenessSectionProps) {
  const { data: allTypes, isLoading } = useAllTypes();

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
                    {getKoreanTypeName(t.type.name)}
                  </Badge>
                  <span className="text-xs font-medium text-foreground">타입 공격 시</span>
                </div>
                <div className="space-y-2 pl-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="w-12 text-xs font-semibold text-red-500">2배</span>
                    {effectiveness.double.length > 0 ? (
                      effectiveness.double.map((type) => {
                        const koreanName = getKoreanTypeName(type);
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
                        const koreanName = getKoreanTypeName(type);
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
                        const koreanName = getKoreanTypeName(type);
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
