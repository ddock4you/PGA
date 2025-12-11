import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePreferences } from "@/features/preferences/PreferencesContext";
import { DexPokemonTab } from "@/features/dex/components/DexPokemonTab";
import { DexMovesTab } from "@/features/dex/components/DexMovesTab";
import { DexAbilitiesTab } from "@/features/dex/components/DexAbilitiesTab";
import { DexItemsTab } from "@/features/dex/components/DexItemsTab";
import { DexFilterProvider } from "@/features/dex/contexts/DexFilterContext";

export function DexPage() {
  const { state } = usePreferences();

  // 기본값은 1세대. Preferences 에 세대가 설정되어 있으면 그것을 우선 사용.
  const effectiveGenerationId = state.selectedGenerationId ?? "1";

  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">도감</h2>
          <p className="text-sm text-muted-foreground">다양한 정보를 탐색하세요.</p>
        </div>
      </header>

      <Tabs defaultValue="pokemon" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pokemon">포켓몬</TabsTrigger>
          <TabsTrigger value="moves">기술</TabsTrigger>
          <TabsTrigger value="abilities">특성</TabsTrigger>
          <TabsTrigger value="items">도구</TabsTrigger>
        </TabsList>

        <TabsContent value="pokemon" className="mt-4">
          <DexFilterProvider>
            <DexPokemonTab />
          </DexFilterProvider>
        </TabsContent>

        <TabsContent value="moves" className="mt-4">
          <DexMovesTab />
        </TabsContent>

        <TabsContent value="abilities" className="mt-4">
          <DexAbilitiesTab />
        </TabsContent>

        <TabsContent value="items" className="mt-4">
          <DexItemsTab />
        </TabsContent>
      </Tabs>
    </section>
  );
}
