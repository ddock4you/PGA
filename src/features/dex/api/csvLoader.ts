import Papa from "papaparse";
import type { CsvPokemon, CsvMove, CsvMachine, CsvNature, CsvItem } from "../types/csvTypes";

// Vite의 ?raw import를 사용해서 CSV 파일들을 정적으로 로드
import pokemonCsv from "../data/pokemon.csv?raw";
import movesCsv from "../data/moves.csv?raw";
import machinesCsv from "../data/machines.csv?raw";
import naturesCsv from "../data/natures.csv?raw";
import itemsCsv from "../data/items.csv?raw";

// CSV 텍스트를 파싱하는 유틸리티 함수
export async function loadCsvData<T>(
  csvText: string,
  filename: string,
  transformRow?: (row: any) => T
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.warn(`CSV parsing warnings for ${filename}:`, results.errors);
        }

        const data = results.data as any[];
        const transformedData = transformRow ? data.map(transformRow) : (data as T[]);

        resolve(transformedData);
      },
      error: (error: any) => {
        reject(new Error(`Failed to parse ${filename}: ${error.message}`));
      },
    });
  });
}

// 각 CSV 파일별 로딩 함수
export async function loadPokemonCsv(): Promise<CsvPokemon[]> {
  return loadCsvData<CsvPokemon>(pokemonCsv, "pokemon.csv", (row) => ({
    id: Number(row.id),
    identifier: row.identifier,
    species_id: Number(row.species_id),
    height: Number(row.height),
    weight: Number(row.weight),
    base_experience: Number(row.base_experience),
    order: Number(row.order),
    is_default: Number(row.is_default),
  }));
}

export async function loadMovesCsv(): Promise<CsvMove[]> {
  return loadCsvData<CsvMove>(movesCsv, "moves.csv", (row) => ({
    id: Number(row.id),
    identifier: row.identifier,
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

export async function loadMachinesCsv(): Promise<CsvMachine[]> {
  return loadCsvData<CsvMachine>(machinesCsv, "machines.csv", (row) => ({
    machine_number: Number(row.machine_number),
    version_group_id: Number(row.version_group_id),
    item_id: Number(row.item_id),
    move_id: Number(row.move_id),
  }));
}

export async function loadNaturesCsv(): Promise<CsvNature[]> {
  return loadCsvData<CsvNature>(naturesCsv, "natures.csv", (row) => ({
    id: Number(row.id),
    identifier: row.identifier,
    decreased_stat_id: Number(row.decreased_stat_id),
    increased_stat_id: Number(row.increased_stat_id),
    hates_flavor_id: Number(row.hates_flavor_id),
    likes_flavor_id: Number(row.likes_flavor_id),
    game_index: Number(row.game_index),
  }));
}

export async function loadItemsCsv(): Promise<CsvItem[]> {
  return loadCsvData<CsvItem>(itemsCsv, "items.csv", (row) => ({
    id: Number(row.id),
    identifier: row.identifier,
    category_id: Number(row.category_id),
    cost: Number(row.cost),
    fling_power: row.fling_power === "" ? null : Number(row.fling_power),
    fling_effect_id: row.fling_effect_id === "" ? null : Number(row.fling_effect_id),
  }));
}
