import React from 'react';
import { GB, VN } from 'country-flag-icons/react/3x2';

// Currency options - matches CurrencyHelper currencies
export const currencyOptions = [
  'VND ₫',
  'USD $',
  'GBP £',
  'JPY ¥'
];

export interface LanguageOption {
  name: string;
  code: string;
  icon: React.ReactElement;
}

export const languageOptions: LanguageOption[] = [
  { name: 'En', code: 'en', icon: <GB /> },
  { name: 'Vi', code: 'vi', icon: <VN /> },
];