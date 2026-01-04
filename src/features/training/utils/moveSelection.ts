import type { MoveChoice } from "../store/types";
import type { CsvMove } from "@/types/csvTypes";
import { TYPE_ID_TO_KOREAN_NAME, getEnglishTypeName } from "@/utils/dataTransforms";
import type { TypeMap } from "@/features/types/utils/typeEffectiveness";

/**
 * 특정 배율의 기술 중 하나를 랜덤으로 선택하여 정답으로 설정
 */
export function selectMoveByMultiplier(
  defenderTypes: string[],
  typeMap: TypeMap,
  targetMultiplier: number, // 2, 1, 또는 0.5
  moves: (CsvMove & { koreanName: string })[],
  computeAttackMultiplier: (attackType: string, defenderTypes: string[], typeMap: TypeMap) => number
): MoveChoice | null {
  // 모든 타입에 대해 배율 계산
  const typeMultipliers: Array<{ typeId: number; englishType: string; multiplier: number }> = [];

  Object.entries(TYPE_ID_TO_KOREAN_NAME).forEach(([typeIdStr, koreanName]) => {
    const typeId = Number(typeIdStr);
    const englishType = Object.keys(TYPE_ID_TO_KOREAN_NAME).find(
      (key) => TYPE_ID_TO_KOREAN_NAME[Number(key)] === koreanName
    );

    if (englishType) {
      const multiplier = computeAttackMultiplier(englishType, defenderTypes, typeMap);
      typeMultipliers.push({ typeId, englishType, multiplier });
    }
  });

  // 목표 배율과 일치하는 타입들 필터링
  const matchingTypes = typeMultipliers.filter((entry) => entry.multiplier === targetMultiplier);

  if (matchingTypes.length === 0) {
    console.warn(`No types found with multiplier ${targetMultiplier} against ${defenderTypes}`);
    return null;
  }

  // 랜덤으로 타입 선택
  const selectedType = matchingTypes[Math.floor(Math.random() * matchingTypes.length)];

  // 해당 타입의 기술들 중 랜덤으로 하나 선택
  const typeMoves = moves.filter((move) => move.type_id === selectedType.typeId);

  if (typeMoves.length === 0) {
    console.warn(`No moves found for type ${selectedType.englishType}`);
    return null;
  }

  const selectedMove = typeMoves[Math.floor(Math.random() * typeMoves.length)];

  return {
    id: selectedMove.id.toString(),
    name: selectedMove.koreanName,
    typeId: selectedMove.type_id,
    typeName: TYPE_ID_TO_KOREAN_NAME[selectedMove.type_id] || "unknown",
    multiplier: targetMultiplier,
    power: selectedMove.power || 0,
  };
}

/**
 * Lv.2용: 최고 배율(x2 이상) 기술 선택
 */
export function selectBestMove(
  defenderTypes: string[],
  typeMap: TypeMap,
  moves: (CsvMove & { koreanName: string })[],
  computeAttackMultiplier: (attackType: string, defenderTypes: string[], typeMap: TypeMap) => number
): MoveChoice | null {
  console.log(`selectBestMove called for defender types: ${defenderTypes}`);

  // x2 이상의 배율을 가진 타입들을 찾음
  const typeMultipliers: Array<{ typeId: number; englishType: string; multiplier: number }> = [];

  // 영어 타입명 매핑을 위한 역매핑 생성
  const idToEnglishType: Record<number, string> = {};
  Object.entries(TYPE_ID_TO_KOREAN_NAME).forEach(([typeIdStr, koreanName]) => {
    const typeId = Number(typeIdStr);
    // getEnglishTypeName 함수를 사용해서 영어 타입명 얻기
    const englishType = getEnglishTypeName(koreanName);
    idToEnglishType[typeId] = englishType;
  });

  Object.entries(TYPE_ID_TO_KOREAN_NAME).forEach(([typeIdStr, koreanName]) => {
    const typeId = Number(typeIdStr);
    const englishType = idToEnglishType[typeId];

    if (englishType) {
      const multiplier = computeAttackMultiplier(englishType, defenderTypes, typeMap);
      console.log(
        `Type ${englishType} (Korean: ${koreanName}, ID: ${typeId}) has multiplier ${multiplier} against ${defenderTypes}`
      );
      if (multiplier >= 2) {
        // x2 이상만 포함
        typeMultipliers.push({ typeId, englishType, multiplier });
      }
    } else {
      console.warn(`Could not find English type for Korean: ${koreanName}`);
    }
  });

  console.log(`Found ${typeMultipliers.length} types with multiplier >= 2:`, typeMultipliers);

  if (typeMultipliers.length === 0) {
    console.warn(
      `No types found with multiplier >= 2 against ${defenderTypes}. Trying fallback to >= 1.5...`
    );

    // 폴백: x1.5 이상으로 시도
    const fallbackTypes: Array<{ typeId: number; englishType: string; multiplier: number }> = [];

    Object.entries(TYPE_ID_TO_KOREAN_NAME).forEach(([typeIdStr]) => {
      const typeId = Number(typeIdStr);
      const englishType = idToEnglishType[typeId];

      if (englishType) {
        const multiplier = computeAttackMultiplier(englishType, defenderTypes, typeMap);
        if (multiplier >= 1.5) {
          fallbackTypes.push({ typeId, englishType, multiplier });
        }
      }
    });

    console.log(
      `Fallback: Found ${fallbackTypes.length} types with multiplier >= 1.5:`,
      fallbackTypes
    );

    if (fallbackTypes.length === 0) {
      console.warn(
        `No types found with multiplier >= 1.5 against ${defenderTypes}. Trying fallback to >= 1...`
      );

      // 최종 폴백: x1 이상으로 시도
      const finalFallbackTypes: Array<{ typeId: number; englishType: string; multiplier: number }> =
        [];

      Object.entries(TYPE_ID_TO_KOREAN_NAME).forEach(([typeIdStr]) => {
        const typeId = Number(typeIdStr);
        const englishType = idToEnglishType[typeId];

        if (englishType) {
          const multiplier = computeAttackMultiplier(englishType, defenderTypes, typeMap);
          if (multiplier >= 1) {
            finalFallbackTypes.push({ typeId, englishType, multiplier });
          }
        }
      });

      console.log(
        `Final fallback: Found ${finalFallbackTypes.length} types with multiplier >= 1:`,
        finalFallbackTypes
      );

      if (finalFallbackTypes.length === 0) {
        console.error(`No types found with multiplier >= 1 against ${defenderTypes}!`);
        return null;
      }

      typeMultipliers.push(...finalFallbackTypes);
    } else {
      typeMultipliers.push(...fallbackTypes);
    }
  }

  // 가장 높은 배율의 타입들 선택
  const maxMultiplier = Math.max(...typeMultipliers.map((t) => t.multiplier));
  const bestTypes = typeMultipliers.filter((entry) => entry.multiplier === maxMultiplier);

  // 랜덤으로 타입 선택
  const selectedType = bestTypes[Math.floor(Math.random() * bestTypes.length)];
  console.log(
    `Selected best type: ${selectedType.englishType} with multiplier ${selectedType.multiplier}`
  );

  // 해당 타입의 기술들 중 랜덤으로 하나 선택
  const typeMoves = moves.filter((move) => move.type_id === selectedType.typeId);
  console.log(
    `Found ${typeMoves.length} moves for type ${selectedType.englishType} (ID: ${selectedType.typeId})`
  );
  console.log(`Available moves:`, typeMoves.map((m) => m.koreanName).slice(0, 5));

  if (typeMoves.length === 0) {
    console.warn(
      `No moves found for type ${selectedType.englishType} (ID: ${selectedType.typeId})`
    );
    console.log(`Total moves loaded: ${moves.length}`);
    console.log(
      `Sample moves:`,
      moves.slice(0, 3).map((m) => `${m.koreanName} (type: ${m.type_id})`)
    );

    // 폴백: 다른 타입의 기술을 사용
    console.log(`Trying fallback: using any available move...`);
    if (moves.length > 0) {
      const fallbackMove = moves[Math.floor(Math.random() * moves.length)];
      console.log(
        `Using fallback move: ${fallbackMove.koreanName} (type: ${fallbackMove.type_id})`
      );

      const fallbackEnglishType = Object.keys(TYPE_ID_TO_KOREAN_NAME).find(
        (key) => Number(key) === fallbackMove.type_id
      );

      return {
        id: fallbackMove.id.toString(),
        name: fallbackMove.koreanName,
        typeId: fallbackMove.type_id,
        typeName: TYPE_ID_TO_KOREAN_NAME[fallbackMove.type_id] || "unknown",
        multiplier: fallbackEnglishType
          ? computeAttackMultiplier(fallbackEnglishType, defenderTypes, typeMap)
          : 1,
        power: fallbackMove.power || 0,
      };
    }

    return null;
  }

  const selectedMove = typeMoves[Math.floor(Math.random() * typeMoves.length)];

  return {
    id: selectedMove.id.toString(),
    name: selectedMove.koreanName,
    typeId: selectedMove.type_id,
    typeName: TYPE_ID_TO_KOREAN_NAME[selectedMove.type_id] || "unknown",
    multiplier: selectedType.multiplier,
    power: selectedMove.power || 0,
  };
}

/**
 * Lv.3용: 지정된 배율(1 또는 0.5) 기술 선택
 */
export function selectMoveByTargetMultiplier(
  defenderTypes: string[],
  typeMap: TypeMap,
  targetMultiplier: 1 | 0.5,
  moves: (CsvMove & { koreanName: string })[],
  computeAttackMultiplier: (attackType: string, defenderTypes: string[], typeMap: TypeMap) => number
): MoveChoice | null {
  let result = selectMoveByMultiplier(
    defenderTypes,
    typeMap,
    targetMultiplier,
    moves,
    computeAttackMultiplier
  );

  // 목표 배율의 기술이 없으면 폴백
  if (!result) {
    if (targetMultiplier === 1) {
      // x1이 없으면 x0.5로 폴백
      result = selectMoveByMultiplier(defenderTypes, typeMap, 0.5, moves, computeAttackMultiplier);
    } else {
      // x0.5가 없으면 x1로 폴백
      result = selectMoveByMultiplier(defenderTypes, typeMap, 1, moves, computeAttackMultiplier);
    }
  }

  return result;
}

/**
 * Lv.2용 보기 생성: x2 이상의 기술을 우선적으로 포함
 */
export function generateMoveChoicesLv2(
  correctMove: MoveChoice,
  allMoves: (CsvMove & { koreanName: string })[],
  defenderTypes: string[],
  typeMap: TypeMap,
  computeAttackMultiplier: (attackType: string, defenderTypes: string[], typeMap: TypeMap) => number
): MoveChoice[] {
  const choices: MoveChoice[] = [correctMove];
  const usedTypeIds = new Set([correctMove.typeId]);

  // x2 이상과 x2 미만 타입들을 분리
  const highMultiplierTypes: Array<{ typeId: number; englishType: string; multiplier: number }> =
    [];
  const lowMultiplierTypes: Array<{ typeId: number; englishType: string; multiplier: number }> = [];

  Object.entries(TYPE_ID_TO_KOREAN_NAME).forEach(([typeIdStr]) => {
    const typeId = Number(typeIdStr);
    const englishType = Object.keys(TYPE_ID_TO_KOREAN_NAME).find(
      (key) => TYPE_ID_TO_KOREAN_NAME[Number(key)] === koreanName
    );

    if (englishType && !usedTypeIds.has(typeId)) {
      const multiplier = computeAttackMultiplier(englishType, defenderTypes, typeMap);
      if (multiplier >= 2) {
        highMultiplierTypes.push({ typeId, englishType, multiplier });
      } else {
        lowMultiplierTypes.push({ typeId, englishType, multiplier });
      }
    }
  });

  // x2 이상 타입들 중 1-2개 선택
  const shuffledHigh = highMultiplierTypes.sort(() => Math.random() - 0.5);
  const selectedHighCount = Math.min(2, shuffledHigh.length);
  const selectedHigh = shuffledHigh.slice(0, selectedHighCount);

  // 나머지는 x2 미만 타입들에서 채움
  const remainingSlots = 3 - selectedHigh.length;
  const shuffledLow = lowMultiplierTypes.sort(() => Math.random() - 0.5);
  const selectedLow = shuffledLow.slice(0, remainingSlots);

  const allSelectedTypes = [...selectedHigh, ...selectedLow];

  for (const typeInfo of allSelectedTypes) {
    const typeMoves = allMoves.filter((move) => move.type_id === typeInfo.typeId);
    if (typeMoves.length > 0) {
      const randomMove = typeMoves[Math.floor(Math.random() * typeMoves.length)];
      choices.push({
        id: randomMove.id.toString(),
        name: randomMove.koreanName,
        typeId: randomMove.type_id,
        typeName: TYPE_ID_TO_KOREAN_NAME[randomMove.type_id] || "unknown",
        multiplier: typeInfo.multiplier,
        power: randomMove.power || 0,
      });
    }
  }

  // 4개가 안 되면 더 추가
  while (choices.length < 4) {
    const availableTypes = Object.keys(TYPE_ID_TO_KOREAN_NAME)
      .map(Number)
      .filter((typeId) => !choices.some((choice) => choice.typeId === typeId));

    if (availableTypes.length === 0) break;

    const randomTypeId = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    const typeMoves = allMoves.filter((move) => move.type_id === randomTypeId);

    if (typeMoves.length > 0) {
      const randomMove = typeMoves[Math.floor(Math.random() * typeMoves.length)];
      const englishType = Object.keys(TYPE_ID_TO_KOREAN_NAME).find(
        (key) => Number(key) === randomTypeId
      );

      if (englishType) {
        const multiplier = computeAttackMultiplier(englishType, defenderTypes, typeMap);
        choices.push({
          id: randomMove.id.toString(),
          name: randomMove.koreanName,
          typeId: randomMove.type_id,
          typeName: TYPE_ID_TO_KOREAN_NAME[randomMove.type_id] || "unknown",
          multiplier,
          power: randomMove.power || 0,
        });
      }
    }
  }

  // 셔플
  return choices.sort(() => Math.random() - 0.5);
}

/**
 * Lv.3용 보기 생성: 모든 배율의 기술이 등장
 */
export function generateMoveChoicesLv3(
  allMoves: (CsvMove & { koreanName: string })[],
  defenderTypes: string[],
  typeMap: TypeMap,
  computeAttackMultiplier: (attackType: string, defenderTypes: string[], typeMap: TypeMap) => number
): { choices: MoveChoice[]; correctAnswer: string } {
  // 1. 모든 타입의 배율을 계산하고 정렬
  const allTypeMultipliers: Array<{
    typeId: number;
    englishType: string;
    multiplier: number;
    koreanType: string;
  }> = [];

  Object.entries(TYPE_ID_TO_KOREAN_NAME).forEach(([typeIdStr, koreanName]) => {
    const typeId = Number(typeIdStr);
    const englishType = Object.keys(TYPE_ID_TO_KOREAN_NAME).find(
      (key) => TYPE_ID_TO_KOREAN_NAME[Number(key)] === koreanName
    );

    if (englishType) {
      const multiplier = computeAttackMultiplier(englishType, defenderTypes, typeMap);
      allTypeMultipliers.push({
        typeId,
        englishType,
        multiplier,
        koreanType: koreanName,
      });
    }
  });

  // 2. 배율이 높은 순으로 정렬
  const sortedTypes = [...allTypeMultipliers].sort((a, b) => b.multiplier - a.multiplier);

  // 3. 가장 높은 배율의 타입들 (중복 배율 가능)
  const highestMultiplier = sortedTypes[0].multiplier;
  const bestTypes = sortedTypes.filter((entry) => entry.multiplier === highestMultiplier);

  // 4. 가장 높은 배율 타입 중 하나를 랜덤 선택
  const selectedBestType = bestTypes[Math.floor(Math.random() * bestTypes.length)];

  // 5. 해당 타입의 기술 중 하나를 랜덤 선택 (정답)
  const bestTypeMoves = allMoves.filter((move) => move.type_id === selectedBestType.typeId);
  if (bestTypeMoves.length === 0) {
    throw new Error("적절한 공격 기술을 찾을 수 없습니다.");
  }

  const correctMoveData = bestTypeMoves[Math.floor(Math.random() * bestTypeMoves.length)];
  const correctMoveId = correctMoveData.id.toString();

  // 6. 보기 생성: 각 타입에서 하나씩 기술을 선택 (최대 4개)
  const choices: MoveChoice[] = [];
  const usedTypeIds = new Set<number>();

  for (const typeInfo of sortedTypes) {
    if (usedTypeIds.has(typeInfo.typeId) || choices.length >= 4) continue;

    const typeMoves = allMoves.filter((move) => move.type_id === typeInfo.typeId);
    if (typeMoves.length > 0) {
      const randomMove = typeMoves[Math.floor(Math.random() * typeMoves.length)];
      choices.push({
        id: randomMove.id.toString(),
        name: randomMove.koreanName,
        typeId: randomMove.type_id,
        typeName: TYPE_ID_TO_KOREAN_NAME[randomMove.type_id] || "unknown",
        multiplier: typeInfo.multiplier,
        power: randomMove.power || 0,
        isCorrect: randomMove.id.toString() === correctMoveId,
        isSelected: false,
      });
      usedTypeIds.add(typeInfo.typeId);
    }
  }

  // 7. 0배 기술만 있는 경우 방지
  const hasNonZeroMultiplier = choices.some((choice) => choice.multiplier > 0);
  if (!hasNonZeroMultiplier && choices.length > 1) {
    // 0배 기술만 있는 경우, 다른 기술들로 일부 교체
    const zeroMultiplierChoices = choices.filter((choice) => choice.multiplier === 0);
    const nonZeroTypes = sortedTypes.filter(
      (type) =>
        !zeroMultiplierChoices.some((choice) => choice.typeId === type.typeId) &&
        type.multiplier > 0
    );

    // 최대 2개까지 교체
    for (let i = 0; i < Math.min(2, nonZeroTypes.length, zeroMultiplierChoices.length); i++) {
      const typeInfo = nonZeroTypes[i];
      const typeMoves = allMoves.filter((move) => move.type_id === typeInfo.typeId);
      if (typeMoves.length > 0) {
        const randomMove = typeMoves[Math.floor(Math.random() * typeMoves.length)];
        const replaceIndex = choices.findIndex((choice) => choice.multiplier === 0);
        if (replaceIndex !== -1) {
          choices[replaceIndex] = {
            id: randomMove.id.toString(),
            name: randomMove.koreanName,
            typeId: randomMove.type_id,
            typeName: TYPE_ID_TO_KOREAN_NAME[randomMove.type_id] || "unknown",
            multiplier: typeInfo.multiplier,
            power: randomMove.power || 0,
            isCorrect: randomMove.id.toString() === correctMoveId,
            isSelected: false,
          };
        }
      }
    }
  }

  return { choices, correctAnswer: correctMoveId };
}

/**
 * 보기 생성: 정답 기술을 포함하여 4개의 서로 다른 타입 기술 선택 (구버전)
 */
export function generateMoveChoices(
  correctMove: MoveChoice,
  allMoves: (CsvMove & { koreanName: string })[],
  defenderTypes: string[],
  typeMap: TypeMap,
  computeAttackMultiplier: (attackType: string, defenderTypes: string[], typeMap: TypeMap) => number
): MoveChoice[] {
  const choices: MoveChoice[] = [correctMove];
  const usedTypeIds = new Set([correctMove.typeId]);

  // 다른 타입들의 기술을 선택하여 보기 채우기
  while (choices.length < 4) {
    // 랜덤 타입 선택 (사용하지 않은 타입)
    const availableTypes = Object.keys(TYPE_ID_TO_KOREAN_NAME)
      .map(Number)
      .filter((typeId) => !usedTypeIds.has(typeId));

    if (availableTypes.length === 0) break;

    const randomTypeId = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    usedTypeIds.add(randomTypeId);

    // 해당 타입의 랜덤 기술 선택
    const typeMoves = allMoves.filter((move) => move.type_id === randomTypeId);
    if (typeMoves.length === 0) continue;

    const randomMove = typeMoves[Math.floor(Math.random() * typeMoves.length)];

    const englishType = Object.keys(TYPE_ID_TO_KOREAN_NAME).find(
      (key) => Number(key) === randomTypeId
    );

    if (!englishType) continue;

    const multiplier = computeAttackMultiplier(englishType, defenderTypes, typeMap);

    choices.push({
      id: randomMove.id.toString(),
      name: randomMove.koreanName,
      typeId: randomMove.type_id,
      typeName: TYPE_ID_TO_KOREAN_NAME[randomMove.type_id] || "unknown",
      multiplier,
      power: randomMove.power || 0,
    });
  }

  // 셔플
  return choices.sort(() => Math.random() - 0.5);
}
