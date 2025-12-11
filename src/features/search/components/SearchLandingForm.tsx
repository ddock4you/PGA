import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Clock, X } from "lucide-react";
import { usePreferences } from "@/features/preferences/PreferencesContext";
import { useUnifiedSearchIndex } from "@/features/search/hooks/useUnifiedSearchIndex";
import { filterUnifiedEntriesByQuery } from "@/features/search/utils/searchLogic";
import { buildSearchQueryString } from "@/lib/utils";

/**
 * 검색 랜딩 페이지 중앙의 통합 검색 UI 컴포넌트.
 *
 * 세대나 게임 버전 제한 없이 포켓몬, 기술, 특성, 도구를 통합 검색할 수 있습니다.
 * 다국어 검색을 지원합니다.
 */
// 검색 기록 관리 유틸리티
const SEARCH_HISTORY_KEY = "pokemon-search-history";
const MAX_HISTORY_ITEMS = 10;

function getSearchHistory(): string[] {
  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function addToSearchHistory(query: string) {
  if (!query.trim()) return;

  try {
    const history = getSearchHistory();
    const filtered = history.filter((item) => item !== query);
    const newHistory = [query, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  } catch {
    // localStorage 에러 무시
  }
}

function clearSearchHistory() {
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch {
    // localStorage 에러 무시
  }
}

export function SearchLandingForm() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const { data: unifiedSearchIndex } = useUnifiedSearchIndex();

  // 검색 기록 불러오기
  useEffect(() => {
    setSearchHistory(getSearchHistory());
  }, []);

  // 자동완성 제안 목록 생성
  const suggestions = useMemo(() => {
    if (!query.trim() || !unifiedSearchIndex) return [];

    const results = filterUnifiedEntriesByQuery(unifiedSearchIndex, query);

    // 최대 8개까지만 제안, 카테고리별로 균등하게 분배
    const suggestionsByCategory: Record<string, typeof results> = {};
    results.forEach((result) => {
      if (!suggestionsByCategory[result.category]) {
        suggestionsByCategory[result.category] = [];
      }
      if (suggestionsByCategory[result.category].length < 2) {
        suggestionsByCategory[result.category].push(result);
      }
    });

    return Object.values(suggestionsByCategory).flat().slice(0, 8);
  }, [query, unifiedSearchIndex]);

  const navigateToSearch = (searchQuery: string) => {
    addToSearchHistory(searchQuery);
    const searchParams = buildSearchQueryString({
      q: searchQuery,
      generationId: "unified",
      gameId: null,
    });
    navigate(`/search?${searchParams}`);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setQuery(suggestion);
    navigateToSearch(suggestion);
  };

  const handleHistorySelect = (historyItem: string) => {
    setQuery(historyItem);
    navigateToSearch(historyItem);
  };

  const handleClearHistory = () => {
    clearSearchHistory();
    setSearchHistory([]);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">통합 검색</CardTitle>
        <CardDescription>
          세대나 게임 버전 제한 없이 포켓몬, 기술, 특성, 도구를 한 번에 검색할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">검색어</label>
          <Command className="rounded-lg border shadow-md">
            <CommandInput
              placeholder="포켓몬 / 기술 / 특성 / 도구 이름"
              value={query}
              onValueChange={(value) => {
                setQuery(value);
              }}
            />
            <CommandList>
              <CommandEmpty>{query ? "검색 결과가 없습니다" : "검색어를 입력하세요"}</CommandEmpty>

              {/* 검색 제안 */}
              {suggestions.length > 0 && (
                <CommandGroup heading="검색 제안">
                  {suggestions.map((suggestion) => (
                    <CommandItem
                      key={`${suggestion.category}-${suggestion.id}`}
                      value={suggestion.name}
                      onSelect={() => handleSuggestionSelect(suggestion.name)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{suggestion.name}</span>
                        <span className="text-xs text-muted-foreground ml-2 capitalize">
                          {suggestion.category}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {/* 검색 기록 */}
              {searchHistory.length > 0 && !query && (
                <CommandGroup heading="최근 검색">
                  {searchHistory.map((historyItem, index) => (
                    <CommandItem
                      key={`history-${index}`}
                      value={historyItem}
                      onSelect={() => handleHistorySelect(historyItem)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{historyItem}</span>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                  <div className="p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearHistory}
                      className="w-full text-xs text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3 mr-1" />
                      기록 삭제
                    </Button>
                  </div>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </div>
      </CardContent>
    </Card>
  );
}
