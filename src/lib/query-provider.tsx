"use client";

import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { serverQueryClient } from "@/lib/query-clients";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={serverQueryClient}>{children}</QueryClientProvider>;
}
