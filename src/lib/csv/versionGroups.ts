import type { CsvVersionGroup } from "@/types/csvTypes";
import { loadCsvData } from "@/lib/csv/parseCsv";

// raw-loader를 사용해서 CSV 파일을 문자열로 정적으로 로드
import versionGroupsCsv from "@/data/version_groups.csv";

export async function loadVersionGroupsCsv(): Promise<CsvVersionGroup[]> {
  return loadCsvData<CsvVersionGroup>(versionGroupsCsv, "version_groups.csv", (row) => ({
    id: Number(row.id),
    identifier: row.identifier as string,
    generation_id: Number(row.generation_id),
    order: Number(row.order),
  }));
}
