import { describe, expect, it } from "vitest";
import { filterPokemonByQuery, type SearchIndex } from "./searchIndexApi";

const sampleIndex: SearchIndex = {
  pokemon: [
    { id: 25, name: "pikachu" },
    { id: 26, name: "raichu" },
    { id: 16, name: "pidgey" },
  ],
};

describe("filterPokemonByQuery", () => {
  it("빈 검색어이거나 공백만 있는 경우 빈 배열을 반환한다", () => {
    expect(filterPokemonByQuery(sampleIndex, "")).toEqual([]);
    expect(filterPokemonByQuery(sampleIndex, "   ")).toEqual([]);
  });

  it("부분 문자열 기준으로 대소문자를 구분하지 않고 필터링한다", () => {
    const result = filterPokemonByQuery(sampleIndex, "Pika");
    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe("pikachu");
  });

  it("여러 결과가 일치할 수 있다", () => {
    const result = filterPokemonByQuery(sampleIndex, "chu");
    const names = result.map((p) => p.name);
    expect(names).toContain("pikachu");
    expect(names).toContain("raichu");
  });
});




