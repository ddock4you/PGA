"use client";

import { GlobalHeader } from "./global-header";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      <GlobalHeader />
      <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>
    </>
  );
}
