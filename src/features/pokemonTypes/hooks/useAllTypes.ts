"use client";

import { useMemo } from "react";
import { getAllTypesStatic } from "@/features/pokemonTypes/model/typeData";
import type { TypeChartId } from "@/features/pokemonTypes/model/typeChart";

export function useAllTypes(chartId: TypeChartId = "gen6plus") {
  const data = useMemo(() => getAllTypesStatic(chartId), [chartId]);
  return { data, isLoading: false, isError: false };
}
