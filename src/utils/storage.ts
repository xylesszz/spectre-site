import type { Language } from '@/types';

const STORAGE_KEYS = {
  LANGUAGE: 'spectre_language'
} as const;

export const storage = {
  getLanguage(): Language {
    const stored = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    if (stored === 'en' || stored === 'pt') return stored;
    return 'en';
  },

  setLanguage(lang: Language): void {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  }
};