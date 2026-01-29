export function formatLocationAreaName(raw: string): string {
  return raw
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/\barea\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function formatEncounterMethodName(raw: string): string {
  const methodName = raw.replace(/-/g, " ");
  if (methodName === "gift") return "선물";
  if (methodName === "walk") return "걸어서";
  if (methodName === "surf") return "서핑";
  if (methodName === "fish") return "낚시";
  if (methodName === "headbutt") return "나무 흔들기";
  if (methodName === "rock smash") return "바위 부수기";
  if (methodName === "dark grass") return "풀숲(어두운)";
  if (methodName === "grass") return "풀숲";
  if (methodName === "cave") return "동굴";
  return methodName;
}
