import { Injectable, signal, computed } from '@angular/core';

export type SupportedCurrency = 'VND' | 'USD' | 'EUR';

export interface CurrencyInfo {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  rate: number; // Exchange rate relative to USD
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private readonly STORAGE_KEY = 'app_currency';
  private readonly DEFAULT_CURRENCY: SupportedCurrency = 'USD';

  // Exchange rates (relative to USD)
  private readonly EXCHANGE_RATES: Record<SupportedCurrency, number> = {
    USD: 1,
    VND: 23000,
    EUR: 0.85
  };

  // Currency information
  private readonly CURRENCIES: Record<SupportedCurrency, CurrencyInfo> = {
    USD: {
      code: 'USD',
      symbol: '$',
      name: 'US Dollar',
      rate: 1
    },
    VND: {
      code: 'VND',
      symbol: '₫',
      name: 'Vietnamese Dong',
      rate: 23000
    },
    EUR: {
      code: 'EUR',
      symbol: '€',
      name: 'Euro',
      rate: 0.85
    }
  };

  private currentCurrency = signal<SupportedCurrency>(this.getStoredCurrency());

  public readonly currentCurrency$ = computed(() => this.currentCurrency());
  public readonly currentCurrencyInfo$ = computed(() => this.CURRENCIES[this.currentCurrency()]);

  constructor() {
    // Initialize with stored currency
    const stored = this.getStoredCurrency();
    this.currentCurrency.set(stored);
  }

  /**
   * Get stored currency from localStorage or default
   */
  private getStoredCurrency(): SupportedCurrency {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem(this.STORAGE_KEY) as SupportedCurrency;
      if (stored && (stored === 'USD' || stored === 'VND' || stored === 'EUR')) {
        return stored;
      }
    }
    return this.DEFAULT_CURRENCY;
  }

  /**
   * Set current currency
   */
  setCurrency(currency: SupportedCurrency): void {
    if (this.currentCurrency() === currency) {
      return;
    }

    this.currentCurrency.set(currency);

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.STORAGE_KEY, currency);
    }
  }

  /**
   * Get current currency code
   */
  getCurrentCurrency(): SupportedCurrency {
    return this.currentCurrency();
  }

  /**
   * Get current currency info
   */
  getCurrentCurrencyInfo(): CurrencyInfo {
    return this.CURRENCIES[this.currentCurrency()];
  }

  /**
   * Convert amount from one currency to another
   */
  convert(amount: number, from: SupportedCurrency, to: SupportedCurrency): number {
    if (from === to) {
      return amount;
    }

    // Convert to USD first (as base currency)
    const amountInUSD = amount / this.EXCHANGE_RATES[from];

    // Then convert to target currency
    return amountInUSD * this.EXCHANGE_RATES[to];
  }

  /**
   * Convert amount to current currency
   */
  convertToCurrent(amount: number, from: SupportedCurrency = 'USD'): number {
    return this.convert(amount, from, this.currentCurrency());
  }

  /**
   * Format amount in current currency
   */
  format(amount: number, sourceCurrency: SupportedCurrency = 'USD'): string {
    const convertedAmount = this.convertToCurrent(amount, sourceCurrency);
    const currentCurrency = this.currentCurrency();
    const currencyInfo = this.CURRENCIES[currentCurrency];

    // Format based on currency with number + currency code
    let formattedNumber: string;

    switch (currentCurrency) {
      case 'VND':
        formattedNumber = new Intl.NumberFormat('vi-VN', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(convertedAmount);
        return `${formattedNumber} VND`;

      case 'EUR':
        formattedNumber = new Intl.NumberFormat('de-DE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(convertedAmount);
        return `${formattedNumber} EUR`;

      case 'USD':
      default:
        formattedNumber = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(convertedAmount);
        return `${formattedNumber} USD`;
    }
  }

  /**
   * Get all available currencies
   */
  getAllCurrencies(): CurrencyInfo[] {
    return Object.values(this.CURRENCIES);
  }

  /**
   * Get currency symbol
   */
  getCurrencySymbol(currency?: SupportedCurrency): string {
    const curr = currency || this.currentCurrency();
    return this.CURRENCIES[curr].symbol;
  }
}
