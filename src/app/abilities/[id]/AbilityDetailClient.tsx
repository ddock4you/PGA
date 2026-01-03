"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { loadPokemonSpeciesNamesCsv, loadVersionGroupsCsv } from "@/data/csvLoader";
import type { CsvPokemonSpeciesName, CsvVersionGroup } from "@/types/csvTypes";
import { useAbility } from "@/features/abilities/hooks/useAbilitiesQueries";
import { getLocalizedAbilityName } from "@/features/abilities/utils/localization";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

interface AbilityDetailClientProps {
  initialAbility: any;
  abilityId: string;
}

export function AbilityDetailClient({ abilityId }: AbilityDetailClientProps) {
  const router = useRouter();
  const { data: ability, isLoading, isError } = useAbility(abilityId);

  const { data: pokemonSpeciesNamesData = [] } = useQuery<CsvPokemonSpeciesName[]>({
    queryKey: ["dex-csv", "pokemon-species-names"],
    queryFn: loadPokemonSpeciesNamesCsv,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const koreanSpeciesNameMap = useMemo(() => {
    const map = new Map<number, string>();
    pokemonSpeciesNamesData.forEach((entry) => {
      if (entry.local_language_id === 3) {
        map.set(entry.pokemon_species_id, entry.name);
      }
    });
    return map;
  }, [pokemonSpeciesNamesData]);

  const { data: versionGroupsData = [] } = useQuery<CsvVersionGroup[]>({
    queryKey: ["dex-csv", "version-groups"],
    queryFn: loadVersionGroupsCsv,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const versionGroupRankMap = useMemo(() => {
    const map: Record<string, number> = {};
    versionGroupsData.forEach((group) => {
      map[group.identifier] = group.id;
    });
    return map;
  }, [versionGroupsData]);

  // 포켓몬 URL에서 종족 ID 추출 → 한국어 이름 매핑
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

  // 로딩/에러 상태 핸들링
  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">특성 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (isError || !ability) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-destructive">특성 정보를 불러오지 못했습니다.</p>
        <Button variant="outline" onClick={() => router.back()}>
          뒤로 가기
        </Button>
      </div>
    );
  }

  // Effect entries 중 한국어/영어를 우선으로 하는 설명 텍스트 추출
  const getEffectText = (entries: typeof ability.effect_entries) => {
    const ko = entries.find((e) => e.language.name === "ko");
    const en = entries.find((e) => e.language.name === "en");
    return {
      effect: ko?.effect || en?.effect || "-",
      short_effect: ko?.short_effect || en?.short_effect || "-",
    };
  };

  const { effect } = getEffectText(ability.effect_entries);
  const abilityDisplayName = getLocalizedAbilityName(ability);
  // 한국어 flavor_text_entries 중 가장 최신 버전그룹 선택
  const flavorTextEntry =
    ability.flavor_text_entries
      .filter((entry) => entry.language.name === "ko")
      .reduce<(typeof ability.flavor_text_entries)[0] | undefined>((chosen, entry) => {
        const currentRank = versionGroupRankMap[entry.version_group.name] ?? -1;
        const chosenRank = chosen ? versionGroupRankMap[chosen.version_group.name] ?? -1 : -1;
        if (!chosen || currentRank >= chosenRank) {
          return entry;
        }
        return chosen;
      }, undefined) ?? undefined;
  const flavorText = flavorTextEntry?.flavor_text;

  // 메인 렌더링: 헤더, 상세 카드, 포켓몬 목록 순서
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="-ml-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <span className="text-sm font-medium text-muted-foreground">특성 상세</span>
      </div>

      <header>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{abilityDisplayName}</h1>
          <Badge variant={ability.is_main_series ? "default" : "secondary"}>
            {ability.is_main_series ? "본가 시리즈" : "외전"}
          </Badge>
          <Badge variant="outline">{ability.generation.name}</Badge>
        </div>
        {/* <p className="text-muted-foreground text-sm mt-1">{short_effect}</p> */}
      </header>

      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">효과 상세</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{flavorText ?? effect}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">보유 포켓몬 ({ability.pokemon.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {ability.pokemon.map((p) => {
                const displayName = getPokemonDisplayName(p.pokemon);
                return (
                  <Badge
                    key={p.pokemon.name}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => {
                      // 포켓몬 ID 추출 시도
                      const match = p.pokemon.url.match(/\/pokemon\/(\d+)\//);
                      if (match) {
                        router.push(`/dex/${match[1]}`);
                      }
                    }}
                  >
                    {displayName} {p.is_hidden && "(숨겨진 특성)"}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
