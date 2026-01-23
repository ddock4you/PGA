"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { UnifiedSearchEntry } from "@/features/search/types/unifiedSearchTypes";
import { SearchHighlightText } from "@/features/search/components/SearchHighlightText";

const CARD_BG_CLASSES: Record<string, string> = {
  포켓몬: "card-pokemon",
  기술: "card-move",
  특성: "card-ability",
  도구: "card-item",
};

export function SearchResultSection({
  title,
  entries,
  query,
  linkPrefix,
  limit,
  onMoreClick,
}: {
  title: string;
  entries: UnifiedSearchEntry[];
  query: string;
  linkPrefix: string;
  limit?: number;
  onMoreClick?: () => void;
}) {
  if (entries.length === 0) return null;

  const displayEntries = limit ? entries.slice(0, limit) : entries;
  const cardClassName = CARD_BG_CLASSES[title] ?? "";

  return (
    <section className="space-y-2">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold">
          {title} <span className="text-xs text-muted-foreground">({entries.length})</span>
        </h3>
        {limit && entries.length > limit && (
          <button
            type="button"
            onClick={onMoreClick}
            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            더 보기
          </button>
        )}
      </div>
      <Card className={cardClassName}>
        <CardContent className="space-y-1 py-3">
          {displayEntries.map((entry) => (
            <Link
              key={`${title}-${entry.id}-${entry.name}`}
              href={`${linkPrefix}/${entry.id}`}
              className="block rounded-md p-3 text-sm transition-colors hover:bg-muted active:bg-muted/80 touch-manipulation border border-transparent hover:border-border/50"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex-1 min-w-0">
                  <SearchHighlightText entry={entry} query={query} />
                </div>
                <span className="ml-2 text-xs text-muted-foreground shrink-0">No.{entry.id}</span>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
