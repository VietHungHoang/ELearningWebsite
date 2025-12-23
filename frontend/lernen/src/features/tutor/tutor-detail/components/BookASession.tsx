import React, { useState, useRef, useEffect, useMemo } from "react";
import CustomDropdown from "../../../../components/ui/CustomDropdown";
import ModalLayout from "../../../../components/ui/ModalLayout";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import DatePickerModal from "./DatePickerModal";
import BookSessionModal from "./BookSessionModal";
import BookTrialModal from "./BookTrialModal";
import type { Timezone } from "../../../../types/common";
import { useAuth } from "../../../../context/AuthContext";
import commonUtils from "../../../../utils/commonUtils";
import { classService } from "../../../../services/classService";
import { scheduleService } from "../../../../services/scheduleService";
import { useTranslation } from "react-i18next";
import type { GetBookedSessionsResponse, Session } from "../../../../types/class";
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

    // Fetch availabilities and sessions
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Calculate date range for current week
                const weekStart = new Date(selectedDate);
                weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 6);

                // Call APIs in parallel
                const [availabilitiesResponse, sessionsResponse] = await Promise.all([
                    scheduleService.getAvailability({
                        tutorId,
                        startDate: weekStart.toISOString().split('T')[0],
                        endDate: weekEnd.toISOString().split('T')[0]
                    }),
                    classService.getTutorSessions(tutorId, weekStart.toISOString().split('T')[0], weekEnd.toISOString().split('T')[0])
                ]);

                setTutorAvailabilities(availabilitiesResponse.data?.availabilities || []);
                setTutorSessions(sessionsResponse.data.sessions || []);
                setLoading(false);
            } catch (err) {
                setError('Failed to load data');
                console.error('Error fetching data:', err);
            }
        };

        if (tutorId) {
            fetchData();
        }
    }, [tutorId, selectedDate]);

    const timezonePlaceholder = selectedTimezone
        ? `${selectedTimezone.name} (${selectedTimezone.offset})`
        : t("tutorDetail.selectTimezone");

    const timezoneOptions = timezones.map((tz) => `${tz.name} (${tz.offset})`);

    const buttonText = hasTrialSession ? "Đăng ký học thử" : "Đăng ký học";

    const sessions = useMemo(() => {
        if (!tutorAvailabilities || !tutorSessions) return [];

        // Create all possible slots from availability
        const allPossibleSlots: string[] = [];
        tutorAvailabilities.forEach((avail: any) => {
            const parseTime = (timeStr: string) => {
                const [hours, minutes] = timeStr.split(":").map(Number);
                return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
            };

            const start24 = parseTime(avail.startTime);
            const end24 = parseTime(avail.endTime);

            const timeSlots = [];
            let current = new Date(`1970-01-01T${start24}`);
            const endTime = new Date(`1970-01-01T${end24}`);
            while (current < endTime) {
                const slot = current.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
                timeSlots.push(slot);
                current.setHours(current.getHours() + 1);
            }

            // Calculate date range for current week
            const today = new Date();
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);

            // Generate slots for each occurrence of this day of week in current week
            let currentDate = new Date(weekStart);
            while (currentDate <= weekEnd) {
                if (currentDate.getDay() === avail.dayOfWeek) {
                    // Create UTC datetime strings for each slot
                    timeSlots.forEach(time => {
                        const utcDateTime = commonUtils.convertToLocalDateTime(currentDate, time, selectedTimezone);
                        allPossibleSlots.push(utcDateTime);
                    });
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
        });

        // Filter out booked slots
        const bookedSlots = new Set(
            tutorSessions.map((session: any) => {
                const utcDate = new Date(session.sessionDateTime);
                // Convert UTC to local time in selectedTimezone
                if (selectedTimezone) {
                    const offsetMatch = selectedTimezone.offset.match(/([+-])(\d{1,2}):(\d{2})/);
                    if (offsetMatch) {
                        const sign = offsetMatch[1] === "+" ? 1 : -1;
                        const offsetHours = parseInt(offsetMatch[2]);
                        const offsetMinutes = parseInt(offsetMatch[3]);
                        utcDate.setHours(utcDate.getHours() + sign * offsetHours);
                        utcDate.setMinutes(utcDate.getMinutes() + sign * offsetMinutes);
                    }
                }
                const year = utcDate.getFullYear();
                const month = String(utcDate.getMonth() + 1).padStart(2, '0');
                const day = String(utcDate.getDate()).padStart(2, '0');
                const hourStr = String(utcDate.getHours()).padStart(2, '0');
                const minuteStr = String(utcDate.getMinutes()).padStart(2, '0');
                const seconds = String(utcDate.getSeconds()).padStart(2, '0');
                return `${year}-${month}-${day}T${hourStr}:${minuteStr}:${seconds}`;
            })
        );
        const availableSlots = allPossibleSlots.filter(slot => !bookedSlots.has(slot));

        // Group by date for display
        const sessionsMap = new Map<string, string[]>();
        availableSlots.forEach(slot => {
            // Parse the UTC datetime string to get date
            const date = new Date(slot);
            const dateKey = date.toDateString();
            const timeStr = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

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

        console.log("Available sessions:", result);
        return result;
    }, [tutorAvailabilities, tutorSessions, selectedTimezone]);

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

    useEffect(() => {
        const combinedSlots = [...bookedTrialSlots];
        if (trialSessionRequest?.sessionDateTime) {
            combinedSlots.push(trialSessionRequest.sessionDateTime);
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
            alert(t("tutorDetail.booking.selectTimeSlot"));
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
            alert(t("tutorDetail.booking.selectNewTimeSlot"));
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

    // Handle slot click with API check for regular sessions
    const handleSlotClick = async (utcDateTime: string) => {
        if (hasTrialSession) {
            // Trial session: chỉ chọn 1
            setSelectedTimes([utcDateTime]);
            return;
        }

        // Regular session: check conflicts via API
        const isSelected = selectedTimes.includes(utcDateTime);
        let newSelectedTimes: string[];

        if (isSelected) {
            // Remove slot
            newSelectedTimes = selectedTimes.filter((t) => t !== utcDateTime);
        } else {
            // Add slot
            newSelectedTimes = [...selectedTimes, utcDateTime];
        }

        try {
            // Call API to check conflicts for new selection
            const response = await classService.checkSlotConflicts(tutorId, newSelectedTimes);
            if (response.success) {
                const conflicts = response.data?.sessions || [];
                
                // Only update selection if no conflicts
                if (conflicts.length === 0) {
                    setSelectedTimes(newSelectedTimes);
                } else {
                    // Show error or handle conflicts - for now just log
                    console.warn("Slot conflicts detected:", conflicts);
                }
            } else {
                console.error("Failed to check slot conflicts:", response.message);
                // Keep current selection if API fails
            }
        } catch (error) {
            console.error("Error checking slot conflicts:", error);
            // Keep current selection if API fails
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
                        const isSelected = selectedDate.toDateString() === d.fullDate.toDateString();
                        const daySessions = sessions.find(
                            (session: any) => session.date.toDateString() === d.fullDate.toDateString()
                        );
                        return (
                            <div key={index} className="text-center">
                                <button
                                    onClick={() => handleSelectDay(d.fullDate)}
                                    className={`w-full p-3 rounded-lg transition-colors ${
                                        isSelected ? "bg-[#F9F3EB]" : "hover:bg-gray-50"
                                    }`}
                                >
                                    <p className="text-sm font-semibold">{d.date}</p>
                                    <p className="text-xs text-gray-500 mt-1">{d.day}</p>
                                </button>
                                <div className="mt-3 space-y-2">
                                    {daySessions && daySessions.timeSlots.length > 0 ? (
                                        daySessions.timeSlots.map((time: string) => {
                                            const utcDateTime = commonUtils.convertToLocalDateTime(d.fullDate, time, selectedTimezone);
                                            const isSelected = selectedTimes.includes(utcDateTime);
                                            const isBookedTrial = bookedTrialSlots.includes(utcDateTime);
                                            const isTrialRequest = Boolean(
                                                trialSessionRequest &&
                                                trialSessionRequest.sessionDateTime === utcDateTime
                                            );
                                            const trialStatus = isTrialRequest
                                                ? (trialSessionRequest?.status as any)
                                                : null;
                                            return (
                                                <div key={time} className="space-y-1">
                                                    <button
                                                        className={`pending-trial-slot w-full text-xs py-2.5 rounded-md font-semibold transition-colors ${
                                                            isTrialRequest && trialStatus
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
                                                                setSelectedTimes([utcDateTime]);
                                                            } else if (isTrialRequest && trialStatus === "PENDING") {
                                                                // Toggle show/hide action buttons for pending trial request
                                                                setSelectedTrialSlot((prev) =>
                                                                    prev === utcDateTime ? null : utcDateTime
                                                                );
                                                            } else if (
                                                                hasTrialSession &&
                                                                !bookedTrialSlots.includes(utcDateTime)
                                                            ) {
                                                                // Trial session: chỉ chọn 1
                                                                setSelectedTimes([utcDateTime]);
                                                            } else if (!hasTrialSession) {
                                                                // Regular session: call API to check conflicts
                                                                handleSlotClick(utcDateTime);
                                                            }
                                                        }}
                                                        disabled={
                                                            (bookedTrialSlots.includes(utcDateTime) &&
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
                                                    {selectedTrialSlot === utcDateTime &&
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
        </div>
    );
};

export default BookASession;
