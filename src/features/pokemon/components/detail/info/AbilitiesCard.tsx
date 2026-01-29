import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDexCsvData } from "@/hooks/useDexCsvData";
import { useLocalizedAbilityName } from "@/hooks/useLocalizedAbilityName";
import { parseAbilityIdFromUrl } from "@/features/pokemon/utils/abilityId";
import type { PokeApiPokemon } from "@/features/pokemon/types/pokeApiTypes";

export function AbilitiesCard({ pokemon }: { pokemon: PokeApiPokemon }) {
  const { abilitiesData, abilityNamesData } = useDexCsvData();
  const { getLocalizedAbilityName } = useLocalizedAbilityName({
    abilitiesData,
    abilityNamesData,
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">특성</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {pokemon.abilities.map((a) => {
          const abilityId = parseAbilityIdFromUrl(a.ability.url);
          const koreanAbilityName = getLocalizedAbilityName({
            id: abilityId,
            identifier: a.ability.name,
          });

          return (
            <div key={a.ability.name} className="flex items-center justify-between">
              <Link href={`/abilities/${a.ability.name}`} className="capitalize text-primary hover:underline">
                {koreanAbilityName}
              </Link>
              {a.is_hidden ? <Badge variant="outline">숨겨진 특성</Badge> : null}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
