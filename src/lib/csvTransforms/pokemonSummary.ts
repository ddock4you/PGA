import type { CsvPokemon, CsvPokemonSpeciesName, CsvPokemonType } from "@/types/csvTypes";
import { getKoreanTypeNameFromId } from "@/utils/pokemonTypes";

export interface DexPokemonSummary {
  id: number;
  name: string;
  number: string;
  types: string[];
}

export function transformPokemonForDex(
  csvData: CsvPokemon[],
  pokemonTypesData: CsvPokemonType[],
  pokemonSpeciesNamesData: CsvPokemonSpeciesName[]
): DexPokemonSummary[] {
  const koreanNameBySpeciesId = new Map<number, string>();
  for (const row of pokemonSpeciesNamesData) {
    if (row.local_language_id !== 3) continue;
    if (!koreanNameBySpeciesId.has(row.pokemon_species_id)) {
      koreanNameBySpeciesId.set(row.pokemon_species_id, row.name);
    }
  }

  const typeEntriesByPokemonId = new Map<number, { slot: number; type_id: number }[]>();
  for (const row of pokemonTypesData) {
    const existing = typeEntriesByPokemonId.get(row.pokemon_id);
    if (existing) {
      existing.push({ slot: row.slot, type_id: row.type_id });
    } else {
      typeEntriesByPokemonId.set(row.pokemon_id, [{ slot: row.slot, type_id: row.type_id }]);
    }
  }

  const sortedPokemon = [...csvData].sort((a: CsvPokemon, b: CsvPokemon) => {
    const speciesComparison = a.species_id - b.species_id;
    if (speciesComparison !== 0) return speciesComparison;

    const defaultComparison = b.is_default - a.is_default;
    if (defaultComparison !== 0) return defaultComparison;

    return a.id - b.id;
  });

  return sortedPokemon.map((p: CsvPokemon) => {
    const koreanName = koreanNameBySpeciesId.get(p.species_id) ?? p.identifier;

    const typeEntries = typeEntriesByPokemonId.get(p.id);
    const pokemonTypes = typeEntries
      ? typeEntries
          .slice()
          .sort((a, b) => a.slot - b.slot)
          .map((pt) => getKoreanTypeNameFromId(pt.type_id))
      : [];

    return {
      id: p.id,
      name: koreanName,
      number: `No.${p.id.toString().padStart(4, "0")}`,
      types: pokemonTypes,
    };
  });
}
