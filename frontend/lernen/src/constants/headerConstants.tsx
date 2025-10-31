import React from 'react';
import { GB, DE, FR } from 'country-flag-icons/react/3x2';

export const currencyOptions = ['USD $', 'EUR €', 'GBP £'];

export interface LanguageOption {
  name: string;
  icon: React.ReactElement;
}

export const languageOptions: LanguageOption[] = [
  { name: 'En', icon: <GB /> },
  { name: 'De', icon: <DE /> },
  { name: 'Fr', icon: <FR /> },
];