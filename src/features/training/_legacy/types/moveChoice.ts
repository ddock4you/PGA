export interface LegacyMoveChoice {
  id: string;
  name: string;
  typeId: number;
  typeName: string;
  multiplier: number;
  power: number;
  isCorrect?: boolean;
  isSelected?: boolean;
}
