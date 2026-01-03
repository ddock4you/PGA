"use client";

import { createContext, type ReactNode } from "react";
import type { DexCsvData } from "./dexCsvData";

export const DexCsvDataContext = createContext<DexCsvData | null>(null);

export function DexCsvDataProvider({ data, children }: { data: DexCsvData; children: ReactNode }) {
  return <DexCsvDataContext.Provider value={data}>{children}</DexCsvDataContext.Provider>;
}
