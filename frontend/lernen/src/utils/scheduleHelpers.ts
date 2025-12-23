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
 * Get color class for a booked session based on status
 */
export const getSessionColorClass = (status: Session['status']): string => {
  switch (status) {
    case 'CONFIRMED':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'COMPLETED':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800 border-red-200';
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
