import type { CsvMove, CsvMoveName } from "@/types/csvTypes";
import { loadCsvData } from "@/lib/csv/parseCsv";

// raw-loader를 사용해서 CSV 파일을 문자열로 정적으로 로드
import movesCsv from "@/data/moves.csv";
import moveNamesCsv from "@/data/move_names.csv";

export async function loadMovesCsv(): Promise<CsvMove[]> {
  return loadCsvData<CsvMove>(movesCsv, "moves.csv", (row) => ({
    id: Number(row.id),
    identifier: row.identifier as string,
    generation_id: Number(row.generation_id),
    type_id: Number(row.type_id),
    power: row.power === "" ? null : Number(row.power),
    pp: Number(row.pp),
    accuracy: row.accuracy === "" ? null : Number(row.accuracy),
    priority: Number(row.priority),
    target_id: Number(row.target_id),
    damage_class_id: Number(row.damage_class_id),
    effect_id: Number(row.effect_id),
    effect_chance: row.effect_chance === "" ? null : Number(row.effect_chance),
    contest_type_id: row.contest_type_id === "" ? null : Number(row.contest_type_id),
    contest_effect_id: row.contest_effect_id === "" ? null : Number(row.contest_effect_id),
    super_contest_effect_id:
      row.super_contest_effect_id === "" ? null : Number(row.super_contest_effect_id),
  }));
}

export async function loadMoveNamesCsv(): Promise<CsvMoveName[]> {
  return loadCsvData<CsvMoveName>(moveNamesCsv, "move_names.csv", (row) => ({
    move_id: Number(row.move_id),
    local_language_id: Number(row.local_language_id),
    name: row.name as string,
  }));
}
