import type { CsvPokemonAbility } from "@/types/csvTypes";
import { loadCsvData } from "@/lib/csv/parseCsv";

// raw-loader를 사용해서 CSV 파일을 문자열로 정적으로 로드
import pokemonAbilitiesCsv from "@/data/pokemon_abilities.csv";

export async function loadPokemonAbilitiesCsv(): Promise<CsvPokemonAbility[]> {
  return loadCsvData<CsvPokemonAbility>(pokemonAbilitiesCsv, "pokemon_abilities.csv", (row) => ({
    pokemon_id: Number(row.pokemon_id),
    ability_id: Number(row.ability_id),
    is_hidden: Number(row.is_hidden),
    slot: Number(row.slot),
  }));
}
