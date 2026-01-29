export type TypeNameEn =
  | "normal"
  | "fighting"
  | "flying"
  | "poison"
  | "ground"
  | "rock"
  | "bug"
  | "ghost"
  | "steel"
  | "fire"
  | "water"
  | "grass"
  | "electric"
  | "psychic"
  | "ice"
  | "dragon"
  | "dark"
  | "fairy";

export type TypeNameEnGen2To5 = Exclude<TypeNameEn, "fairy">;
export type TypeNameEnGen1 = Exclude<TypeNameEn, "steel" | "dark" | "fairy">;

export type TypeChartId = "gen6plus" | "gen2to5" | "gen1";

export interface TypeDamageRelations {
  double_damage_to: TypeNameEn[];
  half_damage_to: TypeNameEn[];
  no_damage_to: TypeNameEn[];
}

export interface TypeChartDefinition<TName extends string> {
  id: TypeChartId;
  typeNames: readonly TName[];
  damageRelations: Record<TName, TypeDamageRelations>;
}
