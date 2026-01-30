"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/features/preferences";
import { MobileNav } from "./MobileNav";

const NAV_LINKS = [
  { href: "/dex", label: "포켓몬" },
  { href: "/moves", label: "기술" },
  { href: "/abilities", label: "특성" },
  { href: "/items", label: "도구" },
  { href: "/type-chart", label: "상성표" },
  { href: "/training", label: "배틀 트레이닝" },
];

export function GlobalHeader() {
  const pathname = usePathname();
  const { state, toggleTheme } = usePreferences();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const closeMobileNav = () => setIsMobileNavOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-base font-semibold">
            포켓몬 게임 어시스턴트
          </Link>
          <nav className="hidden items-center gap-3 text-sm md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  pathname === link.href || pathname.startsWith(link.href + "/")
                    ? "font-semibold"
                    : "text-muted-foreground"
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              테마: {state.theme === "dark" ? "다크" : "라이트"}
            </Button>
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border bg-slate-900/5 text-sm text-muted-foreground transition-colors hover:bg-slate-900/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
              aria-label="모바일 네비게이션 열기"
            >
              <span className="sr-only">메뉴 열기</span>
              <div className="flex h-5 w-5 flex-col items-center justify-between">
                <span className="h-[2px] w-full bg-current" />
                <span className="h-[2px] w-full bg-current" />
                <span className="h-[2px] w-full bg-current" />
              </div>
            </button>
          </div>
        </div>
      </header>
      <MobileNav isOpen={isMobileNavOpen} onClose={closeMobileNav} />
    </>
  );
}
