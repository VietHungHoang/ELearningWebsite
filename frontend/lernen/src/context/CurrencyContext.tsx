import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { CurrencyCode } from '../utils/currencyHelper';
import { getDisplayFormat } from '../utils/currencyHelper';

interface CurrencyContextType {
  selectedCurrency: CurrencyCode;
  setSelectedCurrency: (currency: CurrencyCode) => void;
  currencyDisplay: string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  // Load saved currency from localStorage or default to VND
  const [selectedCurrency, setSelectedCurrencyState] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('selectedCurrency');
    return (saved as CurrencyCode) || 'VND';
  });

  // Save to localStorage whenever currency changes
  useEffect(() => {
    localStorage.setItem('selectedCurrency', selectedCurrency);
  }, [selectedCurrency]);

  const setSelectedCurrency = (currency: CurrencyCode) => {
    setSelectedCurrencyState(currency);
  };

  const currencyDisplay = getDisplayFormat(selectedCurrency);

  return (
    <CurrencyContext.Provider value={{ selectedCurrency, setSelectedCurrency, currencyDisplay }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
