import type { CsvAbility, CsvAbilityName } from "@/types/csvTypes";
import { loadCsvData } from "@/lib/csv/parseCsv";

// raw-loader를 사용해서 CSV 파일을 문자열로 정적으로 로드
import abilitiesCsv from "@/data/abilities.csv";
import abilityNamesCsv from "@/data/ability_names.csv";

export async function loadAbilitiesCsv(): Promise<CsvAbility[]> {
  return loadCsvData<CsvAbility>(abilitiesCsv, "abilities.csv", (row) => ({
    id: Number(row.id),
    identifier: row.identifier as string,
    generation_id: Number(row.generation_id),
    is_main_series: Number(row.is_main_series),
  }));
}

export async function loadAbilityNamesCsv(): Promise<CsvAbilityName[]> {
  return loadCsvData<CsvAbilityName>(abilityNamesCsv, "ability_names.csv", (row) => ({
    ability_id: Number(row.ability_id),
    local_language_id: Number(row.local_language_id),
    name: row.name as string,
  }));
}
