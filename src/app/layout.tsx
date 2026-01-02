import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/query-provider";
import { ClientProviders } from "@/components/client-providers";
import { ClientLayout } from "@/components/ClientLayout";
import { PreferencesProvider } from "@/features/preferences/PreferencesContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "포켓몬 게임 어시스턴트",
  description: "포켓몬 게임 정보를 검색하고 학습할 수 있는 웹앱",
  keywords: ["포켓몬", "pokemon", "게임", "도감", "배틀"],
  authors: [{ name: "PGA Team" }],
  openGraph: {
    title: "포켓몬 게임 어시스턴트",
    description: "포켓몬 게임 정보를 검색하고 학습할 수 있는 웹앱",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <QueryProvider>
          <ClientProviders>
            <PreferencesProvider>
              <div className="min-h-screen bg-background text-foreground">
                <ClientLayout>{children}</ClientLayout>
              </div>
            </PreferencesProvider>
          </ClientProviders>
        </QueryProvider>
      </body>
    </html>
  );
}
