import countries from 'world-countries';
import ISO6391 from 'iso-639-1';

// Get all countries with their names and codes
export const getAllCountries = () => {
    return countries
        .map((country) => ({
            name: country.name.common,
            code: country.cca2,
            flag: country.flag,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
};

// Get all languages with their names and codes
export const getAllLanguages = () => {
    const allLanguageCodes = ISO6391.getAllCodes();
    return allLanguageCodes
        .map((code) => ({
            code,
            name: ISO6391.getName(code),
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
};

// Get country by name
export const getCountryByName = (name: string) => {
    return getAllCountries().find((country) => country.name === name);
};

// Get language by name
export const getLanguageByName = (name: string) => {
    return getAllLanguages().find((language) => language.name === name);
};

