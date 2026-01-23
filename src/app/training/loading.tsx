"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function TrainingLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="text-lg font-semibold">배틀 트레이닝을 준비 중입니다...</div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-56" />
      </div>
    </div>
  );
}
