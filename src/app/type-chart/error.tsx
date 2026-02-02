'use client';
import { AlertCircle, Link } from "lucide-react";

export default function TypeChartError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <AlertCircle className="h-10 w-10 text-destructive" />
      </div>
      <div className="max-w-md text-center space-y-2">
        <h2 className="text-xl font-semibold">타입 상성표를 불러오는 중 오류가 발생했습니다</h2>
        <p className="text-sm text-muted-foreground">
          타입 상성 정보를 불러오는 중 문제가 발생했습니다.
          잠시 후 다시 시도해 주세요.
        </p>
        {error.message && (
          <p className="text-xs text-muted-foreground">
            오류 메시지: {error.message}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          다시 시도
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          홈으로 이동
        </Link>
      </div>
    </div>
  );
}
