import { useState, useCallback } from 'react';
import scheduleService from '../services/scheduleService';
import type { 
  TutorAvailability,
  BookedSession,
  GetAvailabilityRequest,
  GetBookedSessionsRequest,
  BulkUpdateAvailabilityRequest
} from '../types/api';

export const useTutorSchedule = () => {
  const [availabilities, setAvailabilities] = useState<TutorAvailability[]>([]);
  const [bookedSessions, setBookedSessions] = useState<BookedSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch availability patterns (recurring patterns like Mon 9-12, Wed 14-17)
  const fetchAvailability = useCallback(async (request: GetAvailabilityRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await scheduleService.getAvailability(request);
      if (response.success) {
        setAvailabilities(response.data.availabilities);
        return { 
          success: true, 
          data: response.data,
          message: response.message 
        };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMessage = 'Failed to fetch availability patterns';
      setError(errorMessage);
      console.error('Error fetching availability:', err);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch booked sessions (actual sessions booked by students)
  const fetchBookedSessions = useCallback(async (request: GetBookedSessionsRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await scheduleService.getBookedSessions(request);
      if (response.success) {
        setBookedSessions(response.data.sessions);
        return { 
          success: true, 
          data: response.data,
          message: response.message 
        };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMessage = 'Failed to fetch booked sessions';
      setError(errorMessage);
      console.error('Error fetching booked sessions:', err);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Bulk update availability (single API call for both modes)
  // - mode='this_period': Apply changes to this week/month only
  // - mode='recurring': Apply changes to all future weeks/months
  const bulkUpdateAvailability = async (request: BulkUpdateAvailabilityRequest) => {
    try {
      setError(null);
      setLoading(true);
      const response = await scheduleService.bulkUpdateAvailability(request);
      if (response.success) {
        // Update availabilities with new data from backend
        setAvailabilities(response.data.availabilities);
        
        return { success: true, message: response.message, data: response.data };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMessage = 'Failed to bulk update availability';
      setError(errorMessage);
      console.error('Error bulk updating availability:', err);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    availabilities,      // Recurring availability patterns
    bookedSessions,     // Actual booked sessions
    loading,
    error,
    
    // Operations
    fetchAvailability,
    fetchBookedSessions,
    bulkUpdateAvailability,
    
    // Utility
    clearError: () => setError(null),
  };
};

