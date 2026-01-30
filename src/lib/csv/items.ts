import type { CsvItem, CsvItemName } from "@/types/csvTypes";
import { loadCsvData } from "@/lib/csv/parseCsv";

// raw-loader를 사용해서 CSV 파일을 문자열로 정적으로 로드
import itemsCsv from "@/data/items.csv";
import itemNamesCsv from "@/data/item_names.csv";

export async function loadItemsCsv(): Promise<CsvItem[]> {
  return loadCsvData<CsvItem>(itemsCsv, "items.csv", (row) => ({
    id: Number(row.id),
    identifier: row.identifier as string,
    category_id: Number(row.category_id),
    cost: Number(row.cost),
    fling_power: row.fling_power === "" ? null : Number(row.fling_power),
    fling_effect_id: row.fling_effect_id === "" ? null : Number(row.fling_effect_id),
  }));
}

export async function loadItemNamesCsv(): Promise<CsvItemName[]> {
  return loadCsvData<CsvItemName>(itemNamesCsv, "item_names.csv", (row) => ({
    item_id: Number(row.item_id),
    local_language_id: Number(row.local_language_id),
    name: row.name as string,
  }));
}
