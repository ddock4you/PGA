import { describe, expect, it } from "vitest";
import { getCacheMeta } from "./cache-strategy";

describe("cache-strategy util", () => {
  it("returns hybrid strategy for pokemon namespace", () => {
    expect(getCacheMeta(["pokemon", 25])).toEqual({
      cacheStrategy: "both",
      persist: true,
      revalidate: 3600,
    });
  });

  it("returns client-only strategy for pokemon-encounters", () => {
    expect(getCacheMeta(["pokemon-encounters", 25])).toEqual({
      cacheStrategy: "client",
      persist: true,
      maxAge: 3600 * 24 * 30,
    });
  });

  it("falls back to default when namespace is unknown", () => {
    expect(getCacheMeta(["unknown", 1])).toEqual({
      cacheStrategy: "both",
      persist: false,
    });
  });
});
