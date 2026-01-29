"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTypeChart } from "@/features/pokemonTypes/hooks/useTypeChart";
import { isTypeChartId } from "@/features/pokemonTypes/model/typeChart";
import { TypeChartPlayground } from "./TypeChartPlayground";

export function TypeChartViewer() {
  const { chartId, chartLabel, setChartId, availableCharts, typeNames, getMultiplier } =
    useTypeChart();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">표 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="text-sm font-medium">기준 타입표</div>
              <div className="text-xs text-muted-foreground">현재: {chartLabel}</div>
            </div>

            <Select
              value={chartId}
              onValueChange={(v) => {
                if (isTypeChartId(v)) setChartId(v);
              }}
            >
              <SelectTrigger className="w-full sm:w-[260px]">
                <SelectValue placeholder="타입표 선택" />
              </SelectTrigger>
              <SelectContent>
                {availableCharts.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <TypeChartPlayground typeNames={typeNames} getMultiplier={getMultiplier} />
    </div>
  );
}
