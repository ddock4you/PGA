import type { CsvMachine } from "@/types/csvTypes";
import { loadCsvData } from "@/lib/csv/parseCsv";

// raw-loader를 사용해서 CSV 파일을 문자열로 정적으로 로드
import machinesCsv from "@/data/machines.csv";

export async function loadMachinesCsv(): Promise<CsvMachine[]> {
  return loadCsvData<CsvMachine>(machinesCsv, "machines.csv", (row) => ({
    machine_number: Number(row.machine_number),
    version_group_id: Number(row.version_group_id),
    item_id: Number(row.item_id),
    move_id: Number(row.move_id),
  }));
}
