import { SearchX } from "lucide-react";

export default function SearchNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <SearchX className="h-10 w-10 text-muted-foreground" />
      </div>
      <div className="max-w-md text-center space-y-2">
        <h2 className="text-xl font-semibold">검색 결과를 찾을 수 없습니다</h2>
        <p className="text-sm text-muted-foreground">
          요청하신 검색 결과를 찾을 수 없습니다.
          다른 검색어로 다시 시도해 주세요.
        </p>
      </div>
      <div className="flex gap-2">
        <a
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          홈으로 이동
        </a>
        <a
          href="/search"
          className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          다시 검색
        </a>
      </div>
    </div>
  );
}
