"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function SearchLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="text-lg font-semibold">검색 결과를 불러오는 중입니다...</div>
      <div className="w-full max-w-3xl space-y-3 px-4">
        <Skeleton className="h-16 w-full" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
              <Skeleton className="h-12 w-12 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
