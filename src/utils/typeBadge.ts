const TYPE_BADGE_CLASS_BY_ENGLISH: Record<string, string> = {
  normal: "bg-gray-400 text-white",
  fighting: "bg-red-600 text-white",
  flying: "bg-indigo-400 text-white",
  poison: "bg-purple-600 text-white",
  ground: "bg-yellow-600 text-white",
  rock: "bg-yellow-800 text-white",
  bug: "bg-green-500 text-white",
  ghost: "bg-purple-800 text-white",
  steel: "bg-gray-500 text-white",
  fire: "bg-red-500 text-white",
  water: "bg-blue-500 text-white",
  grass: "bg-green-600 text-white",
  electric: "bg-yellow-400 text-black",
  psychic: "bg-pink-500 text-white",
  ice: "bg-cyan-400 text-black",
  dragon: "bg-indigo-600 text-white",
  dark: "bg-gray-800 text-white",
  fairy: "bg-pink-400 text-black",
};

export function getTypeBadgeClass(typeNameEn: string): string {
  return TYPE_BADGE_CLASS_BY_ENGLISH[typeNameEn] ?? "bg-gray-400 text-white";
}
