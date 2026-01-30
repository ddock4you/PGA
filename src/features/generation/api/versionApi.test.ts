import { describe, expect, it, vi } from "vitest";
import { buildGameGenerationMap } from "./versionApi.server";

vi.mock("@/lib/pokeapi", () => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchFromPokeApi: vi.fn(async (path: string): Promise<any> => {
      if (path === "/version") {
        return {
          results: [
            { name: "red", url: "" },
            { name: "blue", url: "" },
          ],
        };
      }

      if (path === "/version/red") {
        return {
          id: 1,
          name: "red",
          version_group: { name: "red-blue", url: "" },
        };
      }

      if (path === "/version/blue") {
        return {
          id: 2,
          name: "blue",
          version_group: { name: "red-blue", url: "" },
        };
      }

      if (path === "/version-group/red-blue") {
        return {
          id: 1,
          name: "red-blue",
          generation: { name: "generation-i", url: "" },
          versions: [
            { name: "red", url: "" },
            { name: "blue", url: "" },
          ],
        };
      }

      throw new Error(`Unexpected PokéAPI path in test: ${path}`);
    }),
  };
});

describe("buildGameGenerationMap", () => {
  it("버전 이름을 세대/버전 그룹 이름으로 매핑한다", async () => {
    const map = await buildGameGenerationMap();

    expect(map.red).toEqual({
      generationName: "generation-i",
      versionGroupName: "red-blue",
    });

    expect(map.blue).toEqual({
      generationName: "generation-i",
      versionGroupName: "red-blue",
    });
  });
});




