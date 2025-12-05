import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { usePreferences } from "@/features/preferences/PreferencesContext";
import { useSearchIndex } from "@/features/search/hooks/useSearchIndex";
import { filterPokemonByQuery } from "@/features/search/api/searchIndexApi";
import { buildSearchQueryString, parseSearchQueryString } from "@/lib/utils";

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
          <p>검색어와 선택한 게임/세대에 따라 포켓몬, 기술, 특성, 도구를 표시합니다.</p>
        </div>
        <p className="text-xs">
          검색어:{" "}
          <span className="font-medium text-foreground">
            {query ? `"${query}"` : "입력된 검색어 없음"}
          </span>{" "}
          · 세대: {generationId ?? "미선택"} · 언어: {language ?? "기본"}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-3 flex flex-col gap-3 text-xs sm:flex-row sm:items-center"
      >
        <div className="flex-1">
          <label className="mb-1 block font-medium text-muted-foreground">검색어</label>
          <Input
            placeholder="검색어를 수정해 다시 검색"
            value={localQuery}
            onChange={(event) => setLocalQuery(event.target.value)}
          />
        </div>
        <div className="flex flex-1 gap-2">
          <div className="flex-1">
            <label className="mb-1 block font-medium text-muted-foreground">게임/세대</label>
            <div className="h-9 rounded-md border bg-muted px-2 text-xs text-muted-foreground">
              <div className="flex h-full items-center">
                {generationId ? `세대 ID: ${generationId}` : "세대 미선택 (추후 구현)"}
              </div>
            </div>
          </div>
          <div className="w-28">
            <label className="mb-1 block font-medium text-muted-foreground">언어</label>
            <div className="h-9 rounded-md border bg-muted px-2 text-xs text-muted-foreground">
              <div className="flex h-full items-center">{language ?? "기본"}</div>
            </div>
          </div>
        </div>
      </form>
    </header>
  );
}

interface SearchResultSectionProps {
  title: string;
  count: number;
  children: React.ReactNode;
}

function SearchResultSection({ title, count, children }: SearchResultSectionProps) {
  return (
    <section className="space-y-2">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold">
          {title} <span className="text-xs text-muted-foreground">({count})</span>
        </h3>
        <button
          type="button"
          className="text-xs text-muted-foreground underline-offset-4 hover:underline"
        >
          더 보기
        </button>
      </div>
      <Card>
        <CardContent className="space-y-2 py-3 text-xs text-muted-foreground">
          {children}
        </CardContent>
      </Card>
    </section>
  );
}

export function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, setPrimaryLanguage, setSelectedGenerationId, setSelectedGameId } =
    usePreferences();
  const { primaryLanguage, selectedGenerationId, selectedGameId } = state;

  const parsed = useMemo(() => parseSearchQueryString(location.search), [location.search]);

  // URL 값을 전역 Preferences 에 반영 (있을 때만)
  useEffect(() => {
    if (parsed.language && parsed.language !== primaryLanguage) {
      setPrimaryLanguage(parsed.language as typeof primaryLanguage);
    }

    if (parsed.generationId && parsed.generationId !== selectedGenerationId) {
      setSelectedGenerationId(parsed.generationId);
    }

    if (parsed.gameId && parsed.gameId !== selectedGameId) {
      setSelectedGameId(parsed.gameId);
    }
  }, [
    parsed.gameId,
    parsed.generationId,
    parsed.language,
    primaryLanguage,
    selectedGenerationId,
    selectedGameId,
    setPrimaryLanguage,
    setSelectedGameId,
    setSelectedGenerationId,
  ]);

  const effectiveGenerationId = parsed.generationId ?? selectedGenerationId ?? "1";
  const effectiveLanguage = parsed.language ?? primaryLanguage;

  const {
    data: searchIndex,
    isLoading,
    isError,
  } = useSearchIndex(effectiveGenerationId, effectiveLanguage);

  const pokemonResults = useMemo(() => {
    if (!searchIndex || !parsed.q) return [];
    return filterPokemonByQuery(searchIndex, parsed.q);
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

  const totalPokemonCount = pokemonResults.length;

  return (
    <section className="space-y-6">
      <SearchSummaryHeader
        query={parsed.q}
        generationId={effectiveGenerationId}
        language={effectiveLanguage}
        onSubmit={handleSearchSubmit}
      />

      <nav className="flex flex-wrap gap-2 text-xs">
        <button type="button" className="rounded-full bg-primary/10 px-3 py-1 font-medium">
          포켓몬 ({totalPokemonCount})
        </button>
        <button
          type="button"
          className="rounded-full bg-muted px-3 py-1 text-muted-foreground hover:bg-muted/80"
        >
          기술 (0)
        </button>
        <button
          type="button"
          className="rounded-full bg-muted px-3 py-1 text-muted-foreground hover:bg-muted/80"
        >
          특성 (0)
        </button>
        <button
          type="button"
          className="rounded-full bg-muted px-3 py-1 text-muted-foreground hover:bg-muted/80"
        >
          도구 (0)
        </button>
      </nav>

      <div className="space-y-6">
        <SearchResultSection title="포켓몬" count={totalPokemonCount}>
          {parsed.q.length === 0 && <p>검색어가 비어 있습니다. 상단에서 검색어를 입력해 주세요.</p>}

          {parsed.q.length > 0 && isLoading && <p>포켓몬 검색 인덱스를 불러오는 중입니다...</p>}

          {parsed.q.length > 0 && isError && (
            <p>검색 인덱스를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.</p>
          )}

          {parsed.q.length > 0 && !isLoading && !isError && pokemonResults.length === 0 && (
            <p>해당 검색어에 해당하는 포켓몬 결과가 없습니다.</p>
          )}

          {pokemonResults.map((p) => (
            <p key={p.id || p.name}>
              {p.name} {p.id ? `(No.${p.id.toString().padStart(3, "0")})` : ""}
            </p>
          ))}
        </SearchResultSection>

        <SearchResultSection title="기술" count={0}>
          <p>기술 검색 결과는 2단계에서 구현될 예정입니다.</p>
        </SearchResultSection>

        <SearchResultSection title="특성" count={0}>
          <p>특성 검색 결과는 2단계에서 구현될 예정입니다.</p>
        </SearchResultSection>

        <SearchResultSection title="도구" count={0}>
          <p>도구 검색 결과는 2단계에서 구현될 예정입니다.</p>
        </SearchResultSection>
      </div>
    </section>
  );
}
