import React, { useState, useRef, useEffect, useMemo } from "react";
import CustomDropdown from "../../../../components/ui/CustomDropdown";
import ModalLayout from "../../../../components/ui/ModalLayout";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import DatePickerModal from "./DatePickerModal";
import BookSessionModal from "./BookSessionModal";
import BookTrialModal from "./BookTrialModal";
import Toast from "../../../../components/ui/Toast";
import type { Timezone } from "../../../../types/common";
import { useAuth } from "../../../../context/AuthContext";
import commonUtils from "../../../../utils/commonUtils";
import { classService } from "../../../../services/classService";
import { scheduleService } from "../../../../services/scheduleService";
import { useTranslation } from "react-i18next";
import type { Session } from "../../../../types/class";
import type { TrialSessionRequestResponse } from "../../../../types/api";

interface BookASessionProps {
    tutorId: string;
    tutorData?: any;
    navigateToApp?: (page: string, data?: any) => void;
}

const BookASession: React.FC<BookASessionProps> = ({
    tutorId,
    tutorData,
    navigateToApp,
}) => {
    const { state, isInitialized } = useAuth();
    const { t } = useTranslation();
    const [selectedDate, setSelectedDate] = useState(new Date()); // Today
    const [, setSelectedDay] = useState<Date>(selectedDate); // UI-only selected day within the week (view-only)
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [timezones, setTimezones] = useState<Timezone[]>([]);
    const datePickerRef = useRef<HTMLDivElement>(null);
    const datePickerButtonRef = useRef<HTMLButtonElement>(null);
    const [popoverPosition, setPopoverPosition] = useState<"top" | "bottom">("bottom");
    const [trialSessionRequest, setTrialSessionRequest] = useState<TrialSessionRequestResponse | null>(null);
    const [bookedTrialSlots, setBookedTrialSlots] = useState<string[]>([]);
    const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
    const [selectedTrialSlot, setSelectedTrialSlot] = useState<string | null>(null);
    const [isRescheduling, setIsRescheduling] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
    const [selectedTimezone, setSelectedTimezone] = useState<Timezone | null>(null);
    const [showCancelTrialConfirm, setShowCancelTrialConfirm] = useState(false);
    const [trialRequestToCancel, setTrialRequestToCancel] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tutorAvailabilities, setTutorAvailabilities] = useState<any[]>([]);
    const [tutorSessions, setTutorSessions] = useState<Session[]>([]);
    const [hasTrialSession, setHasTrialSession] = useState(true); // Default to true (can book trial)
    const [conflictedSlots, setConflictedSlots] = useState<string[]>([]); // Slots that conflict with student's existing classes
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Initialize timezones and set default to machine timezone
    useEffect(() => {
        const allTimezones = commonUtils.getAllTimezones();
        const timezoneData: Timezone[] = allTimezones.map((tz) => ({
            code: tz.code,
            name: tz.name,
            offset: tz.offset,
        }));
        setTimezones(timezoneData);

        // Set default timezone to machine timezone
        const machineTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const defaultTimezone = timezoneData.find((tz) => tz.name === machineTimezone);
        if (defaultTimezone) {
            setSelectedTimezone(defaultTimezone);
        }
    }, []);

    // Check trial session availability
    useEffect(() => {
        const checkTrialSessionAvailability = async () => {
            if (!state.user?.id || !isInitialized) {
                setHasTrialSession(true); // Can book trial if not logged in
                return;
            }

            try {
                const response = await classService.getTrialSessionRequest(tutorId, state.user.id);
                setHasTrialSession(!response.data);
                setTrialSessionRequest(response.data);
            } catch (error) {
                console.error("Failed to check trial session availability:", error);
                setHasTrialSession(true);
                setTrialSessionRequest(null);
            }
        };

        checkTrialSessionAvailability();
    }, [tutorId, state.user?.id, isInitialized]);

    // Fetch availabilities once (they represent recurring weekly availability)
    useEffect(() => {
        const fetchAvailabilities = async () => {
            try {
                setLoading(true);
                setError(null);

                // Use current week as a sample week to fetch recurring availabilities
                const today = new Date();
                const weekStart = new Date(today);
                weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 6);

                const availabilitiesResponse = await scheduleService.getAvailability({
                    tutorId,
                    startDate: weekStart.toISOString().split('T')[0],
                    endDate: weekEnd.toISOString().split('T')[0]
                });

                setTutorAvailabilities(availabilitiesResponse.data?.availabilities || []);
                setLoading(false);
            } catch (err) {
                setError('Failed to load availability');
                console.error('Error fetching availabilities:', err);
                setLoading(false);
            }
        };

        if (tutorId) {
            fetchAvailabilities();
        }
    }, [tutorId]);

    const timezonePlaceholder = selectedTimezone
        ? `${selectedTimezone.name} (${selectedTimezone.offset})`
        : t("tutorDetail.selectTimezone");

    const timezoneOptions = timezones.map((tz) => `${tz.name} (${tz.offset})`);

    const buttonText = hasTrialSession ? "Đăng ký học thử" : "Đăng ký học";

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
        return date.toLocaleDateString("en-US", options);
    };

    const [weekRange, setWeekRange] = useState(getWeekRange(selectedDate));

    // Fetch tutor sessions (booked/conflicting slots) for current weekRange whenever weekRange or tutorId changes
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                setLoading(true);
                setError(null);

                const start = weekRange.start.toISOString().split('T')[0];
                const end = weekRange.end.toISOString().split('T')[0];

                const sessionsResponse = await classService.getTutorSessions(tutorId, start, end);
                setTutorSessions(sessionsResponse.data || []);
                setLoading(false);
            } catch (err) {
                setError('Failed to load sessions');
                console.error('Error fetching sessions:', err);
                setLoading(false);
            }
        };

        if (tutorId) {
            fetchSessions();
        }
    }, [tutorId, weekRange]);

    // Check slot conflicts ONCE when component loads (for regular sessions only)
    useEffect(() => {
        const checkConflicts = async () => {
            // Only check conflicts for regular sessions (not trial)
            if (hasTrialSession || !tutorId) return;

            try {
                // Get all available slots for the current week (empty array = check all tutor's slots)
                const response = await classService.checkSlotConflicts(tutorId, []);
                if (response.success && response.data) {
                    // Store conflicted slot times (ISO strings in UTC+0) - extract sessionDateTime from Sessions
                    const conflictedSlotStrings = response.data
                        .map((session: any) => session.sessionDateTime)
                        .filter((dateTime: string | undefined) => dateTime !== undefined) as string[];
                    setConflictedSlots(conflictedSlotStrings);
                }
            } catch (error) {
                console.error('Error checking slot conflicts:', error);
            }
        };

        checkConflicts();
    }, [tutorId, hasTrialSession]); // Only re-run if tutorId or hasTrialSession changes

    // Generate available slots in UTC+0 for current week
    const availableSlotsUTC = useMemo(() => {
        if (!tutorAvailabilities || !tutorSessions) return [];

        // Use the current weekRange to generate slots (weekRange is updated when navigating weeks)
        const weekStart = new Date(weekRange.start);
        weekStart.setUTCDate(weekStart.getUTCDate());
        weekStart.setUTCHours(0, 0, 0, 0);
        const weekEnd = new Date(weekRange.end);
        weekEnd.setUTCHours(23, 59, 59, 999);

        // Step 1: Generate all possible slots from availabilities in UTC+0
        const allPossibleSlots: string[] = [];
        
        tutorAvailabilities.forEach((avail: any) => {
            // Parse start and end time (format: "HH:MM")
            const startHour = Number(avail.startTime.split(':')[0]);
            const endHour = Number(avail.endTime.split(':')[0]);

            // Parse effective dates
            const effectiveStartDate = avail.effectiveStartDate ? new Date(avail.effectiveStartDate) : null;
            const effectiveEndDate = avail.effectiveEndDate ? new Date(avail.effectiveEndDate) : null;

            // Normalize dayOfWeek: API uses 1=Monday,7=Sunday, JS uses 0=Sunday,1=Monday
            const normalizedDayOfWeek = avail.dayOfWeek === 7 ? 0 : avail.dayOfWeek;

            // Find all dates in current week that match this dayOfWeek
            let currentDate = new Date(weekStart);
            while (currentDate <= weekEnd) {
                if (currentDate.getUTCDay() === normalizedDayOfWeek) {
                    // Check if current date is within effective date range
                    const currentDateOnly = new Date(currentDate);
                    currentDateOnly.setUTCHours(0, 0, 0, 0);
                    
                    // Skip if before effectiveStartDate
                    if (effectiveStartDate) {
                        const effectiveStartDateOnly = new Date(effectiveStartDate);
                        effectiveStartDateOnly.setUTCHours(0, 0, 0, 0);
                        if (currentDateOnly < effectiveStartDateOnly) {
                            currentDate.setUTCDate(currentDate.getUTCDate() + 1);
                            continue;
                        }
                    }
                    
                    // Skip if after effectiveEndDate (if it exists)
                    if (effectiveEndDate) {
                        const effectiveEndDateOnly = new Date(effectiveEndDate);
                        effectiveEndDateOnly.setUTCHours(23, 59, 59, 999);
                        if (currentDateOnly > effectiveEndDateOnly) {
                            currentDate.setUTCDate(currentDate.getUTCDate() + 1);
                            continue;
                        }
                    }
                    
                    // Generate hourly slots for this date (only if within effective date range)
                    for (let hour = startHour; hour < endHour; hour++) {
                        const slotDate = new Date(Date.UTC(
                            currentDate.getUTCFullYear(),
                            currentDate.getUTCMonth(),
                            currentDate.getUTCDate(),
                            hour,
                            0,
                            0,
                            0
                        ));
                        allPossibleSlots.push(slotDate.toISOString());
                    }
                }
                currentDate.setUTCDate(currentDate.getUTCDate() + 1);
            }
        });

        // Step 2: Get booked slots (already in UTC+0) - EXCLUDE trial sessions
        const bookedSlotsSet = new Set<string>(
            tutorSessions
                .filter((session: any) => session.sessionDateTime)
                .map((session: any) => {
                    // Ensure UTC parsing by adding 'Z' if not present
                    let dateTimeString = session.sessionDateTime;
                    if (!dateTimeString.endsWith('Z') && !dateTimeString.includes('+')) {
                        dateTimeString += 'Z';
                    }
                    return new Date(dateTimeString).toISOString();
                })
        );

        // Step 3: Filter out booked slots AND conflicted slots (but keep trial sessions for display)
        const conflictedSlotsSet = new Set<string>(conflictedSlots);
        const availableSlots = allPossibleSlots.filter(slot => 
            !bookedSlotsSet.has(slot) && !conflictedSlotsSet.has(slot)
        );
        
        // Step 4: Add trial session slot if it exists and is in current week
        if (trialSessionRequest?.sessionDateTime) {
            try {
                // IMPORTANT: Ensure we parse as UTC by adding 'Z' if not present
                let dateTimeString = trialSessionRequest.sessionDateTime;
                if (!dateTimeString.endsWith('Z') && !dateTimeString.includes('+') && !dateTimeString.includes('T00:00:00')) {
                    dateTimeString += 'Z'; // Treat as UTC
                }
                const trialDate = new Date(dateTimeString);
                
                if (!isNaN(trialDate.getTime())) {
                    const trialSlotISO = trialDate.toISOString();
                    // Check if trial session is within current week range
                    if (trialDate >= weekStart && trialDate <= weekEnd) {
                        // Add trial session to available slots (even if it's "booked")
                        if (!availableSlots.includes(trialSlotISO)) {
                            availableSlots.push(trialSlotISO);
                        }
                    }
                }
            } catch (error) {
                console.warn('Error adding trial session to slots:', error);
            }
        }

        return availableSlots.sort();
    }, [tutorAvailabilities, tutorSessions, weekRange, trialSessionRequest, conflictedSlots]);

    // Group available slots by date for display
    const sessions = useMemo(() => {
        if (!availableSlotsUTC.length || !selectedTimezone) return [];

        // Group UTC slots by date
        const sessionsMap = new Map<string, string[]>();
        
        availableSlotsUTC.forEach(utcSlot => {
            // Parse UTC time from ISO string
            const utcDate = new Date(utcSlot);
            
            // Get UTC components (not affected by local timezone)
            const utcYear = utcDate.getUTCFullYear();   
            const utcMonth = utcDate.getUTCMonth();
            const utcDay = utcDate.getUTCDate();
            const utcHour = utcDate.getUTCHours();
            const utcMinute = utcDate.getUTCMinutes();
            
            // Apply timezone offset to UTC time
            const offsetMatch = selectedTimezone.offset.match(/([+-])(\d{1,2}):(\d{2})/);
            if (!offsetMatch) return;
            
            const sign = offsetMatch[1] === "+" ? 1 : -1;
            const offsetHours = parseInt(offsetMatch[2]);
            const offsetMinutes = parseInt(offsetMatch[3]);
            
            // Create a new date with offset applied
            const localDate = new Date(Date.UTC(
                utcYear, 
                utcMonth, 
                utcDay, 
                utcHour + sign * offsetHours, 
                utcMinute + sign * offsetMinutes
            ));
            
            // Use UTC components for grouping (to get correct date after offset)
            const localYear = localDate.getUTCFullYear();
            const localMonth = localDate.getUTCMonth();
            const localDay = localDate.getUTCDate();
            const displayHour = localDate.getUTCHours();
            const displayMinute = localDate.getUTCMinutes();
            
            // Create date key using local components
            const dateKey = new Date(localYear, localMonth, localDay).toDateString();
            
            // Format time in 12-hour format
            const hour12 = displayHour === 0 ? 12 : displayHour > 12 ? displayHour - 12 : displayHour;
            const ampm = displayHour >= 12 ? 'PM' : 'AM';
            const timeStr = `${hour12}:${displayMinute.toString().padStart(2, '0')} ${ampm}`;

            if (!sessionsMap.has(dateKey)) {
                sessionsMap.set(dateKey, []);
            }
            sessionsMap.get(dateKey)!.push(timeStr);
        });

        // Convert map to array
        const result: { date: Date; timeSlots: string[] }[] = [];
        sessionsMap.forEach((timeSlots, dateKey) => {
            result.push({ date: new Date(dateKey), timeSlots });
        });

        return result.sort((a, b) => a.date.getTime() - b.date.getTime());
    }, [availableSlotsUTC, selectedTimezone]);

    const displayedDateRange = `${formatDate(weekRange.start, { month: "long", day: "numeric" })} - ${formatDate(
        weekRange.end,
        { month: "long", day: "numeric", year: "numeric" }
    )}`;

    const weekDays = Array.from({ length: 7 }).map((_, i) => {
        const day = new Date(weekRange.start);
        day.setDate(day.getDate() + i);
        return {
            fullDate: day,
            day: formatDate(day, { weekday: "short" }),
            date: formatDate(day, { day: "numeric", month: "short" }),
        };
    });

    const handleDateApply = (date: Date) => {
        setSelectedDate(date);
        setWeekRange(getWeekRange(date));
        setIsDatePickerOpen(false);
        setSelectedDay(date);
    };

    const handleToggleDatePicker = () => {
        if (!isDatePickerOpen && datePickerButtonRef.current) {
            const buttonRect = datePickerButtonRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - buttonRect.bottom;
            const modalHeight = 420; // Estimated height of the date picker modal
            // If not enough space below AND there is enough space above, position top. Otherwise, default to bottom.
            setPopoverPosition(spaceBelow < modalHeight && buttonRect.top > modalHeight ? "top" : "bottom");
        }
        setIsDatePickerOpen((prev) => !prev);
    };

    const handleSelectDay = (date: Date) => {
        // Only update UI selection within the week — do not trigger API calls
        setSelectedDay(date);
    };

    const handlePrevWeek = () => {
        const newStartDate = new Date(weekRange.start);
        newStartDate.setDate(newStartDate.getDate() - 7);
        const newWeekRange = getWeekRange(newStartDate);
        setWeekRange(newWeekRange);
        // Don't update selectedDay - keep it for manual day selection only
        if (selectedDate < newWeekRange.start || selectedDate > newWeekRange.end) {
            setSelectedDate(newStartDate);
        }
    };

    const handleNextWeek = () => {
        const newStartDate = new Date(weekRange.start);
        newStartDate.setDate(newStartDate.getDate() + 7);
        const newWeekRange = getWeekRange(newStartDate);
        setWeekRange(newWeekRange);
        // Don't update selectedDay - keep it for manual day selection only
        if (selectedDate < newWeekRange.start || selectedDate > newWeekRange.end) {
            setSelectedDate(newStartDate);
        }
    };

    const handleTodayClick = () => {
        const today = new Date();
        setSelectedDate(today);
        setWeekRange(getWeekRange(today));
        setSelectedDay(today);
    };

    useEffect(() => {
        const combinedSlots = [...bookedTrialSlots];
        if (trialSessionRequest?.sessionDateTime) {
            try {
                // Ensure UTC parsing by adding 'Z' if not present
                let dateTimeString = trialSessionRequest.sessionDateTime;
                if (!dateTimeString.endsWith('Z') && !dateTimeString.includes('+')) {
                    dateTimeString += 'Z';
                }
                const normalizedSlot = new Date(dateTimeString).toISOString();
                combinedSlots.push(normalizedSlot);
            } catch (error) {
                console.warn('Error normalizing trial session datetime:', error);
            }
        }
        // Update the state only if there are changes
        if (combinedSlots.length !== bookedTrialSlots.length || 
            combinedSlots.some(slot => !bookedTrialSlots.includes(slot))) {
            setBookedTrialSlots(combinedSlots);
        }
    }, [trialSessionRequest]);

    // Fetch trial session request when tutor doesn't have trial session available
    useEffect(() => {
        const fetchTrialSessionRequest = async () => {
            if (!hasTrialSession && state.user?.id && isInitialized) {
                console.log("Fetching trial session request...");
                try {
                    const response = await classService.getTrialSessionRequest(tutorId, state.user.id);
                    if (response.success) {
                        setTrialSessionRequest(response.data);
                    }
                } catch (error) {
                    console.error("Failed to fetch trial session request:", error);
                }
            } else {
                // Reset trial session request if tutor has trial session available
                setTrialSessionRequest(null);
            }
        };

        fetchTrialSessionRequest();
    }, [hasTrialSession, tutorId, state.user?.id, isInitialized]);

    const handleRequestSessionClick = () => {
        // Check if user is logged in
        if (!state.user?.id) {
            window.location.href = "http://localhost:5173/login";
            return;
        }

        if (selectedTimes.length > 0) {
            if (hasTrialSession) {
                setIsTrialModalOpen(true);
            } else {
                setIsModalOpen(true);
            }
        } else {
            setToast({ message: t("tutorDetail.booking.selectTimeSlot"), type: 'error' });
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
            console.log("Cancelling trial request:", trialRequestToCancel);
            // After successful cancel, refresh the trial session request
            setTrialSessionRequest(null);
            setShowCancelTrialConfirm(false);
            setTrialRequestToCancel(null);
            setSelectedTrialSlot(null);
            // You might want to call the fetch function again or update the state
        } catch (error) {
            console.error("Failed to cancel trial request:", error);
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
            return;
        }

        try {
            // TODO: Call API to reschedule
            console.log("Confirming reschedule to:", selectedTimes[0]);
            // After success, reset states
            setIsRescheduling(false);
            setSelectedTimes([]);
        } catch (error) {
            console.error("Failed to reschedule:", error);
        }
    };

    const handleCancelReschedule = () => {
        setIsRescheduling(false);
        setSelectedTimes([]);
    };

    // Handle click outside to close action buttons
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            // Check if click is outside both the time slot button and action buttons
            if (selectedTrialSlot && !target.closest(".trial-slot-actions") && !target.closest(".pending-trial-slot")) {
                setSelectedTrialSlot(null);
            }
        };

        // Use setTimeout to avoid immediate trigger
        const timeoutId = setTimeout(() => {
            document.addEventListener("mousedown", handleClickOutside);
        }, 0);

        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [selectedTrialSlot]);

    // Cancel Trial Request Confirmation Modal Component
    const CancelTrialConfirmModal: React.FC = () => (
        <ModalLayout isOpen={showCancelTrialConfirm} onClose={handleCloseCancelTrialModal} maxWidth="sm">
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {t("tutorDetail.booking.cancelTrialTitle")}
                </h3>
                <p className="text-gray-600 mb-6">{t("tutorDetail.booking.cancelTrialDescription")}</p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={handleCloseCancelTrialModal}
                        className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors"
                    >
                        {t("tutorDetail.booking.cancel")}
                    </button>
                    <button
                        onClick={handleConfirmCancelTrial}
                        className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 transition-colors"
                    >
                        {t("tutorDetail.booking.confirmCancel")}
                    </button>
                </div>
            </div>
        </ModalLayout>
    );

    // Handle slot click - simple toggle, no API call (conflicts already checked on load)
    const handleSlotClick = (utcDateTime: string) => {
        if (hasTrialSession) {
            // Trial session: chỉ chọn 1
            setSelectedTimes([utcDateTime]);
            return;
        }

        // Regular session: toggle selection (conflicts already filtered out)
        const isSelected = selectedTimes.includes(utcDateTime);
        if (isSelected) {
            // Remove slot
            setSelectedTimes(selectedTimes.filter((t) => t !== utcDateTime));
        } else {
            // Add slot
            setSelectedTimes([...selectedTimes, utcDateTime]);
        }
    };

    if (loading || error) {
        return (
            <div className="animate-pulse">
                {/* Header skeleton */}
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <div className="h-8 bg-gray-200 rounded w-48"></div>
                    <div className="h-10 bg-gray-200 rounded w-32"></div>
                </div>

                {/* Controls skeleton */}
                <div className="mt-6 flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-10 bg-gray-200 rounded w-20"></div>
                        <div className="h-10 bg-gray-200 rounded w-48"></div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-10 bg-gray-200 rounded w-40"></div>
                        <div className="h-6 bg-gray-200 rounded w-6"></div>
                    </div>
                </div>

                {/* Calendar skeleton */}
                <div className="mt-7 flex items-center justify-between">
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    <div className="grid grid-cols-7 gap-x-2 flex-grow mx-1">
                        {Array.from({ length: 7 }).map((_, index) => (
                            <div key={index} className="text-center">
                                <div className="w-full p-3 rounded-lg bg-gray-200 mb-3">
                                    <div className="h-4 bg-gray-300 rounded mb-1"></div>
                                    <div className="h-3 bg-gray-300 rounded w-8 mx-auto"></div>
                                </div>
                                <div className="space-y-2">
                                    {Array.from({ length: 3 }).map((_, slotIndex) => (
                                        <div key={slotIndex} className="h-8 bg-gray-200 rounded"></div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">{t("tutorDetail.profile.bookSession")}</h2>
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
                        className="bg-[#F9F3EB] text-gray-700 text-sm font-semibold py-2.5 px-4 rounded-lg hover:bg-[#e9e0d4]"
                    >
                        Today
                    </button>
                    <div ref={datePickerRef} className="relative">
                        <button
                            ref={datePickerButtonRef}
                            onClick={handleToggleDatePicker}
                            className="flex items-center gap-16.5 bg-[#F9F3EB] px-4 py-2.5 rounded-lg hover:bg-[#e9e0d4]"
                        >
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
                                const selected = timezones.find((tz) => `${tz.name} (${tz.offset})` === value);
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
                </div>
            </div>

            {/* Rescheduling Guide */}
            {isRescheduling && (
                <div className="mt-4">
                    <div className="flex items-center justify-end gap-4 px-10">
                        <span className="text-sm text-gray-700 font-medium">
                            {t("tutorDetail.booking.selectNewTimeSlot")}
                        </span>
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
                <button onClick={handlePrevWeek} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                    <FiChevronLeft />
                </button>
                <div className="grid grid-cols-7 gap-x-2 flex-grow mx-1">
                    {weekDays.map((d, index) => {
                        const today = new Date();
                        const isToday = today.toDateString() === d.fullDate.toDateString();
                        const daySessions = sessions.find(
                            (session: any) => session.date.toDateString() === d.fullDate.toDateString()
                        );
                        return (
                            <div key={index} className="text-center">
                                <button
                                    onClick={() => handleSelectDay(d.fullDate)}
                                    className={`w-full p-3 rounded-lg transition-colors ${
                                        isToday ? "bg-[#F9F3EB]" : "hover:bg-gray-50"
                                    }`}
                                >
                                    <p className="text-sm font-semibold">{d.date}</p>
                                    <p className="text-xs text-gray-500 mt-1">{d.day}</p>
                                </button>
                                <div className="mt-3 space-y-2">
                                    {daySessions && daySessions.timeSlots.length > 0 ? (
                                        daySessions.timeSlots.map((time: string, timeIndex: number) => {
                                            // Find the corresponding UTC slot for this display time
                                            const timeMatch = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
                                            if (!timeMatch) return null;

                                            let displayHours = parseInt(timeMatch[1]);
                                            const displayMinutes = parseInt(timeMatch[2]);
                                            const ampm = timeMatch[3].toUpperCase();

                                            if (ampm === "PM" && displayHours !== 12) displayHours += 12;
                                            if (ampm === "AM" && displayHours === 12) displayHours = 0;

                                            // Create date using UTC to avoid local timezone interference
                                            const displayDate = d.fullDate;
                                            const year = displayDate.getFullYear();
                                            const month = displayDate.getMonth();
                                            const day = displayDate.getDate();
                                            
                                            // Convert back to UTC by reversing timezone offset
                                            if (!selectedTimezone) return null;
                                            const offsetMatch = selectedTimezone.offset.match(/([+-])(\d{1,2}):(\d{2})/);
                                            if (!offsetMatch) return null;

                                            const sign = offsetMatch[1] === "+" ? 1 : -1;
                                            const offsetHours = parseInt(offsetMatch[2]);
                                            const offsetMinutes = parseInt(offsetMatch[3]);

                                            // Subtract the offset to get UTC (reverse of display conversion)
                                            const utcHours = displayHours - sign * offsetHours;
                                            const utcMinutes = displayMinutes - sign * offsetMinutes;
                                            
                                            // Create UTC datetime
                                            const utcDateTime = new Date(Date.UTC(year, month, day, utcHours, utcMinutes, 0, 0));
                                            const utcSlot = utcDateTime.toISOString();

                                            // Check if slot is in the past
                                            const now = new Date();
                                            const isPastSlot = utcDateTime < now;

                                            const isSelected = selectedTimes.includes(utcSlot);
                                            const isBookedTrial = bookedTrialSlots.includes(utcSlot);
                                            
                                            // Check if this slot is the trial session request
                                            let isTrialRequest = false;
                                            if (trialSessionRequest?.sessionDateTime) {
                                                try {
                                                    // Ensure UTC parsing by adding 'Z' if not present
                                                    let dateTimeString = trialSessionRequest.sessionDateTime;
                                                    if (!dateTimeString.endsWith('Z') && !dateTimeString.includes('+')) {
                                                        dateTimeString += 'Z';
                                                    }
                                                    const trialDateTime = new Date(dateTimeString);
                                                    const trialSlotISO = trialDateTime.toISOString();
                                                    isTrialRequest = trialSlotISO === utcSlot;
                                                } catch (error) {
                                                    console.warn('Error comparing trial session:', error);
                                                }
                                            }
                                            
                                            const trialStatus = isTrialRequest
                                                ? (trialSessionRequest?.status as any)
                                                : null;
                                            return (
                                                <div key={`${time}-${timeIndex}`} className="space-y-1">
                                                    <button
                                                        className={`pending-trial-slot w-full text-xs py-2.5 rounded-md font-semibold transition-colors ${
                                                            isPastSlot
                                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                                : isTrialRequest && trialStatus
                                                                ? trialStatus === "PENDING"
                                                                    ? "bg-yellow-100 text-yellow-700 border-2 border-yellow-300 cursor-pointer hover:bg-yellow-200"
                                                                    : trialStatus === "CONFIRMED"
                                                                    ? "bg-green-100 text-green-700 border-2 border-green-300 cursor-not-allowed"
                                                                    : trialStatus === "CANCELLED"
                                                                    ? "bg-red-100 text-red-700 border-2 border-red-300 cursor-not-allowed"
                                                                    : "bg-gray-100 text-gray-700 border-2 border-gray-300 cursor-not-allowed"
                                                                : isBookedTrial
                                                                ? "bg-orange-100 text-orange-700 border-2 border-orange-300 cursor-not-allowed"
                                                                : isSelected
                                                                ? "bg-[#0b6459] text-white"
                                                                : "bg-[#F9F3EB] text-gray-700 hover:bg-[#e9e0d4]"
                                                        }`}
                                                        onClick={() => {
                                                            if (isRescheduling) {
                                                                // In rescheduling mode: only allow selecting one slot, no toggle
                                                                setSelectedTimes([utcSlot]);
                                                            } else if (isTrialRequest && trialStatus === "PENDING") {
                                                                // Toggle show/hide action buttons for pending trial request
                                                                setSelectedTrialSlot((prev) =>
                                                                    prev === utcSlot ? null : utcSlot
                                                                );
                                                            } else if (
                                                                hasTrialSession &&
                                                                !bookedTrialSlots.includes(utcSlot)
                                                            ) {
                                                                // Trial session: chỉ chọn 1
                                                                setSelectedTimes([utcSlot]);
                                                            } else if (!hasTrialSession) {
                                                                // Regular session: call API to check conflicts
                                                                handleSlotClick(utcSlot);
                                                            }
                                                        }}
                                                        disabled={
                                                            isPastSlot ||
                                                            (bookedTrialSlots.includes(utcSlot) &&
                                                                !isTrialRequest) ||
                                                            (isTrialRequest && isRescheduling)
                                                        }
                                                    >
                                                        {time}
                                                        {isTrialRequest && trialStatus && (
                                                            <span className="ml-1 text-xs">
                                                                (
                                                                {trialStatus === "PENDING"
                                                                    ? t("tutorDetail.booking.pending")
                                                                    : trialStatus === "CONFIRMED"
                                                                    ? t("tutorDetail.booking.confirmed")
                                                                    : trialStatus === "CANCELLED"
                                                                    ? t("tutorDetail.booking.cancelled")
                                                                    : trialStatus}
                                                                )
                                                            </span>
                                                        )}
                                                        {isBookedTrial && !isTrialRequest && (
                                                            <span className="ml-1 text-xs">
                                                                ({t("tutorDetail.booking.pending")})
                                                            </span>
                                                        )}
                                                    </button>

                                                    {/* Action buttons for pending trial request */}
                                                    {selectedTrialSlot === utcSlot &&
                                                        isTrialRequest &&
                                                        trialStatus === "PENDING" && (
                                                            <div className="flex gap-2 trial-slot-actions">
                                                                <button
                                                                    onClick={() => {
                                                                        // Handle cancel trial request
                                                                        handleCancelTrialRequest(
                                                                            trialSessionRequest!.id
                                                                        );
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
                                            {t("tutorDetail.booking.noSessions")}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <button
                    onClick={handleNextWeek}
                    className="p-2 rounded-lg bg-[#F9F3EB] text-gray-500 hover:bg-opacity-80"
                >
                    <FiChevronRight />
                </button>
            </div>

            {/* Cancel Trial Request Confirmation Modal */}
            <CancelTrialConfirmModal />

            <BookSessionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                tutorData={tutorData}
                selectedTimes={selectedTimes}
                timezone={selectedTimezone}
                navigateToApp={navigateToApp || (() => {})}
            />
            <BookTrialModal
                isOpen={isTrialModalOpen}
                onClose={() => setIsTrialModalOpen(false)}
                tutorId={tutorId}
                tutorData={tutorData}
                selectedTimes={selectedTimes}
                selectedTimezone={selectedTimezone}
                onSuccess={() => {
                    setBookedTrialSlots(prev => [...prev, selectedTimes[0]]);
                }}
            />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default BookASession;
