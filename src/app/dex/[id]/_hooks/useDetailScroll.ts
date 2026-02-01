import { useEffect } from "react";
import { smoothScrollToElement, SCROLL_CONSTANTS } from "@/utils/scroll";

export function useDetailScroll(targetId: string, condition: boolean) {
  useEffect(() => {
    if (!condition) return;
    const timer = setTimeout(() => {
      smoothScrollToElement(targetId, SCROLL_CONSTANTS.DEFAULT_DURATION);
    }, SCROLL_CONSTANTS.TAB_SWITCH_DELAY);
    return () => clearTimeout(timer);
  }, [condition, targetId]);
}
