import React, { useState, useEffect, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { HiChevronLeft, HiChevronRight, HiPencil, HiX } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import Toast from "../../../../components/ui/Toast";
import Tooltip from "../../../../components/ui/Tooltip";
import CustomDropdown from "../../../../components/ui/CustomDropdown";
import { CalendarSkeleton, MonthlyCalendarSkeleton } from "./components/SchedulePageSkeleton";
import TutorSessionDetailModal from "../components/TutorSessionDetailModal";
import { scheduleService } from "../../../../services/scheduleService";
import { classService } from "../../../../services/classService";
import { useAuth } from "../../../../context/AuthContext";
import { useBreadcrumb } from "../../context/BreadcrumbContext";
import type { TutorAvailability } from "../../../../types/tutor";
import type { GetBookedSessionsResponse, Session } from "../../../../types/class";
import commonUtils from "../../../../utils/commonUtils";

// --- INTERFACES ---
// Using BookedSession directly from API types// --- COMPONENT ---
const ScheduleManagementContent: React.FC = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { state } = useAuth();
    const { user } = state;
    const { setBreadcrumb } = useBreadcrumb();
    // --- STATE MANAGEMENT ---
    const [view, setView] = useState<"Daily" | "Weekly" | "Monthly">("Weekly");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [availability, setAvailability] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [availabilityData, setAvailabilityData] = useState<{startDate: Date, endDate: Date, slots: string[]} | null>(null);
    const [originalAvailabilities, setOriginalAvailabilities] = useState<TutorAvailability[]>([]);
    const [bookedSessions, setBookedSessions] = useState<Session[]>([]);
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [modalPosition, setModalPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

    // Edit Mode State
    const [isEditMode, setIsEditMode] = useState(false);
    const [tempAvailability, setTempAvailability] = useState<string[]>(availability);
    const [editModeAvailability, setEditModeAvailability] = useState<string[]>([]); // Slots for next week (for edit mode)

    // Marquee Selection State
    const [isDragging, setIsDragging] = useState(false);
    const [selectionMode, setSelectionMode] = useState<"adding" | "removing" | null>(null);
    const [dragStartCoords, setDragStartCoords] = useState<{ x: number; y: number } | null>(null);
    const [selectionRect, setSelectionRect] = useState<{
        top: number;
        left: number;
        width: number;
        height: number;
    } | null>(null);
    const [initialAvailabilityOnDrag, setInitialAvailabilityOnDrag] = useState<string[]>([]);
    const gridRef = useRef<HTMLDivElement>(null);

    // Save Popover State
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    // Timezone State
    const [selectedTimezone, setSelectedTimezone] = useState<{ name: string; offset: string } | null>(null);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    // Set breadcrumb
    useEffect(() => {
        setBreadcrumb([
            { label: t('dashboard.header.breadcrumb.dashboard'), path: '/dashboard' },
            { label: t('dashboard.tutor.schedule.title') }
        ]);
    }, [setBreadcrumb, t]);

    // Timezone options from commonUtils (memoized to prevent recalculation)
    const timezoneOptions = useMemo(() => 
        commonUtils.getAllTimezones().map(tz => `${tz.name} (${tz.offset})`), 
        []
    );

    // Set default timezone to user's current timezone (only on mount)
    useEffect(() => {
        const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const timezones = commonUtils.getAllTimezones();
        const foundTimezone = timezones.find(tz => tz.name === currentTimezone);
        if (foundTimezone) {
            setSelectedTimezone(foundTimezone);
        } else {
            setSelectedTimezone(timezones[0] || { name: "UTC", offset: "+00:00" }); // fallback
        }
    }, []); // Only on mount

    // Fetch initial availability on mount
    useEffect(() => {
        const { start, end } = getMonthlyRange(currentDate);
        fetchAvailability(start, end);
        fetchBookedSessions(start, end);
        
        // Fetch availability for next week (for edit mode)
        fetchNextWeekAvailability();
    }, []);

    // Fetch availability for next week (for edit mode only)
    const fetchNextWeekAvailability = async () => {
        if (!user?.id) return;
        
        try {
            const today = new Date();
            const nextWeekStart = new Date(today);
            nextWeekStart.setDate(today.getDate() + 7); // Next week start
            
            // Get next week range (Monday to Sunday)
            const weekRange = getWeekRangeForDate(nextWeekStart);
            const startDate = weekRange.start;
            const endDate = new Date(weekRange.end);
            
            const response = await scheduleService.getAvailability({
                tutorId: user.id,
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0]
            });
            
            if (response.success) {
                console.log('Next week availability response:', response.data);
                // Generate slots for next week
                const slots = generateSlotsFromAvailabilities(response.data.availabilities, startDate, endDate);
                console.log('Next week slots generated:', slots);
                setEditModeAvailability(slots);
            }
        } catch (error) {
            console.error('Failed to fetch next week availability:', error);
        }
    };

    // Date Picker Dropdown State
    const [displayDate, setDisplayDate] = useState(
        new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1))
    );
    const [hoveredWeek, setHoveredWeek] = useState<{ start: Date; end: Date } | null>(null);
    const datePickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isDatePickerOpen) {
            setDisplayDate(new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1)));
        }
    }, [currentDate, isDatePickerOpen]);

    // --- HANDLERS ---
    const handleTimezoneSelect = (timezone: string) => {
        // Parse timezone string "Asia/Ho_Chi_Minh (+07:00)" -> { name: "Asia/Ho_Chi_Minh", offset: "+07:00" }
        const match = timezone.match(/^(.+?)\s+\(([+-]\d{2}:\d{2})\)$/);
        if (match) {
            setSelectedTimezone({ name: match[1], offset: match[2] });
        }
    };

    const handleSessionClick = (booking: Session, event: React.MouseEvent) => {
        if (isEditMode) return;
        const rect = event.currentTarget.getBoundingClientRect();
        setModalPosition({ top: rect.top + window.scrollY, left: rect.right + window.scrollX + 10 });
        setSelectedSession(booking);
    };

    const handleCellClick = (date: Date, hour: number) => {
        if (!isEditMode || !selectedTimezone) return;

        // Create slot in local timezone
        const localSlotDate = new Date(date);
        localSlotDate.setUTCHours(hour, 0, 0, 0);
        const localSlotISO = localSlotDate.toISOString();
        
        // Convert local slot back to UTC for storage
        const offsetMatch = selectedTimezone.offset.match(/([+-])(\d{1,2}):(\d{2})/);
        if (!offsetMatch) return;
        
        const sign = offsetMatch[1] === "+" ? 1 : -1;
        const offsetHours = parseInt(offsetMatch[2]);
        const offsetMinutes = parseInt(offsetMatch[3]);
        
        // Reverse the timezone offset to get UTC
        const utcSlotDate = new Date(Date.UTC(
            localSlotDate.getUTCFullYear(),
            localSlotDate.getUTCMonth(),
            localSlotDate.getUTCDate(),
            localSlotDate.getUTCHours() - sign * offsetHours,
            localSlotDate.getUTCMinutes() - sign * offsetMinutes
        ));
        const utcSlotISO = utcSlotDate.toISOString();
        
        const isCurrentlyAvailable = tempAvailability.includes(utcSlotISO);

        console.log('Cell clicked - Local:', localSlotISO, 'UTC:', utcSlotISO, 'currently available:', isCurrentlyAvailable);

        if (isCurrentlyAvailable) {
            setTempAvailability((prev) => {
                const updated = prev.filter((s) => s !== utcSlotISO);
                console.log('Removed slot, new length:', updated.length);
                return updated;
            });
        } else {
            setTempAvailability((prev) => {
                const updated = [...prev, utcSlotISO];
                console.log('Added slot, new length:', updated.length);
                return updated;
            });
        }
    };

    // Edit Mode Handlers
    const handleEditClick = () => {
        // Navigate to next week when editing
        const today = new Date();
        const nextWeekStart = new Date(today);
        nextWeekStart.setDate(today.getDate() + 7);
        const weekRange = getWeekRangeForDate(nextWeekStart);
        setCurrentDate(weekRange.start);
        
        // Use pre-fetched editModeAvailability
        setTempAvailability([...editModeAvailability]);
        setIsEditMode(true);
    };

    const handleCancelClick = () => {
        setIsEditMode(false);
        // Navigate back to current week
        const today = new Date();
        const currentWeekStart = getWeekRangeForDate(today).start;
        setCurrentDate(currentWeekStart);
    };

    const handleDateApply = (date: Date) => {
        const newCurrentDate = new Date(
            Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12, 0, 0)
        );
        setCurrentDate(newCurrentDate);
        setIsDatePickerOpen(false);
        checkAndFetchAvailability(newCurrentDate);
    };

    // --- AVAILABILITY API FUNCTIONS ---
    const getMonthlyRange = (baseDate: Date) => {
        const year = baseDate.getUTCFullYear();
        const month = baseDate.getUTCMonth();
        const start = new Date(Date.UTC(year, month, 1));
        const end = new Date(Date.UTC(year, month, 1));
        end.setDate(end.getDate() + 34); // 35 days for monthly view
        return { start, end };
    };

    const convertTempAvailabilityToTutorAvailabilities = (tempAvailability: string[]): Omit<TutorAvailability, 'id'>[] => {
        const availabilities: Omit<TutorAvailability, 'id'>[] = [];
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const effectiveStartDate = tomorrow.toISOString().split('T')[0];
        
        // Group slots by day of week
        const groupedByDay: { [dayOfWeek: number]: Set<number> } = {};
        tempAvailability.forEach(slot => {
            const date = new Date(slot);
            const dayOfWeek = date.getUTCDay();
            const hour = date.getUTCHours();
            
            if (!groupedByDay[dayOfWeek]) {
                groupedByDay[dayOfWeek] = new Set();
            }
            groupedByDay[dayOfWeek].add(hour);
        });
        
        // For each day, merge consecutive hours into time ranges
        Object.entries(groupedByDay).forEach(([dayStr, hoursSet]) => {
            const dayOfWeek = parseInt(dayStr);
            const hours = Array.from(hoursSet).sort((a, b) => a - b);
            if (hours.length === 0) return;
            
            // Merge consecutive hours
            let rangeStart = hours[0];
            let rangeEnd = hours[0];
            
            for (let i = 1; i <= hours.length; i++) {
                if (i < hours.length && hours[i] === rangeEnd + 1) {
                    // Continue current range
                    rangeEnd = hours[i];
                } else {
                    // End current range and create availability
                    availabilities.push({
                        dayOfWeek,
                        startTime: `${rangeStart.toString().padStart(2, '0')}:00`,
                        endTime: `${(rangeEnd + 1).toString().padStart(2, '0')}:00`,
                        effectiveStartDate
                    });
                    
                    // Start new range
                    if (i < hours.length) {
                        rangeStart = hours[i];
                        rangeEnd = hours[i];
                    }
                }
            }
        });
        
        return availabilities;
    };

    const generateSlotsFromAvailabilities = (availabilities: TutorAvailability[], startDate: Date, endDate: Date): string[] => {
        const slots: string[] = [];
        
        availabilities.forEach((avail) => {
            // Parse time range
            const [startHour] = avail.startTime.split(':').map(Number);
            const [endHour] = avail.endTime.split(':').map(Number);
            
            // Check effective date range
            const effectiveStart = new Date(avail.effectiveStartDate);
            const effectiveEnd = avail.effectiveEndDate ? new Date(avail.effectiveEndDate) : null;

            // Normalize dayOfWeek: API uses 1=Monday,7=Sunday, getUTCDay() uses 0=Sunday,1=Monday
            const normalizedDayOfWeek = avail.dayOfWeek === 7 ? 0 : avail.dayOfWeek;
            
            // Find all dates within range that match the dayOfWeek
            let currentDate = new Date(startDate);
            // Find the first date that matches dayOfWeek
            const dayDiff = (normalizedDayOfWeek - currentDate.getUTCDay() + 7) % 7;
            currentDate.setUTCDate(currentDate.getUTCDate() + dayDiff);
            
            // Iterate through all matching dates
            while (currentDate <= endDate) {
                // Check if currentDate is within effective range
                if (currentDate >= effectiveStart && (!effectiveEnd || currentDate <= effectiveEnd)) {
                    // Generate hourly slots for this date
                    for (let hour = startHour; hour < endHour; hour++) {
                        const slotISO = new Date(
                            Date.UTC(
                                currentDate.getUTCFullYear(),
                                currentDate.getUTCMonth(),
                                currentDate.getUTCDate(),
                                hour,
                                0, 0, 0
                            )
                        ).toISOString();
                        slots.push(slotISO);
                    }
                }
                // Move to next week same day
                currentDate = new Date(currentDate);
                currentDate.setUTCDate(currentDate.getUTCDate() + 7);
            }
        });
        
        return slots;
    };
    
    const fetchAvailability = async (startDate: Date, endDate: Date) => {
        if (!user?.id) return;
        
        setLoading(true);
        try {
            const response = await scheduleService.getAvailability({
                tutorId: user.id,
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0]
            });
            
            if (response.success) {
                console.log('Availability API response:', response.data);
                // Store original availabilities from BE
                setOriginalAvailabilities(response.data.availabilities);
                // Generate time slots from TutorAvailability data
                const slots = generateSlotsFromAvailabilities(response.data.availabilities, startDate, endDate);
                console.log('Generated slots:', slots);
                
                setAvailability(slots);
                setAvailabilityData({ startDate, endDate, slots });
            }
        } catch (error) {
            console.error('Failed to fetch availability:', error);
            setToast({ message: t('dashboard.tutor.schedule.errors.loadAvailability'), type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const fetchBookedSessions = async (startDate: Date, endDate: Date) => {
        if (!user?.id) return;

        try {
            const response = await classService.getBookedSessions({
                tutorId: user.id,
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0]
            });

            if (response.success) {
                setBookedSessions(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch booked sessions:', error);
            setToast({ message: t('dashboard.tutor.schedule.errors.loadSessions'), type: 'error' });
        }
    };

    const checkAndFetchAvailability = (newDate: Date) => {
        const { start, end } = getMonthlyRange(newDate);
        
        if (!availabilityData || 
            start < availabilityData.startDate || 
            end > availabilityData.endDate) {
            fetchAvailability(start, end);
            fetchBookedSessions(start, end);
        }
    };

    const handleSaveForFuture = async () => {
        if (!user?.id) return;
        
        try {
            console.log('=== SAVE DEBUG ===');
            console.log('tempAvailability slots (UTC):', tempAvailability);
            console.log('tempAvailability length:', tempAvailability.length);
            
            // Convert tempAvailability slots (UTC ISO strings) back to TutorAvailability format
            const newAvailabilities = convertTempAvailabilityToTutorAvailabilities(tempAvailability);
            console.log('Converted availabilities (no IDs):', newAvailabilities);
            
            console.log('Sending to API:', { availabilities: newAvailabilities });
            
            // Call API to update availability (only send new availabilities, no deleteIds)
            const response = await scheduleService.updateAvailability(user.id, { 
                availabilities: newAvailabilities
            });
            
            if (response.success) {
                setAvailability(tempAvailability);
                setIsEditMode(false);
                setToast({ message: t('dashboard.tutor.schedule.success.save'), type: 'success' });
                
                // Refetch to get new availability data with IDs
                const { start, end } = getMonthlyRange(currentDate);
                fetchAvailability(start, end);
                
                // Refetch next week availability for edit mode
                fetchNextWeekAvailability();
                
                // Navigate back to current week
                const today = new Date();
                const currentWeekStart = getWeekRangeForDate(today).start;
                setCurrentDate(currentWeekStart);
            } else {
                setToast({ message: t('dashboard.tutor.schedule.errors.save'), type: 'error' });
            }
        } catch (error) {
            console.error('Failed to save availability:', error);
            setToast({ message: t('dashboard.tutor.schedule.errors.save'), type: 'error' });
        }
    };

    // Convert UTC slots to local timezone for display
    const displaySlots = useMemo(() => {
        if (!selectedTimezone || availability.length === 0) return [];

        const slots: string[] = [];
        
        availability.forEach(utcSlot => {
            // Parse UTC time from ISO string
            const utcDate = new Date(utcSlot);
            
            // Get UTC components
            const utcYear = utcDate.getUTCFullYear();
            const utcMonth = utcDate.getUTCMonth();
            const utcDay = utcDate.getUTCDate();
            const utcHour = utcDate.getUTCHours();
            const utcMinute = utcDate.getUTCMinutes();
            
            // Parse timezone offset
            const offsetMatch = selectedTimezone.offset.match(/([+-])(\d{1,2}):(\d{2})/);
            if (!offsetMatch) return;
            
            const sign = offsetMatch[1] === "+" ? 1 : -1;
            const offsetHours = parseInt(offsetMatch[2]);
            const offsetMinutes = parseInt(offsetMatch[3]);
            
            // Apply offset to create local time
            const localDate = new Date(Date.UTC(
                utcYear,
                utcMonth,
                utcDay,
                utcHour + sign * offsetHours,
                utcMinute + sign * offsetMinutes
            ));
            
            // Store as ISO string (but represents local time)
            slots.push(localDate.toISOString());
        });

        return slots;
    }, [availability, selectedTimezone]);

    // Convert tempAvailability (UTC) to local timezone for display in edit mode
    const displayTempSlots = useMemo(() => {
        if (!selectedTimezone || tempAvailability.length === 0) return [];

        const slots: string[] = [];
        
        tempAvailability.forEach(utcSlot => {
            const utcDate = new Date(utcSlot);
            
            const utcYear = utcDate.getUTCFullYear();
            const utcMonth = utcDate.getUTCMonth();
            const utcDay = utcDate.getUTCDate();
            const utcHour = utcDate.getUTCHours();
            const utcMinute = utcDate.getUTCMinutes();
            
            const offsetMatch = selectedTimezone.offset.match(/([+-])(\d{1,2}):(\d{2})/);
            if (!offsetMatch) return;
            
            const sign = offsetMatch[1] === "+" ? 1 : -1;
            const offsetHours = parseInt(offsetMatch[2]);
            const offsetMinutes = parseInt(offsetMatch[3]);
            
            const localDate = new Date(Date.UTC(
                utcYear,
                utcMonth,
                utcDay,
                utcHour + sign * offsetHours,
                utcMinute + sign * offsetMinutes
            ));
            
            slots.push(localDate.toISOString());
        });

        return slots;
    }, [tempAvailability, selectedTimezone]);

    // --- DATE & NAVIGATION UTILS ---
    const getWeekDays = (baseDate: Date) => {
        const startOfWeek = new Date(baseDate.getTime());
        startOfWeek.setUTCHours(0, 0, 0, 0);
        const dayOfWeek = startOfWeek.getUTCDay();
        const diff = startOfWeek.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Monday as start of week
        startOfWeek.setUTCDate(diff);
        return Array.from({ length: 7 }, (_, i) => {
            const day = new Date(startOfWeek.getTime());
            day.setUTCDate(startOfWeek.getUTCDate() + i);
            return day;
        });
    };

    const handleNavigation = (direction: "prev" | "next" | "today") => {
        let newDate: Date;
        
        if (direction === "today") {
            const today = new Date();
            newDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0));
        } else {
            newDate = new Date(currentDate.getTime());
            const increment = direction === "prev" ? -1 : 1;

            if (view === "Daily") {
                newDate.setUTCDate(newDate.getUTCDate() + increment);
            } else if (view === "Weekly") {
                newDate.setUTCDate(newDate.getUTCDate() + 7 * increment);
            } else if (view === "Monthly") {
                newDate.setUTCMonth(newDate.getUTCMonth() + increment);
            }
        }
        
        setCurrentDate(newDate);
        checkAndFetchAvailability(newDate);
    };

    const getDisplayDate = () => {
        const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
        const options: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
        if (view === "Daily") {
            options.year = "numeric";
            options.month = "long";
            options.day = "numeric";
            return currentDate.toLocaleDateString(locale, options);
        }
        if (view === "Monthly") {
            options.month = "long";
            options.year = "numeric";
            return currentDate.toLocaleDateString(locale, options);
        }
        // Weekly view
        const week = getWeekDays(currentDate);
        const start = week[0];
        const end = week[6];

        const startOptions: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", timeZone: "UTC" };
        const endOptions: Intl.DateTimeFormatOptions = {
            month: "long",
            day: "numeric",
            year: "numeric",
            timeZone: "UTC",
        };

        if (start.getUTCFullYear() !== end.getUTCFullYear()) {
            startOptions.year = "numeric";
        }

        return `${start.toLocaleDateString(locale, startOptions)} - ${end.toLocaleDateString(locale, endOptions)}`;
    };

    // --- DATE PICKER HELPERS ---
    const getWeekRangeForDate = (date: Date) => {
        const d = new Date(date.getTime());
        d.setUTCHours(0, 0, 0, 0);
        const day = d.getUTCDay();
        const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
        const start = new Date(d.setUTCDate(diff));
        const end = new Date(start.getTime());
        end.setUTCDate(start.getUTCDate() + 6);
        return { start, end };
    };

    const handleDayClick = (day: number) => {
        const year = displayDate.getUTCFullYear();
        const month = displayDate.getUTCMonth();
        const clickedDate = new Date(Date.UTC(year, month, day, 12, 0, 0));
        if (view === "Daily") {
            handleDateApply(clickedDate);
        } else {
            const weekStart = getWeekRangeForDate(clickedDate).start;
            handleDateApply(weekStart);
        }
    };

    const handleMonthClick = (index: number) => {
        const year = displayDate.getUTCFullYear();
        handleDateApply(new Date(Date.UTC(year, index, 1, 12, 0, 0)));
    };

    const handlePrevMonth = () =>
        setDisplayDate((prev) => new Date(Date.UTC(prev.getUTCFullYear(), prev.getUTCMonth() - 1, 1)));
    const handleNextMonth = () =>
        setDisplayDate((prev) => new Date(Date.UTC(prev.getUTCFullYear(), prev.getUTCMonth() + 1, 1)));
    const handlePrevYear = () => setDisplayDate((prev) => new Date(Date.UTC(prev.getUTCFullYear() - 1, 0, 1)));
    const handleNextYear = () => setDisplayDate((prev) => new Date(Date.UTC(prev.getUTCFullYear() + 1, 0, 1)));

    // --- MARQUEE SELECTION LOGIC ---
    const handleMouseDown = (e: React.MouseEvent, date: Date, hour: number) => {
        if (!isEditMode || e.button !== 0 || !selectedTimezone) return;
        e.preventDefault();

        const gridRect = gridRef.current?.getBoundingClientRect();
        if (!gridRect) return;

        const startX = e.clientX - gridRect.left;
        const startY = e.clientY - gridRect.top;
        setDragStartCoords({ x: startX, y: startY });

        // Create slot in local timezone
        const localSlotDate = new Date(date);
        localSlotDate.setUTCHours(hour, 0, 0, 0);
        
        // Convert to UTC for checking
        const offsetMatch = selectedTimezone.offset.match(/([+-])(\d{1,2}):(\d{2})/);
        if (!offsetMatch) return;
        
        const sign = offsetMatch[1] === "+" ? 1 : -1;
        const offsetHours = parseInt(offsetMatch[2]);
        const offsetMinutes = parseInt(offsetMatch[3]);
        
        const utcSlotDate = new Date(Date.UTC(
            localSlotDate.getUTCFullYear(),
            localSlotDate.getUTCMonth(),
            localSlotDate.getUTCDate(),
            localSlotDate.getUTCHours() - sign * offsetHours,
            localSlotDate.getUTCMinutes() - sign * offsetMinutes
        ));
        const utcSlotISO = utcSlotDate.toISOString();
        
        const mode = tempAvailability.includes(utcSlotISO) ? "removing" : "adding";
        setSelectionMode(mode);
        setInitialAvailabilityOnDrag([...tempAvailability]);
        setIsDragging(true);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !dragStartCoords || !gridRef.current) return;
            e.preventDefault();
            const gridRect = gridRef.current.getBoundingClientRect();
            const currentX = e.clientX - gridRect.left;
            const currentY = e.clientY - gridRect.top;
            const rect = {
                left: Math.min(dragStartCoords.x, currentX),
                top: Math.min(dragStartCoords.y, currentY),
                width: Math.abs(dragStartCoords.x - currentX),
                height: Math.abs(dragStartCoords.y - currentY),
            };
            setSelectionRect(rect);
        };
        const handleMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
                setDragStartCoords(null);
                setSelectionRect(null);
                setSelectionMode(null);
                setInitialAvailabilityOnDrag([]);
            }
        };
        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, dragStartCoords]);

    useEffect(() => {
        if (!isDragging || !selectionRect || !selectionMode || !gridRef.current || !selectedTimezone) return;

        const newAvailability = new Set(initialAvailabilityOnDrag);
        const gridRect = gridRef.current.getBoundingClientRect();
        const cellElements = gridRef.current.querySelectorAll(".calendar-cell");

        // Parse timezone offset once
        const offsetMatch = selectedTimezone.offset.match(/([+-])(\d{1,2}):(\d{2})/);
        if (!offsetMatch) return;
        
        const sign = offsetMatch[1] === "+" ? 1 : -1;
        const offsetHours = parseInt(offsetMatch[2]);
        const offsetMinutes = parseInt(offsetMatch[3]);

        cellElements.forEach((cell) => {
            const cellRect = cell.getBoundingClientRect();
            const relativeCellRect = {
                top: cellRect.top - gridRect.top,
                bottom: cellRect.bottom - gridRect.top,
                left: cellRect.left - gridRect.left,
                right: cellRect.right - gridRect.left,
            };
            if (
                selectionRect.left < relativeCellRect.right &&
                selectionRect.left + selectionRect.width > relativeCellRect.left &&
                selectionRect.top < relativeCellRect.bottom &&
                selectionRect.top + selectionRect.height > relativeCellRect.top
            ) {
                const localIso = (cell as HTMLElement).dataset.iso;
                if (localIso) {
                    // Convert local ISO to UTC ISO
                    const localDate = new Date(localIso);
                    const utcDate = new Date(Date.UTC(
                        localDate.getUTCFullYear(),
                        localDate.getUTCMonth(),
                        localDate.getUTCDate(),
                        localDate.getUTCHours() - sign * offsetHours,
                        localDate.getUTCMinutes() - sign * offsetMinutes
                    ));
                    const utcIso = utcDate.toISOString();
                    
                    if (selectionMode === "adding") newAvailability.add(utcIso);
                    else if (selectionMode === "removing") newAvailability.delete(utcIso);
                }
            }
        });
        const updated = Array.from(newAvailability);
        console.log('Drag selection updated tempAvailability, new length:', updated.length);
        setTempAvailability(updated);
    }, [selectionRect, selectionMode, initialAvailabilityOnDrag, isDragging, selectedTimezone]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                setIsDatePickerOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // --- DATE PICKER RENDER FUNCTIONS ---
    const renderDayAndWeekPicker = () => {
        const year = displayDate.getUTCFullYear();
        const month = displayDate.getUTCMonth();
        const firstDayOfMonth = new Date(Date.UTC(year, month, 1)).getUTCDay();
        const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
        const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
        const blanks = Array(adjustedFirstDay).fill(null);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        const daysOfWeek = [
            t('dashboard.tutor.schedule.days.mon'),
            t('dashboard.tutor.schedule.days.tue'),
            t('dashboard.tutor.schedule.days.wed'),
            t('dashboard.tutor.schedule.days.thu'),
            t('dashboard.tutor.schedule.days.fri'),
            t('dashboard.tutor.schedule.days.sat'),
            t('dashboard.tutor.schedule.days.sun')
        ];

        return (
            <>
                <div className="flex items-center justify-between mb-4">
                    <button 
                        onClick={handlePrevMonth} 
                        disabled={isEditMode}
                        className={`p-2 rounded-full hover:bg-gray-100 ${isEditMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <HiChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="font-semibold text-gray-700">
                        {displayDate.toLocaleString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', { month: "long", year: "numeric", timeZone: "UTC" })}
                    </span>
                    <button 
                        onClick={handleNextMonth} 
                        disabled={isEditMode}
                        className={`p-2 rounded-full hover:bg-gray-100 ${isEditMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <HiChevronRight className="w-5 h-5" />
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 mb-2">
                    {daysOfWeek.map((day) => (
                        <div key={day} className="h-8 flex items-center justify-center">
                            {day}
                        </div>
                    ))}
                </div>
                <div
                    className="grid grid-cols-7 gap-1"
                    onMouseLeave={view === "Weekly" ? () => setHoveredWeek(null) : undefined}
                >
                    {blanks.map((_, i) => (
                        <div key={`blank-${i}`}></div>
                    ))}
                    {days.map((day) => {
                        const dayDate = new Date(Date.UTC(year, month, day));
                        let isSelected = false;
                        if (view === "Daily") {
                            isSelected =
                                currentDate.getUTCDate() === day &&
                                currentDate.getUTCMonth() === month &&
                                currentDate.getUTCFullYear() === year;
                        } else {
                            const weekRange = getWeekRangeForDate(currentDate);
                            const dayTime = new Date(
                                Date.UTC(dayDate.getUTCFullYear(), dayDate.getUTCMonth(), dayDate.getUTCDate())
                            ).getTime();
                            isSelected = dayTime >= weekRange.start.getTime() && dayTime <= weekRange.end.getTime();
                        }

                        let isInHoveredWeek = false;
                        if (view === "Weekly" && hoveredWeek) {
                            const dayTime = dayDate.getTime();
                            isInHoveredWeek =
                                dayTime >= hoveredWeek.start.getTime() && dayTime <= hoveredWeek.end.getTime();
                        }

                        return (
                            <div
                                key={day}
                                className="flex justify-center items-center"
                                onMouseEnter={
                                    view === "Weekly" && !isEditMode ? () => setHoveredWeek(getWeekRangeForDate(dayDate)) : undefined
                                }
                            >
                                <button
                                    onClick={isEditMode ? undefined : () => handleDayClick(day)}
                                    disabled={isEditMode}
                                    className={`w-10 h-10 rounded-lg transition-colors font-medium ${
                                        isSelected
                                            ? "bg-[#0b6459] text-white"
                                            : isInHoveredWeek
                                            ? "bg-green-100"
                                            : isEditMode
                                            ? "text-gray-400 cursor-not-allowed"
                                            : "hover:bg-gray-100 text-gray-700"
                                    }`}
                                >
                                    {day}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </>
        );
    };

    const renderMonthPicker = () => {
        const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
        const year = displayDate.getUTCFullYear();
        const months = Array.from({ length: 12 }, (_, i) =>
            new Date(Date.UTC(year, i, 1)).toLocaleString(locale, { month: "short", timeZone: "UTC" })
        );

        return (
            <>
                <div className="flex items-center justify-between mb-4">
                    <button onClick={handlePrevYear} className="p-2 rounded-full hover:bg-gray-100">
                        <HiChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="font-semibold text-gray-700">{year}</span>
                    <button onClick={handleNextYear} className="p-2 rounded-full hover:bg-gray-100">
                        <HiChevronRight className="w-5 h-5" />
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {months.map((monthName, index) => {
                        const isSelected = currentDate.getUTCMonth() === index && currentDate.getUTCFullYear() === year;
                        return (
                            <button
                                key={monthName}
                                onClick={() => handleMonthClick(index)}
                                className={`py-4 rounded-lg font-semibold text-sm transition-colors ${
                                    isSelected ? "bg-[#0b6459] text-white" : "hover:bg-gray-100"
                                }`}
                            >
                                {monthName}
                            </button>
                        );
                    })}
                </div>
            </>
        );
    };

    // --- RENDER FUNCTIONS FOR VIEWS ---
    const timeSlots = Array.from({ length: 18 }, (_, i) => `${String(i + 7).padStart(2, "0")}:00`); // 7:00-24:00 - all time slots

    const renderHourlyGrid = (days: Date[], isDaily: boolean = false) => {
        // Daily view: larger cells (h-12) for scrolling
        // Weekly view: smaller cells (h-7) to fit without scrolling
        const timeColumnWidth = isDaily ? '100px' : '80px';
        const cellHeight = isDaily ? 'h-12' : 'h-7.5';
        const timeTextSize = isDaily ? 'text-sm font-medium text-gray-700' : 'text-[10px] text-gray-500';
        const timePadding = isDaily ? 'pr-4 py-1' : 'pr-3 py-0.5';
        const sessionTextSize = isDaily ? 'text-xs' : 'text-[10px]';
        const sessionPadding = isDaily ? 'px-2 py-1' : 'px-2 py-0.5';

        return (
        <div className="bg-white rounded-lg border border-gray-200 flex flex-col h-full w-full min-h-0 overflow-hidden">
            <div className="overflow-x-auto overflow-y-auto flex-1 relative min-h-0" ref={gridRef}>
                <div className={`grid`} style={{ gridTemplateColumns: `${timeColumnWidth} repeat(${days.length}, 1fr)`, width: '100%' }}>
                    {/* Time Column Header */}
                    <div className="sticky left-0 bg-white z-10"></div>
                    {/* Day Headers */}
                    {days.map((day) => (
                        <div key={day.toISOString()} className="text-center p-0.5 border-b border-gray-200 bg-white sticky top-0 z-10">
                            <p className="text-[10px] text-gray-500">
                                {day.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" })}
                            </p>
                            <p className="text-xs font-bold text-gray-800">{day.getUTCDate()}</p>
                        </div>
                    ))}

                    {/* Time Slots and Availability Grid */}
                    {timeSlots.map((time) => (
                        <React.Fragment key={time}>
                            <div className={`text-right border-r border-gray-200 sticky left-0 bg-white z-10 ${cellHeight} flex items-center justify-end ${timeTextSize} ${timePadding}`}>
                                {time}
                            </div>
                            {days.map((day) => {
                                const hour = parseInt(time.split(":")[0]);
                                
                                // Create slot in LOCAL timezone (day is already in local timezone from getWeekDays)
                                const slotDate = new Date(day);
                                slotDate.setUTCHours(hour, 0, 0, 0);
                                const slotISO = slotDate.toISOString();

                                // Check if this slot is available (compare with displaySlots)
                                const isAvailable = isEditMode
                                    ? displayTempSlots.includes(slotISO)
                                    : displaySlots.includes(slotISO);
                                    
                                // Find booked session for this slot
                                // Convert booked session time to local timezone for comparison
                                const bookedSession = bookedSessions.find(session => {
                                    if (!session.sessionDatetime) return false;
                                    
                                    // Parse session datetime (UTC from BE)
                                    const sessionUtcDate = new Date(session.sessionDatetime);
                                    
                                    if (!selectedTimezone) return false;
                                    
                                    // Convert to local timezone
                                    const offsetMatch = selectedTimezone.offset.match(/([+-])(\d{1,2}):(\d{2})/);
                                    if (!offsetMatch) return false;
                                    
                                    const sign = offsetMatch[1] === "+" ? 1 : -1;
                                    const offsetHours = parseInt(offsetMatch[2]);
                                    const offsetMinutes = parseInt(offsetMatch[3]);
                                    
                                    const sessionLocalDate = new Date(Date.UTC(
                                        sessionUtcDate.getUTCFullYear(),
                                        sessionUtcDate.getUTCMonth(),
                                        sessionUtcDate.getUTCDate(),
                                        sessionUtcDate.getUTCHours() + sign * offsetHours,
                                        sessionUtcDate.getUTCMinutes() + sign * offsetMinutes
                                    ));
                                    
                                    // Compare with slot time
                                    return sessionLocalDate.getTime() === slotDate.getTime();
                                });

                                if (bookedSession) {
                                    return (
                                        <div key={day.toISOString()} className={`border-b border-r border-gray-200 ${cellHeight} p-0 overflow-hidden`}>
                                            <div
                                                onClick={(e) => handleSessionClick(bookedSession, e)}
                                                className={`h-full w-full rounded ${sessionTextSize} ${sessionPadding} bg-blue-100 text-blue-800 border border-blue-200 overflow-hidden flex flex-col justify-center min-w-0 ${
                                                    !isEditMode ? "cursor-pointer" : "cursor-default opacity-70"
                                                }`}
                                            >
                                                <p className={`font-bold leading-tight ${sessionTextSize} overflow-hidden text-ellipsis whitespace-nowrap min-w-0`}>{bookedSession.tutor?.fullName || 'Unknown Tutor'}</p>
                                                <p className={`leading-tight ${sessionTextSize} overflow-hidden text-ellipsis whitespace-nowrap min-w-0`}>
                                                    {bookedSession.students && bookedSession.students.length > 0
                                                        ? (bookedSession.students.length === 1 
                                                            ? (bookedSession.students[0]?.fullName || 'Unknown Student')
                                                            : `${bookedSession.students[0]?.fullName || 'Unknown'} (+${bookedSession.students.length - 1})`)
                                                        : 'No students'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div
                                        key={day.toISOString()}
                                        data-iso={slotISO}
                                        className={`calendar-cell border-b border-r border-gray-200 ${cellHeight} text-center select-none overflow-hidden ${
                                            isEditMode ? "cursor-pointer" : ""
                                        }`}
                                        onMouseDown={(e) => handleMouseDown(e, day, hour)}
                                        onClick={() => handleCellClick(day, hour)}
                                    >
                                        {isAvailable && (
                                            <div
                                                className={`h-full w-full ${
                                                    isEditMode ? "bg-green-200" : "bg-green-100"
                                                } opacity-70`}
                                            ></div>
                                        )}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
                {isDragging && selectionRect && (
                    <div
                        className="absolute bg-blue-500 bg-opacity-30 border-2 border-blue-600 pointer-events-none z-20"
                        style={{
                            left: selectionRect.left,
                            top: selectionRect.top,
                            width: selectionRect.width,
                            height: selectionRect.height,
                        }}
                    />
                )}
            </div>
        </div>
        );
    };

    // Helper function to get day name from dayOfWeek (1=Monday, 7=Sunday)
    const getDayName = (dayOfWeek: number): string => {
        const days = [
            t('common.days.monday'),
            t('common.days.tuesday'),
            t('common.days.wednesday'),
            t('common.days.thursday'),
            t('common.days.friday'),
            t('common.days.saturday'),
            t('common.days.sunday')
        ];
        return days[dayOfWeek === 7 ? 6 : dayOfWeek - 1] || '';
    };

    // Render availability details panel
    const renderAvailabilityDetails = () => {
        if (!originalAvailabilities || originalAvailabilities.length === 0) {
            return (
                <div className="bg-white rounded-lg border border-gray-200 flex flex-col h-full">
                    <div className="p-4 border-b border-gray-200 flex-shrink-0">
                        <h3 className="text-lg font-semibold text-gray-800">{t('dashboard.tutor.schedule.availabilityDetails.title')}</h3>
                    </div>
                    <div className="p-4 flex-1 flex items-center justify-center">
                        <p className="text-sm text-gray-500">{t('dashboard.tutor.schedule.availabilityDetails.noAvailability')}</p>
                    </div>
                </div>
            );
        }

        // Group availabilities by dayOfWeek (1=Monday, 7=Sunday)
        const groupedByDay: { [key: number]: typeof originalAvailabilities } = {};
        originalAvailabilities.forEach((avail) => {
            if (!groupedByDay[avail.dayOfWeek]) {
                groupedByDay[avail.dayOfWeek] = [];
            }
            groupedByDay[avail.dayOfWeek].push(avail);
        });

        // Sort by dayOfWeek (Monday to Sunday)
        const sortedDays = [1, 2, 3, 4, 5, 6, 7].filter(day => groupedByDay[day]);

        return (
            <div className="bg-white rounded-lg border border-gray-200 flex flex-col h-full min-h-0">
                <div className="p-3 border-b border-gray-200 flex-shrink-0 sticky top-0 bg-white z-10 rounded-t-lg">
                    <h3 className="text-base font-semibold text-gray-800">{t('dashboard.tutor.schedule.availabilityDetails.title')}</h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                        {originalAvailabilities.length} {originalAvailabilities.length > 1 ? t('dashboard.tutor.schedule.availabilityDetails.slots') : t('dashboard.tutor.schedule.availabilityDetails.slot')}
                    </p>
                </div>
                <div className="flex-1 overflow-y-auto p-2 min-h-0">
                    <div className="space-y-2">
                        {sortedDays.map((dayOfWeek) => {
                            const dayAvailabilities = groupedByDay[dayOfWeek];
                            return (
                                <div key={dayOfWeek} className="border border-gray-200 rounded-md p-2 hover:border-[#0b6459] transition-colors bg-gray-50 hover:bg-white">
                                    <div className="mb-1.5">
                                        <span className="text-xs font-semibold text-gray-800">
                                            {getDayName(dayOfWeek)}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {dayAvailabilities.map((avail) => (
                                            <span key={avail.id} className="text-[10px] text-gray-600 font-medium px-1.5 py-0.5 bg-white rounded border border-gray-200">
                                                {avail.startTime} - {avail.endTime}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const renderDailyView = () => renderHourlyGrid([currentDate], true);
    const renderWeeklyView = () => renderHourlyGrid(getWeekDays(currentDate), false);

    const renderMonthlyView = () => {
        const year = currentDate.getUTCFullYear();
        const month = currentDate.getUTCMonth();
        const firstDayOfMonth = new Date(Date.UTC(year, month, 1));
        const lastDayOfMonth = new Date(Date.UTC(year, month + 1, 0));
        const daysInMonth = lastDayOfMonth.getUTCDate();
        const startDayOfWeek = firstDayOfMonth.getUTCDay() === 0 ? 6 : firstDayOfMonth.getUTCDay() - 1;

        const calendarDays = [];
        const prevMonthLastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
        for (let i = startDayOfWeek - 1; i >= 0; i--) {
            calendarDays.push({
                day: prevMonthLastDay - i,
                isCurrentMonth: false,
                date: new Date(Date.UTC(year, month - 1, prevMonthLastDay - i)),
            });
        }
        for (let i = 1; i <= daysInMonth; i++) {
            calendarDays.push({ day: i, isCurrentMonth: true, date: new Date(Date.UTC(year, month, i)) });
        }
        const remainingCells = 42 - calendarDays.length; // 6 rows * 7 days = 42
        for (let i = 1; i <= remainingCells; i++) {
            calendarDays.push({ day: i, isCurrentMonth: false, date: new Date(Date.UTC(year, month + 1, i)) });
        }

        const weekDayHeaders = [
            t('dashboard.tutor.schedule.days.mon'),
            t('dashboard.tutor.schedule.days.tue'),
            t('dashboard.tutor.schedule.days.wed'),
            t('dashboard.tutor.schedule.days.thu'),
            t('dashboard.tutor.schedule.days.fri'),
            t('dashboard.tutor.schedule.days.sat'),
            t('dashboard.tutor.schedule.days.sun')
        ];

        return (
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                    {weekDayHeaders.map((day) => (
                        <div key={day} className="p-3 text-center text-sm font-semibold text-gray-600">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 auto-rows-[112px]">
                    {calendarDays.map((d, index) => {
                        const dayBookings: Session[] = []; // TODO: Implement booked sessions from API
                        return (
                            <div
                                key={index}
                                onClick={() => {
                                    setCurrentDate(
                                        new Date(
                                            Date.UTC(
                                                d.date.getUTCFullYear(),
                                                d.date.getUTCMonth(),
                                                d.date.getUTCDate(),
                                                12,
                                                0,
                                                0
                                            )
                                        )
                                    );
                                    setView("Daily");
                                }}
                                className={`h-28 p-2 border-r border-b border-gray-200 cursor-pointer transition-colors flex flex-col ${
                                    d.isCurrentMonth ? "hover:bg-gray-50" : "bg-gray-50"
                                }`}
                            >
                                <p
                                    className={`text-sm font-semibold flex-shrink-0 ${
                                        d.isCurrentMonth ? "text-gray-800" : "text-gray-400"
                                    }`}
                                >
                                    {d.day}
                                </p>
                                <div className="mt-1 space-y-1 overflow-y-auto flex-1 min-h-0 custom-scrollbar">
                                    {dayBookings.length > 0 ? (
                                        dayBookings.map((session) => (
                                            <div
                                                key={session.id}
                                                className="text-xs font-semibold py-0.5 px-1 rounded text-left truncate bg-blue-100 text-blue-800"
                                            >
                                                {session.tutor?.fullName || 'Unknown Tutor'}
                                            </div>
                                        ))
                                    ) : null}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const ViewButton: React.FC<{ label: "Daily" | "Weekly" | "Monthly" }> = ({ label }) => {
        const labelKey = label === "Daily" 
            ? 'dashboard.tutor.schedule.views.daily'
            : label === "Weekly"
            ? 'dashboard.tutor.schedule.views.weekly'
            : 'dashboard.tutor.schedule.views.monthly';
        return (
            <button
                onClick={() => setView(label)}
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                    view === label ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:bg-white/50"
                }`}
            >
                {t(labelKey)}
            </button>
        );
    };

    // --- MAIN RENDER ---
    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="bg-white px-6 pt-6 pb-0 rounded-2xl shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            {selectedSession && (
                <TutorSessionDetailModal
                    session={selectedSession}
                    position={modalPosition}
                    onClose={() => setSelectedSession(null)}
                />
            )}

            <div className="flex flex-wrap justify-between items-center gap-4 mb-6 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                        <button 
                            onClick={() => handleNavigation("prev")} 
                            disabled={isEditMode}
                            className={`p-2 hover:bg-gray-100 rounded-l-md ${isEditMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <HiChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => handleNavigation("today")}
                            disabled={isEditMode}
                            className={`px-4 py-1.5 text-sm font-semibold text-gray-700 border-x border-gray-200 hover:bg-gray-100 ${isEditMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {t('dashboard.tutor.schedule.today')}
                        </button>
                        <button 
                            onClick={() => handleNavigation("next")} 
                            disabled={isEditMode}
                            className={`p-2 hover:bg-gray-100 rounded-r-md ${isEditMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <HiChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="relative flex items-center gap-2">
                           <button
                               onClick={isEditMode ? undefined : () => setIsDatePickerOpen(true)}
                               disabled={isEditMode}
                               className={`bg-gray-100 border border-transparent rounded-lg pl-4 pr-4 py-2 text-sm font-medium text-gray-800 min-w-64 text-left flex items-center justify-between ${
                                   isEditMode ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer focus:outline-none'
                               }`}
                           >
                            <span>{getDisplayDate()}</span>
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                            </svg>
                           </button>
                        {isEditMode && (
                            <Tooltip text={t('dashboard.tutor.schedule.editTooltip')} />
                        )}
                        {isDatePickerOpen && (
                            <div
                                ref={datePickerRef}
                                className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl w-80 p-6 z-20"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-bold text-gray-800">
                                        {view === "Daily" ? t('dashboard.tutor.schedule.datePicker.selectDay') : view === "Weekly" ? t('dashboard.tutor.schedule.datePicker.selectWeek') : t('dashboard.tutor.schedule.datePicker.selectMonth')}
                                    </h2>
                                    <button
                                        onClick={() => setIsDatePickerOpen(false)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <HiX className="w-5 h-5" />
                                    </button>
                                </div>
                                {view === "Monthly" ? renderMonthPicker() : renderDayAndWeekPicker()}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-48 h-[38px] flex items-center">
                        <CustomDropdown
                            options={timezoneOptions}
                            selectedValue={selectedTimezone ? `${selectedTimezone.name} (${selectedTimezone.offset})` : ""}
                            placeholder="Select timezone"
                            onSelect={handleTimezoneSelect}
                            dropdownId="timezone-dropdown"
                            openDropdown={openDropdown}
                            setOpenDropdown={setOpenDropdown}
                            hasSearch={true}
                            searchPlaceholder="Search timezone..."
                            maxVisibleItems={4}
                        />
                    </div>
                    <div className="bg-gray-100 p-1 rounded-lg flex items-center">
                        <ViewButton label="Daily" />
                        <ViewButton label="Weekly" />
                        <ViewButton label="Monthly" />
                    </div>
                    {isEditMode ? (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleCancelClick}
                                className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg text-sm hover:bg-gray-300 transition-colors"
                            >
                                {t('dashboard.tutor.schedule.cancel')}
                            </button>
                            <button
                                onClick={handleSaveForFuture}
                                className="px-4 py-2 bg-[#0b6459] text-white font-medium rounded-lg text-sm hover:bg-[#084c43] transition-colors"
                            >
                                {t('dashboard.tutor.schedule.save')}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleEditClick}
                            disabled={view !== "Weekly"}
                            className={`flex items-center gap-2 bg-[#0b6459] text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors ${
                                view !== "Weekly" ? "opacity-50 cursor-not-allowed" : "hover:bg-[#084c43]"
                            }`}
                        >
                            <HiPencil className="w-4 h-4" /> {t('dashboard.tutor.schedule.edit')}
                        </button>
                    )}
                </div>
            </div>

            <div className="relative flex-1 min-h-0 flex flex-col -mx-6 -mb-6">
                {loading ? (
                    view === "Monthly" ? <MonthlyCalendarSkeleton /> : <CalendarSkeleton />
                ) : (
                    <>
                        {view === "Weekly" ? (
                            <div className="grid grid-cols-10 gap-4 h-full min-h-0 px-6 pb-6">
                                <div className="col-span-7 flex flex-col h-full min-h-0">
                                    {renderWeeklyView()}
                                </div>
                                <div className="col-span-3 flex flex-col h-full min-h-0">
                                    {renderAvailabilityDetails()}
                                </div>
                            </div>
                        ) : (
                            <>
                                {view === "Daily" && (
                                    <div className="h-full min-h-0 overflow-auto px-6 pb-6">
                                        {renderDailyView()}
                                    </div>
                                )}
                                {view === "Monthly" && (
                                    <div className="h-full min-h-0 overflow-auto px-6 pb-6">
                                        {renderMonthlyView()}
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
        </div>
    );
};

export default ScheduleManagementContent;
