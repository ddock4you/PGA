import type { CsvItem } from "@/types/csvTypes";
import type { DexItemSummary } from "@/features/items/types/itemList";

export function transformItemsForList(csvItems: CsvItem[]): DexItemSummary[] {
  return csvItems
    .map((item) => ({
      id: item.id,
      name: item.identifier,
      category: getItemCategoryName(item.category_id),
      cost: item.cost,
    }))
    .sort((a, b) => a.id - b.id);
}

function getItemCategoryName(categoryId: number): string {
  const categories: Record<number, string> = {
    1: "stat-boosts",
    2: "effort-drop",
    3: "medicine",
    4: "other",
    5: "in-a-pinch",
    6: "picky-healing",
    7: "type-protection",
    8: "baking-only",
    9: "collectibles",
    10: "evolution",
    11: "spelunking",
    12: "held-items",
    13: "choice",
    14: "effort-training",
    15: "bad-held-items",
    16: "training",
    17: "plates",
    18: "species-specific",
    19: "type-enhancement",
    20: "event-items",
    21: "gameplay",
    22: "plot-advancement",
    23: "unused",
    24: "loot",
    25: "all-mail",
    26: "vitamins",
    27: "healing",
    28: "pp-recovery",
    29: "revival",
    30: "status-cures",
    31: "mulch",
    32: "special-balls",
    33: "standard-balls",
    34: "dex-completion",
    35: "scarves",
    36: "all-machines",
    37: "flutes",
    38: "apricorn-balls",
    39: "apricorn-box",
    40: "data-cards",
    41: "jewels",
    42: "miracle-shooter",
    43: "mega-stones",
    44: "memories",
    45: "z-crystals",
    46: "species-candies",
    47: "dynamax-crystals",
    48: "nature-mints",
    49: "curry-ingredients",
    50: "catching-bonus",
  };

  return categories[categoryId] || "unknown";
}
