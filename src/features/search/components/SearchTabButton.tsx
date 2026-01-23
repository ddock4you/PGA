"use client";

import type { TabType } from "@/features/search/hooks/useSearchPageState";

export function SearchTabButton({
  tab,
  label,
  count,
  activeTab,
  disabled,
  onClick,
}: {
  tab: TabType;
  label: string;
  count: number;
  activeTab: TabType;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-full px-3 py-2 font-medium transition-colors whitespace-nowrap touch-manipulation ${
        activeTab === tab
          ? "bg-primary text-primary-foreground shadow-sm"
          : disabled
          ? "bg-muted/50 text-muted-foreground/50 cursor-not-allowed"
          : "bg-muted text-muted-foreground hover:bg-muted/80 active:bg-muted/90"
      }`}
    >
      {label}
      <span className="ml-1 text-[10px] opacity-75">({count})</span>
    </button>
  );
}
