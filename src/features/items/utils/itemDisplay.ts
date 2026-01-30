const ITEM_CATEGORY_DESCRIPTION: Record<string, string> = {
  "standard-balls": "포켓몬을 잡는 데 사용",
  healing: "HP 회복",
  "pp-recovery": "기술 PP 회복",
  "status-cures": "상태 이상 치료",
  vitamins: "능력치 상승",
  evolution: "진화 관련",
  "held-items": "지니게 하는 도구",
};

export function getItemCategoryDescription(category: string): string {
  return ITEM_CATEGORY_DESCRIPTION[category] || `${category} 카테고리의 도구`;
}

export function getItemSpriteUrl(itemIdentifier: string): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${itemIdentifier}.png`;
}
