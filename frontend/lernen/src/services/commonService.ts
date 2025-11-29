import apiService from './apiService';
import type { TimezoneResponse } from '../types/api';

export interface Country {
  id: string; // UUID
  name: string;
}

export interface Language {
  id: string; // UUID
  name: string;
  code: string; // e.g., "en", "vi"
}

export interface Subject {
  id: string; // UUID
  name: string;
}

const mockTimezones: TimezoneResponse[] = [
  { id: '1', name: 'Pacific/Midway', utcOffset: '-11:00' },
  { id: '2', name: 'Pacific/Honolulu', utcOffset: '-10:00' },
  { id: '3', name: 'America/Anchorage', utcOffset: '-09:00' },
  { id: '4', name: 'America/Los_Angeles', utcOffset: '-08:00' },
  { id: '5', name: 'America/Denver', utcOffset: '-07:00' },
  { id: '6', name: 'America/Chicago', utcOffset: '-06:00' },
  { id: '7', name: 'America/New_York', utcOffset: '-05:00' },
  { id: '8', name: 'America/Caracas', utcOffset: '-04:00' },
  { id: '9', name: 'America/Sao_Paulo', utcOffset: '-03:00' },
  { id: '10', name: 'Atlantic/Azores', utcOffset: '-01:00' },
  { id: '11', name: 'Europe/London', utcOffset: '+00:00' },
  { id: '12', name: 'Europe/Paris', utcOffset: '+01:00' },
  { id: '13', name: 'Europe/Helsinki', utcOffset: '+02:00' },
  { id: '14', name: 'Europe/Moscow', utcOffset: '+03:00' },
  { id: '15', name: 'Asia/Dubai', utcOffset: '+04:00' },
  { id: '16', name: 'Asia/Karachi', utcOffset: '+05:00' },
  { id: '17', name: 'Asia/Dhaka', utcOffset: '+06:00' },
  { id: '18', name: 'Asia/Bangkok', utcOffset: '+07:00' },
  { id: '19', name: 'Asia/Ho_Chi_Minh', utcOffset: '+07:00' },
  { id: '20', name: 'Asia/Singapore', utcOffset: '+08:00' },
  { id: '21', name: 'Asia/Tokyo', utcOffset: '+09:00' },
  { id: '22', name: 'Australia/Sydney', utcOffset: '+10:00' },
  { id: '23', name: 'Pacific/Guadalcanal', utcOffset: '+11:00' },
  { id: '24', name: 'Pacific/Auckland', utcOffset: '+12:00' },
];

const mockCountries: Country[] = [
  { id: 'c1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6', name: 'Afghanistan' },
  { id: 'c2a3b4c5-d6e7-f8g9-h0i1-j2k3l4m5n6o7', name: 'United States' },
  { id: 'c3a4b5c6-d7e8-f9g0-h1i2-j3k4l5m6n7o8', name: 'Singapore' },
  { id: 'c4a5b6c7-d8e9-f0g1-h2i3-j4k5l6m7n8o9', name: 'Japan' },
  { id: 'c5a6b7c8-d9e0-f1g2-h3i4-j5k6l7m8n9o0', name: 'Korea' },
  { id: 'c6a7b8c9-d0e1-f2g3-h4i5-j6k7l8m9n0o1', name: 'Thailand' },
  { id: 'c7a8b9c0-d1e2-f3g4-h5i6-j7k8l9m0n1o2', name: 'Australia' },
  { id: 'c8a9b0c1-d2e3-f4g5-h6i7-j8k9l0m1n2o3', name: 'Canada' },
  { id: 'c9a0b1c2-d3e4-f5g6-h7i8-j9k0l1m2n3o4', name: 'United Kingdom' },
  { id: 'c0a1b2c3-d4e5-f6g7-h8i9-j0k1l2m3n4o5', name: 'Vietnam' },
];

const mockLanguages: Language[] = [
  { id: 'l1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6', name: 'Georgian', code: 'ka' },
  { id: 'l2a3b4c5-d6e7-f8g9-h0i1-j2k3l4m5n6o7', name: 'English', code: 'en' },
  { id: 'l3a4b5c6-d7e8-f9g0-h1i2-j3k4l5m6n7o8', name: 'Vietnamese', code: 'vi' },
  { id: 'l4a5b6c7-d8e9-f0g1-h2i3-j4k5l6m7n8o9', name: 'Spanish', code: 'es' },
  { id: 'l5a6b7c8-d9e0-f1g2-h3i4-j5k6l7m8n9o0', name: 'French', code: 'fr' },
  { id: 'l6a7b8c9-d0e1-f2g3-h4i5-j6k7l8m9n0o1', name: 'German', code: 'de' },
  { id: 'l7a8b9c0-d1e2-f3g4-h5i6-j7k8l9m0n1o2', name: 'Chinese', code: 'zh' },
  { id: 'l8a9b0c1-d2e3-f4g5-h6i7-j8k9l0m1n2o3', name: 'Dutch', code: 'nl' },
];

const mockSubjects: Subject[] = [
  { id: 's1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6', name: 'Mathematics' },
  { id: 's2a3b4c5-d6e7-f8g9-h0i1-j2k3l4m5n6o7', name: 'Physics' },
  { id: 's3a4b5c6-d7e8-f9g0-h1i2-j3k4l5m6n7o8', name: 'Chemistry' },
  { id: 's4a5b6c7-d8e9-f0g1-h2i3-j4k5l6m7n8o9', name: 'Biology' },
  { id: 's5a6b7c8-d9e0-f1g2-h3i4-j5k6l7m8n9o0', name: 'English Literature' },
  { id: 's6a7b8c9-d0e1-f2g3-h4i5-j6k7l8m9n0o1', name: 'History' },
  { id: 's7a8b9c0-d1e2-f3g4-h5i6-j7k8l9m0n1o2', name: 'Geography' },
  { id: 's8a9b0c1-d2e3-f4g5-h6i7-j8k9l0m1n2o3', name: 'Computer Science' },
];

export const getTimezones = async (): Promise<TimezoneResponse[]> => {
  try {
    const response = await apiService.get('/v1/common/timezones');
    return response.data as TimezoneResponse[];
  } catch (error) {
    console.warn('Failed to fetch timezones, using mock data:', error);
    return mockTimezones;
  }
};

export const getCountries = async (): Promise<Country[]> => {
  try {
    const response = await apiService.get<Country[]>('/v1/public/common/countries');
    return response.data;
  } catch (error) {
    console.warn('Failed to fetch countries, using mock data:', error);
    return mockCountries;
  }
};

export const getLanguages = async (): Promise<Language[]> => {
  try {
    const response = await apiService.get<Language[]>('/v1/public/common/languages');
    return response.data;
  } catch (error) {
    console.warn('Failed to fetch languages, using mock data:', error);
    return mockLanguages;
  }
};

export const getSubjects = async (): Promise<Subject[]> => {
  try {
    const response = await apiService.get<Subject[]>('/v1/common/subjects');
    return response.data;
  } catch (error) {
    console.warn('Failed to fetch subjects, using mock data:', error);
    return mockSubjects;
  }
};