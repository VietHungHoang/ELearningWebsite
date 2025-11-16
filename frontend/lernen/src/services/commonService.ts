import apiService from './apiService';
import type { TimezoneResponse } from '../types/api';

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

export const getTimezones = async (): Promise<TimezoneResponse[]> => {
  try {
    const response = await apiService.get('/v1/common/timezones');
    return response.data as TimezoneResponse[];
  } catch (error) {
    console.warn('Failed to fetch timezones, using mock data:', error);
    return mockTimezones;
  }
};