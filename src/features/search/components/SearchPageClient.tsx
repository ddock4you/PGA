"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePreferences } from "@/features/preferences/PreferencesContext";
import { useUnifiedSearchIndex } from "@/features/search/hooks/useUnifiedSearchIndex";
import { filterUnifiedEntriesByQuery } from "@/features/search/utils/searchLogic";
import type { UnifiedSearchEntry } from "@/features/search/types/unifiedSearchTypes";
import {
  GENERATION_VERSION_GROUP_MAP,
  getVersionGroupByGameId,
} from "@/features/generation/constants/generationData";
import { buildSearchQueryString, parseSearchQueryString } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type TabType = "all" | "pokemon" | "moves" | "abilities" | "items";

export function SearchPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state, setSelectedGenerationId, setSelectedGameId, setSelectedVersionGroup } =
    usePreferences();
  const { selectedGenerationId, selectedGameId, selectedVersionGroup } = state;

  const [activeTab, setActiveTab] = useState<TabType>("all");

  const parsed = useMemo(() => {
    const search = searchParams.toString();
    return parseSearchQueryString(search ? `?${search}` : "");
  }, [searchParams]);

  useEffect(() => {
    if (parsed.generationId && parsed.generationId !== selectedGenerationId) {
      setSelectedGenerationId(parsed.generationId);
      if (!parsed.gameId) {
        setSelectedVersionGroup(GENERATION_VERSION_GROUP_MAP[parsed.generationId] ?? null);
      }
    }

    if (parsed.gameId && parsed.gameId !== selectedGameId) {
      setSelectedGameId(parsed.gameId);
      const versionGroup =
        getVersionGroupByGameId(parsed.gameId) ??
        (parsed.generationId
          ? GENERATION_VERSION_GROUP_MAP[parsed.generationId]
          : selectedVersionGroup);
      setSelectedVersionGroup(versionGroup ?? null);
    }
  }, [
    parsed,
    selectedGenerationId,
    selectedGameId,
    selectedVersionGroup,
    setSelectedGenerationId,
    setSelectedGameId,
    setSelectedVersionGroup,
  ]);

  const { data: unifiedSearchIndex, isLoading, isError } = useUnifiedSearchIndex();

  const results = useMemo(() => {
    if (!unifiedSearchIndex || !parsed.q)
      return { pokemon: [], moves: [], abilities: [], items: [] };

    const allResults = filterUnifiedEntriesByQuery(unifiedSearchIndex, parsed.q);

    return {
      pokemon: allResults.filter((entry) => entry.category === "pokemon"),
      moves: allResults.filter((entry) => entry.category === "move"),
      abilities: allResults.filter((entry) => entry.category === "ability"),
      items: allResults.filter((entry) => entry.category === "item"),
    };
  }, [parsed.q, unifiedSearchIndex]);

  const handleSearchSubmit = (nextQuery: string) => {
    const trimmed = nextQuery.trim();
    if (!trimmed) return;
    const searchQuery = buildSearchQueryString({
      q: trimmed,
      generationId: "unified",
      gameId: null,
    });
    router.push(`/search?${searchQuery}`);
  };

  const SearchResultsSkeleton = () => (
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

  const NoResults = ({ query }: { query: string }) => (
    <div className="text-center py-12">
      <div className="text-4xl mb-4">🔍</div>
      <h3 className="text-lg font-medium text-muted-foreground mb-2">
        &ldquo;{query}&rdquo;에 대한 검색 결과가 없습니다
      </h3>
      <p className="text-sm text-muted-foreground">다른 검색어나 철자를 확인해보세요</p>
    </div>
  );

  const SearchPrompt = () => (
    <div className="text-center py-12">
      <div className="text-4xl mb-4">⚡</div>
      <h3 className="text-lg font-medium text-muted-foreground mb-2">
        포켓몬, 기술, 특성, 도구 검색
      </h3>
      <p className="text-sm text-muted-foreground">한국어, 영어, 일본어로 검색할 수 있습니다</p>
    </div>
  );

  const HighlightText = ({ entry, query }: { entry: UnifiedSearchEntry; query: string }) => {
    if (!query) return <>{entry.name}</>;

    const displayText = entry.name;
    const parts = displayText.split(new RegExp(`(${query})`, "gi"));

    return (
      <>
        {parts.map((part: string, i: number) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span
              key={i}
              className="bg-yellow-200 font-medium text-foreground dark:bg-yellow-900/50"
            >
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const SearchSummaryHeader = ({
    query,
    generationId,
    onSubmit,
  }: {
    query: string;
    generationId: string | null;
    onSubmit: (nextQuery: string) => void;
  }) => {
    const [localQuery, setLocalQuery] = useState(query);

    useEffect(() => {
      setLocalQuery(query);
    }, [query]);

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
  };

  const SearchResultSection = ({
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
  }) => {
    const count = entries.length;
    const displayEntries = limit ? entries.slice(0, limit) : entries;

    if (count === 0) return null;

    const getCardClassName = (title: string) => {
      if (title.includes("포켓몬")) return "card-pokemon";
      if (title.includes("기술")) return "card-move";
      if (title.includes("특성")) return "card-ability";
      if (title.includes("도구")) return "card-item";
      return "";
    };

    const cardClassName = getCardClassName(title);

    return (
      <section className="space-y-2">
        <div className="flex items-baseline justify-between">
          <h3 className="text-sm font-semibold">
            {title} <span className="text-xs text-muted-foreground">({count})</span>
          </h3>
          {limit && count > limit && (
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
  };

  const renderContent = () => {
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

    let entries: UnifiedSearchEntry[] = [];
    let linkPrefix = "";
    if (activeTab === "pokemon") {
      entries = results.pokemon;
      linkPrefix = "/dex";
    } else if (activeTab === "moves") {
      entries = results.moves;
      linkPrefix = "/moves";
    } else if (activeTab === "abilities") {
      entries = results.abilities;
      linkPrefix = "/abilities";
    } else if (activeTab === "items") {
      entries = results.items;
      linkPrefix = "/items";
    }

    return (
      <div className="space-y-4">
        <SearchResultSection
          title={getTabLabel(activeTab)}
          entries={entries}
          query={parsed.q}
          linkPrefix={linkPrefix}
        />
        {entries.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              &ldquo;{getTabLabel(activeTab)}&rdquo; 카테고리에서 검색된 결과가 없습니다
            </p>
          </div>
        )}
      </div>
    );
  };

  const getTabLabel = (tab: TabType) => {
    switch (tab) {
      case "all":
        return "전체";
      case "pokemon":
        return "포켓몬";
      case "moves":
        return "기술";
      case "abilities":
        return "특성";
      case "items":
        return "도구";
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
      <section className="space-y-6">
        <SearchSummaryHeader query={parsed.q} generationId="통합" onSubmit={handleSearchSubmit} />

        <nav className="overflow-x-auto pb-2">
          <div className="flex gap-2 text-xs min-w-max px-1">
            {(["all", "pokemon", "moves", "abilities", "items"] as const).map((tab) => {
              const count =
                tab === "all"
                  ? Object.values(results).reduce((acc, cur) => acc + cur.length, 0)
                  : results[tab as keyof typeof results]?.length || 0;

              const isDisabled = tab !== "all" && count === 0;

              return (
                <button
                  key={tab}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-3 py-2 font-medium transition-colors whitespace-nowrap touch-manipulation ${
                    activeTab === tab
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : isDisabled
                      ? "bg-muted/50 text-muted-foreground/50 cursor-not-allowed"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 active:bg-muted/90"
                  }`}
                >
                  {getTabLabel(tab)}
                  <span className="ml-1 text-[10px] opacity-75">({count})</span>
                </button>
              );
            })}
          </div>
        </nav>

        {renderContent()}
      </section>
    </main>
  );
}
