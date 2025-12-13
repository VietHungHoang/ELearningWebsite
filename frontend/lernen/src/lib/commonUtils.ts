import countries from 'world-countries';
import ISO6391 from 'iso-639-1';

// Get all countries with their names and codes
const getAllCountries = () => {
    return countries
        .map((country) => ({
            name: country.name.common,
            code: country.cca2,
            flag: country.flag,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
};

// Get all languages with their names and codes
const getAllLanguages = () => {
    const allLanguageCodes = ISO6391.getAllCodes();
    return allLanguageCodes
        .map((code) => ({
            code,
            name: ISO6391.getName(code),
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
};

// Get country by name
const getCountryByName = (name: string) => {
    return getAllCountries().find((country) => country.name === name);
};

// Get all timezones
const getAllTimezones = () => {
    const timezones = Intl.supportedValuesOf('timeZone');
    return timezones
        .map((tz, index) => ({
            id: `tz-${index}`,
            name: tz,
            offset: '', // Có thể tính offset nếu cần
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

export default {
    getAllCountries,
    getAllLanguages,
    getAllTimezones,
    getCountryByName,
    getLanguageByName,
    getTimezoneByName,
};

