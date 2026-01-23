"use client";

export function SearchNoResults({ query }: { query: string }) {
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
