// CSV 데이터 타입 정의

export interface CsvPokemon {
  id: number;
  identifier: string;
  species_id: number;
  height: number;
  weight: number;
  base_experience: number;
  order: number;
  is_default: number;
}

export interface CsvMove {
  id: number;
  identifier: string;
  generation_id: number;
  type_id: number;
  power: number | null;
  pp: number;
  accuracy: number | null;
  priority: number;
  target_id: number;
  damage_class_id: number;
  effect_id: number;
  effect_chance: number | null;
  contest_type_id: number | null;
  contest_effect_id: number | null;
  super_contest_effect_id: number | null;
}

export interface CsvMachine {
  machine_number: number;
  version_group_id: number;
  item_id: number;
  move_id: number;
}

export interface CsvNature {
  id: number;
  identifier: string;
  decreased_stat_id: number;
  increased_stat_id: number;
  hates_flavor_id: number;
  likes_flavor_id: number;
  game_index: number;
}

export interface CsvItem {
  id: number;
  identifier: string;
  category_id: number;
  cost: number;
  fling_power: number | null;
  fling_effect_id: number | null;
}

export interface CsvAbility {
  id: number;
  identifier: string;
  generation_id: number;
  is_main_series: number;
}

export interface CsvAbilityName {
  ability_id: number;
  local_language_id: number;
  name: string;
}
