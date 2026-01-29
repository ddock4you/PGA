import type { CsvMachine, CsvMove } from "@/types/csvTypes";
import { getDamageClassName, getTypeName } from "@/utils/dataTransforms";

import type { DexMoveSummary } from "../types";

export function transformMovesForDex(
  csvMoves: CsvMove[],
  csvMachines: CsvMachine[],
  generationId: string
): DexMoveSummary[] {
  const genId = parseInt(generationId, 10);

  const machinesByMoveId = new Map<number, CsvMachine[]>();
  for (const machine of csvMachines) {
    const list = machinesByMoveId.get(machine.move_id);
    if (list) {
      list.push(machine);
    } else {
      machinesByMoveId.set(machine.move_id, [machine]);
    }
  }

  const moves: DexMoveSummary[] = [];
  for (const move of csvMoves) {
    if (move.generation_id > genId) continue;

    moves.push({
      id: move.id,
      name: move.identifier,
      type: getTypeName(move.type_id),
      damageClass: getDamageClassName(move.damage_class_id),
      power: move.power,
      accuracy: move.accuracy,
      pp: move.pp,
      machines: machinesByMoveId.get(move.id) ?? [],
    });
  }

  return [...moves].sort((a, b) => a.id - b.id);
}
