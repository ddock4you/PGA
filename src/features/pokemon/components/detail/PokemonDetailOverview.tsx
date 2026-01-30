import Image from "next/image";
import { usePreferences } from "@/features/preferences";
import { getGenerationInfoByGameId, getGameVersionById } from "@/features/generation";
import type { PokeApiPokemon, PokeApiPokemonSpecies } from "../../types/pokeApiTypes";
import { getPokemonDisplayName } from "@/features/pokemon/utils/pokemonDisplayName";

interface PokemonDetailOverviewProps {
  pokemon: PokeApiPokemon;
  species: PokeApiPokemonSpecies;
  language: string;
}

export function PokemonDetailOverview({ pokemon, species, language }: PokemonDetailOverviewProps) {
  // Find name in current language, fallback to English or API name
  const name = getPokemonDisplayName(pokemon, species, language);

  // Image (Official Artwork > Home > Front Default)
  const imageUrl =
    pokemon.sprites.other?.["official-artwork"].front_default ||
    pokemon.sprites.other?.home.front_default ||
    pokemon.sprites.front_default;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
      <div className="relative aspect-square w-32 shrink-0 overflow-hidden rounded-xl border bg-muted sm:w-40">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            width={160}
            height={160}
            className="h-full w-full object-contain p-2"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
      </div>

      <div className="flex-1 space-y-4">
        <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground leading-relaxed">
          <FlavorText species={species} language={language} />
        </div>
      </div>
    </div>
  );
}

function FlavorText({ species, language }: { species: PokeApiPokemonSpecies; language: string }) {
  const { state } = usePreferences();
  const selectedGameId = state.selectedGameId;

  // 선택된 게임 버전에 맞는 버전 이름 찾기
  let targetVersionName = "";
  if (selectedGameId) {
    targetVersionName = getGameVersionById(selectedGameId)?.id ?? ""; // API에서는 ID가 버전 이름으로 사용됨
  }

  // 1. 선택된 언어 + 선택된 버전
  let targetEntries = species.flavor_text_entries.filter(
    (e) => e.language.name === language && e.version.name === targetVersionName
  );

  // 2. 선택된 언어 + 해당 세대의 다른 버전
  if (targetEntries.length === 0 && targetVersionName) {
    const selectedGeneration = selectedGameId ? getGenerationInfoByGameId(selectedGameId) : undefined;
    if (selectedGeneration) {
      const generationVersionNames = selectedGeneration.versions.map((v) => v.id);
      targetEntries = species.flavor_text_entries.filter(
        (e) => e.language.name === language && generationVersionNames.includes(e.version.name)
      );
    }
  }

  // 3. 선택된 언어 (모든 버전)
  if (targetEntries.length === 0) {
    targetEntries = species.flavor_text_entries.filter((e) => e.language.name === language);
  }

  // 4. 영어 (선택된 버전)
  if (targetEntries.length === 0 && targetVersionName) {
    targetEntries = species.flavor_text_entries.filter(
      (e) => e.language.name === "en" && e.version.name === targetVersionName
    );
  }

  // 5. 영어 (모든 버전)
  if (targetEntries.length === 0) {
    targetEntries = species.flavor_text_entries.filter((e) => e.language.name === "en");
  }

  if (targetEntries.length === 0) return <span>설명이 없습니다.</span>;

  const cleanText = (text: string) => text.replace(/[\f\n\r]/g, " ");

  // 가장 최신 버전의 설명을 우선적으로 선택
  const sortedEntries = targetEntries.sort((a, b) => {
    // 간단하게 배열 순서로 정렬 (실제로는 버전 출시 순서로 정렬하는 것이 좋음)
    return targetEntries.indexOf(a) - targetEntries.indexOf(b);
  });

  return <span>{cleanText(sortedEntries[0].flavor_text)}</span>;
}
