import type { CsvPokemonType } from "@/types/csvTypes";
import { loadCsvData } from "@/lib/csv/parseCsv";

// raw-loader를 사용해서 CSV 파일을 문자열로 정적으로 로드
import pokemonTypesCsv from "@/data/pokemon_types.csv";

export async function loadPokemonTypesCsv(): Promise<CsvPokemonType[]> {
  return loadCsvData<CsvPokemonType>(pokemonTypesCsv, "pokemon_types.csv", (row) => ({
    pokemon_id: Number(row.pokemon_id),
    type_id: Number(row.type_id),
    slot: Number(row.slot),
  }));
}
