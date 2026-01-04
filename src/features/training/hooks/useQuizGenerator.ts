import { useEffect, useState } from "react";
import { useQuizContext } from "../store";
import { loadQuizData, type QuizPokemon, type QuizMove } from "../api/quizData";
import type { QuizOptions, QuizQuestion, QuizChoiceData } from "../store/types";
import {
  buildTypeMap,
  type TypeMap,
  computeAttackMultiplier,
} from "@/features/types/utils/typeEffectiveness";
import { TYPE_ID_TO_KOREAN_NAME } from "@/utils/dataTransforms";

// 임시: 한글 타입명 목록 (계산기 로직에 필요)
const KOREAN_TYPE_NAMES = Object.values(TYPE_ID_TO_KOREAN_NAME);

// 한글 -> 영문 매핑 (계산기용)
function toEnglishType(koreanType: string): string {
  const map: Record<string, string> = {
    노말: "normal",
    격투: "fighting",
    비행: "flying",
    독: "poison",
    땅: "ground",
    바위: "rock",
    벌레: "bug",
    고스트: "ghost",
    강철: "steel",
    불꽃: "fire",
    물: "water",
    풀: "grass",
    전기: "electric",
    에스퍼: "psychic",
    얼음: "ice",
    드래곤: "dragon",
    악: "dark",
    페어리: "fairy",
  };
  return map[koreanType] || "unknown";
}

// 영문 -> 한글 매핑 (표시용)
function toKoreanType(englishType: string): string {
  const map: Record<string, string> = {
    normal: "노말",
    fighting: "격투",
    flying: "비행",
    poison: "독",
    ground: "땅",
    rock: "바위",
    bug: "벌레",
    ghost: "고스트",
    steel: "강철",
    fire: "불꽃",
    water: "물",
    grass: "풀",
    electric: "전기",
    psychic: "에스퍼",
    ice: "얼음",
    dragon: "드래곤",
    dark: "악",
    fairy: "페어리",
  };
  return map[englishType] || englishType;
}

// 타입 맵 생성 (계산기용)
// typeEffectiveness.ts는 PokeApiType 객체를 필요로 하므로,
// 여기서는 간단히 name과 damage_relations만 있는 모의 객체를 만들거나,
// typeEffectiveness를 수정해서 문자열 기반으로 작동하게 하는 게 좋음.
// 하지만 typeEffectiveness.ts를 이미 수정하진 않았으므로(로직만 수정),
// 기존 buildTypeMap을 쓰려면 PokeApiType 구조가 필요함.
// -> 퀴즈 개편 시 API 의존성을 끊으려면 typeEffectiveness도 로컬 데이터 기반으로 동작해야 함.
// -> typeEffectiveness.ts는 buildTypeMap을 통해 TypeMap을 만드는데, 이건 PokeApiType 배열을 받음.
// -> 우리는 이제 CSV나 상수로만 작업하고 싶음.
// -> 따라서 TypeMap을 직접 생성하는 헬퍼가 필요함.

// 간단한 상성표 (하드코딩 or CSV 로드). 여기서는 일단 하드코딩된 상성표를 사용하는 게 빠름.
// 하지만 프로젝트에는 이미 API에서 가져온 type 데이터가 있을 것임.
// API 호출 없이 하려면 상성표 상수 데이터가 필요함.
// `src/features/types/constants/typeRelations.ts` 같은 게 있으면 좋지만 없으면 여기서 정의하거나
// `features/dex/data/pokemon_types.csv` 같은 게 아니라 `type_efficacy.csv` 같은 게 필요함.
// API 의존성을 완전히 끊으려면 상성표도 로컬에 있어야 함.
// 일단 `useAllTypesQuery`를 사용하여 가져온 데이터를 캐싱해두고 쓰는 방식을 유지할 수도 있음 (API 호출이지만 1회성).
// 사용자가 "PokeAPI 의존도를 최대한 낮추기"라고 했으니, 상성표도 로컬 상수로 박는 게 좋음.

// 편의상 상성표는 API에서 가져온 데이터를 한 번 로드해서 사용하는 방식으로 하되,
// `usePokemonQuiz`에서 매번 fetch하던 걸 `useAllTypesQuery` (React Query 캐시)로 대체.
// `useAllTypesQuery`는 이미 `src/features/types/hooks/useAllTypesQuery.ts`에 있고 persist 됨.
// 따라서 이건 그대로 써도 됨. "퀴즈 시작할 때 마다 API 요청"만 안 하면 됨.

import { useAllTypesQuery } from "@/features/types/hooks/useAllTypesQuery";

export function useQuizGenerator() {
  const { state, actions } = useQuizContext();
  const { data: allTypes } = useAllTypesQuery();
  const [quizData, setQuizData] = useState<{ pokemons: QuizPokemon[]; moves: QuizMove[] } | null>(
    null
  );
  const [typeMap, setTypeMap] = useState<TypeMap | null>(null);

  // 1. 초기 데이터 로드
  useEffect(() => {
    loadQuizData().then(setQuizData);
  }, []);

  // 2. 타입 맵 생성
  useEffect(() => {
    if (allTypes && !typeMap) {
      setTypeMap(buildTypeMap(allTypes));
    }
  }, [allTypes, typeMap]);

  // 3. 문제 생성 트리거
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (
      !quizData ||
      (state.mode !== "type" && !typeMap) ||
      state.screen !== "playing" ||
      state.question ||
      isGenerating
    ) {
      return;
    }

    const generate = async () => {
      setIsGenerating(true);
      actions.setLoading(true);
      try {
        let question: QuizQuestion | null = null;

        if (state.mode === "attack") {
          if (state.level === 1) {
            question = generateAttackLevel1(state.options, typeMap);
          } else if (state.level === 2) {
            question = generateAttackLevel2(
              state.options,
              typeMap,
              quizData.pokemons,
              quizData.moves,
              state.askedPokemonIds
            );
          } else if (state.level === 3) {
            // Lv3 추가 예정
            question = generateAttackLevel3(
              state.options,
              typeMap,
              quizData.pokemons,
              quizData.moves,
              state.askedPokemonIds
            );
          }
        } else if (state.mode === "type") {
          question = generateTypeQuiz(state.options, quizData.pokemons, state.askedPokemonIds);
        }

        if (question) {
          if (question.pokemonData?.id) {
            actions.addAskedPokemon(question.pokemonData.id);
          }
          actions.setQuestion(question);
        } else {
          actions.setError("문제를 생성할 수 없습니다.");
        }
      } catch (error) {
        console.error(error);
        actions.setError("문제 생성 중 오류가 발생했습니다.");
      } finally {
        setIsGenerating(false);
      }
    };

    generate();
  }, [
    quizData,
    typeMap,
    state.screen,
    state.question,
    state.mode,
    state.level,
    state.options,
    isGenerating,
    state.askedPokemonIds,
  ]);
}

// === 레벨별 생성 로직 ===

function generateAttackLevel1(options: QuizOptions, typeMap: TypeMap): QuizQuestion {
  // 1. 방어 타입 선정 (랜덤)
  // 듀얼 타입 허용 여부 체크
  const types = KOREAN_TYPE_NAMES;
  const allowDual = options.allowDualType ?? false;

  let defenderTypes: string[] = [];
  if (allowDual && Math.random() < 0.5) {
    const t1 = types[Math.floor(Math.random() * types.length)];
    let t2 = types[Math.floor(Math.random() * types.length)];
    while (t1 === t2) {
      t2 = types[Math.floor(Math.random() * types.length)];
    }
    defenderTypes = [t1, t2];
  } else {
    defenderTypes = [types[Math.floor(Math.random() * types.length)]];
  }

  // 2. 상성 계산 (영문 변환 필요)
  const defTypesEn = defenderTypes.map(toEnglishType);

  // 공격 타입 후보 찾기 (2배 이상)
  const effectiveTypes: { type: string; multiplier: number }[] = [];
  const allAttacks = Object.keys(typeMap).filter((t) => t !== "stellar" && t !== "unknown");

  for (const atk of allAttacks) {
    const mult = computeAttackMultiplier(atk, defTypesEn, typeMap);
    if (mult >= 2) {
      effectiveTypes.push({ type: atk, multiplier: mult });
    }
  }

  if (effectiveTypes.length === 0) {
    // 유효한 공격 타입이 없는 방어 타입 조합이 걸리면 재시도 (재귀)
    return generateAttackLevel1(options, typeMap);
  }

  // 3. 정답 선택
  const answer = effectiveTypes[Math.floor(Math.random() * effectiveTypes.length)];
  const answerTypeKo = toKoreanType(answer.type);

  // 4. 오답 선택 (정답 배율보다 낮은 것들)
  // 모든 타입 중 정답보다 배율이 낮은 것들 필터링
  const wrongCandidates: string[] = [];
  for (const atk of allAttacks) {
    const mult = computeAttackMultiplier(atk, defTypesEn, typeMap);
    if (mult < answer.multiplier) {
      wrongCandidates.push(toKoreanType(atk));
    }
  }

  // 오답 3개 랜덤 선택
  const wrongChoices: string[] = [];
  while (wrongChoices.length < 3 && wrongCandidates.length > 0) {
    const idx = Math.floor(Math.random() * wrongCandidates.length);
    const choice = wrongCandidates[idx];
    if (!wrongChoices.includes(choice) && choice !== answerTypeKo) {
      wrongChoices.push(choice);
    }
    wrongCandidates.splice(idx, 1); // 중복 방지 위해 제거
  }

  // 5. 보기 구성
  const choices: QuizChoiceData[] = [
    { id: answerTypeKo, label: answerTypeKo, multiplier: answer.multiplier },
    ...wrongChoices.map((c) => ({ id: c, label: c })),
  ];

  // 섞기
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }

  const typeText = defenderTypes.join("/");

  return {
    id: `atk-lv1-${Date.now()}`,
    text: `${typeText} 타입 포켓몬에게 효과적인 공격 타입은?`,
    choices,
    correctAnswer: answerTypeKo,
    defenderTypes,
  };
}

function generateAttackLevel2(
  options: QuizOptions,
  typeMap: TypeMap,
  pokemons: QuizPokemon[],
  moves: QuizMove[],
  askedPokemonIds: number[]
): QuizQuestion {
  // 1. 포켓몬 필터링 (세대 등)
  let candidates = pokemons;
  if (options.generationSelection) {
    const { type, ...genOpt } = options.generationSelection;
    if (type === "single") {
      const targetGen = (genOpt as any).generation;
      // 하위 세대 포함 여부 체크 필요하지만, 데이터 구조상 generationId만 있음.
      // 간단히 targetGen과 같거나 (includeSubGenerations면) 작거나.
      const includeSub = (genOpt as any).includeSubGenerations;
      candidates = pokemons.filter((p) =>
        includeSub ? p.generationId <= targetGen : p.generationId === targetGen
      );
    } else if (type === "range") {
      const { minGeneration, maxGeneration } = genOpt as any;
      candidates = pokemons.filter(
        (p) => p.generationId >= minGeneration && p.generationId <= maxGeneration
      );
    }
  }

  if (candidates.length === 0) candidates = pokemons; // fallback

  // 2. 포켓몬 선택
  const unused = candidates.filter((p) => !askedPokemonIds.includes(p.id));
  const pool = unused.length > 0 ? unused : candidates;
  const pokemon = pool[Math.floor(Math.random() * pool.length)];
  const defTypesEn = pokemon.types.map(toEnglishType);

  // 3. 정답 타입 후보 찾기 (2배 이상)
  const effectiveTypes: { type: string; multiplier: number }[] = [];
  const allAttacks = Object.keys(typeMap).filter((t) => t !== "stellar" && t !== "unknown");

  for (const atk of allAttacks) {
    const mult = computeAttackMultiplier(atk, defTypesEn, typeMap);
    if (mult >= 2) {
      effectiveTypes.push({ type: atk, multiplier: mult });
    }
  }

  if (effectiveTypes.length === 0) {
    // 약점이 없는 포켓몬(저리더프 등)은 재시도
    return generateAttackLevel2(options, typeMap, pokemons, moves, askedPokemonIds);
  }

  // 4. 정답 선택 (타입)
  const answerTypeObj = effectiveTypes[Math.floor(Math.random() * effectiveTypes.length)];
  const answerTypeKo = toKoreanType(answerTypeObj.type);

  // 5. 정답 기술 선택 (해당 타입의 기술 중 랜덤)
  const validMoves = moves.filter((m) => m.type === answerTypeKo);
  if (validMoves.length === 0) {
    // 해당 타입 기술이 데이터에 없으면 재시도
    return generateAttackLevel2(options, typeMap, pokemons, moves, askedPokemonIds);
  }
  const answerMove = validMoves[Math.floor(Math.random() * validMoves.length)];

  // 6. 오답 선택 (정답 배율보다 낮은 타입의 기술들)
  const wrongMoves: QuizMove[] = [];
  const wrongTypeCandidates: string[] = [];

  for (const atk of allAttacks) {
    const mult = computeAttackMultiplier(atk, defTypesEn, typeMap);
    if (mult < answerTypeObj.multiplier) {
      wrongTypeCandidates.push(toKoreanType(atk));
    }
  }

  // 오답 기술 3개 선택
  let safety = 0;
  while (wrongMoves.length < 3 && safety < 100) {
    safety++;
    const randType = wrongTypeCandidates[Math.floor(Math.random() * wrongTypeCandidates.length)];
    const typeMoves = moves.filter((m) => m.type === randType);
    if (typeMoves.length > 0) {
      const randMove = typeMoves[Math.floor(Math.random() * typeMoves.length)];
      // 중복 체크
      if (randMove.id !== answerMove.id && !wrongMoves.find((m) => m.id === randMove.id)) {
        wrongMoves.push(randMove);
      }
    }
  }

  // 7. 보기 구성
  const choices: QuizChoiceData[] = [
    {
      id: answerMove.id.toString(),
      label: answerMove.name,
      type: answerMove.type,
      multiplier: answerTypeObj.multiplier,
    },
    ...wrongMoves.map((m) => {
      const mult = computeAttackMultiplier(toEnglishType(m.type), defTypesEn, typeMap);
      return {
        id: m.id.toString(),
        label: m.name,
        type: m.type,
        multiplier: mult,
      };
    }),
  ];

  // 섞기
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }

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

function generateAttackLevel3(
  options: QuizOptions,
  typeMap: TypeMap,
  pokemons: QuizPokemon[],
  moves: QuizMove[],
  askedPokemonIds: number[]
): QuizQuestion {
  // 로직은 Lv2와 유사하지만 정답 조건이 0.25배 이상 & 가장 높은 배율
  // 1. 포켓몬 필터링 및 선택
  let candidates = pokemons;
  if (options.generationSelection) {
    // (Lv2와 동일한 필터링 로직)
    const { type, ...genOpt } = options.generationSelection;
    if (type === "single") {
      const targetGen = (genOpt as any).generation;
      const includeSub = (genOpt as any).includeSubGenerations;
      candidates = pokemons.filter((p) =>
        includeSub ? p.generationId <= targetGen : p.generationId === targetGen
      );
    } else if (type === "range") {
      const { minGeneration, maxGeneration } = genOpt as any;
      candidates = pokemons.filter(
        (p) => p.generationId >= minGeneration && p.generationId <= maxGeneration
      );
    }
  }
  if (candidates.length === 0) candidates = pokemons;

  const unused = candidates.filter((p) => !askedPokemonIds.includes(p.id));
  const pool = unused.length > 0 ? unused : candidates;
  const pokemon = pool[Math.floor(Math.random() * pool.length)];
  const defTypesEn = pokemon.types.map(toEnglishType);

  // 2. 모든 타입의 배율 계산
  const allAttacks = Object.keys(typeMap).filter((t) => t !== "stellar" && t !== "unknown");
  const typeMultipliers = allAttacks.map((atk) => ({
    type: atk,
    multiplier: computeAttackMultiplier(atk, defTypesEn, typeMap),
  }));

  // 3. 정답 후보 (가장 높은 배율을 가진 타입들, 최소 0.25배 이상)
  // 정렬
  typeMultipliers.sort((a, b) => b.multiplier - a.multiplier);
  const maxMultiplier = typeMultipliers[0].multiplier;

  if (maxMultiplier < 0.25) {
    // 최고 배율조차 0.25 미만(0배 등)이면 문제 성립 어려움 (효과가 없는데 정답이라니?)
    // 재시도
    return generateAttackLevel3(options, typeMap, pokemons, moves, askedPokemonIds);
  }

  const bestTypes = typeMultipliers.filter((t) => t.multiplier === maxMultiplier);
  const answerTypeObj = bestTypes[Math.floor(Math.random() * bestTypes.length)];
  const answerTypeKo = toKoreanType(answerTypeObj.type);

  // 4. 정답 기술 선택
  const validMoves = moves.filter((m) => m.type === answerTypeKo);
  if (validMoves.length === 0) {
    return generateAttackLevel3(options, typeMap, pokemons, moves, askedPokemonIds);
  }
  const answerMove = validMoves[Math.floor(Math.random() * validMoves.length)];

  // 5. 오답 기술 선택 (정답보다 배율이 낮은 타입들 중에서)
  // 배율이 낮은 후보들
  const wrongTypeCandidates = typeMultipliers.filter((t) => t.multiplier < maxMultiplier);

  const wrongMoves: QuizMove[] = [];

  // 오답 3개
  let safety = 0;
  while (wrongMoves.length < 3 && safety < 100 && wrongTypeCandidates.length > 0) {
    safety++;
    const randTypeObj = wrongTypeCandidates[Math.floor(Math.random() * wrongTypeCandidates.length)];
    const randTypeKo = toKoreanType(randTypeObj.type);
    const typeMoves = moves.filter((m) => m.type === randTypeKo);

    if (typeMoves.length > 0) {
      const randMove = typeMoves[Math.floor(Math.random() * typeMoves.length)];
      if (randMove.id !== answerMove.id && !wrongMoves.find((m) => m.id === randMove.id)) {
        wrongMoves.push(randMove);
      }
    }
  }

  // 만약 오답 후보가 부족하면(예: 모든 타입이 1배인 경우 등), 그냥 다른 기술을 가져오되 배율이 같은건 피해야 함.
  // 하지만 위 로직에서 multiplier < maxMultiplier 인 것만 골랐으므로,
  // 정답이 유일(최고배율)하다는 조건은 만족됨.

  // 6. 보기 구성
  const choices: QuizChoiceData[] = [
    {
      id: answerMove.id.toString(),
      label: answerMove.name,
      type: answerMove.type, // UI에서는 숨길 수 있지만 데이터로는 줌
      multiplier: maxMultiplier,
    },
    ...wrongMoves.map((m) => {
      const mult = computeAttackMultiplier(toEnglishType(m.type), defTypesEn, typeMap);
      return {
        id: m.id.toString(),
        label: m.name,
        type: m.type,
        multiplier: mult,
      };
    }),
  ];

  // 섞기
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }

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

function generateTypeQuiz(
  options: QuizOptions,
  pokemons: QuizPokemon[],
  askedPokemonIds: number[]
): QuizQuestion {
  // 1. 세대 필터링
  let candidates = pokemons;
  if (options.generationSelection) {
    const { type, ...genOpt } = options.generationSelection;
    if (type === "single") {
      const targetGen = (genOpt as any).generation;
      const includeSub = (genOpt as any).includeSubGenerations;
      candidates = pokemons.filter((p) =>
        includeSub ? p.generationId <= targetGen : p.generationId === targetGen
      );
    } else if (type === "range") {
      const { minGeneration, maxGeneration } = genOpt as any;
      candidates = pokemons.filter(
        (p) => p.generationId >= minGeneration && p.generationId <= maxGeneration
      );
    }
  }
  if (candidates.length === 0) candidates = pokemons;

  const unused = candidates.filter((p) => !askedPokemonIds.includes(p.id));
  const pool = unused.length > 0 ? unused : candidates;

  // 2. 랜덤 포켓몬 선택
  const pokemon = pool[Math.floor(Math.random() * pool.length)];

  // 3. 문제 생성
  const isDualType = pokemon.types.length === 2;
  const questionText = isDualType
    ? `이 포켓몬의 타입은 무엇일까요? (모두 고르시오)`
    : `이 포켓몬의 타입은 무엇일까요?`;

  // 4. 선택지 생성 (4개: 정답 타입 + 오답 3개)
  const allTypes = [
    "노말",
    "격투",
    "비행",
    "독",
    "땅",
    "바위",
    "벌레",
    "고스트",
    "강철",
    "불꽃",
    "물",
    "풀",
    "전기",
    "에스퍼",
    "얼음",
    "드래곤",
    "악",
    "페어리",
  ];

  // 정답 타입들
  const correctTypes = pokemon.types;

  // 오답 타입들 (정답에 포함되지 않은 타입들)
  const wrongTypes = allTypes.filter((type) => !correctTypes.includes(type));

  // 오답 선택 (총 4개 선택지가 되도록)
  const numWrongTypes = 4 - correctTypes.length; // 듀얼 타입이면 2개, 단일 타입이면 3개
  const selectedWrongTypes = [];
  while (selectedWrongTypes.length < numWrongTypes && wrongTypes.length > 0) {
    const randomIndex = Math.floor(Math.random() * wrongTypes.length);
    const wrongType = wrongTypes.splice(randomIndex, 1)[0];
    selectedWrongTypes.push(wrongType);
  }

  // 선택지 배열 생성 (정답 + 오답)
  const allChoices = [...correctTypes, ...selectedWrongTypes];

  // 섞기
  for (let i = allChoices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allChoices[i], allChoices[j]] = [allChoices[j], allChoices[i]];
  }

  const choices: QuizChoiceData[] = allChoices.map((type) => ({
    id: type,
    label: type,
    type: type,
  }));

  return {
    id: `type-${Date.now()}`,
    text: questionText,
    choices,
    correctAnswer: correctTypes.join(","), // 정답은 타입들의 조합
    pokemonData: {
      id: pokemon.id,
      name: pokemon.name,
      sprite: pokemon.spriteUrl,
      types: pokemon.types,
    },
  };
}
