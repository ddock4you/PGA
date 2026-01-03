"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useDexCsvData } from "@/hooks/useDexCsvData";
import { useLocalizedMoveName } from "@/hooks/useLocalizedMoveName";
import { usePokemonArtwork } from "@/hooks/usePokemonArtwork";

type MoveEffectEntry = {
  language: { name: string };
  effect?: string;
  short_effect?: string;
};

type MoveFlavorTextEntry = MoveEffectEntry & {
  version_group: { name: string };
  flavor_text: string;
};

type LearnedPokemonEntry = {
  name: string;
  url: string;
};

interface MoveDetailClientProps {
  move: any;
}

export function MoveDetailClient({ move }: MoveDetailClientProps) {
  const router = useRouter();

  const { pokemonSpeciesNamesData, versionGroupsData } = useDexCsvData();
  const { getLocalizedMoveName } = useLocalizedMoveName();
  const { getArtworkUrl } = usePokemonArtwork();

  const versionGroupRankMap = useMemo(() => {
    const map: Record<string, number> = {};
    versionGroupsData.forEach((group) => {
      map[group.identifier] = group.id;
    });
    return map;
  }, [versionGroupsData]);

  const koreanSpeciesNameMap = useMemo(() => {
    const map = new Map<number, string>();
    pokemonSpeciesNamesData.forEach((entry) => {
      if (entry.local_language_id === 3) {
        map.set(entry.pokemon_species_id, entry.name);
      }
    });
    return map;
  }, [pokemonSpeciesNamesData]);

  const getPokemonDisplayName = (pokemon: { name: string; url: string }) => {
    const match = pokemon.url.match(/\/pokemon\/(\d+)\//);
    if (!match) {
      return pokemon.name;
    }
    const speciesId = Number(match[1]);
    if (Number.isNaN(speciesId)) {
      return pokemon.name;
    }
    return koreanSpeciesNameMap.get(speciesId) ?? pokemon.name;
  };

  const getEffectText = (entries: MoveEffectEntry[]) => {
    const ko = entries.find((e) => e.language.name === "ko");
    const en = entries.find((e) => e.language.name === "en");
    return {
      effect: ko?.effect || en?.effect || "-",
      short_effect: ko?.short_effect || en?.short_effect || "-",
    };
  };

  const { effect, short_effect } = getEffectText(move.effect_entries);

  const KOREAN_UNUSABLE_TEXT = "사용할 수 없는 기술입니다.";
  const flavorTextEntries = move.flavor_text_entries as MoveFlavorTextEntry[];

  const sortedFlavorTextEntries = flavorTextEntries
    .filter((entry) => entry.language.name === "ko")
    .slice()
    .sort(
      (a, b) =>
        (versionGroupRankMap[b.version_group.name] ?? -1) -
        (versionGroupRankMap[a.version_group.name] ?? -1)
    );
  const flavorTextEntry =
    sortedFlavorTextEntries.find((entry) => !entry.flavor_text.includes(KOREAN_UNUSABLE_TEXT)) ??
    sortedFlavorTextEntries[0];
  const flavorText = flavorTextEntry?.flavor_text;

  const localizedMoveName = getLocalizedMoveName(move.name);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="-ml-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <span className="text-sm font-medium text-muted-foreground">기술 상세</span>
      </div>

      <header>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{localizedMoveName}</h1>
          <Badge>{move.type.name}</Badge>
          <Badge variant="outline">{move.damage_class.name}</Badge>
        </div>
        <p className="text-muted-foreground text-sm mt-1">{short_effect}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">위력</span>
              <span className="font-medium">{move.power ?? "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">명중률</span>
              <span className="font-medium">{move.accuracy ?? "-"}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">PP</span>
              <span className="font-medium">{move.pp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">우선도</span>
              <span className="font-medium">{move.priority}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">대상</span>
              <span className="font-medium">API 확인 필요</span>
            </div>
          </CardContent>
        </Card>

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
            <CardTitle className="text-base">도감 설명</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{flavorText ?? effect}</p>
          </CardContent>
        </Card>

        {move.learned_by_pokemon && move.learned_by_pokemon.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                배울 수 있는 포켓몬 ({move.learned_by_pokemon.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(move.learned_by_pokemon as LearnedPokemonEntry[]).map((entry) => {
                  const displayName = getPokemonDisplayName(entry);
                  const portrait = getArtworkUrl(entry);
                  const match = entry.url.match(/\/pokemon\/(\d+)\//);
                  const targetId = match ? match[1] : null;
                  return (
                    <Badge
                      key={entry.name}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => {
                        if (targetId) {
                          router.push(`/dex/${targetId}`);
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {portrait && (
                          <span className="h-8 w-8 overflow-hidden rounded-full bg-muted/50">
                            <Image src={portrait} alt={displayName} width={32} height={32} />
                          </span>
                        )}
                        <span>{displayName}</span>
                      </div>
                    </Badge>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {move.meta && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">메타 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">상태이상</span>
                <span className="font-medium">{move.meta.ailment.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">카테고리</span>
                <span className="font-medium">{move.meta.category.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">급소율</span>
                <span className="font-medium">{move.meta.crit_rate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">드레인</span>
                <span className="font-medium">{move.meta.drain}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">플린치 확률</span>
                <span className="font-medium">{move.meta.flinch_chance}%</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
