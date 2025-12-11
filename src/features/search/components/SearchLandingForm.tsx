import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { buildSearchQueryString } from "@/lib/utils";

/**
 * 검색 랜딩 페이지 중앙의 통합 검색 UI 컴포넌트.
 *
 * 세대나 게임 버전 제한 없이 포켓몬, 기술, 특성, 도구를 통합 검색할 수 있습니다.
 */

export function SearchLandingForm() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    const searchParams = buildSearchQueryString({
      q: trimmed,
      generationId: "unified",
      gameId: null,
    });
    navigate(`/search?${searchParams}`);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSearch(query);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch(query);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">통합 검색</CardTitle>
        <CardDescription>
          세대나 게임 버전 제한 없이 포켓몬, 기술, 특성, 도구를 한 번에 검색할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="포켓몬 / 기술 / 특성 / 도구 이름"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
