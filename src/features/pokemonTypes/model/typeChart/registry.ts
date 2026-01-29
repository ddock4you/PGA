import type {
  TypeChartDefinition,
  TypeChartId,
  TypeNameEn,
  TypeNameEnGen1,
  TypeNameEnGen2To5,
} from "./types";
import {
  ALL_TYPE_NAMES_EN_GEN1,
  ALL_TYPE_NAMES_EN_GEN2_TO_5,
  ALL_TYPE_NAMES_EN_GEN6PLUS,
} from "./typeNames";
import { TYPE_DAMAGE_RELATIONS_GEN1 } from "./charts.gen1";
import { TYPE_DAMAGE_RELATIONS_GEN2_TO_5 } from "./charts.gen2to5";
import { TYPE_DAMAGE_RELATIONS_GEN6PLUS } from "./charts.gen6plus";

export const TYPE_CHARTS = {
  gen6plus: {
    id: "gen6plus",
    typeNames: ALL_TYPE_NAMES_EN_GEN6PLUS,
    damageRelations: TYPE_DAMAGE_RELATIONS_GEN6PLUS,
  } satisfies TypeChartDefinition<TypeNameEn>,
  gen2to5: {
    id: "gen2to5",
    typeNames: ALL_TYPE_NAMES_EN_GEN2_TO_5,
    damageRelations: TYPE_DAMAGE_RELATIONS_GEN2_TO_5,
  } satisfies TypeChartDefinition<TypeNameEnGen2To5>,
  gen1: {
    id: "gen1",
    typeNames: ALL_TYPE_NAMES_EN_GEN1,
    damageRelations: TYPE_DAMAGE_RELATIONS_GEN1,
  } satisfies TypeChartDefinition<TypeNameEnGen1>,
} as const;

export function getTypeChart(chartId: TypeChartId): TypeChartDefinition<string> {
  return TYPE_CHARTS[chartId] as unknown as TypeChartDefinition<string>;
}

export function isTypeChartId(value: string): value is TypeChartId {
  return value === "gen6plus" || value === "gen2to5" || value === "gen1";
}

export function isTypeNameEn(value: string): value is TypeNameEn {
  return (ALL_TYPE_NAMES_EN_GEN6PLUS as string[]).includes(value);
}
