import type { PokeApiPokemon, PokeApiPokemonSpecies } from "../../api/pokemonApi";

interface PokemonDetailOverviewProps {
  pokemon: PokeApiPokemon;
  species: PokeApiPokemonSpecies;
  language: string;
}

export function PokemonDetailOverview({ pokemon, species, language }: PokemonDetailOverviewProps) {
  // Find name in current language, fallback to English or API name
  const localNameObj = species.names.find((n) => n.language.name === language);
  const name = localNameObj ? localNameObj.name : pokemon.name;

  // Image (Official Artwork > Home > Front Default)
  const imageUrl =
    pokemon.sprites.other?.["official-artwork"].front_default ||
    pokemon.sprites.other?.home.front_default ||
    pokemon.sprites.front_default;

  return (
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
