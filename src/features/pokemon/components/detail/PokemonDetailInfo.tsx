import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePreferences } from "@/features/preferences/PreferencesContext";
import { GENERATION_GAME_MAPPING } from "@/features/generation/constants/generationData";
import type { PokeApiPokemon, PokeApiPokemonSpecies } from "../../api/pokemonApi";

interface PokemonDetailInfoProps {
  pokemon: PokeApiPokemon;
  species: PokeApiPokemonSpecies;
}

export function PokemonDetailInfo({ pokemon, species }: PokemonDetailInfoProps) {
  const { state } = usePreferences();
  const selectedGameId = state.selectedGameId;

  const evYields = pokemon.stats
    .filter((s) => s.effort > 0)
    .map((s) => `${s.stat.name} +${s.effort}`);

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
          {pokemon.abilities.map((a) => (
            <div key={a.ability.name} className="flex items-center justify-between">
              <Link
                to={`/abilities/${a.ability.name}`}
                className="capitalize text-primary hover:underline"
              >
                {a.ability.name.replace("-", " ")}
              </Link>
              {a.is_hidden && <Badge variant="outline">숨겨진 특성</Badge>}
            </div>
          ))}
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
                  {g.name}
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
            <span className="capitalize">{species.growth_rate?.name.replace("-", " ") ?? "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">노력치(EV)</span>
            <div className="flex flex-col items-end">
              {evYields.length > 0
                ? evYields.map((ev) => (
                    <span key={ev} className="text-xs capitalize">
                      {ev}
                    </span>
                  ))
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
              .map((item) => (
                <div key={item.itemName} className="flex items-center justify-between">
                  <span className="capitalize">{item.itemName.replace("-", " ")}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{item.rarity}%</span>
                    {item.versionName && selectedGameId && item.versionName !== selectedGameId && (
                      <Badge variant="outline" className="text-xs">
                        {item.versionName}
                      </Badge>
                    )}
                  </div>
                </div>
              ))
          ) : (
            <div className="text-muted-foreground">없음</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
