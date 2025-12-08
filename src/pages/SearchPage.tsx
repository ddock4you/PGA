import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { usePreferences } from "@/features/preferences/PreferencesContext";
import { useSearchIndex } from "@/features/search/hooks/useSearchIndex";
import { filterEntriesByQuery, type SearchEntry } from "@/features/search/api/searchIndexApi";
import { buildSearchQueryString, parseSearchQueryString } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Highlight component
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;

  const parts = text.split(new RegExp(`(${query})`, "gi"));

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

interface SearchSummaryHeaderProps {
  query: string;
  generationId: string | null;
  language: string | null;
  onSubmit: (nextQuery: string) => void;
}

function SearchSummaryHeader({
  query,
  generationId,
  language,
  onSubmit,
}: SearchSummaryHeaderProps) {
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
            <Badge variant="outline">언어: {language ?? "-"}</Badge>
          </div>
        </div>
      </form>
    </header>
  );
}

interface SearchResultSectionProps {
  title: string;
  entries: SearchEntry[];
  query: string;
  linkPrefix: string;
  limit?: number;
  onMoreClick?: () => void;
}

function SearchResultSection({
  title,
  entries,
  query,
  linkPrefix,
  limit,
  onMoreClick,
}: SearchResultSectionProps) {
  const count = entries.length;
  const displayEntries = limit ? entries.slice(0, limit) : entries;

  if (count === 0) return null;

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
      <Card>
        <CardContent className="space-y-1 py-3">
          {displayEntries.map((entry) => (
            <Link
              key={`${title}-${entry.id}-${entry.name}`}
              to={`${linkPrefix}/${entry.id}`}
              className="block rounded-md p-2 text-sm transition-colors hover:bg-muted"
            >
              <HighlightText text={entry.name} query={query} />
              {entry.id > 0 && (
                <span className="ml-2 text-xs text-muted-foreground">No.{entry.id}</span>
              )}
            </Link>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}

type TabType = "all" | "pokemon" | "moves" | "abilities" | "items";

export function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, setPrimaryLanguage, setSelectedGenerationId, setSelectedGameId } =
    usePreferences();
  const { primaryLanguage, selectedGenerationId, selectedGameId } = state;

  const [activeTab, setActiveTab] = useState<TabType>("all");

  // Detailed Filters State (UI Only)
  const [typeFilter, setTypeFilter] = useState("all");

  const parsed = useMemo(() => parseSearchQueryString(location.search), [location.search]);

  useEffect(() => {
    if (parsed.language && parsed.language !== primaryLanguage)
      setPrimaryLanguage(parsed.language as any);
    if (parsed.generationId && parsed.generationId !== selectedGenerationId)
      setSelectedGenerationId(parsed.generationId);
    if (parsed.gameId && parsed.gameId !== selectedGameId) setSelectedGameId(parsed.gameId);
  }, [
    parsed,
    primaryLanguage,
    selectedGenerationId,
    selectedGameId,
    setPrimaryLanguage,
    setSelectedGenerationId,
    setSelectedGameId,
  ]);

  const effectiveGenerationId = parsed.generationId ?? selectedGenerationId ?? "1";
  const effectiveLanguage = parsed.language ?? primaryLanguage;

  const {
    data: searchIndex,
    isLoading,
    isError,
  } = useSearchIndex(effectiveGenerationId, effectiveLanguage);

  const results = useMemo(() => {
    if (!searchIndex || !parsed.q) return { pokemon: [], moves: [], abilities: [], items: [] };
    return {
      pokemon: filterEntriesByQuery(searchIndex.pokemon, parsed.q),
      moves: filterEntriesByQuery(searchIndex.moves, parsed.q),
      abilities: filterEntriesByQuery(searchIndex.abilities, parsed.q),
      items: filterEntriesByQuery(searchIndex.items, parsed.q),
    };
  }, [parsed.q, searchIndex]);

  const handleSearchSubmit = (nextQuery: string) => {
    const trimmed = nextQuery.trim();
    if (!trimmed) return;
    const searchQuery = buildSearchQueryString({
      q: trimmed,
      generationId: effectiveGenerationId,
      gameId: parsed.gameId ?? state.selectedGameId,
      language: effectiveLanguage,
    });
    navigate(`/search?${searchQuery}`);
  };

  const renderContent = () => {
    if (isLoading) return <p className="text-sm text-muted-foreground">검색 인덱스 로딩 중...</p>;
    if (isError) return <p className="text-sm text-destructive">인덱스 로딩 오류 발생</p>;
    if (!parsed.q) return <p className="text-sm text-muted-foreground">검색어를 입력하세요.</p>;

    const hasAnyResults = Object.values(results).some((arr) => arr.length > 0);
    if (!hasAnyResults)
      return <p className="text-sm text-muted-foreground">검색 결과가 없습니다.</p>;

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

    // Individual tabs
    let entries: SearchEntry[] = [];
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
        {/* 상세 필터 UI (MVP: 포켓몬/기술 탭일 때만 표시) */}
        {(activeTab === "pokemon" || activeTab === "moves") && (
          <div className="flex items-center gap-2 rounded-md border bg-muted/20 p-2">
            <span className="text-xs font-medium text-muted-foreground">상세 필터:</span>
            <div className="w-32">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue placeholder="타입 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 타입</SelectItem>
                  <SelectItem value="fire">불꽃</SelectItem>
                  <SelectItem value="water">물</SelectItem>
                  <SelectItem value="grass">풀</SelectItem>
                  <SelectItem value="electric">전기</SelectItem>
                  {/* 추가 타입들... */}
                </SelectContent>
              </Select>
            </div>
            <span className="ml-auto text-[10px] text-muted-foreground">
              * 상세 필터는 추후 데이터 연동 예정
            </span>
          </div>
        )}

        <SearchResultSection
          title={getTabLabel(activeTab)}
          entries={entries}
          query={parsed.q}
          linkPrefix={linkPrefix}
        />
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
    <section className="space-y-6">
      <SearchSummaryHeader
        query={parsed.q}
        generationId={effectiveGenerationId}
        language={effectiveLanguage}
        onSubmit={handleSearchSubmit}
      />

      <nav className="flex flex-wrap gap-2 text-xs">
        {(["all", "pokemon", "moves", "abilities", "items"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-3 py-1 font-medium transition-colors ${
              activeTab === tab
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {getTabLabel(tab)} (
            {tab === "all"
              ? Object.values(results).reduce((acc, cur) => acc + cur.length, 0)
              : results[tab as keyof typeof results]?.length || 0}
            )
          </button>
        ))}
      </nav>

      {renderContent()}
    </section>
  );
}
