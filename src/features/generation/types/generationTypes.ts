export interface GameVersion {
  id: string;
  name: string;
  color: string; // Tailwind CSS 클래스
  textClass?: string; // Tailwind CSS 클래스 (기본값: text-white)
  generationId: string;
  versionGroup: string;
}

export interface GenerationInfo {
  id: string;
  name: string;
  versions: GameVersion[];
}
