import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePreferences } from "@/features/preferences/PreferencesContext";
import { buildSearchQueryString } from "@/lib/utils";

/**
 * 검색 랜딩 페이지 중앙의
 * "게임/세대 선택 + 검색어 입력" UI 뼈대를 담당하는 컴포넌트.
 *
 * 아직 실제 게임/세대 선택이나 검색 인덱스와는 연결하지 않고,
 * 단순히 검색어를 받아 /search 로 이동하는 최소 동작만 구현한다.
 */
export function SearchLandingForm() {
  const navigate = useNavigate();
  const {
    state: { selectedGenerationId, selectedGameId, primaryLanguage },
  } = usePreferences();
  const [query, setQuery] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    const searchQuery = buildSearchQueryString({
      q: trimmed,
      generationId: selectedGenerationId,
      gameId: selectedGameId,
      language: primaryLanguage,
    });

    navigate(`/search?${searchQuery}`);
  };

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">빠른 검색</CardTitle>
          <CardDescription>
            지금 플레이 중인 게임/세대를 선택하고 검색어를 입력해 검색을 시작할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              게임/세대
            </label>
            <select className="h-9 w-full rounded-md border bg-background px-2 text-sm">
              <option>게임/세대 선택</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">검색어</label>
            <Input
              placeholder="포켓몬 / 기술 / 특성 / 도구 이름"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
