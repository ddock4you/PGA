import { getEnglishTypeName, getKoreanTypeName } from "@/utils/pokemonTypes";
import { computeAttackMultiplier, type TypeMap } from "@/features/pokemonTypes/utils/typeEffectiveness";
import type { QuizChoiceData, QuizOptions, QuizQuestion } from "../../contexts/types";
import type { QuizMove, QuizPokemon } from "../../api/quizData";
import { filterPokemonsByGenerationSelection, pickRandom, shuffleInPlace, toEnglishTypes } from "./_shared";

export function generateAttackLv3(
  options: QuizOptions,
  typeMap: TypeMap,
  pokemons: QuizPokemon[],
  moves: QuizMove[],
  askedPokemonIds: number[]
): QuizQuestion {
  const allAttacks = Object.keys(typeMap).filter((t) => t !== "stellar" && t !== "unknown");

  for (let attempt = 0; attempt < 80; attempt++) {
    const filtered = filterPokemonsByGenerationSelection(pokemons, options.generationSelection);
    const candidates = filtered.length > 0 ? filtered : pokemons;
    const unused = candidates.filter((p) => !askedPokemonIds.includes(p.id));
    const pool = unused.length > 0 ? unused : candidates;
    if (pool.length === 0) continue;

    const pokemon = pickRandom(pool);
    const defenderTypesEn = toEnglishTypes(pokemon.types);

    const typeMultipliers = allAttacks
      .map((atk) => ({ atk, multiplier: computeAttackMultiplier(atk, defenderTypesEn, typeMap) }))
      .sort((a, b) => b.multiplier - a.multiplier);

    const maxMultiplier = typeMultipliers[0]?.multiplier;
    if (maxMultiplier == null) continue;
    if (maxMultiplier < 0.25) continue;

    const bestTypes = typeMultipliers.filter((t) => t.multiplier === maxMultiplier);
    const answerType = pickRandom(bestTypes).atk;
    const answerTypeKo = getKoreanTypeName(answerType);
    const validMoves = moves.filter((m) => m.type === answerTypeKo);
    if (validMoves.length === 0) continue;
    const answerMove = pickRandom(validMoves);

    const wrongTypeCandidates = typeMultipliers.filter((t) => t.multiplier < maxMultiplier);
    if (wrongTypeCandidates.length === 0) continue;
    const wrongTypesKo = shuffleInPlace(
      [...new Set(wrongTypeCandidates.map((t) => getKoreanTypeName(t.atk)))].filter(
        (t) => t !== answerTypeKo
      )
    );
    if (wrongTypesKo.length === 0) continue;

    const wrongMoves: QuizMove[] = [];
    let safety = 0;
    while (wrongMoves.length < 3 && safety < 150) {
      safety++;
      const randTypeKo = pickRandom(wrongTypesKo);
      const typeMoves = moves.filter((m) => m.type === randTypeKo);
      if (typeMoves.length === 0) continue;
      const randMove = pickRandom(typeMoves);
      if (randMove.id === answerMove.id) continue;
      if (wrongMoves.some((m) => m.id === randMove.id)) continue;
      wrongMoves.push(randMove);
    }
    if (wrongMoves.length < 3) continue;

    const choices: QuizChoiceData[] = shuffleInPlace([
      {
        id: answerMove.id.toString(),
        label: answerMove.name,
        type: answerMove.type,
        multiplier: maxMultiplier,
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
      id: `atk-lv3-${Date.now()}`,
      text: `${pokemon.name}에게 가장 효과적인 기술은?`,
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
