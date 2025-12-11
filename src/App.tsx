import { Link, NavLink, Outlet, Route, Routes } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/features/preferences/PreferencesContext";
import { HomePage } from "./pages/HomePage";
import { DexPage } from "./pages/DexPage";
import { SearchPage } from "./pages/SearchPage";
import { TrainingPage } from "./pages/TrainingPage";
import { PokemonDetailPage } from "./pages/PokemonDetailPage";
import { MoveDetailPage } from "./pages/MoveDetailPage";
import { AbilityDetailPage } from "./pages/AbilityDetailPage";
import { ItemDetailPage } from "./pages/ItemDetailPage";

function AppLayout() {
  const { state, toggleTheme } = usePreferences();
  const themeLabel = state.theme === "dark" ? "다크" : "라이트";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-base font-semibold">
            포켓몬 게임 어시스턴트
          </Link>
          <div className="flex items-center gap-4 text-xs sm:text-sm">
            <nav className="flex items-center gap-3">
              <NavLink
                to="/dex"
                className={({ isActive }) => (isActive ? "font-semibold" : "text-muted-foreground")}
              >
                도감
              </NavLink>
              <NavLink
                to="/training"
                className={({ isActive }) => (isActive ? "font-semibold" : "text-muted-foreground")}
              >
                배틀 트레이닝
              </NavLink>
            </nav>
            <div className="hidden items-center gap-2 sm:flex">
              <Button variant="ghost" size="sm" type="button" aria-label="언어 선택 (추후 구현)">
                언어
              </Button>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={toggleTheme}
                aria-label="테마 전환"
              >
                테마: {themeLabel}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/dex" element={<DexPage />} />
        <Route path="/dex/:id" element={<PokemonDetailPage />} />
        <Route path="/moves/:id" element={<MoveDetailPage />} />
        <Route path="/abilities/:id" element={<AbilityDetailPage />} />
        <Route path="/items/:id" element={<ItemDetailPage />} />
        <Route path="/training" element={<TrainingPage />} />
      </Route>
    </Routes>
  );
}

export default App;
