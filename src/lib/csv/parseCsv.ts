import Papa from "papaparse";

// CSV 텍스트를 파싱하는 공통 유틸
export async function loadCsvData<T>(
  csvText: string,
  filename: string,
  transformRow?: (row: Record<string, unknown>) => T
): Promise<T[]> {
  return new Promise((resolve) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results: Papa.ParseResult<unknown>) => {
        if (results.errors.length > 0) {
          console.warn(`CSV parsing warnings for ${filename}:`, results.errors);
        }

        const data = results.data as Record<string, unknown>[];
        const transformedData = transformRow ? data.map(transformRow) : (data as T[]);
        resolve(transformedData);
      },
    });
  });
}
