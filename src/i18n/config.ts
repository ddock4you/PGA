import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const SUPPORTED_LANGUAGES = ["ko", "en", "ja"] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = "ko";

const resources = {
  ko: {
    translation: {
      "app.title": "포켓몬 게임 어시스턴트",
      "nav.dex": "도감",
      "nav.training": "배틀 트레이닝",
    },
  },
  en: {
    translation: {
      "app.title": "Pokemon Game Assistant",
      "nav.dex": "dex",
      "nav.training": "Battle Training",
    },
  },
  ja: {
    translation: {
      "app.title": "ポケモンゲームアシスタント",
      "nav.dex": "図鑑",
      "nav.training": "バトルトレーニング",
    },
  },
} as const;

export function initI18n() {
  if (!i18n.isInitialized) {
    void i18n.use(initReactI18next).init({
      resources,
      lng: DEFAULT_LANGUAGE,
      fallbackLng: "en",
      interpolation: {
        escapeValue: false,
      },
    });
  }

  return i18n;
}
