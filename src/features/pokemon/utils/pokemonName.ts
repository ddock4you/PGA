import type { CsvPokemon, CsvPokemonSpeciesName } from "@/types/csvTypes";

export function getKoreanPokemonNameFromCsv(
  speciesNameOrId: string,
  pokemonData: CsvPokemon[],
  pokemonSpeciesNamesData: CsvPokemonSpeciesName[]
): string {
  const idMatch = speciesNameOrId.match(/^\d+$/);
  if (idMatch) {
    const id = Number.parseInt(idMatch[0] ?? "", 10);
    const koreanName = pokemonSpeciesNamesData.find(
      (name) => name.pokemon_species_id === id && name.local_language_id === 3
    )?.name;
    return koreanName ?? speciesNameOrId;
  }

  const pokemonEntry = pokemonData.find((p) => p.identifier === speciesNameOrId);
  if (!pokemonEntry) return speciesNameOrId;

  const koreanName = pokemonSpeciesNamesData.find(
    (name) => name.pokemon_species_id === pokemonEntry.species_id && name.local_language_id === 3
  )?.name;

  return koreanName ?? speciesNameOrId;
}
