import countries from 'world-countries';
import ISO6391 from 'iso-639-1';
import apiService from '../services/apiService';
import type { Country, Language, Subject, Category } from '../types/common';

const getAllCountries = ():Country[] => {
    return countries
        .map((country):Country => ({
            code: country.cca2,
            name: country.name.common,
            flag: country.flag,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
};

const getAllLanguages = ():Language[] => {
    const allLanguageCodes = ISO6391.getAllCodes();
    return allLanguageCodes
        .map((code) => ({
            code,
            name: ISO6391.getName(code),
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
};

const getCountryByName = (name: string) => {
    return getAllCountries().find((country) => country.name === name);
};

const getAllTimezones = () => {
    const timezones = Intl.supportedValuesOf('timeZone');
    
    // Function to calculate UTC offset for a timezone
    const getTimezoneOffset = (timezone: string) => {
        const now = new Date();
        const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
        const targetDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
        const diff = targetDate.getTime() - utcDate.getTime();
        const hours = Math.floor(Math.abs(diff) / (1000 * 60 * 60));
        const minutes = Math.floor((Math.abs(diff) % (1000 * 60 * 60)) / (1000 * 60));
        const sign = diff >= 0 ? '+' : '-';
        return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };
    
    return timezones
        .map((tz, index) => ({
            code: `tz-${index}`,
            name: tz,
            offset: getTimezoneOffset(tz),
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
};
// Get language by name
const getLanguageByName = (name: string) => {
    return getAllLanguages().find((language) => language.name === name);
};

// Get timezone by name
const getTimezoneByName = (name: string) => {
    return getAllTimezones().find((timezone) => timezone.name === name);
};

// Get subjects from localStorage or API
const getSubjects = async (): Promise<Subject[]> => {
    const cached = localStorage.getItem('subjects');
    if (cached) {
        return JSON.parse(cached);
    }
    try {
        const response = await apiService.get<Subject[]>('/v1/public/common/subjects');
        localStorage.setItem('subjects', JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        console.warn('Failed to fetch subjects:', error);
        return [];
    }
};

// Get categories from localStorage or API
const getCategories = async (): Promise<Category[]> => {
    const cached = localStorage.getItem('categories');
    if (cached) {
        return JSON.parse(cached);
    }
    try {
        const response = await apiService.get<Category[]>('/v1/public/common/categories');
        localStorage.setItem('categories', JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        console.warn('Failed to fetch categories:', error);
        return [];
    }
};

export default {
    getAllCountries,
    getAllLanguages,
    getAllTimezones,
    getCountryByName,
    getLanguageByName,
    getTimezoneByName,
    getSubjects,
    getCategories,
};
