/**
 * Currency Helper
 * Provides currency conversion utilities
 * Base currency in DB: VND (Vietnamese Dong)
 */

export type CurrencyCode = 'VND' | 'USD' | 'GBP' | 'JPY';

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
  displayFormat: string; // e.g., "USD $", "GBP £"
}

// Exchange rates (relative to VND)
// These should ideally come from an API for real-time rates
// Current rates as of reference (approximate)
const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  VND: 1,           // Base currency
  USD: 0.000040,    // 1 VND = 0.00004 USD (25,000 VND = 1 USD)
  GBP: 0.000032,    // 1 VND = 0.000032 GBP (31,250 VND = 1 GBP)
  JPY: 0.0060,      // 1 VND = 0.006 JPY (167 VND = 1 JPY)
};

export const CURRENCY_INFO: Record<CurrencyCode, CurrencyInfo> = {
  VND: {
    code: 'VND',
    symbol: '₫',
    name: 'Vietnamese Dong',
    displayFormat: 'VND ₫'
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    displayFormat: 'USD $'
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    displayFormat: 'GBP £'
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    displayFormat: 'JPY ¥'
  }
};

/**
 * Convert from VND (base currency) to target currency
 * @param amountInVND - Amount in Vietnamese Dong
 * @param targetCurrency - Target currency code
 * @returns Converted amount
 */
export function convertFromVND(amountInVND: number, targetCurrency: CurrencyCode): number {
  if (!amountInVND || amountInVND === 0) return 0;
  const rate = EXCHANGE_RATES[targetCurrency];
  return amountInVND * rate;
}

/**
 * Convert from any currency to VND (base currency)
 * @param amount - Amount in source currency
 * @param sourceCurrency - Source currency code
 * @returns Amount in VND
 */
export function convertToVND(amount: number, sourceCurrency: CurrencyCode): number {
  if (!amount || amount === 0) return 0;
  const rate = EXCHANGE_RATES[sourceCurrency];
  return amount / rate;
}

/**
 * Convert between any two currencies
 * @param amount - Amount in source currency
 * @param fromCurrency - Source currency code
 * @param toCurrency - Target currency code
 * @returns Converted amount
 */
export function convertCurrency(
  amount: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode
): number {
  if (!amount || amount === 0) return 0;
  if (fromCurrency === toCurrency) return amount;
  
  // Convert to VND first, then to target currency
  const amountInVND = convertToVND(amount, fromCurrency);
  return convertFromVND(amountInVND, toCurrency);
}

/**
 * Format currency amount for display
 * @param amount - Amount to format
 * @param currency - Currency code
 * @param includeSymbol - Whether to include currency symbol
 * @returns Formatted string
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode,
  includeSymbol: boolean = true
): string {
  if (amount === null || amount === undefined) return '';
  
  const info = CURRENCY_INFO[currency];
  
  // Different formatting based on currency
  let formatted: string;
  
  switch (currency) {
    case 'VND':
      // VND: no decimals, thousands separator
      formatted = Math.round(amount).toLocaleString('vi-VN');
      break;
    case 'JPY':
      // JPY: no decimals
      formatted = Math.round(amount).toLocaleString('ja-JP');
      break;
    case 'USD':
    case 'GBP':
      // USD, GBP: 2 decimals
      formatted = amount.toFixed(2);
      break;
    default:
      formatted = amount.toFixed(2);
  }
  
  return includeSymbol ? `${info.symbol}${formatted}` : formatted;
}

/**
 * Get currency code from display format (e.g., "USD $" -> "USD")
 * @param displayFormat - Display format string
 * @returns Currency code
 */
export function getCurrencyCodeFromDisplay(displayFormat: string): CurrencyCode {
  const code = displayFormat.split(' ')[0] as CurrencyCode;
  return code in CURRENCY_INFO ? code : 'VND';
}

/**
 * Get display format from currency code
 * @param code - Currency code
 * @returns Display format string
 */
export function getDisplayFormat(code: CurrencyCode): string {
  return CURRENCY_INFO[code]?.displayFormat || 'VND ₫';
}

/**
 * Parse currency display format to extract amount and currency
 * @param displayString - String like "$25.00" or "₫500,000"
 * @returns Object with amount and currency code
 */
export function parseCurrencyDisplay(displayString: string): { amount: number; currency: CurrencyCode } {
  // Remove all non-numeric characters except decimal point
  const numericString = displayString.replace(/[^0-9.]/g, '');
  const amount = parseFloat(numericString);
  
  // Detect currency from symbol
  let currency: CurrencyCode = 'VND';
  if (displayString.includes('$')) currency = 'USD';
  else if (displayString.includes('£')) currency = 'GBP';
  else if (displayString.includes('¥')) currency = 'JPY';
  else if (displayString.includes('₫')) currency = 'VND';
  
  return { amount, currency };
}

/**
 * Get all available currencies for dropdown
 */
export function getAvailableCurrencies(): CurrencyInfo[] {
  return Object.values(CURRENCY_INFO);
}
