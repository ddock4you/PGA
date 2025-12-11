import { describe, expect, it } from "vitest";
import { filterUnifiedEntriesByQuery, filterEntriesByCategoryAndQuery } from "../utils/searchLogic";
import type { UnifiedSearchIndex } from "../types/unifiedSearchTypes";

// 테스트용 샘플 데이터
const sampleIndex: UnifiedSearchIndex = {
  pokemon: [
    {
      id: 1,
      category: "pokemon",
      names: { ja: "フシギダネ", ko: "이상해씨", en: "Bulbasaur" },
    },
    {
      id: 25,
      category: "pokemon",
      names: { ja: "ピカチュウ", ko: "피카츄", en: "Pikachu" },
    },
  ],
  moves: [
    {
      id: 1,
      category: "move",
      names: { ja: "はたく", ko: "막치기", en: "Pound" },
    },
    {
      id: 33,
      category: "move",
      names: { ja: "１０まんボルト", ko: "10만볼트", en: "Thunderbolt" },
    },
  ],
  abilities: [
    {
      id: 1,
      category: "ability",
      names: { ja: "あくしゅう", ko: "악취", en: "Stench" },
    },
  ],
  items: [
    {
      id: 1,
      category: "item",
      names: { ja: "マスターボール", ko: "마스터볼", en: "Master Ball" },
    },
  ],
};

describe("통합 검색 로직", () => {
  describe("filterUnifiedEntriesByQuery", () => {
    it("빈 검색어는 빈 배열을 반환한다", () => {
      expect(filterUnifiedEntriesByQuery(sampleIndex, "", "ko")).toEqual([]);
      expect(filterUnifiedEntriesByQuery(sampleIndex, "   ", "ko")).toEqual([]);
    });

    it("1차 언어(한국어) 완전 일치가 최고 우선순위를 가진다", () => {
      const results = filterUnifiedEntriesByQuery(sampleIndex, "피카츄", "ko");
      expect(results).toHaveLength(1);
      expect(results[0].names.ko).toBe("피카츄");
    });

    it("1차 언어 부분 일치가 높은 우선순위를 가진다", () => {
      const results = filterUnifiedEntriesByQuery(sampleIndex, "피카", "ko");
      expect(results).toHaveLength(1);
      expect(results[0].names.ko).toBe("피카츄");
    });

    it("2차 언어와 영어 일치도 검색된다", () => {
      const results = filterUnifiedEntriesByQuery(sampleIndex, "Bulbasaur", "ko", "en");
      expect(results).toHaveLength(1);
      expect(results[0].names.en).toBe("Bulbasaur");
    });

    it("여러 카테고리에서 검색된다", () => {
      const results = filterUnifiedEntriesByQuery(sampleIndex, "볼", "ko");
      expect(results.length).toBeGreaterThan(1);
      // 10만볼트와 마스터볼이 포함되어야 함
      const moveNames = results.filter((r) => r.category === "move").map((r) => r.names.ko);
      const itemNames = results.filter((r) => r.category === "item").map((r) => r.names.ko);
      expect(moveNames).toContain("10만볼트");
      expect(itemNames).toContain("마스터볼");
    });

    it("점수에 따라 정렬된다 (높은 점수 우선)", () => {
      const results = filterUnifiedEntriesByQuery(sampleIndex, "10만", "ko");
      // 첫 번째 결과는 10만볼트 (완전 일치)이어야 함
      expect(results[0].names.ko).toBe("10만볼트");
    });
  });

  describe("filterEntriesByCategoryAndQuery", () => {
    it("특정 카테고리 내에서만 검색된다", () => {
      const pokemonOnly = filterEntriesByCategoryAndQuery(sampleIndex.pokemon, "이상해씨", "ko");
      expect(pokemonOnly).toHaveLength(1);
      expect(pokemonOnly[0].names.ko).toBe("이상해씨");
    });

    it("카테고리 외의 결과는 제외된다", () => {
      const pokemonOnly = filterEntriesByCategoryAndQuery(
        sampleIndex.pokemon,
        "10만볼트", // 기술 이름으로 포켓몬 검색
        "ko"
      );
      expect(pokemonOnly).toHaveLength(0);
    });
  });

  describe("언어 우선순위", () => {
    it("동일 점수 시 ID 오름차순 정렬", () => {
      // '볼'로 검색 시 두 항목 모두 포함 일치 (60점)
      // 점수가 같으므로 ID 오름차순 정렬: 마스터볼(1) -> 10만볼트(33)
      const results = filterUnifiedEntriesByQuery(sampleIndex, "볼", "ko");

      expect(results[0].names.ko).toBe("마스터볼"); // ID: 1
      expect(results[1].names.ko).toBe("10만볼트"); // ID: 33
    });

    it("시작 부분 일치가 포함 일치보다 우선된다", () => {
      // '피'로 검색 시 "피카츄"가 "10만볼트"보다 우선
      const results = filterUnifiedEntriesByQuery(sampleIndex, "피", "ko");
      expect(results[0].names.ko).toBe("피카츄");
    });
  });
});
