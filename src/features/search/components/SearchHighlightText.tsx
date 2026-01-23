"use client";

import type { UnifiedSearchEntry } from "@/features/search/types/unifiedSearchTypes";
import { escapeRegExp } from "@/features/search/utils/escapeRegExp";

export function SearchHighlightText({ entry, query }: { entry: UnifiedSearchEntry; query: string }) {
  if (!query) return <>{entry.name}</>;

  const safeQuery = escapeRegExp(query);
  const parts = entry.name.split(new RegExp(`(${safeQuery})`, "gi"));

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={i} className="bg-yellow-200 font-medium text-foreground dark:bg-yellow-900/50">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}
