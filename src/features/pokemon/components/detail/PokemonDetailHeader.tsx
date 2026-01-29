import { useLayoutEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { usePreferences } from "@/features/preferences";
import { GameGenerationSelector } from "@/features/generation/components/GameGenerationSelector";
import { GENERATION_VERSION_GROUP_MAP } from "@/features/generation/constants/generationData";
import type { PokeApiPokemon, PokeApiPokemonSpecies } from "../../types/pokeApiTypes";
import { getPokemonDisplayName } from "@/features/pokemon/utils/pokemonDisplayName";

interface PokemonDetailHeaderProps {
  pokemon: PokeApiPokemon;
  species: PokeApiPokemonSpecies;
  language: string; // 'ko' | 'en'
}

export function PokemonDetailHeader({ pokemon, species, language }: PokemonDetailHeaderProps) {
  const { setSelectedGenerationId, setSelectedGameId, setSelectedVersionGroup } = usePreferences();
  const headerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const element = headerRef.current;
    if (!element) return;

    const updateHeight = () => {
      const height = element.offsetHeight;
      document.documentElement.style.setProperty("--header-height", `${height}px`);
    };

    // 초기 높이 설정
    updateHeight();

    // ResizeObserver로 변경 감지
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, [pokemon, species, language]);

  // Find name in current language, fallback to English or API name
  const name = getPokemonDisplayName(pokemon, species, language);

  // Find genus (classification)
  const genusObj = species.genera.find((g) => g.language.name === language);
  const genus = genusObj ? genusObj.genus : "";

  // Format ID
  const formattedId = `No.${pokemon.id.toString().padStart(4, "0")}`;

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-10 flex flex-col gap-6 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
    >
      {/* 상단 컨트롤 및 타이틀 행 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="w-full sm:w-[180px]">
          <GameGenerationSelector
            variant="compact"
            showGenerationOnly={false}
            onGenerationSelect={(generationId, version) => {
              setSelectedGenerationId(generationId);
              if (version) {
                setSelectedGameId(version.id);
                setSelectedVersionGroup(version.versionGroup);
              } else {
                setSelectedGameId(null);
                setSelectedVersionGroup(GENERATION_VERSION_GROUP_MAP[generationId] ?? null);
              }
            }}
          />
        </div>

        <div className="flex flex-1 flex-wrap items-center gap-3">
          <span className="font-mono text-sm text-muted-foreground">{formattedId}</span>
          <h1 className="text-2xl font-bold sm:text-3xl">{name}</h1>
          {genus && <span className="text-sm text-muted-foreground">({genus})</span>}

          <div className="flex gap-2 ml-auto sm:ml-4">
            {pokemon.types.map((t) => (
              <Badge
                key={t.type.name}
                variant="secondary"
                className="uppercase text-base px-3 py-1"
              >
                {t.type.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
