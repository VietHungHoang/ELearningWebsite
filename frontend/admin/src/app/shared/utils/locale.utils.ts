import { Injectable } from '@angular/core';
import countries from 'world-countries';
import ISO6391 from 'iso-639-1';
import * as currencyCodes from 'currency-codes';

@Injectable({
    providedIn: 'root'
})
export class LocaleUtilsService {
    // Get all countries with their names and codes
    getAllCountries() {
        return countries
            .map((country) => ({
                name: country.name.common,
                code: country.cca2,
                flag: country.flag,
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }

    // Get all languages with their names and codes
    getAllLanguages() {
        const allLanguageCodes = ISO6391.getAllCodes();
        return allLanguageCodes
            .map((code) => ({
                code,
                name: ISO6391.getName(code),
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }

    // Get country by name
    getCountryByName(name: string) {
        return this.getAllCountries().find((country) => country.name === name);
    }

    // Get all timezones
    getAllTimezones() {
        const timezones = Intl.supportedValuesOf('timeZone');
        return timezones
            .map((tz, index) => {
                const offset = this.getTimezoneOffset(tz);
                return {
                    id: `tz-${index}`,
                    name: tz,
                    offset: offset,
                };
            })
            .sort((a, b) => a.name.localeCompare(b.name));
    }

    // Get timezone offset in UTC format
    private getTimezoneOffset(timezone: string): string {
        try {
            const now = new Date();
            const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
            const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
            const offsetMinutes = (tzDate.getTime() - utcDate.getTime()) / 60000;
            const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
            const offsetMins = Math.abs(offsetMinutes) % 60;
            const sign = offsetMinutes >= 0 ? '+' : '-';
            return `UTC${sign}${offsetHours}${offsetMins > 0 ? ':' + offsetMins.toString().padStart(2, '0') : ''}`;
        } catch {
            return 'UTC';
        }
    }

    // Get language by name
    getLanguageByName(name: string) {
        return this.getAllLanguages().find((language) => language.name === name);
    }

    // Get timezone by name
    getTimezoneByName(name: string) {
        return this.getAllTimezones().find((timezone) => timezone.name === name);
    }

    // Get language name by code
    getLanguageName(code: string): string {
        return ISO6391.getName(code) || code;
    }

    // Get country by code
    getCountryByCode(code: string) {
        return countries.find((country) => country.cca2 === code);
    }

    // Get all currencies
    getAllCurrencies() {
        return currencyCodes.data
            .map((currency: any) => ({
                code: currency.code,
                name: currency.currency,
                countries: currency.countries || []
            }))
            .sort((a: any, b: any) => a.code.localeCompare(b.code));
    }

    // Get currency by code
    getCurrencyByCode(code: string) {
        const currency = currencyCodes.code(code);
        return currency ? {
            code: currency.code,
            name: currency.currency,
            countries: currency.countries || []
        } : null;
    }
}
