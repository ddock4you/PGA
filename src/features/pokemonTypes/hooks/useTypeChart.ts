"use client";

import { useCallback, useMemo } from "react";
import { usePreferences } from "@/features/preferences";
import { getAllTypesStatic } from "@/features/pokemonTypes/model/typeData";
import {
  getTypeChart,
  isTypeChartId,
  TYPE_CHART_LABELS,
  type TypeChartId,
} from "@/features/pokemonTypes/model/typeChart";
import { buildTypeMap, computeAttackMultiplier } from "@/features/pokemonTypes/utils/typeEffectiveness";

export interface UseTypeChartResult {
  chartId: TypeChartId;
  chartLabel: string;
  typeNames: string[];
  getMultiplier: (attackType: string, defenderTypes: string[]) => number;
  setChartId: (next: TypeChartId) => void;
  availableCharts: Array<{ id: TypeChartId; label: string }>;
}

export function useTypeChart(): UseTypeChartResult {
  const { state, setTypeChartId } = usePreferences();
  const chartId = isTypeChartId(state.typeChartId) ? state.typeChartId : "gen6plus";

  const setChartId = useCallback(
    (next: TypeChartId) => {
      setTypeChartId(next);
    },
    [setTypeChartId]
  );

  const chartLabel = TYPE_CHART_LABELS[chartId];
  const typeNames = useMemo(() => {
    const chart = getTypeChart(chartId);
    return [...chart.typeNames];
  }, [chartId]);

  const typeMap = useMemo(() => {
    const types = getAllTypesStatic(chartId);
    return buildTypeMap(types);
  }, [chartId]);

  const getMultiplier = useCallback(
    (attackType: string, defenderTypes: string[]) => {
      return computeAttackMultiplier(attackType, defenderTypes, typeMap);
    },
    [typeMap]
  );

  const availableCharts = useMemo(() => {
    return (Object.keys(TYPE_CHART_LABELS) as TypeChartId[]).map((id) => ({
      id,
      label: TYPE_CHART_LABELS[id],
    }));
  }, []);

  return {
    chartId,
    chartLabel,
    typeNames,
    getMultiplier,
    setChartId,
    availableCharts,
  };
}
