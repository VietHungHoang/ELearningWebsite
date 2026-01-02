import countries from 'world-countries';
import ISO6391 from 'iso-639-1';
import apiService from '../services/apiService';
import type { Country, Language, Subject, Category, Timezone } from '../types/common';

const getAllCountries = (): Country[] => {
    return countries
        .map((country): Country => ({
            code: country.cca2,
            name: country.name.common,
            flag: country.flag,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
};

const getAllLanguages = (): Language[] => {
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

// Clear subjects and categories cache - call this when data might be stale
const clearSubjectsCache = (): void => {
    localStorage.removeItem('subjects');
    localStorage.removeItem('categories');
    console.log('Cleared subjects and categories cache');
};

// Get subjects - always fetch from API first, use cache only when API fails
const getSubjects = async (): Promise<Subject[]> => {
    try {
        // Always try to fetch from API first to get latest data
        const response = await apiService.get<Subject[]>('/v1/public/common/subjects');
        if (response.data && response.data.length > 0) {
            localStorage.setItem('subjects', JSON.stringify(response.data));
            return response.data;
        }
    } catch (error) {
        console.warn('Failed to fetch subjects from API:', error);
    }
    
    // Fallback to cache if API fails
    const cached = localStorage.getItem('subjects');
    if (cached) {
        const parsedCache = JSON.parse(cached);
        if (parsedCache && parsedCache.length > 0) {
            console.log('Using cached subjects:', parsedCache.length, 'items');
            return parsedCache;
        }
    }
    
    // No cache and no API - return empty array (no mock data to avoid ID mismatch)
    console.warn('No subjects available from API or cache');
    return [];
};

// Get categories - always fetch from API first, use cache only when API fails
const getCategories = async (): Promise<Category[]> => {
    try {
        // Always try to fetch from API first to get latest data
        const response = await apiService.get<Category[]>('/v1/public/common/categories');
        if (response.data && response.data.length > 0) {
            localStorage.setItem('categories', JSON.stringify(response.data));
            return response.data;
        }
    } catch (error) {
        console.warn('Failed to fetch categories from API:', error);
    }
    
    // Fallback to cache if API fails
    const cached = localStorage.getItem('categories');
    if (cached) {
        const parsedCache = JSON.parse(cached);
        if (parsedCache && parsedCache.length > 0) {
            console.log('Using cached categories:', parsedCache.length, 'items');
            return parsedCache;
        }
    }
    
    // No cache and no API - return empty array
    console.warn('No categories available from API or cache');
    return [];
};

// Convert date and time from UTC to selected timezone datetime string
const convertToLocalDateTime = (date: Date, timeStr: string, selectedTimezone: Timezone | null): string => {
    // Parse timeStr (e.g., "10:00 AM" -> hours and minutes) as UTC time
    const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!timeMatch) return "";

    let hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);
    const ampm = timeMatch[3].toUpperCase();

    if (ampm === "PM" && hours !== 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;

    // Create date object with the selected date and parsed time as UTC
    const dateTime = new Date(date);
    dateTime.setHours(hours, minutes, 0, 0);

    // Add selected timezone offset to get local time
    if (selectedTimezone) {
        const offsetMatch = selectedTimezone.offset.match(/([+-])(\d{1,2}):(\d{2})/);
        if (offsetMatch) {
            const sign = offsetMatch[1] === "+" ? 1 : -1; // Add offset
            const offsetHours = parseInt(offsetMatch[2]);
            const offsetMinutes = parseInt(offsetMatch[3]);
            dateTime.setHours(dateTime.getHours() + sign * offsetHours);
            dateTime.setMinutes(dateTime.getMinutes() + sign * offsetMinutes);
        }
    }

    // Return local time ISO string in selected timezone
    // Format: "2025-12-17T17:00:00" for UTC 10:00 +7 hours
    // Note: This creates an ISO string in local timezone
    const year = dateTime.getFullYear();
    const month = String(dateTime.getMonth() + 1).padStart(2, '0');
    const day = String(dateTime.getDate()).padStart(2, '0');
    const hourStr = String(dateTime.getHours()).padStart(2, '0');
    const minuteStr = String(dateTime.getMinutes()).padStart(2, '0');
    const seconds = String(dateTime.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hourStr}:${minuteStr}:${seconds}`;
};

// Convert time slot from UTC to selected timezone
const convertTimeSlotToTimezone = (timeSlot: string, timezone: Timezone | null): string => {
    if (!timezone) return timeSlot;

    // Parse timeSlot (e.g., "9:00 AM")
    const timeMatch = timeSlot.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!timeMatch) return timeSlot;

    let hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);
    const ampm = timeMatch[3].toUpperCase();

    if (ampm === "PM" && hours !== 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;

    // Create UTC date
    const utcDate = new Date();
    utcDate.setHours(hours, minutes, 0, 0);

    // Add timezone offset
    const offsetMatch = timezone.offset.match(/([+-])(\d{1,2}):(\d{2})/);
    if (offsetMatch) {
        const sign = offsetMatch[1] === "+" ? 1 : -1;
        const offsetHours = parseInt(offsetMatch[2]);
        const offsetMinutes = parseInt(offsetMatch[3]);
        utcDate.setHours(utcDate.getHours() + sign * offsetHours);
        utcDate.setMinutes(utcDate.getMinutes() + sign * offsetMinutes);
    }

    // Format back to 12h
    const localHours = utcDate.getHours();
    const localMinutes = utcDate.getMinutes();
    const period = localHours >= 12 ? "PM" : "AM";
    const displayHours = localHours % 12 || 12;
    return `${displayHours}:${localMinutes.toString().padStart(2, "0")} ${period}`;
};

/**
 * Convert UTC datetime string to local Date object
 * Backend returns datetime in UTC format (e.g., "2025-12-25T00:00")
 * This function converts it to the user's local timezone
 * @param utcDateTimeString - UTC datetime string from backend (format: "YYYY-MM-DDTHH:mm" or "YYYY-MM-DDTHH:mm:ss")
 * @returns Date object in user's local timezone
 */
const convertUTCToLocalDate = (utcDateTimeString: string): Date => {
    // Add 'Z' suffix if not present to indicate UTC
    const utcString = utcDateTimeString.endsWith('Z') ? utcDateTimeString : `${utcDateTimeString}Z`;
    return new Date(utcString);
};

/**
 * Convert UTC datetime string to local date string (for date comparison)
 * @param utcDateTimeString - UTC datetime string from backend
 * @returns Local date string (e.g., "Mon Dec 25 2025")
 */
const convertUTCToLocalDateString = (utcDateTimeString: string): string => {
    const localDate = convertUTCToLocalDate(utcDateTimeString);
    return localDate.toDateString();
};

/**
 * Get user's current timezone
 * @returns Timezone string (e.g., "Asia/Ho_Chi_Minh")
 */
const getUserTimezone = (): string => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Format UTC datetime to local time string
 * @param utcDateTimeString - UTC datetime string from backend
 * @param options - Intl.DateTimeFormatOptions for formatting
 * @returns Formatted local time string
 */
const formatUTCToLocalTime = (
    utcDateTimeString: string,
    options?: Intl.DateTimeFormatOptions
): string => {
    const localDate = convertUTCToLocalDate(utcDateTimeString);
    return localDate.toLocaleString(undefined, options);
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
    clearSubjectsCache,
    convertToLocalDateTime,
    convertTimeSlotToTimezone,
    convertUTCToLocalDate,
    convertUTCToLocalDateString,
    getUserTimezone,
    formatUTCToLocalTime,
};
