"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="space-y-3 text-center">
        <div className="text-lg font-semibold">페이지를 불러오는 중입니다...</div>
        <div className="flex items-center justify-center gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}
