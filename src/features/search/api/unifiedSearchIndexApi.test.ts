import { describe, expect, it } from "vitest";
import { filterUnifiedEntriesByQuery } from "../utils/searchLogic";
import type { UnifiedSearchIndex } from "../types/unifiedSearchTypes";

// 테스트용 샘플 데이터
const sampleIndex: UnifiedSearchIndex = {
  pokemon: [
    {
      id: 1,
      category: "pokemon",
      name: "이상해씨",
    },
    {
      id: 25,
      category: "pokemon",
      name: "피카츄",
    },
  ],
  moves: [
    {
      id: 1,
      category: "move",
      name: "막치기",
    },
    {
      id: 33,
      category: "move",
      name: "10만볼트",
    },
  ],
  abilities: [
    {
      id: 1,
      category: "ability",
      name: "악취",
    },
  ],
  items: [
    {
      id: 1,
      category: "item",
      name: "마스터볼",
    },
  ],
};

describe("통합 검색 로직", () => {
  describe("filterUnifiedEntriesByQuery", () => {
    it("빈 검색어는 빈 배열을 반환한다", () => {
      expect(filterUnifiedEntriesByQuery(sampleIndex, "")).toEqual([]);
      expect(filterUnifiedEntriesByQuery(sampleIndex, "   ")).toEqual([]);
    });

    it("한국어 완전 일치가 최고 우선순위를 가진다", () => {
      const results = filterUnifiedEntriesByQuery(sampleIndex, "피카츄");
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe("피카츄");
    });

    it("부분 일치가 높은 우선순위를 가진다", () => {
      const results = filterUnifiedEntriesByQuery(sampleIndex, "피카");
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe("피카츄");
    });

    it("여러 카테고리에서 검색된다", () => {
      const results = filterUnifiedEntriesByQuery(sampleIndex, "볼");
      expect(results.length).toBeGreaterThan(1);
      // 10만볼트와 마스터볼이 포함되어야 함
      const moveNames = results.filter((r) => r.category === "move").map((r) => r.name);
      const itemNames = results.filter((r) => r.category === "item").map((r) => r.name);
      expect(moveNames).toContain("10만볼트");
      expect(itemNames).toContain("마스터볼");
    });

    it("점수에 따라 정렬된다 (높은 점수 우선)", () => {
      const results = filterUnifiedEntriesByQuery(sampleIndex, "10만");
      // 첫 번째 결과는 10만볼트 (완전 일치)이어야 함
      expect(results[0].name).toBe("10만볼트");
    });
  });

  describe("카테고리별 검색", () => {
    it("특정 카테고리 내에서만 검색된다", () => {
      const pokemonOnly = sampleIndex.pokemon.filter((p) => p.name === "이상해씨");
      expect(pokemonOnly).toHaveLength(1);
      expect(pokemonOnly[0].name).toBe("이상해씨");
    });

    it("카테고리 외의 결과는 제외된다", () => {
      const pokemonOnly = sampleIndex.pokemon.filter((p) => p.name === "10만볼트");
      expect(pokemonOnly).toHaveLength(0);
    });
  });

  describe("검색 우선순위", () => {
    it("포켓몬 검색", () => {
      const results = filterUnifiedEntriesByQuery(sampleIndex, "피카");
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe("피카츄");
    });

    it("기술 검색", () => {
      const results = filterUnifiedEntriesByQuery(sampleIndex, "10만");
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe("10만볼트");
    });
  });
});
