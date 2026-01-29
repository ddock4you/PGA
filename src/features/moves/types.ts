import type { CsvMachine } from "@/types/csvTypes";

export interface DexMoveSummary {
  id: number;
  name: string;
  type: string;
  damageClass: string;
  power: number | null;
  accuracy: number | null;
  pp: number;
  machines: CsvMachine[];
  displayName?: string;
}
