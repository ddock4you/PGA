import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEggGroupKorean, getGrowthRateKorean, getStatNameKorean } from "@/utils/dataTransforms";
import type { PokeApiPokemon, PokeApiPokemonSpecies } from "@/features/pokemon/types/pokeApiTypes";

export function BreedingInfoCard({
  pokemon,
  species,
}: {
  pokemon: PokeApiPokemon;
  species: PokeApiPokemonSpecies;
}) {
  const evYields = pokemon.stats
    .filter((s) => s.effort > 0)
    .map((s) => `${s.stat.name} +${s.effort}`);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">육성 정보</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">알 그룹</span>
          <div className="flex gap-1">
            {species.egg_groups?.map((g) => (
              <span key={g.name} className="capitalize">
                {getEggGroupKorean(g.name)}
              </span>
            )) || "-"}
          </div>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">포획률</span>
          <span>{species.capture_rate ?? "-"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">부화 카운터</span>
          <span>{species.hatch_counter ? `${species.hatch_counter} 사이클` : "-"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">초기 친밀도</span>
          <span>{species.base_happiness ?? "-"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">성장 곡선</span>
          <span className="capitalize">
            {species.growth_rate ? getGrowthRateKorean(species.growth_rate.name) : "-"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">노력치(EV)</span>
          <div className="flex flex-col items-end">
            {evYields.length > 0
              ? evYields.map((ev) => {
                  const statMatch = ev.match(/^(.+)\s\+\d+$/);
                  const statName = statMatch ? statMatch[1] : ev;
                  const koreanStatName = getStatNameKorean(statName);
                  return (
                    <span key={ev} className="text-xs capitalize">
                      {ev.replace(statName, koreanStatName)}
                    </span>
                  );
                })
              : "-"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
