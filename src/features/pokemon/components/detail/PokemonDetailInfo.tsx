"use client";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/features/preferences";
import { GENERATION_GAME_MAPPING } from "@/features/generation/constants/generationData";
import { usePreviousStagePokemons } from "../../hooks/usePreviousStagePokemons";
import { useDexCsvData } from "@/hooks/useDexCsvData";
import { useLocalizedAbilityName } from "@/hooks/useLocalizedAbilityName";
import { getEggGroupKorean, getGrowthRateKorean, getStatNameKorean } from "@/utils/dataTransforms";
import type {
  PokeApiPokemon,
  PokeApiPokemonSpecies,
  PokeApiEncounter,
  PokeApiEvolutionChain,
} from "../../api/pokemonApi";

interface PokemonDetailInfoProps {
  pokemon: PokeApiPokemon;
  species: PokeApiPokemonSpecies;
  encounters?: PokeApiEncounter[];
  evolutionChain?: PokeApiEvolutionChain;
  onTabChange?: (value: string) => void;
}

export function PokemonDetailInfo({
  pokemon,
  species,
  encounters,
  evolutionChain,
  onTabChange,
}: PokemonDetailInfoProps) {
  const { state } = usePreferences();
  const selectedGameId = state.selectedGameId;
  const { abilitiesData, abilityNamesData, itemsData, pokemonSpeciesNamesData } = useDexCsvData();
  const { getLocalizedAbilityName } = useLocalizedAbilityName({
    abilitiesData,
    abilityNamesData,
  });

  // 진화 이전 단계 포켓몬 정보
  const { stages: previousStages } = usePreviousStagePokemons(evolutionChain, species.name);

  const evYields = pokemon.stats
    .filter((s) => s.effort > 0)
    .map((s) => `${s.stat.name} +${s.effort}`);

  // 포켓몬 이름 한글화 헬퍼 함수
  const getKoreanPokemonName = (speciesName: string) => {
    // speciesName에서 ID 추출 시도
    const idMatch = speciesName.match(/(\d+)$/);
    const id = idMatch ? parseInt(idMatch[1], 10) : null;
    if (id) {
      const koreanName = pokemonSpeciesNamesData.find(
        (name) => name.pokemon_species_id === id && name.local_language_id === 3
      )?.name;
      if (koreanName) return koreanName;
    }
    return speciesName;
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Physical Info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">신체 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">키</span>
            <span>{pokemon.height / 10} m</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">몸무게</span>
            <span>{pokemon.weight / 10} kg</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">성비</span>
            <span>
              {species.gender_rate === -1
                ? "무성"
                : species.gender_rate !== undefined
                ? `수컷 ${(1 - species.gender_rate / 8) * 100}%, 암컷 ${
                    (species.gender_rate / 8) * 100
                  }%`
                : "-"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Abilities */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">특성</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {pokemon.abilities.map((a) => {
            const abilityIdMatch = a.ability.url.match(/\/ability\/(\d+)\//);
            const abilityId = abilityIdMatch ? parseInt(abilityIdMatch[1], 10) : undefined;
            const koreanAbilityName = getLocalizedAbilityName({
              id: abilityId,
              identifier: a.ability.name,
            });

            return (
              <div key={a.ability.name} className="flex items-center justify-between">
                <Link
                  href={`/abilities/${a.ability.name}`}
                  className="capitalize text-primary hover:underline"
                >
                  {koreanAbilityName}
                </Link>
                {a.is_hidden && <Badge variant="outline">숨겨진 특성</Badge>}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Breeding & Capture */}
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
                    // "attack +2" 같은 형식에서 스탯 이름 추출
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

      {/* Held Items (Wild) */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">야생 소지 도구</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {pokemon.held_items.length > 0 ? (
            pokemon.held_items
              .map((item) => {
                // 선택된 버전에 맞는 version_detail 찾기
                let versionDetail = null;
                if (selectedGameId) {
                  versionDetail = item.version_details.find(
                    (detail) => detail.version.name === selectedGameId
                  );
                }

                // 선택된 버전에 정보가 없으면 해당 세대의 다른 버전 찾기
                if (!versionDetail && selectedGameId) {
                  const selectedGeneration = GENERATION_GAME_MAPPING.find((gen) =>
                    gen.versions.some((v) => v.id === selectedGameId)
                  );
                  if (selectedGeneration) {
                    const generationVersionNames = selectedGeneration.versions.map((v) => v.id);
                    versionDetail = item.version_details.find((detail) =>
                      generationVersionNames.includes(detail.version.name)
                    );
                  }
                }

                // 그래도 없으면 첫 번째 버전 사용
                if (!versionDetail) {
                  versionDetail = item.version_details[0];
                }

                return {
                  itemName: item.item.name,
                  rarity: versionDetail ? versionDetail.rarity : 0,
                  versionName: versionDetail ? versionDetail.version.name : "",
                };
              })
              .filter((item) => item.rarity > 0) // 확률이 0인 아이템은 표시하지 않음
              .sort((a, b) => b.rarity - a.rarity) // 확률 높은 순으로 정렬
              .map((item) => {
                // 아이템 ID 추출 및 한글 이름 찾기
                const itemIdentifier = item.itemName;
                const itemData = itemsData.find((i) => i.identifier === itemIdentifier);
                const koreanItemName =
                  itemData?.identifier.replace(/-/g, " ") || item.itemName.replace("-", " ");

                return (
                  <div key={item.itemName} className="flex items-center justify-between">
                    <span className="capitalize">{koreanItemName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{item.rarity}%</span>
                      {item.versionName &&
                        selectedGameId &&
                        item.versionName !== selectedGameId && (
                          <Badge variant="outline" className="text-xs">
                            {item.versionName}
                          </Badge>
                        )}
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="text-muted-foreground">없음</div>
          )}
        </CardContent>
      </Card>

      {/* Obtaining Methods */}
      <Card id="obtaining-methods">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">획득 방법</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {/* Wild Encounters */}
          {encounters && encounters.length > 0 ? (
            <div className="space-y-2">
              {(() => {
                // 선택된 게임 버전에만 해당하는 encounter 필터링
                const filteredEncounters = encounters.filter(
                  (encounter) =>
                    selectedGameId
                      ? encounter.version_details.some((vd) => vd.version.name === selectedGameId)
                      : true // 게임이 선택되지 않은 경우 모두 표시
                );

                if (filteredEncounters.length === 0) {
                  return (
                    <div className="text-muted-foreground text-xs">
                      선택된 게임 버전에서는 야생에서 포획할 수 없습니다.
                    </div>
                  );
                }

                return (
                  <>
                    <h4 className="text-xs font-medium text-muted-foreground">야생에서 포획</h4>
                    <div className="space-y-2">
                      {filteredEncounters.slice(0, 5).map((encounter) => {
                        // 선택된 버전에 맞는 version_detail 찾기
                        const versionDetail = selectedGameId
                          ? encounter.version_details.find(
                              (vd) => vd.version.name === selectedGameId
                            )
                          : encounter.version_details[0];

                        if (!versionDetail) return null;

                        return (
                          <div key={encounter.location_area.name} className="flex flex-col">
                            <span className="capitalize text-xs font-medium">
                              {encounter.location_area.name
                                .replace(/-/g, " ")
                                .replace(/_/g, " ")
                                .replace(/\barea\b/g, "") // "area" 단어 제거
                                .replace(/\s+/g, " ") // 연속된 공백 정리
                                .trim()}
                            </span>
                            <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                              {versionDetail.encounter_details.slice(0, 2).map((detail, idx) => {
                                const methodName = detail.method.name.replace(/-/g, " ");
                                const displayMethod =
                                  methodName === "gift"
                                    ? "선물"
                                    : methodName === "walk"
                                    ? "걸어서"
                                    : methodName === "surf"
                                    ? "서핑"
                                    : methodName === "fish"
                                    ? "낚시"
                                    : methodName === "headbutt"
                                    ? "나무 흔들기"
                                    : methodName === "rock smash"
                                    ? "바위 부수기"
                                    : methodName === "dark grass"
                                    ? "풀숲(어두운)"
                                    : methodName === "grass"
                                    ? "풀숲"
                                    : methodName === "cave"
                                    ? "동굴"
                                    : methodName;
                                return (
                                  <span key={idx}>
                                    {displayMethod} (Lv.{detail.min_level}-{detail.max_level},{" "}
                                    {detail.chance}%)
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="text-muted-foreground text-xs">야생 출현 정보가 없습니다.</div>
          )}

          {/* Evolution Methods */}
          {previousStages.length > 0 && (
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
                      {index < previousStages.length - 1 && " → "}
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
          )}

          {/* Egg Methods */}
          {species.egg_groups && species.egg_groups.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground">알을 통해 획득</h4>
              <div className="text-xs text-muted-foreground">교배를 통해 알에서 부화 가능</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
