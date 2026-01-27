"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import type { TabType } from "@/features/search/hooks/useSearchPageState";
import { useSearchPageState } from "@/features/search/hooks/useSearchPageState";
import { SearchSummaryHeader } from "@/features/search/components/SearchSummaryHeader";
import { SearchResultsSkeleton } from "@/features/search/components/SearchResultsSkeleton";
import { SearchPrompt } from "@/features/search/components/SearchPrompt";
import { SearchResultSection } from "@/features/search/components/SearchResultSection";
import { SearchTabButton } from "@/features/search/components/SearchTabButton";
import { SearchNoResults } from "@/features/search/components/SearchNoResults";
import type { UnifiedSearchEntry } from "@/features/search/types/unifiedSearchTypes";

import { TAB_LABELS } from "@/features/search/constants/searchPageConstants";
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
    if (!hasAnyResults) return <SearchNoResults query={parsed.q} />;

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
              <SearchTabButton
                key={tab}
                tab={tab}
                count={tab === "all" ? totalCount : counts[tab]}
                activeTab={activeTab}
                disabled={tab !== "all" && counts[tab] === 0}
                label={TAB_LABELS[tab]}
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
