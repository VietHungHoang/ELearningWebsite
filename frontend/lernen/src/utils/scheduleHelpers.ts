import type { Session } from '../types/class';
import type { TutorAvailability } from '../types/tutor';

/**
 * Generate actual time slots from recurring availability patterns
 * 
 * Example:
 * Input: [{ dayOfWeek: 1, startTime: "09:00", endTime: "12:00" }]
 * Output: All Monday 9-12 slots between startDate and endDate
 * 
 * @param availabilities - Recurring patterns from backend
 * @param startDate - Start of date range
 * @param endDate - End of date range
 * @param slotDurationMinutes - Duration of each slot (default 60 minutes)
 * @returns Array of display slots with datetime
 */
export interface DisplaySlot {
  datetime: Date;
  availabilityId: string;
  isBooked: boolean;
  bookedSession?: Session;
}

export const generateSlotsFromPatterns = (
  availabilities: TutorAvailability[],
  startDate: Date,
  endDate: Date,
  slotDurationMinutes: number = 60
): DisplaySlot[] => {
  const slots: DisplaySlot[] = [];
  
  // Use all availability patterns (no status filtering needed)
  const activePatterns = availabilities;
  
  // Iterate through each day in the range
  const currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0);
  
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Find patterns that apply to this day
    const dayPatterns = activePatterns.filter(pattern => {
      // Check if pattern applies to this day of week
      if (pattern.dayOfWeek !== dayOfWeek) return false;
      
      // Check if current date is within effective range
      const effectiveStart = new Date(pattern.effectiveStartDate);
      const effectiveEnd = pattern.effectiveEndDate 
        ? new Date(pattern.effectiveEndDate) 
        : new Date('2099-12-31'); // Far future if no end date
      
      return currentDate >= effectiveStart && currentDate <= effectiveEnd;
    });
    
    // Generate slots for each pattern
    dayPatterns.forEach(pattern => {
      const [startHour, startMinute] = pattern.startTime.split(':').map(Number);
      const [endHour, endMinute] = pattern.endTime.split(':').map(Number);
      
      // Create datetime for pattern start
      const slotTime = new Date(currentDate);
      slotTime.setHours(startHour, startMinute, 0, 0);
      
      const patternEnd = new Date(currentDate);
      patternEnd.setHours(endHour, endMinute, 0, 0);
      
      // Generate slots within this pattern's time range
      while (slotTime < patternEnd) {
        slots.push({
          datetime: new Date(slotTime),
          availabilityId: pattern.id || '',
          isBooked: false,
          bookedSession: undefined
        });
        
        // Move to next slot
        slotTime.setMinutes(slotTime.getMinutes() + slotDurationMinutes);
      }
    });
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return slots.sort((a, b) => a.datetime.getTime() - b.datetime.getTime());
};

/**
 * Overlay booked sessions onto display slots
 * Marks slots as booked and attaches session info
 * 
 * @param slots - Display slots generated from patterns
 * @param bookedSessions - Actual booked sessions
 * @returns Slots with booked status updated
 */
export const overlayBookedSessions = (
  slots: DisplaySlot[],
  bookedSessions: Session[]
): DisplaySlot[] => {
  return slots.map(slot => {
    // Find if this slot has a booked session
    const bookedSession = bookedSessions.find(session => {
      const sessionDate = new Date(session.sessionDatetime);
      const slotDate = slot.datetime;
      
      // Check if session starts at this slot time
      return sessionDate.getTime() === slotDate.getTime();
    });
    
    if (bookedSession) {
      return {
        ...slot,
        isBooked: true,
        bookedSession
      };
    }
    
    return slot;
  });
};

/**
 * Get color class for a booked session based on session type
 */
export const getSessionColorClass = (sessionType: string): string => {
  switch (sessionType) {
    case 'ONE_ON_ONE':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'GROUP':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'TRIAL':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'NO_SHOW':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

/**
 * Format time for display (e.g., "09:00 AM")
 */
export const formatTimeSlot = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Check if two dates are the same day
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * Convert UTC time string (HH:mm) to local timezone time string (HH:mm)
 * @param utcTime - Time string in UTC format "HH:mm" (e.g., "02:00")
 * @returns Time string in local timezone format "HH:mm" (e.g., "09:00" for UTC+7)
 */
export const convertUtcTimeToLocal = (utcTime: string): string => {
  try {
    // Parse UTC time (HH:mm format)
    const [hours, minutes] = utcTime.split(':').map(Number);
    
    // Create a date object with UTC time (using today's date)
    const today = new Date();
    const utcDate = new Date(Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
      hours,
      minutes,
      0
    ));
    
    // Get local time hours and minutes
    const localHours = utcDate.getHours();
    const localMinutes = utcDate.getMinutes();
    
    // Format back to HH:mm
    return `${String(localHours).padStart(2, '0')}:${String(localMinutes).padStart(2, '0')}`;
  } catch (error) {
    console.error('Error converting UTC time to local:', error);
    return utcTime; // Return original time if conversion fails
  }
};

/**
 * Convert UTC datetime string to local timezone datetime string
 * @param utcDateTime - ISO datetime string in UTC (e.g., "2026-01-08T02:00:00")
 * @returns ISO datetime string in local timezone
 */
export const convertUtcDateTimeToLocal = (utcDateTime: string): string => {
  try {
    // Parse UTC datetime
    const utcDate = new Date(utcDateTime);
    
    // Get local datetime components
    const localYear = utcDate.getFullYear();
    const localMonth = String(utcDate.getMonth() + 1).padStart(2, '0');
    const localDay = String(utcDate.getDate()).padStart(2, '0');
    const localHours = String(utcDate.getHours()).padStart(2, '0');
    const localMinutes = String(utcDate.getMinutes()).padStart(2, '0');
    const localSeconds = String(utcDate.getSeconds()).padStart(2, '0');
    
    // Format back to ISO string
    return `${localYear}-${localMonth}-${localDay}T${localHours}:${localMinutes}:${localSeconds}`;
  } catch (error) {
    console.error('Error converting UTC datetime to local:', error);
    return utcDateTime; // Return original datetime if conversion fails
  }
};