import type { CsvNature } from "@/types/csvTypes";
import { loadCsvData } from "@/lib/csv/parseCsv";

// raw-loader를 사용해서 CSV 파일을 문자열로 정적으로 로드
import naturesCsv from "@/data/natures.csv";

export async function loadNaturesCsv(): Promise<CsvNature[]> {
  return loadCsvData<CsvNature>(naturesCsv, "natures.csv", (row) => ({
    id: Number(row.id),
    identifier: row.identifier as string,
    decreased_stat_id: Number(row.decreased_stat_id),
    increased_stat_id: Number(row.increased_stat_id),
    hates_flavor_id: Number(row.hates_flavor_id),
    likes_flavor_id: Number(row.likes_flavor_id),
    game_index: Number(row.game_index),
  }));
}
