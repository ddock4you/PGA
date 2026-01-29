"use client";

import { useEffect, useState } from "react";
import { TypeChartViewer } from "@/features/pokemonTypes/components/TypeChartViewer";

export function TypeChartViewerGate() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) {
    return (
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        타입 상성표를 불러오는 중...
      </div>
    );
  }

  return <TypeChartViewer />;
}
