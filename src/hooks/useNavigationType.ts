"use client";

import { useCallback, useEffect, useState } from "react";

export type NavigationType = "push" | "pop";

export function useNavigationType() {
  const [navigationType, setNavigationType] = useState<NavigationType>("push");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handlePop = () => setNavigationType("pop");
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (navigationType === "pop") {
      const id = window.setTimeout(() => setNavigationType("push"), 0);
      return () => window.clearTimeout(id);
    }
    return undefined;
  }, [navigationType]);

  const markPush = useCallback(() => {
    setNavigationType("push");
  }, []);

  return { navigationType, markPush };
}
