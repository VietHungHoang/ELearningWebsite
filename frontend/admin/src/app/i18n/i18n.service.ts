import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type SupportedLanguage = 'en' | 'vi';

interface Translations {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private readonly STORAGE_KEY = 'app_language';
  private readonly DEFAULT_LANGUAGE: SupportedLanguage = 'en';
  
  private currentLanguage = signal<SupportedLanguage>(this.getStoredLanguage());
  private translations = signal<Translations>({});
  
  public readonly currentLanguage$ = computed(() => this.currentLanguage());
  public readonly translations$ = computed(() => this.translations());

  constructor() {
    this.loadTranslations(this.currentLanguage());
  }

  /**
   * Get stored language from localStorage or default
   */
  private getStoredLanguage(): SupportedLanguage {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem(this.STORAGE_KEY) as SupportedLanguage;
      if (stored && (stored === 'en' || stored === 'vi')) {
        return stored;
      }
    }
    return this.DEFAULT_LANGUAGE;
  }

  /**
   * Load translations for the specified language
   */
  private async loadTranslations(lang: SupportedLanguage): Promise<void> {
    try {
      const translations = await import(`./locales/${lang}.json`);
      this.translations.set(translations.default);
    } catch (error) {
      console.error(`Failed to load translations for language: ${lang}`, error);
      // Fallback to English if loading fails
      if (lang !== 'en') {
        const fallback = await import(`./locales/en.json`);
        this.translations.set(fallback.default);
      }
    }
  }

  /**
   * Change the current language
   */
  async setLanguage(lang: SupportedLanguage): Promise<void> {
    if (this.currentLanguage() === lang) {
      return;
    }

    this.currentLanguage.set(lang);
    
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.STORAGE_KEY, lang);
    }

    await this.loadTranslations(lang);
  }

  /**
   * Get translation by key path (e.g., 'dashboard.overview.totalCourses.title')
   */
  translate(key: string, params?: { [key: string]: string | number }): string {
    const translations = this.translations();
    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    if (typeof value !== 'string') {
      console.warn(`Translation value is not a string for key: ${key}`);
      return key;
    }

    // Replace parameters if provided
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }

    return value;
  }

  /**
   * Get current language
   */
  getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguage();
  }

  /**
   * Get all supported languages
   */
  getSupportedLanguages(): SupportedLanguage[] {
    return ['en', 'vi'];
  }
}

