import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEncountersForGame } from "@/features/pokemon/hooks/useEncountersForGame";
import { formatEncounterMethodName, formatLocationAreaName } from "@/features/pokemon/utils/encounterFormatting";
import type { PokeApiEncounter, PokeApiPokemonSpecies } from "@/features/pokemon/types/pokeApiTypes";
import type { PreviousStagePokemon } from "@/features/pokemon/hooks/usePreviousStagePokemons";

export function ObtainingMethodsCard({
  species,
  encounters,
  selectedGameId,
  previousStages,
  getKoreanPokemonName,
  onTabChange,
}: {
  species: PokeApiPokemonSpecies;
  encounters?: PokeApiEncounter[];
  selectedGameId?: string;
  previousStages: PreviousStagePokemon[];
  getKoreanPokemonName: (speciesName: string) => string;
  onTabChange?: (value: string) => void;
}) {
  const { filteredEncounters, hasEncounters } = useEncountersForGame({ encounters, selectedGameId });

  return (
    <Card id="obtaining-methods">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">획득 방법</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {hasEncounters ? (
          filteredEncounters.length > 0 ? (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground">야생에서 포획</h4>
              <div className="space-y-2">
                {filteredEncounters.slice(0, 5).map((encounter) => {
                  const versionDetail = selectedGameId
                    ? encounter.version_details.find((vd) => vd.version.name === selectedGameId)
                    : encounter.version_details[0];
                  if (!versionDetail) return null;

                  return (
                    <div key={encounter.location_area.name} className="flex flex-col">
                      <span className="capitalize text-xs font-medium">
                        {formatLocationAreaName(encounter.location_area.name)}
                      </span>
                      <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                        {versionDetail.encounter_details.slice(0, 2).map((detail, idx) => (
                          <span key={idx}>
                            {formatEncounterMethodName(detail.method.name)} (Lv.{detail.min_level}-
                            {detail.max_level}, {detail.chance}%)
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground text-xs">
              선택된 게임 버전에서는 야생에서 포획할 수 없습니다.
            </div>
          )
        ) : (
          <div className="text-muted-foreground text-xs">야생 출현 정보가 없습니다.</div>
        )}

        {previousStages.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground">진화를 통해 획득</h4>
            <div className="space-y-1 text-xs">
              <div className="flex flex-wrap gap-1">
                {previousStages.map((stage, index) => (
                  <Link
                    key={stage.speciesName}
                    href={`/dex/${stage.speciesName}?scrollTo=obtaining-methods`}
                    className="text-primary hover:underline capitalize"
                  >
                    {getKoreanPokemonName(stage.speciesName)}
                    {index < previousStages.length - 1 ? " → " : null}
                  </Link>
                ))}
                <span className="text-muted-foreground"> 진화</span>
              </div>
              <div className="text-muted-foreground">
                또는{" "}
                <Button
                  variant="link"
                  className="h-auto p-0 text-xs text-primary hover:underline"
                  onClick={() => onTabChange?.("evolution")}
                >
                  진화 탭 참조
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        {species.egg_groups && species.egg_groups.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground">알을 통해 획득</h4>
            <div className="text-xs text-muted-foreground">교배를 통해 알에서 부화 가능</div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
