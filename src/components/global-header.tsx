"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/features/preferences/PreferencesContext";

export function GlobalHeader() {
  const pathname = usePathname();
  const { state, toggleTheme } = usePreferences();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-base font-semibold">
          포켓몬 게임 어시스턴트
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link
            href="/dex"
            className={pathname === "/dex" ? "font-semibold" : "text-muted-foreground"}
          >
            포켓몬
          </Link>
          <Link
            href="/moves"
            className={pathname.startsWith("/moves") ? "font-semibold" : "text-muted-foreground"}
          >
            기술
          </Link>
          <Link
            href="/abilities"
            className={
              pathname.startsWith("/abilities") ? "font-semibold" : "text-muted-foreground"
            }
          >
            특성
          </Link>
          <Link
            href="/items"
            className={pathname.startsWith("/items") ? "font-semibold" : "text-muted-foreground"}
          >
            도구
          </Link>
          <Link
            href="/training"
            className={pathname === "/training" ? "font-semibold" : "text-muted-foreground"}
          >
            배틀 트레이닝
          </Link>
        </nav>
        <Button variant="ghost" size="sm" onClick={toggleTheme}>
          테마: {state.theme === "dark" ? "다크" : "라이트"}
        </Button>
      </div>
    </header>
  );
}
