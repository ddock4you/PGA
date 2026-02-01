"use client";

export default function Error() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md text-center space-y-4">
        <h2 className="text-xl font-semibold text-destructive">오류가 발생했습니다</h2>
        <p className="text-muted-foreground">도구 정보를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.</p>
      </div>
    </div>
  );
}
