"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function SearchSummaryHeader({
  query,
  generationId,
  onSubmit,
}: {
  query: string;
  generationId: string | null;
  onSubmit: (nextQuery: string) => void;
}) {
  const [localQuery, setLocalQuery] = useState(query);

  const handleSubmit = (event: FormEvent) => {
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
