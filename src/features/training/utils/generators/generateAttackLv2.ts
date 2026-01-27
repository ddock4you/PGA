import { getEnglishTypeName, getKoreanTypeName } from "@/utils/dataTransforms";
import { computeAttackMultiplier, type TypeMap } from "@/features/pokemonTypes/utils/typeEffectiveness";
import type { QuizChoiceData, QuizOptions, QuizQuestion } from "../../contexts/types";
import type { QuizMove, QuizPokemon } from "../../api/quizData";
import { filterPokemonsByGenerationSelection, pickRandom, shuffleInPlace, toEnglishTypes } from "./_shared";

export function generateAttackLv2(
  options: QuizOptions,
  typeMap: TypeMap,
  pokemons: QuizPokemon[],
  moves: QuizMove[],
  askedPokemonIds: number[]
): QuizQuestion {
  const allAttacks = Object.keys(typeMap).filter((t) => t !== "stellar" && t !== "unknown");

  for (let attempt = 0; attempt < 80; attempt++) {
    // 1) 포켓몬 후보 풀
    const filtered = filterPokemonsByGenerationSelection(pokemons, options.generationSelection);
    const candidates = filtered.length > 0 ? filtered : pokemons;
    const unused = candidates.filter((p) => !askedPokemonIds.includes(p.id));
    const pool = unused.length > 0 ? unused : candidates;
    if (pool.length === 0) continue;

    // 2) 포켓몬 선택
    const pokemon = pickRandom(pool);
    const defenderTypesEn = toEnglishTypes(pokemon.types);

    // 3) 정답 타입 후보(2배 이상)
    const effectiveTypes: Array<{ type: string; multiplier: number }> = [];
    for (const atk of allAttacks) {
      const mult = computeAttackMultiplier(atk, defenderTypesEn, typeMap);
      if (mult >= 2) effectiveTypes.push({ type: atk, multiplier: mult });
    }
    if (effectiveTypes.length === 0) continue;

    // 4) 정답 타입/기술 선택
    const answerTypeObj = pickRandom(effectiveTypes);
    const answerTypeKo = getKoreanTypeName(answerTypeObj.type);
    const validMoves = moves.filter((m) => m.type === answerTypeKo);
    if (validMoves.length === 0) continue;
    const answerMove = pickRandom(validMoves);

    // 5) 오답 타입 후보(정답보다 배율 낮은 것)
    const wrongTypeCandidates: string[] = [];
    for (const atk of allAttacks) {
      const mult = computeAttackMultiplier(atk, defenderTypesEn, typeMap);
      if (mult < answerTypeObj.multiplier) wrongTypeCandidates.push(getKoreanTypeName(atk));
    }
    const wrongTypes = shuffleInPlace([...new Set(wrongTypeCandidates)]);
    if (wrongTypes.length === 0) continue;

    // 6) 오답 기술 3개 선택
    const wrongMoves: QuizMove[] = [];
    let safety = 0;
    while (wrongMoves.length < 3 && safety < 120) {
      safety++;
      const randType = pickRandom(wrongTypes);
      const typeMoves = moves.filter((m) => m.type === randType);
      if (typeMoves.length === 0) continue;
      const randMove = pickRandom(typeMoves);

      if (randMove.id === answerMove.id) continue;
      if (wrongMoves.some((m) => m.id === randMove.id)) continue;
      wrongMoves.push(randMove);
    }
    if (wrongMoves.length < 3) continue;

    // 7) 보기 구성
    const choices: QuizChoiceData[] = shuffleInPlace([
      {
        id: answerMove.id.toString(),
        label: answerMove.name,
        type: answerMove.type,
        multiplier: answerTypeObj.multiplier,
      },
      ...wrongMoves.map((m) => {
        const mult = computeAttackMultiplier(getEnglishTypeName(m.type), defenderTypesEn, typeMap);
        return {
          id: m.id.toString(),
          label: m.name,
          type: m.type,
          multiplier: mult,
        };
      }),
    ]);

    return {
      id: `atk-lv2-${Date.now()}`,
      text: `${pokemon.name}에게 효과적인 공격은?`,
      choices,
      correctAnswer: answerMove.id.toString(),
      pokemonData: {
        id: pokemon.id,
        name: pokemon.name,
        sprite: pokemon.spriteUrl,
        types: pokemon.types,
      },
    };
  }

  throw new Error("문제를 생성할 수 없습니다.");
}
