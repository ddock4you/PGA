export interface DexMoveListItem {
  id: number;
  name: string;
  type: string;
  damageClass: string;
  power: number | null;
  accuracy: number | null;
  pp: number;
  displayName?: string;
}

// Use when move-to-machine mapping is required.
export interface DexMoveWithMachines extends DexMoveListItem {
  machines: import("@/types/csvTypes").CsvMachine[];
}
