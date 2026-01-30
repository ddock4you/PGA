const MEGA_EVOLUTION_SUPPORTED_VERSIONS = new Set([
  "x",
  "y", // 6세대
  "omega-ruby",
  "alpha-sapphire", // 6세대
  "sun",
  "moon", // 7세대 (일부)
  "ultra-sun",
  "ultra-moon", // 7세대
  "lets-go-pikachu",
  "lets-go-eevee", // 7세대
]);

const GIGANTAMAX_SUPPORTED_VERSIONS = new Set([
  "sword",
  "shield", // 8세대
  "brilliant-diamond",
  "shining-pearl", // 8세대 리메이크
  "legends-arceus", // 8세대
]);

export function shouldShowVariantPokemon(
  pokemonName: string,
  selectedGameVersionId?: string
): boolean {
  if (!selectedGameVersionId) return true;

  const hasMega = pokemonName.includes("-mega");
  const hasGmax = pokemonName.includes("-gmax");

  if (hasMega) {
    return MEGA_EVOLUTION_SUPPORTED_VERSIONS.has(selectedGameVersionId);
  }

  if (hasGmax) {
    return GIGANTAMAX_SUPPORTED_VERSIONS.has(selectedGameVersionId);
  }

  return true;
}
