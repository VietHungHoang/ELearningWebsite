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

// Mock data for subjects (fallback when API fails)
const MOCK_SUBJECTS: Subject[] = [
    { id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', nameVi: 'Toán học', nameEn: 'Mathematics', categoryId: '11111111-1111-1111-1111-111111111111' },
    { id: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', nameVi: 'Vật lý', nameEn: 'Physics', categoryId: '11111111-1111-1111-1111-111111111111' },
    { id: 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', nameVi: 'Hóa học', nameEn: 'Chemistry', categoryId: '11111111-1111-1111-1111-111111111111' },
    { id: 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', nameVi: 'Sinh học', nameEn: 'Biology', categoryId: '11111111-1111-1111-1111-111111111111' },
    { id: 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b', nameVi: 'Văn học', nameEn: 'Literature', categoryId: '22222222-2222-2222-2222-222222222222' },
    { id: 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c', nameVi: 'Lịch sử', nameEn: 'History', categoryId: '22222222-2222-2222-2222-222222222222' },
    { id: 'a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d', nameVi: 'Địa lý', nameEn: 'Geography', categoryId: '22222222-2222-2222-2222-222222222222' },
    { id: 'b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e', nameVi: 'Tiếng Anh', nameEn: 'English', categoryId: '33333333-3333-3333-3333-333333333333' },
    { id: 'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', nameVi: 'Tiếng Nhật', nameEn: 'Japanese', categoryId: '33333333-3333-3333-3333-333333333333' },
    { id: 'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a', nameVi: 'Tiếng Trung', nameEn: 'Chinese', categoryId: '33333333-3333-3333-3333-333333333333' },
    { id: 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b', nameVi: 'Lập trình', nameEn: 'Programming', categoryId: '44444444-4444-4444-4444-444444444444' },
    { id: 'f2a3b4c5-d6e7-4f8a-9b0c-1d2e3f4a5b6c', nameVi: 'Thiết kế đồ họa', nameEn: 'Graphic Design', categoryId: '44444444-4444-4444-4444-444444444444' },
];

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
        console.warn('Failed to fetch subjects from API, using mock data:', error);
        // Return mock data as fallback
        localStorage.setItem('subjects', JSON.stringify(MOCK_SUBJECTS));
        return MOCK_SUBJECTS;
    }
};

// Mock data for categories (fallback when API fails)
const MOCK_CATEGORIES: Category[] = [
    { id: '1', nameVi: 'Khoa học tự nhiên', nameEn: 'Natural Sciences' },
    { id: '2', nameVi: 'Khoa học xã hội', nameEn: 'Social Sciences' },
    { id: '3', nameVi: 'Ngoại ngữ', nameEn: 'Foreign Languages' },
    { id: '4', nameVi: 'Công nghệ', nameEn: 'Technology' },
    { id: '5', nameVi: 'Nghệ thuật', nameEn: 'Arts' },
];

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
        console.warn('Failed to fetch categories from API, using mock data:', error);
        // Return mock data as fallback
        localStorage.setItem('categories', JSON.stringify(MOCK_CATEGORIES));
        return MOCK_CATEGORIES;
    }
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
    convertToLocalDateTime,
    convertTimeSlotToTimezone,
    convertUTCToLocalDate,
    convertUTCToLocalDateString,
    getUserTimezone,
    formatUTCToLocalTime,
};
