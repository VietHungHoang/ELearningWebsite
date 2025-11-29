import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getCountries, getLanguages } from '../services/commonService';
import { getCachedData } from '../utils/apiCache';

interface CommonContextType {
  countries: any[];
  languages: any[];
  loading: boolean;
  error: string | null;
}

const CommonContext = createContext<CommonContextType | undefined>(undefined);

export const useCommon = () => {
  const context = useContext(CommonContext);
  if (!context) {
    throw new Error('useCommon must be used within CommonProvider');
  }
  return context;
};

interface ProviderProps {
  children: ReactNode;
}

export const CommonProvider: React.FC<ProviderProps> = ({ children }) => {
  const [countries, setCountries] = useState<any[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [countriesData, languagesData] = await Promise.all([
          getCachedData('countries', () => getCountries()),
          getCachedData('languages', () => getLanguages())
        ]);
        setCountries(countriesData as any[]);
        setLanguages(languagesData as any[]);
      } catch (err) {
        setError('Failed to load countries/languages');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <CommonContext.Provider value={{ countries, languages, loading, error }}>
      {children}
    </CommonContext.Provider>
  );
};