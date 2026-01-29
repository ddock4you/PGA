export function normalizeSearchQuery(query: string): string {
  return query.trim().toLowerCase();
}

export function includesSearchText(
  text: string | null | undefined,
  normalizedQuery: string
): boolean {
  if (!normalizedQuery) return true;
  if (!text) return false;
  return text.toLowerCase().includes(normalizedQuery);
}

export function matchesAnySearchText(
  texts: Array<string | null | undefined>,
  normalizedQuery: string
): boolean {
  if (!normalizedQuery) return true;

  for (const text of texts) {
    if (includesSearchText(text, normalizedQuery)) return true;
  }
  return false;
}
