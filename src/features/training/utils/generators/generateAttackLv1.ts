import { getEnglishTypeName, getKoreanTypeName } from "@/utils/pokemonTypes";
import { computeAttackMultiplier, type TypeMap } from "@/features/pokemonTypes/utils/typeEffectiveness";
import type { QuizChoiceData, QuizOptions, QuizQuestion } from "../../contexts/types";
import { ALL_KOREAN_TYPE_NAMES, pickRandom, shuffleInPlace } from "./_shared";

export function generateAttackLv1(options: QuizOptions, typeMap: TypeMap): QuizQuestion {
  const allowDual = options.allowDualType ?? false;
  const allAttacks = Object.keys(typeMap).filter((t) => t !== "stellar" && t !== "unknown");

  for (let attempt = 0; attempt < 50; attempt++) {
    // 1) 방어 타입 선정
    let defenderTypes: string[];
    if (allowDual && Math.random() < 0.5) {
      const t1 = pickRandom(ALL_KOREAN_TYPE_NAMES);
      let t2 = pickRandom(ALL_KOREAN_TYPE_NAMES);
      while (t2 === t1) t2 = pickRandom(ALL_KOREAN_TYPE_NAMES);
      defenderTypes = [t1, t2];
    } else {
      defenderTypes = [pickRandom(ALL_KOREAN_TYPE_NAMES)];
    }

    const defenderTypesEn = defenderTypes.map(getEnglishTypeName);

    // 2) 정답 후보(2배 이상) 계산
    const effectiveTypes: Array<{ type: string; multiplier: number }> = [];
    for (const atk of allAttacks) {
      const mult = computeAttackMultiplier(atk, defenderTypesEn, typeMap);
      if (mult >= 2) effectiveTypes.push({ type: atk, multiplier: mult });
    }
    if (effectiveTypes.length === 0) continue;

    // 3) 정답 선택
    const answer = pickRandom(effectiveTypes);
    const answerTypeKo = getKoreanTypeName(answer.type);

    // 4) 오답(정답 배율보다 낮은 타입들) 선택
    const wrongCandidates: string[] = [];
    for (const atk of allAttacks) {
      const mult = computeAttackMultiplier(atk, defenderTypesEn, typeMap);
      if (mult < answer.multiplier) wrongCandidates.push(getKoreanTypeName(atk));
    }

    const wrongChoices: string[] = [];
    const wrongPool = [...new Set(wrongCandidates)].filter((t) => t !== answerTypeKo);
    shuffleInPlace(wrongPool);
    for (const t of wrongPool) {
      if (wrongChoices.length >= 3) break;
      wrongChoices.push(t);
    }
    if (wrongChoices.length < 3) continue;

    // 5) 보기 구성
    const choices: QuizChoiceData[] = shuffleInPlace([
      { id: answerTypeKo, label: answerTypeKo, multiplier: answer.multiplier },
      ...wrongChoices.map((c) => ({ id: c, label: c })),
    ]);

    return {
      id: `atk-lv1-${Date.now()}`,
      text: `${defenderTypes.join("/")} 타입 포켓몬에게 효과적인 공격 타입은?`,
      choices,
      correctAnswer: answerTypeKo,
      defenderTypes,
    };
  }

  // 마지막 방어선
  const fallbackType = ALL_KOREAN_TYPE_NAMES[0] ?? "노말";
  return {
    id: `atk-lv1-fallback-${Date.now()}`,
    text: `${fallbackType} 타입 포켓몬에게 효과적인 공격 타입은?`,
    choices: [{ id: fallbackType, label: fallbackType }],
    correctAnswer: fallbackType,
    defenderTypes: [fallbackType],
  };
}
