import type { PokeApiPokemon, PokeApiPokemonSpecies } from "@/features/pokemon/types/pokeApiTypes";

const REGIONAL_SUFFIXES = new Set(["Galarian", "Alolan", "Hisuian", "Paldean", "갈라르", "알로라", "히스이", "팔데아"]);

export function getPokemonDisplayName(
  pokemon: PokeApiPokemon,
  species: PokeApiPokemonSpecies,
  language: string
): string {
  const isVariant =
    pokemon.name.includes("-mega") ||
    pokemon.name.includes("-gmax") ||
    pokemon.name.includes("-galar") ||
    pokemon.name.includes("-alola") ||
    pokemon.name.includes("-hisui") ||
    pokemon.name.includes("-paldea");

  if (isVariant) {
    const localNameObj = species.names.find((n) => n.language.name === language);
    const baseName = localNameObj ? localNameObj.name : species.name;

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

    if (suffix) {
      return REGIONAL_SUFFIXES.has(suffix) ? `${suffix} ${baseName}` : `${baseName} ${suffix}`;
    }
  }

  const localNameObj = species.names.find((n) => n.language.name === language);
  return localNameObj ? localNameObj.name : pokemon.name;
}
