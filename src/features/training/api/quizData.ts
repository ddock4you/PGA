import {
  loadPokemonCsv,
  loadPokemonTypesCsv,
  loadPokemonSpeciesNamesCsv,
  loadMovesCsv,
  loadMoveNamesCsv,
} from "@/data/csvLoader";
import {
  transformPokemonForDex,
  GENERATION_POKEMON_RANGES,
  TYPE_ID_TO_KOREAN_NAME,
  getTypeName,
} from "@/utils/dataTransforms";
import type { CsvMove } from "@/types/csvTypes";

export interface QuizPokemon {
  id: number;
  name: string;
  types: string[]; // 한글 타입명
  generationId: number;
  spriteUrl: string; // 스프라이트 URL 생성용 ID 활용
}

export interface QuizMove {
  id: number;
  name: string;
  type: string; // 한글 타입명
  power: number | null;
  damageClassId: number;
}

// 싱글톤 캐시
let cachedQuizPokemons: QuizPokemon[] | null = null;
let cachedQuizMoves: QuizMove[] | null = null;

// 세대 ID 계산 헬퍼
function getGenerationId(pokemonId: number): number {
  for (const [genStr, range] of Object.entries(GENERATION_POKEMON_RANGES)) {
    if (pokemonId >= range[0] && pokemonId <= range[1]) {
      return Number(genStr);
    }
  }
  return 9; // 기본값
}

export async function loadQuizData() {
  if (cachedQuizPokemons && cachedQuizMoves) {
    return { pokemons: cachedQuizPokemons, moves: cachedQuizMoves };
  }

  const [pokemonData, pokemonTypesData, pokemonSpeciesNamesData, movesData, moveNamesData] =
    await Promise.all([
      loadPokemonCsv(),
      loadPokemonTypesCsv(),
      loadPokemonSpeciesNamesCsv(),
      loadMovesCsv(),
      loadMoveNamesCsv(),
    ]);

  // 포켓몬 데이터 변환
  // transformPokemonForDex를 재사용하되, 세대 정보 추가
  const dexPokemons = transformPokemonForDex(
    pokemonData,
    pokemonTypesData,
    pokemonSpeciesNamesData
  );

  cachedQuizPokemons = dexPokemons
    .filter((p) => p.id <= 1025) // 최신 포켓몬까지만 (임시 제한)
    .map((p) => ({
      id: p.id,
      name: p.name,
      types: p.types,
      generationId: getGenerationId(p.id),
      spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`,
    }));

  // 기술 데이터 변환
  // 한국어 이름이 있는 기술만 필터링
  const moveNameMap = new Map<number, string>();
  moveNamesData.forEach((row) => {
    if (row.local_language_id === 3) {
      // 한국어
      moveNameMap.set(row.move_id, row.name);
    }
  });

  // 영문 이름 백업 (한국어 없을 경우)
  const moveNameMapEn = new Map<number, string>();
  moveNamesData.forEach((row) => {
    if (row.local_language_id === 9) {
      // 영어
      moveNameMapEn.set(row.move_id, row.name);
    }
  });

  cachedQuizMoves = movesData
    .filter((m) => m.power !== null && m.power > 0) // 공격 기술만 (위력 > 0)
    .filter((m) => m.damage_class_id === 2 || m.damage_class_id === 3) // 물리(2) 또는 특수(3)
    .map((m) => {
      const koreanName = moveNameMap.get(m.id);
      const englishName = moveNameMapEn.get(m.id);

      if (!koreanName && !englishName) return null;

      return {
        id: m.id,
        name: koreanName || englishName!,
        type: TYPE_ID_TO_KOREAN_NAME[m.type_id] || "알수없음",
        power: m.power,
        damageClassId: m.damage_class_id,
      };
    })
    .filter((m): m is QuizMove => m !== null && m.type !== "알수없음"); // 유효한 기술만

  return { pokemons: cachedQuizPokemons, moves: cachedQuizMoves };
}

export async function getQuizPokemonsByGeneration(generationId: number | null) {
  const { pokemons } = await loadQuizData();
  if (!generationId) return pokemons;
  return pokemons.filter((p) => p.generationId === generationId);
}

export async function getQuizMoves() {
  const { moves } = await loadQuizData();
  return moves;
}
