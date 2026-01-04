"use client";

import { Button } from "@/components/ui/button";

interface LoadMoreButtonProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  isLoading: boolean;
  onClick: () => void;
  loadingText?: string;
  noMoreText?: string;
}

export function LoadMoreButton({
  currentPage,
  totalPages,
  hasNextPage,
  isLoading,
  onClick,
  loadingText = "로딩 중...",
  noMoreText = "모든 항목을 불러왔습니다",
}: LoadMoreButtonProps) {
  const label = isLoading
    ? loadingText
    : hasNextPage
    ? `더보기 ${currentPage}/${totalPages}`
    : noMoreText;

  return (
    <Button
      variant="ghost"
      className="w-full justify-center"
      disabled={!hasNextPage || isLoading}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
