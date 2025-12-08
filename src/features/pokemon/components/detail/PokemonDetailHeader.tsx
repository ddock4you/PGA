import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePreferences } from "@/features/preferences/PreferencesContext";
import type { PokeApiPokemon, PokeApiPokemonSpecies } from "../../api/pokemonApi";

interface PokemonDetailHeaderProps {
  pokemon: PokeApiPokemon;
  species: PokeApiPokemonSpecies;
  language: string; // 'ko' | 'en'
}

export function PokemonDetailHeader({ pokemon, species, language }: PokemonDetailHeaderProps) {
  const { state, setSelectedGenerationId } = usePreferences();

  // Find name in current language, fallback to English or API name
  const localNameObj = species.names.find((n) => n.language.name === language);
  const name = localNameObj ? localNameObj.name : pokemon.name;

  // Find genus (classification)
  const genusObj = species.genera.find((g) => g.language.name === language);
  const genus = genusObj ? genusObj.genus : "";

  // Format ID
  const formattedId = `No.${pokemon.id.toString().padStart(4, "0")}`;

  // Image (Official Artwork > Home > Front Default)
  const imageUrl =
    pokemon.sprites.other?.["official-artwork"].front_default ||
    pokemon.sprites.other?.home.front_default ||
    pokemon.sprites.front_default;

  return (
    <header className="flex flex-col gap-6">
      {/* 상단 컨트롤 및 타이틀 행 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="w-full sm:w-[180px]">
          <Select
            value={state.selectedGenerationId || "1"}
            onValueChange={(val) => setSelectedGenerationId(val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="세대 선택" />
            </SelectTrigger>
            <SelectContent>
              {/* 1~9세대 하드코딩 (API로 불러올 수도 있음) */}
              {Array.from({ length: 9 }, (_, i) => i + 1).map((gen) => (
                <SelectItem key={gen} value={gen.toString()}>
                  {gen}세대
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

      {/* 이미지 및 설명 섹션 */}
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div className="relative aspect-square w-32 shrink-0 overflow-hidden rounded-xl border bg-muted sm:w-40">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="h-full w-full object-contain p-2" />
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
    </header>
  );
}

function FlavorText({ species, language }: { species: PokeApiPokemonSpecies; language: string }) {
  const entries = species.flavor_text_entries.filter((e) => e.language.name === language);
  const targetEntries =
    entries.length > 0
      ? entries
      : species.flavor_text_entries.filter((e) => e.language.name === "en");

  if (targetEntries.length === 0) return <span>설명이 없습니다.</span>;

  const cleanText = (text: string) => text.replace(/[\f\n\r]/g, " ");

  // 랜덤하게 하나 보여주거나, 가장 최신 버전을 보여주는 것이 좋음
  // 여기서는 첫 번째 항목 사용
  return <span>{cleanText(targetEntries[0].flavor_text)}</span>;
}
