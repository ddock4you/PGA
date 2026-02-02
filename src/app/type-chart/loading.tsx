"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function TypeChartLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="text-lg font-semibold">타입 상성표를 불러오는 중입니다...</div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-56" />
      </div>
    </div>
  );
}
