import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PokeApiPokemon, PokeApiPokemonSpecies } from "../../api/pokemonApi";

interface PokemonDetailInfoProps {
  pokemon: PokeApiPokemon;
  species: PokeApiPokemonSpecies;
}

export function PokemonDetailInfo({ pokemon, species }: PokemonDetailInfoProps) {
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
              <span className="capitalize">{a.ability.name.replace("-", " ")}</span>
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
            pokemon.held_items.map((item) => (
              <div key={item.item.name} className="flex items-center justify-between">
                <span className="capitalize">{item.item.name.replace("-", " ")}</span>
                {/* Show aggregated rarity across versions or simple list? Just simple for now */}
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
