import { Link, NavLink, Outlet, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/features/preferences/PreferencesContext";
import { GameGenerationSelector } from "@/features/generation/components/GameGenerationSelector";
import { GENERATION_VERSION_GROUP_MAP } from "@/features/generation/constants/generationData";
import { HomePage } from "./pages/HomePage";
import { DexPage } from "./pages/DexPage";
import { SearchPage } from "./pages/SearchPage";
import { TrainingPage } from "./pages/TrainingPage";
import { PokemonDetailPage } from "./pages/PokemonDetailPage";
import { MoveDetailPage } from "./pages/MoveDetailPage";
import { AbilityDetailPage } from "./pages/AbilityDetailPage";
import { ItemDetailPage } from "./pages/ItemDetailPage";

function AppLayout() {
  const {
    state,
    toggleTheme,
    setSelectedGenerationId,
    setSelectedGameId,
    setSelectedVersionGroup,
  } = usePreferences();
  const { t } = useTranslation();
  const themeLabel = state.theme === "dark" ? "다크" : "라이트";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-base font-semibold">
            {t("app.title")}
          </Link>
          <div className="flex items-center gap-4 text-xs sm:text-sm">
            <nav className="flex items-center gap-3">
              <NavLink
                to="/dex"
                className={({ isActive }) => (isActive ? "font-semibold" : "text-muted-foreground")}
              >
                {t("nav.dex")}
              </NavLink>
              <NavLink
                to="/training"
                className={({ isActive }) => (isActive ? "font-semibold" : "text-muted-foreground")}
              >
                {t("nav.training")}
              </NavLink>
            </nav>
            <div className="hidden items-center gap-2 sm:flex">
              <GameGenerationSelector
                variant="compact"
                onGenerationSelect={(generationId, version) => {
                  setSelectedGenerationId(generationId);
                  if (version) {
                    setSelectedGameId(version.id);
                    setSelectedVersionGroup(version.versionGroup);
                  } else {
                    setSelectedGameId(null);
                    setSelectedVersionGroup(GENERATION_VERSION_GROUP_MAP[generationId] ?? null);
                  }
                }}
              />
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
