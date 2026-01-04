"use client";

import { GlobalHeader } from "./global-header";
import { ReactQueryProvider } from "./ReactQueryProvider";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      <GlobalHeader />
      <ReactQueryProvider>
        <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>
      </ReactQueryProvider>
    </>
  );
}
