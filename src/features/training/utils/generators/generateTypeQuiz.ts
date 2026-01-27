import type { QuizChoiceData, QuizOptions, QuizQuestion } from "../../contexts/types";
import type { QuizPokemon } from "../../api/quizData";
import { ALL_KOREAN_TYPE_NAMES, filterPokemonsByGenerationSelection, pickRandom, shuffleInPlace } from "./_shared";

export function generateTypeQuiz(
  options: QuizOptions,
  pokemons: QuizPokemon[],
  askedPokemonIds: number[]
): QuizQuestion {
  const filtered = filterPokemonsByGenerationSelection(pokemons, options.generationSelection);
  const candidates = filtered.length > 0 ? filtered : pokemons;
  const unused = candidates.filter((p) => !askedPokemonIds.includes(p.id));
  const pool = unused.length > 0 ? unused : candidates;
  if (pool.length === 0) throw new Error("문제를 생성할 수 없습니다.");

  const pokemon = pickRandom(pool);
  const correctTypes = pokemon.types;
  const isDualType = correctTypes.length === 2;
  const questionText = isDualType
    ? "이 포켓몬의 타입은 무엇일까요? (모두 고르시오)"
    : "이 포켓몬의 타입은 무엇일까요?";

  const wrongTypes = ALL_KOREAN_TYPE_NAMES.filter((t) => !correctTypes.includes(t));
  const numWrongTypes = 4 - correctTypes.length;
  shuffleInPlace(wrongTypes);
  const selectedWrongTypes = wrongTypes.slice(0, numWrongTypes);

  const allChoices = shuffleInPlace([...correctTypes, ...selectedWrongTypes]);
  const choices: QuizChoiceData[] = allChoices.map((type) => ({ id: type, label: type, type }));

  return {
    id: `type-${Date.now()}`,
    text: questionText,
    choices,
    correctAnswer: correctTypes.join(","),
    pokemonData: {
      id: pokemon.id,
      name: pokemon.name,
      sprite: pokemon.spriteUrl,
      types: pokemon.types,
    },
  };
}
