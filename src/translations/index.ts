import type { Language, Translation } from '@/types';
import { storage } from '@/utils/storage';
import { en } from './en';
import { pt } from './pt';

const translations: Record<Language, Translation> = { en, pt };

class TranslationManager {
  private currentLanguage: Language;
  private listeners: Array<() => void> = [];

  constructor() {
    this.currentLanguage = storage.getLanguage();
  }

  getLanguage(): Language {
    return this.currentLanguage;
  }

  t(): Translation {
    return translations[this.currentLanguage];
  }

  toggleLanguage(): void {
    const newLang: Language = this.currentLanguage === 'en' ? 'pt' : 'en';
    storage.setLanguage(newLang);
    this.currentLanguage = newLang;
    this.notifyListeners();
    window.location.reload();
  }

  onChange(listener: () => void): void {
    this.listeners.push(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach((fn) => fn());
  }
}

export const i18n = new TranslationManager();