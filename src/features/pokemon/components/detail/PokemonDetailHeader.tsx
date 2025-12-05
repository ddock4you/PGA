import { Badge } from "@/components/ui/badge";
import type { PokeApiPokemon, PokeApiPokemonSpecies } from "../../api/pokemonApi";

interface PokemonDetailHeaderProps {
  pokemon: PokeApiPokemon;
  species: PokeApiPokemonSpecies;
  language: string; // 'ko' | 'en'
}

export function PokemonDetailHeader({ pokemon, species, language }: PokemonDetailHeaderProps) {
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
    <header className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
      <div className="relative aspect-square w-32 shrink-0 overflow-hidden rounded-xl border bg-muted sm:w-40">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="h-full w-full object-contain p-2" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col items-center text-center sm:items-start sm:text-left">
        <p className="font-mono text-sm font-medium text-muted-foreground">{formattedId}</p>
        <h1 className="text-2xl font-bold sm:text-3xl">{name}</h1>
        {genus && <p className="text-sm text-muted-foreground">{genus}</p>}

        <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
          {pokemon.types.map((t) => (
            <Badge key={t.type.name} variant="secondary" className="uppercase">
              {t.type.name}
            </Badge>
          ))}
        </div>

        {/* Flavor Text (Use the latest version one found for simplicity) */}
        <div className="mt-4 max-w-md rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
          <FlavorText species={species} language={language} />
        </div>
      </div>
    </header>
  );
}

function FlavorText({ species, language }: { species: PokeApiPokemonSpecies; language: string }) {
  // Filter entries by language
  const entries = species.flavor_text_entries.filter((e) => e.language.name === language);

  // If no entries for language, try English
  const targetEntries =
    entries.length > 0
      ? entries
      : species.flavor_text_entries.filter((e) => e.language.name === "en");

  if (targetEntries.length === 0) return <span>설명이 없습니다.</span>;

  // Pick a random one or the latest one?
  // Usually the last one in the array is from the latest generation in API response (not guaranteed but often true)
  // Or we can just pick one randomly to show variety.
  // Let's pick the one corresponding to the "latest" version if possible, but version list is not ordered.
  // For MVP, just take the first one that matches language to avoid duplicates.

  // Clean up text (remove form feeds etc)
  const cleanText = (text: string) => text.replace(/[\f\n\r]/g, " ");

  return <span>{cleanText(targetEntries[0].flavor_text)}</span>;
}
