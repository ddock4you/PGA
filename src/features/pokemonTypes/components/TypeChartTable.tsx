"use client";

import { cn } from "@/lib/utils";
import { getKoreanTypeName } from "@/utils/pokemonTypes";
import { TypeBadge } from "./TypeBadge";

interface TypeChartTableProps {
  typeNames: string[];
  getMultiplier: (attackType: string, defenderTypes: string[]) => number;
}

function getCellClass(multiplier: number) {
  if (multiplier === 0) return "bg-muted text-muted-foreground";
  if (multiplier >= 2) return "bg-emerald-500/15 text-emerald-900 dark:text-emerald-200";
  if (multiplier <= 0.5) return "bg-amber-500/15 text-amber-900 dark:text-amber-200";
  return "bg-background";
}

export function TypeChartTable({ typeNames, getMultiplier }: TypeChartTableProps) {
  const defenderTypes = typeNames;
  const attackerTypes = typeNames;

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-max border-separate border-spacing-0 text-xs">
        <thead>
          <tr>
            <th
              scope="col"
              className="sticky left-0 top-0 z-30 w-28 border-b bg-background px-3 py-2 text-left font-semibold"
            >
              공격\방어
            </th>
            {defenderTypes.map((def) => (
              <th
                key={def}
                scope="col"
                className="sticky top-0 z-20 border-b bg-background px-2 py-2 text-center"
              >
                <div className="flex justify-center">
                  <TypeBadge typeNameEn={def} className="text-[11px]" />
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {attackerTypes.map((atk) => (
            <tr key={atk}>
              <th
                scope="row"
                className="sticky left-0 z-10 border-b bg-background px-3 py-2 text-left"
              >
                <TypeBadge typeNameEn={atk} className="text-[11px]" />
              </th>
              {defenderTypes.map((def) => {
                const multiplier = getMultiplier(atk, [def]);
                const label = multiplier === 1 ? "-" : `x${multiplier}`;
                return (
                  <td
                    key={`${atk}:${def}`}
                    className={cn(
                      "border-b px-2 py-2 text-center tabular-nums",
                      getCellClass(multiplier)
                    )}
                    title={`${getKoreanTypeName(atk)} -> ${getKoreanTypeName(def)}: x${multiplier}`}
                  >
                    {label}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
