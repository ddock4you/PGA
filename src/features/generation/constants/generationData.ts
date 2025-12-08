import type { GenerationInfo } from "../types/generationTypes";

// 세대별 대표 version group 매핑 (기술 필터링에 사용)
export const GENERATION_VERSION_GROUP_MAP: Record<string, string> = {
  "1": "red-blue",
  "2": "gold-silver",
  "3": "ruby-sapphire",
  "4": "diamond-pearl",
  "5": "black-white",
  "6": "x-y",
  "7": "sun-moon",
  "8": "sword-shield",
  "9": "scarlet-violet",
};

export const GENERATION_GAME_MAPPING: GenerationInfo[] = [
  {
    id: "1",
    name: "1세대",
    versions: [
      { id: "red", name: "빨강", color: "bg-red-500", generationId: "1" },
      { id: "blue", name: "파랑", color: "bg-blue-500", generationId: "1" },
      { id: "yellow", name: "노랑", color: "bg-yellow-500", generationId: "1" },
    ],
  },
  {
    id: "2",
    name: "2세대",
    versions: [
      { id: "gold", name: "금", color: "bg-yellow-600", generationId: "2" },
      { id: "silver", name: "은", color: "bg-gray-400", generationId: "2" },
      { id: "crystal", name: "크리스탈", color: "bg-purple-400", generationId: "2" },
    ],
  },
  {
    id: "3",
    name: "3세대",
    versions: [
      { id: "ruby", name: "루비", color: "bg-red-600", generationId: "3" },
      { id: "sapphire", name: "사파이어", color: "bg-blue-600", generationId: "3" },
      { id: "emerald", name: "에메랄드", color: "bg-emerald-500", generationId: "3" },
      { id: "firered", name: "파이어레드", color: "bg-red-500", generationId: "3" },
      { id: "leafgreen", name: "리프그린", color: "bg-green-500", generationId: "3" },
    ],
  },
  {
    id: "4",
    name: "4세대",
    versions: [
      { id: "diamond", name: "다이아몬드", color: "bg-cyan-400", generationId: "4" },
      { id: "pearl", name: "펄", color: "bg-pink-400", generationId: "4" },
      { id: "platinum", name: "플래티나", color: "bg-gray-500", generationId: "4" },
      { id: "heartgold", name: "하트골드", color: "bg-yellow-500", generationId: "4" },
      { id: "soulsilver", name: "소울실버", color: "bg-gray-300", generationId: "4" },
    ],
  },
  {
    id: "5",
    name: "5세대",
    versions: [
      { id: "black", name: "블랙", color: "bg-gray-800", generationId: "5" },
      { id: "white", name: "화이트", color: "bg-gray-100", generationId: "5" },
      { id: "black-2", name: "블랙2", color: "bg-gray-700", generationId: "5" },
      { id: "white-2", name: "화이트2", color: "bg-gray-200", generationId: "5" },
    ],
  },
  {
    id: "6",
    name: "6세대",
    versions: [
      { id: "x", name: "X", color: "bg-red-500", generationId: "6" },
      { id: "y", name: "Y", color: "bg-blue-500", generationId: "6" },
      { id: "omega-ruby", name: "오메가루비", color: "bg-red-700", generationId: "6" },
      { id: "alpha-sapphire", name: "알파사파이어", color: "bg-blue-700", generationId: "6" },
    ],
  },
  {
    id: "7",
    name: "7세대",
    versions: [
      { id: "sun", name: "썬", color: "bg-orange-400", generationId: "7" },
      { id: "moon", name: "문", color: "bg-indigo-500", generationId: "7" },
      { id: "ultra-sun", name: "울트라썬", color: "bg-orange-500", generationId: "7" },
      { id: "ultra-moon", name: "울트라문", color: "bg-indigo-600", generationId: "7" },
    ],
  },
  {
    id: "8",
    name: "8세대",
    versions: [
      { id: "sword", name: "소드", color: "bg-slate-600", generationId: "8" },
      { id: "shield", name: "실드", color: "bg-amber-600", generationId: "8" },
      {
        id: "brilliant-diamond",
        name: "브릴리언트 다이아몬드",
        color: "bg-cyan-500",
        generationId: "8",
      },
      { id: "shining-pearl", name: "샤이닝 펄", color: "bg-pink-500", generationId: "8" },
      {
        id: "legends-arceus",
        name: "레전드 아르세우스",
        color: "bg-purple-600",
        generationId: "8",
      },
    ],
  },
  {
    id: "9",
    name: "9세대",
    versions: [
      { id: "scarlet", name: "스칼렛", color: "bg-red-400", generationId: "9" },
      { id: "violet", name: "바이올렛", color: "bg-purple-400", generationId: "9" },
    ],
  },
];
