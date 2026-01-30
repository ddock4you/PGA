"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "@/lib/query-clients";

interface ReactQueryProviderProps {
  children: React.ReactNode;
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const queryClient = createQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
