export function parseAbilityIdFromUrl(url?: string): number | undefined {
  if (!url) return undefined;
  const match = url.match(/\/ability\/(\d+)\//);
  if (!match) return undefined;
  return Number.parseInt(match[1] ?? "", 10);
}
