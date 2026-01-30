import type { CsvPokemon, CsvPokemonSpeciesName } from "@/types/csvTypes";
import { loadCsvData } from "@/lib/csv/parseCsv";

// raw-loader를 사용해서 CSV 파일을 문자열로 정적으로 로드
import pokemonCsv from "@/data/pokemon.csv";
import pokemonSpeciesNamesCsv from "@/data/pokemon_species_names.csv";

export async function loadPokemonCsv(): Promise<CsvPokemon[]> {
  return loadCsvData<CsvPokemon>(pokemonCsv, "pokemon.csv", (row) => ({
    id: Number(row.id),
    identifier: row.identifier as string,
    species_id: Number(row.species_id),
    height: Number(row.height),
    weight: Number(row.weight),
    base_experience: Number(row.base_experience),
    order: Number(row.order),
    is_default: Number(row.is_default),
  }));
}

export async function loadPokemonSpeciesNamesCsv(): Promise<CsvPokemonSpeciesName[]> {
  return loadCsvData<CsvPokemonSpeciesName>(
    pokemonSpeciesNamesCsv,
    "pokemon_species_names.csv",
    (row) => ({
      pokemon_species_id: Number(row.pokemon_species_id),
      local_language_id: Number(row.local_language_id),
      name: row.name as string,
      genus: row.genus as string,
    })
  );
}
