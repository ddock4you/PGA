import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAllTypesQuery } from "@/features/types/hooks/useAllTypesQuery";
import { buildTypeMap, computeAttackMultiplier } from "@/features/types/utils/typeEffectiveness";
import type { PokeApiPokemon } from "../../api/pokemonApi";

interface PokemonTypeEffectivenessProps {
  types: PokeApiPokemon["types"];
}

export function PokemonTypeEffectiveness({ types }: PokemonTypeEffectivenessProps) {
  const { data: allTypes } = useAllTypesQuery();

  const effectiveness = useMemo(() => {
    if (!allTypes) return null;

    const typeMap = buildTypeMap(allTypes);
    const defenderTypes = types.map((t) => t.type.name);

    // Group by multiplier
    const groups: Record<number, string[]> = {};

    allTypes.forEach((attackType) => {
      // Skip special types like 'stellar' or 'unknown' if they don't have damage relations logic standardly
      // (But API usually returns them, computeAttackMultiplier handles them if data exists)
      if (attackType.name === "shadow" || attackType.name === "unknown") return;

      const multiplier = computeAttackMultiplier(attackType.name, defenderTypes, typeMap);
      if (multiplier !== 1) {
        if (!groups[multiplier]) groups[multiplier] = [];
        groups[multiplier].push(attackType.name);
      }
    });

    return groups;
  }, [allTypes, types]);

  if (!effectiveness) return null;

  // Sort multipliers: High (Weak) -> Low (Resist)
  const sortedMultipliers = Object.keys(effectiveness)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">방어 상성 (Weakness & Resistance)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedMultipliers.map((multiplier) => (
          <div key={multiplier} className="flex items-start gap-3">
            <div className="w-14 shrink-0 text-sm font-semibold text-muted-foreground">
              x {multiplier}
            </div>
            <div className="flex flex-wrap gap-2">
              {effectiveness[multiplier].map((typeName) => (
                <Badge key={typeName} variant="outline" className="capitalize">
                  {typeName}
                </Badge>
              ))}
            </div>
          </div>
        ))}
        {sortedMultipliers.length === 0 && (
          <p className="text-sm text-muted-foreground">약점이나 저항이 없는 보통 상성입니다.</p>
        )}
      </CardContent>
    </Card>
  );
}
