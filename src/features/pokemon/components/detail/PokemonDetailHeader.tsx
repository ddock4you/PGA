import { useLayoutEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { usePreferences } from "@/features/preferences";
import { GameGenerationSelector } from "@/features/generation/components/GameGenerationSelector";
import { GENERATION_VERSION_GROUP_MAP } from "@/features/generation/constants/generationData";
import type { PokeApiPokemon, PokeApiPokemonSpecies } from "../../api/pokemonApi";

// 변형 포켓몬의 표시 이름 생성 헬퍼 함수
function getPokemonDisplayName(
  pokemon: PokeApiPokemon,
  species: PokeApiPokemonSpecies,
  language: string
): string {
  // 변형 포켓몬인지 확인 (mega, gmax, regional variants 등)
  const isVariant =
    pokemon.name.includes("-mega") ||
    pokemon.name.includes("-gmax") ||
    pokemon.name.includes("-galar") ||
    pokemon.name.includes("-alola") ||
    pokemon.name.includes("-hisui") ||
    pokemon.name.includes("-paldea");

  if (isVariant) {
    // 기본 species 이름 찾기
    const localNameObj = species.names.find((n) => n.language.name === language);
    const baseName = localNameObj ? localNameObj.name : species.name;

    // 변형 접미사 생성
    let suffix = "";
    if (pokemon.name.includes("-mega-x")) {
      suffix = language === "ko" ? "메가 X" : "Mega X";
    } else if (pokemon.name.includes("-mega-y")) {
      suffix = language === "ko" ? "메가 Y" : "Mega Y";
    } else if (pokemon.name.includes("-mega")) {
      suffix = language === "ko" ? "메가" : "Mega";
    } else if (pokemon.name.includes("-gmax")) {
      suffix = language === "ko" ? "거다이맥스" : "Gigantamax";
    } else if (pokemon.name.includes("-galar")) {
      suffix = language === "ko" ? "갈라르" : "Galarian";
    } else if (pokemon.name.includes("-alola")) {
      suffix = language === "ko" ? "알로라" : "Alolan";
    } else if (pokemon.name.includes("-hisui")) {
      suffix = language === "ko" ? "히스이" : "Hisuian";
    } else if (pokemon.name.includes("-paldea")) {
      suffix = language === "ko" ? "팔데아" : "Paldean";
    }

    // 리전 폼의 경우 접미사 위치 조정
    if (
      suffix &&
      ["Galarian", "Alolan", "Hisuian", "Paldean", "갈라르", "알로라", "히스이", "팔데아"].includes(
        suffix
      )
    ) {
      return `${suffix} ${baseName}`;
    } else if (suffix) {
      return `${baseName} ${suffix}`;
    }
  }

  // 기본 포켓몬의 경우 기존 로직 사용
  const localNameObj = species.names.find((n) => n.language.name === language);
  return localNameObj ? localNameObj.name : pokemon.name;
}

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
