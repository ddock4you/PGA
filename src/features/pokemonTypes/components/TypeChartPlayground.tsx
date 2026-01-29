"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TypeBadge } from "./TypeBadge";

type Mode = "attack" | "defense";

interface TypeChartPlaygroundProps {
  typeNames: string[];
  getMultiplier: (attackType: string, defenderTypes: string[]) => number;
}

function uniqSorted(typeNames: string[]) {
  return [...new Set(typeNames)].sort();
}

export function TypeChartPlayground({ typeNames, getMultiplier }: TypeChartPlaygroundProps) {
  const [mode, setMode] = useState<Mode>("defense");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const sortedTypeNames = useMemo(() => uniqSorted(typeNames), [typeNames]);

  const setModeAndResetSelection = (next: Mode) => {
    setMode((prev) => {
      if (prev === next) return prev;
      return next;
    });
    setSelectedTypes([]);
  };

  const toggleType = (t: string) => {
    setSelectedTypes((prev) => {
      if (prev.includes(t)) return prev.filter((x) => x !== t);
      if (prev.length >= 2) return prev;
      return [...prev, t];
    });
  };

  const selectionLabel = useMemo(() => {
    if (selectedTypes.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-2">
        {selectedTypes.map((t) => (
          <TypeBadge key={t} typeNameEn={t} className="text-[11px]" />
        ))}
      </div>
    );
  }, [selectedTypes]);

  const defenseResult = useMemo(() => {
    if (mode !== "defense") return null;
    if (selectedTypes.length === 0) return null;

    const defenders = selectedTypes;
    const groups: Record<string, string[]> = {
      "x4": [],
      "x2": [],
      "x0.5": [],
      "x0.25": [],
      "x0": [],
    };

    for (const atk of sortedTypeNames) {
      const mult = getMultiplier(atk, defenders);

      if (mult === 0) groups["x0"].push(atk);
      else if (mult >= 4) groups["x4"].push(atk);
      else if (mult >= 2) groups["x2"].push(atk);
      else if (mult <= 0.25) groups["x0.25"].push(atk);
      else if (mult <= 0.5) groups["x0.5"].push(atk);
    }

    return groups;
  }, [getMultiplier, mode, selectedTypes, sortedTypeNames]);

  const attackResult = useMemo(() => {
    if (mode !== "attack") return null;
    if (selectedTypes.length === 0) return null;

    return selectedTypes.map((attackType) => {
      const groups: Record<string, string[]> = {
        "x2": [],
        "x0.5": [],
        "x0": [],
      };

      for (const def of sortedTypeNames) {
        const mult = getMultiplier(attackType, [def]);
        if (mult === 0) groups["x0"].push(def);
        else if (mult >= 2) groups["x2"].push(def);
        else if (mult <= 0.5) groups["x0.5"].push(def);
      }

      return { attackType, groups };
    });
  }, [getMultiplier, mode, selectedTypes, sortedTypeNames]);

  const maxSelected = selectedTypes.length >= 2;

  return (
    <div className="space-y-3">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3">
            {/* Segmented control */}
            <div className="inline-flex w-full rounded-md border bg-muted p-1">
              <button
                type="button"
                className={cn(
                  "flex-1 rounded-sm px-3 py-2 text-sm font-medium transition",
                  mode === "defense" ? "bg-background shadow-sm" : "text-muted-foreground"
                )}
                onClick={() => setModeAndResetSelection("defense")}
                aria-pressed={mode === "defense"}
              >
                방어
              </button>
              <button
                type="button"
                className={cn(
                  "flex-1 rounded-sm px-3 py-2 text-sm font-medium transition",
                  mode === "attack" ? "bg-background shadow-sm" : "text-muted-foreground"
                )}
                onClick={() => setModeAndResetSelection("attack")}
                aria-pressed={mode === "attack"}
              >
                공격
              </button>
            </div>

            {/* Type toggle grid */}
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
              {sortedTypeNames.map((t) => {
                const isSelected = selectedTypes.includes(t);
                const isDisabled = !isSelected && maxSelected;

                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleType(t)}
                    disabled={isDisabled}
                    aria-pressed={isSelected}
                    className={cn(
                      "rounded-md border px-2 py-2 text-left transition",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isSelected ? "border-ring bg-accent/30" : "bg-background hover:bg-muted",
                      isDisabled ? "opacity-40" : ""
                    )}
                  >
                    <TypeBadge typeNameEn={t} className="text-[11px]" />
                  </button>
                );
              })}
            </div>

            {/* Selected badges */}
            {selectionLabel}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3" />
        <CardContent className="space-y-4">
          {mode === "defense" ? (
            defenseResult ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {(
                  [
                    { key: "x4", tone: "text-emerald-700 dark:text-emerald-300" },
                    { key: "x2", tone: "text-emerald-700 dark:text-emerald-300" },
                    { key: "x0.5", tone: "text-amber-700 dark:text-amber-300" },
                    { key: "x0.25", tone: "text-amber-700 dark:text-amber-300" },
                    { key: "x0", tone: "text-muted-foreground" },
                  ] as const
                ).map((s) => {
                  const items = defenseResult[s.key] ?? [];
                  return (
                    <div key={s.key} className="rounded-lg border p-3">
                      <div className={cn("mb-2 text-sm font-semibold", s.tone)}>{s.key}</div>
                      {items.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {items.map((t) => (
                            <TypeBadge key={t} typeNameEn={t} className="text-[11px]" />
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground">-</div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                타입을 최대 2개까지 선택하세요
              </div>
            )
          ) : attackResult ? (
            <div className={cn("grid gap-3", attackResult.length === 2 ? "lg:grid-cols-2" : "")}
            >
              {attackResult.map(({ attackType, groups }) => (
                <div key={attackType} className="rounded-lg border p-3">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <TypeBadge typeNameEn={attackType} className="text-[11px]" />
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {(
                      [
                        { key: "x2", tone: "text-emerald-700 dark:text-emerald-300" },
                        { key: "x0.5", tone: "text-amber-700 dark:text-amber-300" },
                        { key: "x0", tone: "text-muted-foreground" },
                      ] as const
                    ).map((s) => {
                      const items = groups[s.key] ?? [];
                      return (
                        <div key={s.key} className="rounded-lg border p-3">
                          <div className={cn("mb-2 text-sm font-semibold", s.tone)}>{s.key}</div>
                          {items.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {items.map((t) => (
                                <TypeBadge key={t} typeNameEn={t} className="text-[11px]" />
                              ))}
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground">-</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              타입을 최대 2개까지 선택하세요
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
