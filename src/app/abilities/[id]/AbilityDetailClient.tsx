"use client";

import { useMemo, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDexCsvData } from "@/hooks/useDexCsvData";
import { useAbilityNameResolver } from "@/features/abilities/hooks/useAbilityNameResolver";
import { usePokemonArtwork } from "@/hooks/usePokemonArtwork";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left";
import type { Ability, AbilityEffectEntry } from "@/types/pokeapi";

interface AbilityDetailClientProps {
  ability: Ability;
}

const getPokemonDisplayName = (
  koreanSpeciesNameMap: Map<number, string>
) => (pokemon: { name: string; url: string }) => {
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

const getEffectText = (entries: AbilityEffectEntry[]) => {
  const ko = entries.find((e) => e.language.name === "ko");
  const en = entries.find((e) => e.language.name === "en");
  return {
    effect: ko?.effect || en?.effect || "-",
    short_effect: ko?.short_effect || en?.short_effect || "-",
  };
};

export function AbilityDetailClient({ ability }: AbilityDetailClientProps) {
  const router = useRouter();

  const { pokemonSpeciesNamesData, versionGroupsData } = useDexCsvData();

  const koreanSpeciesNameMap = useMemo(() => {
    const map = new Map<number, string>();
    pokemonSpeciesNamesData.forEach((entry) => {
      if (entry.local_language_id === 3) {
        map.set(entry.pokemon_species_id, entry.name);
      }
    });
    return map;
  }, [pokemonSpeciesNamesData]);

  const versionGroupRankMap = useMemo(() => {
    const map = new Map<string, number>();
    versionGroupsData.forEach((group) => {
      map.set(group.identifier, group.id);
    });
    return map;
  }, [versionGroupsData]);

  const { getArtworkUrl } = usePokemonArtwork();
  const { getAbilityName } = useAbilityNameResolver();
  const { effect } = getEffectText(ability.effect_entries);
  const abilityDisplayName = getAbilityName(ability);

  const getLatestFlavorText = useCallback(() => {
    const koEntries = ability.flavor_text_entries.filter(
      (entry) => entry.language.name === "ko"
    );

    if (koEntries.length === 0) return null;

    return koEntries.reduce((latest, entry) => {
      const latestRank = latest ? versionGroupRankMap.get(latest.version_group.name) ?? -1 : -1;
      const currentRank = versionGroupRankMap.get(entry.version_group.name) ?? -1;
      return currentRank > latestRank ? entry : latest;
    });
  }, [ability.flavor_text_entries, versionGroupRankMap]);

  const flavorText = getLatestFlavorText()?.flavor_text;

  const handlePokemonClick = useCallback((targetId: string | null) => {
    if (targetId) {
      router.push(`/dex/${targetId}`);
    }
  }, [router]);

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
                const displayName = getPokemonDisplayName(koreanSpeciesNameMap)(p.pokemon);
                const portrait = getArtworkUrl(p.pokemon);
                const match = p.pokemon.url.match(/\/pokemon\/(\d+)\//);
                const targetId = match ? match[1] : null;
                return (
                  <Badge
                    key={p.pokemon.name}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handlePokemonClick(targetId)}
                  >
                    <div className="flex items-center gap-2">
                      {portrait && (
                        <span className="h-8 w-8 overflow-hidden rounded-full bg-muted/50">
                          <Image src={portrait} alt={displayName} width={32} height={32} />
                        </span>
                      )}
                      <span>
                        {displayName} {p.is_hidden && "(숨겨진 특성)"}
                      </span>
                    </div>
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
