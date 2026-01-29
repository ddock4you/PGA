import type { NamedAPIResource } from "@/types/pokeapi";
import { getTypeChart, type TypeChartId, type TypeNameEn } from "./typeChart";

// 앱 내부 상성 계산을 위한 타입 리소스 형태(기존 호환용)
export interface PokeApiType {
  id: number;
  name: string;
  damage_relations: {
    double_damage_to: NamedAPIResource[];
    half_damage_to: NamedAPIResource[];
    no_damage_to: NamedAPIResource[];
    double_damage_from: NamedAPIResource[];
    half_damage_from: NamedAPIResource[];
    no_damage_from: NamedAPIResource[];
  };
}

function toNamedResources(names: TypeNameEn[]): NamedAPIResource[] {
  // URL은 현재 사용하지 않으므로 빈 문자열로 둔다.
  return names.map((name) => ({ name, url: "" }));
}

const STATIC_TYPES_BY_CHART: Record<TypeChartId, PokeApiType[]> = {
  gen6plus: [],
  gen2to5: [],
  gen1: [],
};

function buildStaticTypes(chartId: TypeChartId): PokeApiType[] {
  const chart = getTypeChart(chartId);

  return chart.typeNames.map((name, index) => {
    const rel = chart.damageRelations[name];
    return {
      id: index + 1,
      name,
      damage_relations: {
        double_damage_to: toNamedResources(rel.double_damage_to as TypeNameEn[]),
        half_damage_to: toNamedResources(rel.half_damage_to as TypeNameEn[]),
        no_damage_to: toNamedResources(rel.no_damage_to as TypeNameEn[]),
        double_damage_from: [],
        half_damage_from: [],
        no_damage_from: [],
      },
    };
  });
}

for (const chartId of Object.keys(STATIC_TYPES_BY_CHART) as TypeChartId[]) {
  STATIC_TYPES_BY_CHART[chartId] = buildStaticTypes(chartId);
}

/**
 * 앱에서 사용하는 "실전 타입" 정적 데이터.
 * 네트워크 요청 없이 세대별 타입 상성 규칙을 기반으로 생성한다.
 */
export function getAllTypesStatic(chartId: TypeChartId = "gen6plus"): PokeApiType[] {
  return STATIC_TYPES_BY_CHART[chartId];
}
