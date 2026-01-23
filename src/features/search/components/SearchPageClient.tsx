"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import type { UnifiedSearchEntry } from "@/features/search/types/unifiedSearchTypes";
import { escapeRegExp } from "@/features/search/utils/escapeRegExp";
import { useSearchPageState, type TabType } from "@/features/search/hooks/useSearchPageState";

const TAB_LABELS: Record<TabType, string> = {
  all: "전체",
  pokemon: "포켓몬",
  moves: "기술",
  abilities: "특성",
  items: "도구",
};

const CARD_BG_CLASSES: Record<string, string> = {
  포켓몬: "card-pokemon",
  기술: "card-move",
  특성: "card-ability",
  도구: "card-item",
};

function TabButton({
  tab,
  count,
  activeTab,
  disabled,
  onClick,
}: {
  tab: TabType;
  count: number;
  activeTab: TabType;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-full px-3 py-2 font-medium transition-colors whitespace-nowrap touch-manipulation ${
        activeTab === tab
          ? "bg-primary text-primary-foreground shadow-sm"
          : disabled
          ? "bg-muted/50 text-muted-foreground/50 cursor-not-allowed"
          : "bg-muted text-muted-foreground hover:bg-muted/80 active:bg-muted/90"
      }`}
    >
      {TAB_LABELS[tab]}
      <span className="ml-1 text-[10px] opacity-75">({count})</span>
    </button>
  );
}

function SearchSummaryHeader({
  query,
  generationId,
  onSubmit,
}: {
  query: string;
  generationId: string | null;
  onSubmit: (nextQuery: string) => void;
}) {
  const [localQuery, setLocalQuery] = useState(query);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(localQuery);
  };

  return (
    <header className="space-y-2 border-b pb-3">
      <div className="flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">검색 결과</h2>
          <p>포켓몬, 기술, 특성, 도구를 통합 검색합니다.</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-3 flex flex-col gap-3 text-xs sm:flex-row sm:items-center"
      >
        <div className="flex-1">
          <label className="mb-1 block font-medium text-muted-foreground">검색어</label>
          <Input
            placeholder="검색어를 입력하세요"
            value={localQuery}
            onChange={(event) => setLocalQuery(event.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block font-medium text-muted-foreground">필터 정보</label>
          <div className="flex h-9 items-center gap-2 text-sm">
            <Badge variant="outline">세대: {generationId ?? "-"}</Badge>
          </div>
        </div>
      </form>
    </header>
  );
}

function SearchResultsSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="space-y-3 py-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-12" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function SearchPrompt() {
  return (
    <div className="text-center py-12">
      <div className="text-4xl mb-4">⚡</div>
      <h3 className="text-lg font-medium text-muted-foreground mb-2">
        포켓몬, 기술, 특성, 도구 검색
      </h3>
      <p className="text-sm text-muted-foreground">한국어, 영어, 일본어로 검색할 수 있습니다</p>
    </div>
  );
}

function NoResults({ query }: { query: string }) {
  return (
    <div className="text-center py-12">
      <div className="text-4xl mb-4">🔍</div>
      <h3 className="text-lg font-medium text-muted-foreground mb-2">
        &ldquo;{query}&rdquo;에 대한 검색 결과가 없습니다
      </h3>
      <p className="text-sm text-muted-foreground">다른 검색어나 철자를 확인해보세요</p>
    </div>
  );
}

function HighlightText({ entry, query }: { entry: UnifiedSearchEntry; query: string }) {
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

function SearchResultSection({
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
                  <HighlightText entry={entry} query={query} />
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

export function SearchPageClient() {
  const {
    parsed,
    activeTab,
    setActiveTab,
    results,
    handleSearchSubmit,
    isLoading,
    isError,
  } = useSearchPageState();

  const renderResults = () => {
    if (isLoading) return <SearchResultsSkeleton />;
    if (isError) {
      return (
        <Alert className="border-destructive">
          <AlertDescription>
            검색 데이터를 불러오는 중 오류가 발생했습니다. 페이지를 새로고침하거나 잠시 후 다시
            시도해주세요.
          </AlertDescription>
        </Alert>
      );
    }

    if (!parsed.q) return <SearchPrompt />;

    const hasAnyResults = Object.values(results).some((arr) => arr.length > 0);
    if (!hasAnyResults) return <NoResults query={parsed.q} />;

    if (activeTab === "all") {
      return (
        <div className="space-y-6">
          <SearchResultSection
            title="포켓몬"
            entries={results.pokemon}
            query={parsed.q}
            linkPrefix="/dex"
            limit={3}
            onMoreClick={() => setActiveTab("pokemon")}
          />
          <SearchResultSection
            title="기술"
            entries={results.moves}
            query={parsed.q}
            linkPrefix="/moves"
            limit={3}
            onMoreClick={() => setActiveTab("moves")}
          />
          <SearchResultSection
            title="특성"
            entries={results.abilities}
            query={parsed.q}
            linkPrefix="/abilities"
            limit={3}
            onMoreClick={() => setActiveTab("abilities")}
          />
          <SearchResultSection
            title="도구"
            entries={results.items}
            query={parsed.q}
            linkPrefix="/items"
            limit={3}
            onMoreClick={() => setActiveTab("items")}
          />
        </div>
      );
    }

    const tabEntries: Record<TabType, { entries: UnifiedSearchEntry[]; prefix: string }> = {
      all: { entries: [], prefix: "" },
      pokemon: { entries: results.pokemon, prefix: "/dex" },
      moves: { entries: results.moves, prefix: "/moves" },
      abilities: { entries: results.abilities, prefix: "/abilities" },
      items: { entries: results.items, prefix: "/items" },
    };

    const { entries, prefix } = tabEntries[activeTab];

    return (
      <div className="space-y-4">
        <SearchResultSection
          title={TAB_LABELS[activeTab]}
          entries={entries}
          query={parsed.q}
          linkPrefix={prefix}
        />
        {entries.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              &ldquo;{TAB_LABELS[activeTab]}&rdquo; 카테고리에서 검색된 결과가 없습니다
            </p>
          </div>
        )}
      </div>
    );
  };

  const counts = {
    pokemon: results.pokemon.length,
    moves: results.moves.length,
    abilities: results.abilities.length,
    items: results.items.length,
  };

  const totalCount =
    counts.pokemon + counts.moves + counts.abilities + counts.items;

  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
      <section className="space-y-6">
        <SearchSummaryHeader
          key={parsed.q ?? "search"}
          query={parsed.q}
          generationId="통합"
          onSubmit={handleSearchSubmit}
        />

        <nav className="overflow-x-auto pb-2">
          <div className="flex gap-2 text-xs min-w-max px-1">
            {(Object.keys(TAB_LABELS) as TabType[]).map((tab) => (
              <TabButton
                key={tab}
                tab={tab}
                count={tab === "all" ? totalCount : counts[tab]}
                activeTab={activeTab}
                disabled={tab !== "all" && counts[tab] === 0}
                onClick={() => setActiveTab(tab)}
              />
            ))}
          </div>
        </nav>

        {renderResults()}
      </section>
    </main>
  );
}
