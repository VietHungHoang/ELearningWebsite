import React, { useState, useRef, useEffect, useMemo } from 'react';
import CustomDropdown from '../../../../components/ui/CustomDropdown';
import ModalLayout from '../../../../components/ui/ModalLayout';
import { FiCalendar, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import FilterSessionPopover from './FilterSessionPopover';
import DatePickerModal from './DatePickerModal';
import type { TutorDetail } from '../../../../types/tutor';
import type { Timezone } from '../../../../types/common';
import { useAuth } from '../../../../context/AuthContext';
import commonUtils from '../../../../utils/commonUtils';
import { classService } from '../../../../services/classService';

interface BookASessionProps {
    onOpenModal: () => void;
    onOpenTrialModal?: () => void;
    tutor: TutorDetail;
    selectedTimes: string[];
    onTimesSelect: (times: string[]) => void;
    bookedTrialSlots?: string[];
}

const BookASession: React.FC<BookASessionProps> = ({ onOpenModal, onOpenTrialModal, tutor, selectedTimes, onTimesSelect, bookedTrialSlots: propBookedTrialSlots = [] }) => {
    const { state, isInitialized } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date()); // Today
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);
    const [timezones, setTimezones] = useState<Timezone[]>([]);
    const filterRef = useRef<HTMLDivElement>(null);
    const datePickerRef = useRef<HTMLDivElement>(null);
    const datePickerButtonRef = useRef<HTMLButtonElement>(null);
    const [popoverPosition, setPopoverPosition] = useState<'top' | 'bottom'>('bottom');
    const [trialSessionRequest, setTrialSessionRequest] = useState<any | null>(null);
    const [bookedTrialSlots, setBookedTrialSlots] = useState<string[]>(propBookedTrialSlots);
    const [selectedTrialSlot, setSelectedTrialSlot] = useState<string | null>(null);
    const [isRescheduling, setIsRescheduling] = useState(false);
    const [showCancelTrialConfirm, setShowCancelTrialConfirm] = useState(false);
    const [trialRequestToCancel, setTrialRequestToCancel] = useState<string | null>(null);
    
    // Initialize timezones and set default to machine timezone
    useEffect(() => {
        const allTimezones = commonUtils.getAllTimezones();
        const timezoneData: Timezone[] = allTimezones.map(tz => ({
            code: tz.code,
            name: tz.name,
            offset: tz.offset
        }));
        setTimezones(timezoneData);

        // Set default timezone to machine timezone
        const machineTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const defaultTimezone = timezoneData.find(tz => tz.name === machineTimezone);
        if (defaultTimezone) {
            setSelectedTimezone(defaultTimezone);
        }
    }, []);
    
    const [selectedTimezone, setSelectedTimezone] = useState<Timezone | null>(null);
    
    const timezonePlaceholder = selectedTimezone ? `${selectedTimezone.name} (${selectedTimezone.offset})` : 'Select timezone';

    // Helper function to convert date and time from selected timezone to UTC datetime string
    const convertToUTCDateTime = (date: Date, timeStr: string): string => {
        // Parse timeStr (e.g., "10:00 AM" -> hours and minutes) in selected timezone
        const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if (!timeMatch) return '';
        
        let hours = parseInt(timeMatch[1]);
        const minutes = parseInt(timeMatch[2]);
        const ampm = timeMatch[3].toUpperCase();
        
        if (ampm === 'PM' && hours !== 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
        
        // Create date object with the selected date and parsed time in selected timezone
        const dateTime = new Date(date);
        dateTime.setHours(hours, minutes, 0, 0);
        
        // Subtract selected timezone offset to get UTC
        if (selectedTimezone) {
            const offsetMatch = selectedTimezone.offset.match(/([+-])(\d{1,2}):(\d{2})/);
            if (offsetMatch) {
                const sign = offsetMatch[1] === '+' ? -1 : 1; // Reverse to subtract
                const offsetHours = parseInt(offsetMatch[2]);
                const offsetMinutes = parseInt(offsetMatch[3]);
                dateTime.setHours(dateTime.getHours() + sign * offsetHours);
                dateTime.setMinutes(dateTime.getMinutes() + sign * offsetMinutes);
            }
        }
        
        // Convert to UTC and return ISO string without milliseconds (to match API format)
        // Format: "2025-12-17T06:00:00"
        const isoString = dateTime.toISOString();
        return isoString.substring(0, 19); // Remove ".000Z" part
    };

        const timezoneOptions = timezones.map(tz => `${tz.name} (${tz.offset})`);
    
    const buttonText = tutor.hasTrialSession ? 'Đăng ký học thử' : 'Đăng ký học';

    // Helper function to convert time slot from UTC to selected timezone
    const convertTimeSlotToTimezone = (timeSlot: string, timezone: Timezone | null): string => {
        if (!timezone) return timeSlot;
        
        // Parse timeSlot (e.g., "9:00 AM")
        const timeMatch = timeSlot.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if (!timeMatch) return timeSlot;
        
        let hours = parseInt(timeMatch[1]);
        const minutes = parseInt(timeMatch[2]);
        const ampm = timeMatch[3].toUpperCase();
        
        if (ampm === 'PM' && hours !== 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
        
        // Create UTC date
        const utcDate = new Date();
        utcDate.setHours(hours, minutes, 0, 0);
        
        // Add timezone offset
        const offsetMatch = timezone.offset.match(/([+-])(\d{1,2}):(\d{2})/);
        if (offsetMatch) {
            const sign = offsetMatch[1] === '+' ? 1 : -1;
            const offsetHours = parseInt(offsetMatch[2]);
            const offsetMinutes = parseInt(offsetMatch[3]);
            utcDate.setHours(utcDate.getHours() + sign * offsetHours);
            utcDate.setMinutes(utcDate.getMinutes() + sign * offsetMinutes);
        }
        
        // Format back to 12h
        const localHours = utcDate.getHours();
        const localMinutes = utcDate.getMinutes();
        const period = localHours >= 12 ? 'PM' : 'AM';
        const displayHours = localHours % 12 || 12;
        return `${displayHours}:${localMinutes.toString().padStart(2, '0')} ${period}`;
    };

    const sessions = useMemo(() => {
        if (!tutor.availabilities) return [];
        const sessionsMap = new Map<string, string[]>(); // date string -> timeSlots

        tutor.availabilities
            .forEach((avail: any) => {
                const parseTime = (timeStr: string) => {
                    const [hours, minutes] = timeStr.split(':').map(Number);
                    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                };

                const start24 = parseTime(avail.startTime);
                const end24 = parseTime(avail.endTime);

                const timeSlots = [];
                let current = new Date(`1970-01-01T${start24}`);
                const endTime = new Date(`1970-01-01T${end24}`);
                while (current < endTime) {
                    const slot = current.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                    timeSlots.push(convertTimeSlotToTimezone(slot, selectedTimezone));
                    current.setHours(current.getHours() + 1);
                }

                // Calculate date range for this availability - include current week
                const today = new Date();
                const weekStart = new Date(today);
                weekStart.setDate(today.getDate() - today.getDay()); // Start of current week (Sunday)
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 6); // End of current week (Saturday)

                const startDate = new Date(avail.effectiveStartDate);
                const endDate = avail.effectiveEndDate ? new Date(avail.effectiveEndDate) : new Date(startDate.getTime() + (8 * 7 * 24 * 60 * 60 * 1000)); // 8 weeks if no end date

                // Use the later start date
                const effectiveStart = startDate > weekStart ? startDate : weekStart;
                const effectiveEnd = endDate < weekEnd ? endDate : weekEnd;

                // Generate sessions for each occurrence of this day of week within the effective range
                let currentDate = new Date(effectiveStart);
                // Find the first occurrence of the target day of week
                while (currentDate.getDay() !== avail.dayOfWeek && currentDate <= effectiveEnd) {
                    currentDate.setDate(currentDate.getDate() + 1);
                }

                // Generate sessions for each matching day
                while (currentDate <= effectiveEnd) {
                    if (currentDate.getDay() === avail.dayOfWeek) {
                        const dateKey = currentDate.toDateString();
                        const existingSlots = sessionsMap.get(dateKey) || [];
                        const mergedSlots = [...existingSlots, ...timeSlots].filter((slot, index, arr) => arr.indexOf(slot) === index); // Remove duplicates
                        sessionsMap.set(dateKey, mergedSlots);
                    }
                    // Move to next week
                    currentDate.setDate(currentDate.getDate() + 7);
                }
        });

        // Convert map to array
        const result: { date: Date; timeSlots: string[] }[] = [];
        sessionsMap.forEach((timeSlots, dateKey) => {
            result.push({ date: new Date(dateKey), timeSlots });
        });

        console.log('sessions:', result);
        return result;
    }, [tutor.availabilities, selectedTimezone]);

    const getWeekRange = (date: Date) => {
        const startDate = new Date(date);
        const dayOfWeek = startDate.getDay(); // 0 = Sunday
        const diff = startDate.getDate() - dayOfWeek;
        startDate.setDate(diff);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        return { start: startDate, end: endDate };
    };

    const formatDate = (date: Date, options: Intl.DateTimeFormatOptions): string => {
        return date.toLocaleDateString('en-US', options);
    };

    const [weekRange, setWeekRange] = useState(getWeekRange(selectedDate));

    const displayedDateRange = `${formatDate(weekRange.start, { month: 'long', day: 'numeric' })} - ${formatDate(weekRange.end, { month: 'long', day: 'numeric', year: 'numeric' })}`;
    
    const weekDays = Array.from({ length: 7 }).map((_, i) => {
        const day = new Date(weekRange.start);
        day.setDate(day.getDate() + i);
        return {
            fullDate: day,
            day: formatDate(day, { weekday: 'short' }),
            date: formatDate(day, { day: 'numeric', month: 'short' }),
        };
    });

    const handleDateApply = (date: Date) => {
        setSelectedDate(date);
        setWeekRange(getWeekRange(date));
        setIsDatePickerOpen(false);
    };

    const handleToggleDatePicker = () => {
        if (!isDatePickerOpen && datePickerButtonRef.current) {
            const buttonRect = datePickerButtonRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - buttonRect.bottom;
            const modalHeight = 420; // Estimated height of the date picker modal
            // If not enough space below AND there is enough space above, position top. Otherwise, default to bottom.
            setPopoverPosition(spaceBelow < modalHeight && buttonRect.top > modalHeight ? 'top' : 'bottom');
        }
        setIsDatePickerOpen(prev => !prev);
    };

    const handleSelectDay = (date: Date) => {
        setSelectedDate(date);
    };

    const handlePrevWeek = () => {
        const newStartDate = new Date(weekRange.start);
        newStartDate.setDate(newStartDate.getDate() - 7);
        const newWeekRange = getWeekRange(newStartDate);
        setWeekRange(newWeekRange);
        if (selectedDate < newWeekRange.start || selectedDate > newWeekRange.end) {
            setSelectedDate(newStartDate);
        }
    };
    
    const handleNextWeek = () => {
        const newStartDate = new Date(weekRange.start);
        newStartDate.setDate(newStartDate.getDate() + 7);
        const newWeekRange = getWeekRange(newStartDate);
        setWeekRange(newWeekRange);
        if (selectedDate < newWeekRange.start || selectedDate > newWeekRange.end) {
            setSelectedDate(newStartDate);
        }
    };
    
    const handleTodayClick = () => {
        const today = new Date();
        setSelectedDate(today);
        setWeekRange(getWeekRange(today));
    };

    // Update bookedTrialSlots when props change or trial session request is fetched
    useEffect(() => {
        const combinedSlots = [...propBookedTrialSlots];
        if (trialSessionRequest?.sessionDateTime) {
            combinedSlots.push(trialSessionRequest.sessionDateTime);
        }
        setBookedTrialSlots(combinedSlots);
    }, [propBookedTrialSlots, trialSessionRequest]);

    // Fetch trial session request when tutor doesn't have trial session available
    useEffect(() => {
        const fetchTrialSessionRequest = async () => {
            if (!tutor.hasTrialSession && state.user?.id && isInitialized) {
                console.log('Fetching trial session request...');
                try {
                    const response = await classService.getTrialSessionRequest(tutor.id, state.user.id);
                    if (response.success) {
                        setTrialSessionRequest(response.data);
                    }
                } catch (error) {
                    console.error('Failed to fetch trial session request:', error);
                }
            } else {
                // Reset trial session request if tutor has trial session available
                setTrialSessionRequest(null);
            }
        };

        fetchTrialSessionRequest();
    }, [tutor.hasTrialSession, tutor.id, state.user?.id, isInitialized]);

    const handleRequestSessionClick = () => {
        // Check if user is logged in
        if (!state.user?.id) {
            window.location.href = 'http://localhost:5173/login';
            return;
        }

        if (selectedTimes.length > 0) {
            if (tutor.hasTrialSession) {
                onOpenTrialModal?.();
            } else {
                onOpenModal();
            }
        } else {
            alert('Please select a time slot before requesting a session.');
        }
    };

    const handleCancelTrialRequest = (requestId: string) => {
        setTrialRequestToCancel(requestId);
        setShowCancelTrialConfirm(true);
    };

    const handleConfirmCancelTrial = async () => {
        if (!trialRequestToCancel) return;

        try {
            // TODO: Implement cancel API call
            console.log('Cancelling trial request:', trialRequestToCancel);
            // After successful cancel, refresh the trial session request
            setTrialSessionRequest(null);
            setShowCancelTrialConfirm(false);
            setTrialRequestToCancel(null);
            setSelectedTrialSlot(null);
            // You might want to call the fetch function again or update the state
        } catch (error) {
            console.error('Failed to cancel trial request:', error);
        }
    };

    const handleCloseCancelTrialModal = () => {
        setShowCancelTrialConfirm(false);
        setTrialRequestToCancel(null);
    };

    const handleRescheduleTrialRequest = () => {
        // Enter rescheduling mode
        setIsRescheduling(true);
        setSelectedTrialSlot(null);
    };

    const handleConfirmReschedule = async () => {
        if (selectedTimes.length === 0) {
            alert('Vui lòng chọn khung giờ mới');
            return;
        }
        
        try {
            // TODO: Call API to reschedule
            console.log('Confirming reschedule to:', selectedTimes[0]);
            // After success, reset states
            setIsRescheduling(false);
            onTimesSelect([]);
        } catch (error) {
            console.error('Failed to reschedule:', error);
        }
    };

    const handleCancelReschedule = () => {
        setIsRescheduling(false);
        onTimesSelect([]);
    };

    // Handle click outside to close action buttons
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            // Check if click is outside both the time slot button and action buttons
            if (selectedTrialSlot && 
                !target.closest('.trial-slot-actions') && 
                !target.closest('.pending-trial-slot')) {
                setSelectedTrialSlot(null);
            }
        };

        // Use setTimeout to avoid immediate trigger
        const timeoutId = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 0);
        
        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [selectedTrialSlot]);

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">Book a session</h2>
                <button 
                    onClick={handleRequestSessionClick}
                    className="bg-[#FF5A1F] text-white font-medium text-sm py-2.5 px-4 rounded-lg hover:bg-orange-600 transition-colors"
                >
                    {buttonText}
                </button>
            </div>

            {/* Controls */}
            <div className="mt-6 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleTodayClick}
                        className="bg-[#F9F3EB] text-gray-700 text-sm font-semibold py-2.5 px-4 rounded-lg hover:bg-[#e9e0d4]">
                        Today
                    </button>
                    <div ref={datePickerRef} className="relative">
                        <button 
                          ref={datePickerButtonRef} 
                          onClick={handleToggleDatePicker}
                          className="flex items-center gap-16.5 bg-[#F9F3EB] px-4 py-2.5 rounded-lg hover:bg-[#e9e0d4]">
                            <span className="text-sm font-normal text-sm text-gray-700">{displayedDateRange}</span>
                            <FiCalendar />
                        </button>
                         <DatePickerModal 
                            isOpen={isDatePickerOpen}
                            onClose={() => setIsDatePickerOpen(false)}
                            onApply={handleDateApply}
                            selectedDate={selectedDate}
                            position={popoverPosition}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-70">
                       <CustomDropdown
                            options={timezoneOptions}
                            selectedValue={timezonePlaceholder}
                            placeholder={timezonePlaceholder}
                            onSelect={(value) => {
                                const selected = timezones.find(tz => `${tz.name} (${tz.offset})` === value);
                                setSelectedTimezone(selected || null);
                            }}
                            dropdownId="timezone"
                            openDropdown={openDropdown}
                            setOpenDropdown={setOpenDropdown}
                            hasSearch={true}
                            searchPlaceholder="Search timezone..."
                            maxVisibleItems={8}
                        />
                    </div>
                     <div ref={filterRef} className="relative">
                        <button 
                            onClick={() => setIsFilterPopoverOpen(!isFilterPopoverOpen)}
                            className="p-2.75 border border-gray-300 rounded-lg hover:bg-gray-100"
                            aria-haspopup="true"
                            aria-expanded={isFilterPopoverOpen}
                        >
                            <FiFilter />
                        </button>
                        {isFilterPopoverOpen && <FilterSessionPopover onClose={() => setIsFilterPopoverOpen(false)} />}
                    </div>
                </div>
            </div>

            {/* Rescheduling Guide */}
            {isRescheduling && (
                <div className="mt-4">
                    <div className="flex items-center justify-end gap-4 px-10">
                        <span className="text-sm text-gray-700 font-medium">Vui lòng chọn khung giờ mới</span>
                        <div className="flex gap-2">
                            <button
                                onClick={handleConfirmReschedule}
                                disabled={selectedTimes.length === 0}
                                className="px-4 py-2 bg-[#0b6459] text-white text-sm font-medium rounded-md hover:bg-[#094d44] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                Lưu
                            </button>
                            <button
                                onClick={handleCancelReschedule}
                                className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Calendar */}
            <div className="mt-7 flex items-center justify-between">
                <button onClick={handlePrevWeek} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"><FiChevronLeft /></button>
                <div className="grid grid-cols-7 gap-x-2 flex-grow mx-1">
                    {weekDays.map((d, index) => {
                        const isSelected = selectedDate.toDateString() === d.fullDate.toDateString();
                        const daySessions = sessions.find((session: any) => session.date.toDateString() === d.fullDate.toDateString());
                        return (
                            <div key={index} className="text-center">
                                <button
                                    onClick={() => handleSelectDay(d.fullDate)}
                                    className={`w-full p-3 rounded-lg transition-colors ${isSelected ? 'bg-[#F9F3EB]' : 'hover:bg-gray-50'}`}
                                >
                                    <p className="text-sm font-semibold">{d.date}</p>
                                    <p className="text-xs text-gray-500 mt-1">{d.day}</p>
                                </button>
                                <div className="mt-3 space-y-2">
                                    {daySessions && daySessions.timeSlots.length > 0 ? (
                                        daySessions.timeSlots.map((time: string) => {
                                            const utcDateTime = convertToUTCDateTime(d.fullDate, time);
                                            const isSelected = selectedTimes.includes(utcDateTime);
                                            const isBookedTrial = bookedTrialSlots.includes(utcDateTime);
                                            const isTrialRequest = trialSessionRequest && trialSessionRequest.sessionDateTime === utcDateTime;
                                            const trialStatus = isTrialRequest ? (trialSessionRequest?.status as any) : null;
                                            return (
                                                <div key={time} className="space-y-1">
                                                    <button 
                                                        className={`pending-trial-slot w-full text-xs py-2.5 rounded-md font-semibold transition-colors ${
                                                            isTrialRequest && trialStatus
                                                            ? trialStatus === 'PENDING'
                                                                ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300 cursor-pointer hover:bg-yellow-200'
                                                                : trialStatus === 'CONFIRMED'
                                                                ? 'bg-green-100 text-green-700 border-2 border-green-300 cursor-not-allowed'
                                                                : trialStatus === 'CANCELLED'
                                                                ? 'bg-red-100 text-red-700 border-2 border-red-300 cursor-not-allowed'
                                                                : 'bg-gray-100 text-gray-700 border-2 border-gray-300 cursor-not-allowed'
                                                            : isBookedTrial
                                                            ? 'bg-orange-100 text-orange-700 border-2 border-orange-300 cursor-not-allowed'
                                                            : isSelected
                                                            ? 'bg-[#0b6459] text-white' 
                                                            : 'bg-[#F9F3EB] text-gray-700 hover:bg-[#e9e0d4]'
                                                        }`}
                                                        onClick={() => {
                                                            if (isRescheduling) {
                                                                // In rescheduling mode: only allow selecting one slot, no toggle
                                                                onTimesSelect([utcDateTime]);
                                                            } else if (isTrialRequest && trialStatus === 'PENDING') {
                                                                // Toggle show/hide action buttons for pending trial request
                                                                setSelectedTrialSlot(prev => prev === utcDateTime ? null : utcDateTime);
                                                            } else if (tutor.hasTrialSession && !bookedTrialSlots.includes(utcDateTime)) {
                                                                // Trial session: chỉ chọn 1
                                                                onTimesSelect([utcDateTime]);
                                                            } else if (!tutor.hasTrialSession) {
                                                                // Regular session: toggle multi-select
                                                                if (isSelected) {
                                                                    onTimesSelect(selectedTimes.filter(t => t !== utcDateTime));
                                                                } else {
                                                                    onTimesSelect([...selectedTimes, utcDateTime]);
                                                                }
                                                            }
                                                        }}
                                                        disabled={bookedTrialSlots.includes(utcDateTime) && !isTrialRequest || (isTrialRequest && isRescheduling)}
                                                    >
                                                    {time}
                                                    {isTrialRequest && trialStatus && (
                                                        <span className="ml-1 text-xs">
                                                            ({trialStatus === 'PENDING' ? 'Pending' : 
                                                              trialStatus === 'CONFIRMED' ? 'Confirmed' : 
                                                              trialStatus === 'CANCELLED' ? 'Cancelled' : 
                                                              trialStatus})
                                                        </span>
                                                    )}
                                                    {isBookedTrial && !isTrialRequest && <span className="ml-1 text-xs">(Pending)</span>}
                                                </button>
                                                
                                                {/* Action buttons for pending trial request */}
                                                {selectedTrialSlot === utcDateTime && isTrialRequest && trialStatus === 'PENDING' && (
                                                    <div className="flex gap-2 trial-slot-actions">
                                                        <button 
                                                            onClick={() => {
                                                                // Handle cancel trial request
                                                                handleCancelTrialRequest(trialSessionRequest.id);
                                                            }}
                                                            className="flex-1 text-xs py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                                        >
                                                            Hủy
                                                        </button>
                                                        <button 
                                                            onClick={() => {
                                                                // Handle reschedule trial request
                                                                handleRescheduleTrialRequest();
                                                            }}
                                                            className="flex-1 text-xs py-1.5 bg-[#0b6459] text-white rounded-md hover:bg-[#094d44] transition-colors"
                                                        >
                                                            Đổi lịch
                                                        </button>
                                                    </div>
                                                )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="bg-gray-100 text-gray-400 text-xs py-2.5 rounded-md">
                                            No sessions
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <button onClick={handleNextWeek} className="p-2 rounded-lg bg-[#F9F3EB] text-gray-500 hover:bg-opacity-80"><FiChevronRight /></button>
            </div>

            {/* Cancel Trial Request Confirmation Modal */}
            <ModalLayout
                isOpen={showCancelTrialConfirm}
                onClose={handleCloseCancelTrialModal}
                maxWidth="sm"
            >
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Xác nhận hủy yêu cầu học thử
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Bạn có chắc chắn muốn hủy yêu cầu học thử này không? Hành động này không thể hoàn tác.
                    </p>
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={handleCloseCancelTrialModal}
                            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleConfirmCancelTrial}
                            className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 transition-colors"
                        >
                            Xác nhận hủy
                        </button>
                    </div>
                </div>
            </ModalLayout>
        </div>
    );
};

export default BookASession;