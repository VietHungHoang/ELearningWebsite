import React, { useState, useEffect, useRef } from "react";
import { HiChevronLeft, HiChevronRight, HiCalendar, HiPencil, HiX } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import Toast from "../../../../components/ui/Toast";
import Tooltip from "../../../../components/ui/Tooltip";
import TutorSessionDetailModal from "../components/TutorSessionDetailModal";
import Breadcrumb from "../../components/Breadcrumb";
import { scheduleService } from "../../../../services/scheduleService";
import { classService } from "../../../../services/classService";
import { useAuth } from "../../../../context/AuthContext";
import type { TutorAvailability } from "../../../../types/tutor";
import type { GetBookedSessionsResponse, BookedSession } from "../../../../types/class";

// --- INTERFACES ---
// Using BookedSession directly from API types// --- COMPONENT ---
const ScheduleManagementContent: React.FC = () => {
    const navigate = useNavigate();
    const { state } = useAuth();
    const { user } = state;
    // --- STATE MANAGEMENT ---
    const [view, setView] = useState<"Daily" | "Weekly" | "Monthly">("Weekly");
    const [currentDate, setCurrentDate] = useState(new Date("2025-10-20T12:00:00Z"));
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [availability, setAvailability] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [availabilityData, setAvailabilityData] = useState<{startDate: Date, endDate: Date, slots: string[]} | null>(null);
    const [bookedSessions, setBookedSessions] = useState<GetBookedSessionsResponse['sessions']>([]);
    const [selectedSession, setSelectedSession] = useState<BookedSession | null>(null);
    const [modalPosition, setModalPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

    // Edit Mode State
    const [isEditMode, setIsEditMode] = useState(false);
    const [tempAvailability, setTempAvailability] = useState<string[]>(availability);

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

    // Fetch initial availability on mount
    useEffect(() => {
        const { start, end } = getMonthlyRange(currentDate);
        fetchAvailability(start, end);
        fetchBookedSessions(start, end);
    }, []);

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
    const handleSessionClick = (booking: BookedSession, event: React.MouseEvent) => {
        if (isEditMode) return;
        const rect = event.currentTarget.getBoundingClientRect();
        setModalPosition({ top: rect.top + window.scrollY, left: rect.right + window.scrollX + 10 });
        setSelectedSession(booking);
    };

    const handleCellClick = (date: Date, hour: number) => {
        if (!isEditMode) return;

        const slotDate = new Date(date);
        slotDate.setUTCHours(hour, 0, 0, 0);
        const slotISO = slotDate.toISOString();
        const isCurrentlyAvailable = tempAvailability.includes(slotISO);

        if (isCurrentlyAvailable) {
            setTempAvailability((prev) => prev.filter((s) => s !== slotISO));
        } else {
            setTempAvailability((prev) => [...prev, slotISO]);
        }
    };

    // Edit Mode Handlers
    const handleEditClick = () => {
        // Always go to current week when editing (current week is the active schedule)
        const today = new Date();
        const currentWeekStart = getWeekRangeForDate(today).start;
        setCurrentDate(currentWeekStart);
        
        setTempAvailability([...availability]);
        setIsEditMode(true);
    };

    const handleCancelClick = () => {
        setIsEditMode(false);
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
        
        // Group slots by day of week and time ranges
        const groupedSlots: { [key: string]: string[] } = {};
        
        tempAvailability.forEach(slot => {
            const date = new Date(slot);
            const dayOfWeek = date.getUTCDay();
            const timeKey = date.toISOString().split('T')[1].substring(0, 5); // HH:MM
            
            const key = `${dayOfWeek}`;
            if (!groupedSlots[key]) groupedSlots[key] = [];
            groupedSlots[key].push(timeKey);
        });
        
        // Create availability objects
        Object.entries(groupedSlots).forEach(([dayStr, times]) => {
            const dayOfWeek = parseInt(dayStr);
            const sortedTimes = times.sort();
            
            if (sortedTimes.length > 0) {
                const startTime = sortedTimes[0];
                const endTime = `${parseInt(sortedTimes[sortedTimes.length - 1].split(':')[0]) + 1}:00`;
                
                availabilities.push({
                    dayOfWeek,
                    startTime: `${startTime}:00`,
                    endTime: `${endTime}:00`,
                    effectiveStartDate: new Date().toISOString().split('T')[0]
                });
            }
        });
        
        return availabilities;
    };

    const generateSlotsFromAvailabilities = (availabilities: TutorAvailability[], startDate: Date, endDate: Date): string[] => {
        const slots: string[] = [];
        
        availabilities.forEach((avail) => {
            const start = new Date(`1970-01-01T${avail.startTime}`);
            const end = new Date(`1970-01-01T${avail.endTime}`);
            
            // Generate hourly slots between start and end
            for (let time = start; time < end; time.setHours(time.getHours() + 1)) {
                // Check if this slot falls within our date range
                const slotDate = new Date(startDate);
                while (slotDate <= endDate) {
                    if (slotDate.getUTCDay() === avail.dayOfWeek) {
                        const slotISO = new Date(
                            slotDate.getUTCFullYear(),
                            slotDate.getUTCMonth(),
                            slotDate.getUTCDate(),
                            time.getUTCHours(),
                            0, 0, 0
                        ).toISOString();
                        slots.push(slotISO);
                    }
                    slotDate.setDate(slotDate.getDate() + 7); // Next week same day
                }
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
                // Generate time slots from TutorAvailability data
                const slots = generateSlotsFromAvailabilities(response.data.availabilities, startDate, endDate);
                
                setAvailability(slots);
                setAvailabilityData({ startDate, endDate, slots });
            }
        } catch (error) {
            console.error('Failed to fetch availability:', error);
            setToast({ message: 'Failed to load availability', type: 'error' });
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
                setBookedSessions(response.data.sessions);
            }
        } catch (error) {
            console.error('Failed to fetch booked sessions:', error);
            setToast({ message: 'Failed to load booked sessions', type: 'error' });
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
            // Convert tempAvailability slots back to TutorAvailability format
            const tutorAvailabilities = convertTempAvailabilityToTutorAvailabilities(tempAvailability);
            
            // Call API to update availability
            const response = await scheduleService.updateAvailability(user.id, { availabilities: tutorAvailabilities });
            
            if (response.success) {
                setAvailability(tempAvailability);
                setIsEditMode(false);
                setToast({ message: 'Availability updated for all future schedules', type: 'success' });
            } else {
                setToast({ message: 'Failed to save availability', type: 'error' });
            }
        } catch (error) {
            console.error('Failed to save availability:', error);
            setToast({ message: 'Failed to save availability', type: 'error' });
        }
    };

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
        const options: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
        if (view === "Daily") {
            options.year = "numeric";
            options.month = "long";
            options.day = "numeric";
            return currentDate.toLocaleDateString("en-US", options);
        }
        if (view === "Monthly") {
            options.month = "long";
            options.year = "numeric";
            return currentDate.toLocaleDateString("en-US", options);
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

        return `${start.toLocaleDateString("en-US", startOptions)} - ${end.toLocaleDateString("en-US", endOptions)}`;
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
        if (!isEditMode || e.button !== 0) return;
        e.preventDefault();

        const gridRect = gridRef.current?.getBoundingClientRect();
        if (!gridRect) return;

        const startX = e.clientX - gridRect.left;
        const startY = e.clientY - gridRect.top;
        setDragStartCoords({ x: startX, y: startY });

        const slotDate = new Date(date);
        slotDate.setUTCHours(hour, 0, 0, 0);
        const slotISO = slotDate.toISOString();
        const mode = tempAvailability.includes(slotISO) ? "removing" : "adding";
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
        if (!isDragging || !selectionRect || !selectionMode || !gridRef.current) return;

        const newAvailability = new Set(initialAvailabilityOnDrag);
        const gridRect = gridRef.current.getBoundingClientRect();
        const cellElements = gridRef.current.querySelectorAll(".calendar-cell");

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
                const iso = (cell as HTMLElement).dataset.iso;
                if (iso) {
                    if (selectionMode === "adding") newAvailability.add(iso);
                    else if (selectionMode === "removing") newAvailability.delete(iso);
                }
            }
        });
        setTempAvailability(Array.from(newAvailability));
    }, [selectionRect, selectionMode, initialAvailabilityOnDrag, isDragging]);

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
        const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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
                        {displayDate.toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" })}
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
        const year = displayDate.getUTCFullYear();
        const months = Array.from({ length: 12 }, (_, i) =>
            new Date(Date.UTC(year, i, 1)).toLocaleString("en-US", { month: "short", timeZone: "UTC" })
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
    const timeSlots = Array.from({ length: 16 }, (_, i) => `${String(i + 7).padStart(2, "0")}:00`);

    const renderHourlyGrid = (days: Date[]) => (
        <div className="overflow-x-auto relative" ref={gridRef}>
            <div className={`grid min-w-[400px]`} style={{ gridTemplateColumns: `auto repeat(${days.length}, 1fr)` }}>
                {/* Time Column Header */}
                <div className="sticky left-0 bg-white z-10"></div>
                {/* Day Headers */}
                {days.map((day) => (
                    <div key={day.toISOString()} className="text-center p-3 border-b border-gray-200">
                        <p className="text-xs text-gray-500">
                            {day.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" })}
                        </p>
                        <p className="text-lg font-bold text-gray-800">{day.getUTCDate()}</p>
                    </div>
                ))}

                {/* Time Slots and Availability Grid */}
                {timeSlots.map((time) => (
                    <React.Fragment key={time}>
                        <div className="text-right pr-4 py-2 border-r border-gray-200 text-xs text-gray-500 sticky left-0 bg-white z-10 h-12 flex items-center justify-end">
                            {time}
                        </div>
                        {days.map((day) => {
                            const hour = parseInt(time.split(":")[0]);
                            const slotDate = new Date(day);
                            slotDate.setUTCHours(hour, 0, 0, 0);
                            const slotISO = slotDate.toISOString();

                            const isAvailable = isEditMode
                                ? tempAvailability.includes(slotISO)
                                : availability.includes(slotISO);
                            const bookedSession = bookedSessions.find(session => {
                                const sessionDate = new Date(session.sessionDatetime);
                                // Check if slot matches the session datetime (assuming 1-hour sessions)
                                return sessionDate.getTime() === slotDate.getTime();
                            });

                            if (bookedSession) {
                                return (
                                    <div key={day.toISOString()} className="border-b border-r border-gray-200 p-1">
                                        <div
                                            onClick={(e) => handleSessionClick(bookedSession, e)}
                                            className={`h-full rounded text-xs p-1 bg-blue-100 text-blue-800 border-blue-200 ${
                                                !isEditMode ? "cursor-pointer" : "cursor-default opacity-70"
                                            }`}
                                        >
                                            <p className="font-bold">{bookedSession.className}</p>
                                            <p>
                                                {bookedSession.students.length === 1 
                                                    ? bookedSession.students[0].fullName 
                                                    : `${bookedSession.students[0].fullName} (+${bookedSession.students.length - 1} more)`
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
                                    className={`calendar-cell border-b border-r border-gray-200 h-12 text-center select-none ${
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
    );

    const renderDailyView = () => renderHourlyGrid([currentDate]);
    const renderWeeklyView = () => renderHourlyGrid(getWeekDays(currentDate));

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
        const remainingCells = 35 - calendarDays.length;
        for (let i = 1; i <= remainingCells; i++) {
            calendarDays.push({ day: i, isCurrentMonth: false, date: new Date(Date.UTC(year, month + 1, i)) });
        }

        const weekDayHeaders = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

        return (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                    {weekDayHeaders.map((day) => (
                        <div key={day} className="p-3 text-center text-sm font-semibold text-gray-600">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 grid-rows-5">
                    {calendarDays.map((d, index) => {
                        const dayBookings: BookedSession[] = []; // TODO: Implement booked sessions from API
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
                                className={`h-28 p-2 border-r border-b border-gray-200 cursor-pointer transition-colors ${
                                    d.isCurrentMonth ? "hover:bg-gray-50" : "bg-gray-50"
                                }`}
                            >
                                <p
                                    className={`text-sm font-semibold ${
                                        d.isCurrentMonth ? "text-gray-800" : "text-gray-400"
                                    }`}
                                >
                                    {d.day}
                                </p>
                                <div className="mt-1 space-y-1 overflow-hidden">
                                    {dayBookings.map((session) => (
                                        <div
                                            key={session.id}
                                            className="text-xs font-semibold py-0.5 px-1 rounded text-left truncate bg-blue-100 text-blue-800"
                                        >
                                            {session.className}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const ViewButton: React.FC<{ label: "Daily" | "Weekly" | "Monthly" }> = ({ label }) => (
        <button
            onClick={() => setView(label)}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                view === label ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:bg-white/50"
            }`}
        >
            {label}
        </button>
    );

    // --- MAIN RENDER ---
    return (
        <div>
            {/* Breadcrumb */}
            <Breadcrumb
                items={[
                    { label: 'Dashboard', onClick: () => navigate('/dashboard') },
                    { label: 'Schedule Management', isActive: true }
                ]}
                className="mb-6"
            />
            <div className="bg-white p-6 rounded-2xl shadow-sm">
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            {selectedSession && (
                <TutorSessionDetailModal
                    session={selectedSession}
                    position={modalPosition}
                    onClose={() => setSelectedSession(null)}
                />
            )}

            <div className="flex flex-wrap justify-between items-center gap-4">
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
                            Today
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
                            <HiCalendar className="w-5 h-5" />
                        </button>
                        {isEditMode && (
                            <Tooltip text="Lịch này sẽ áp dụng cho những ngày còn lại của từ tuần này và các tuần sau" />
                        )}
                        {isDatePickerOpen && (
                            <div
                                ref={datePickerRef}
                                className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl w-80 p-6 z-20"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-bold text-gray-800">
                                        Select a {view === "Daily" ? "Day" : view === "Weekly" ? "Week" : "Month"}
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
                    <div className="bg-gray-100 p-1 rounded-lg flex items-center">
                        <ViewButton label="Daily" />
                        <ViewButton label="Weekly" />
                        <ViewButton label="Monthly" />
                    </div>
                    {isEditMode ? (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleCancelClick}
                                className="bg-gray-200 text-gray-800 font-semibold py-2.5 px-5 rounded-lg text-sm hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveForFuture}
                                className="bg-[#0b6459] text-white font-semibold py-2.5 px-5 rounded-lg text-sm hover:bg-[#084c43]"
                            >
                                Save
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleEditClick}
                            disabled={view !== "Weekly"}
                            className={`flex items-center gap-2 bg-[#0b6459] text-white font-semibold py-2 px-5 rounded-lg ${
                                view !== "Weekly" ? "opacity-50 cursor-not-allowed" : "hover:bg-[#084c43]"
                            }`}
                        >
                            <HiPencil className="w-4 h-4" /> Edit
                        </button>
                    )}
                </div>
            </div>

            <div className="mt-6 relative">
                {loading && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0b6459]"></div>
                    </div>
                )}
                {view === "Daily" && renderDailyView()}
                {view === "Weekly" && renderWeeklyView()}
                {view === "Monthly" && renderMonthlyView()}
            </div>
        </div>
        </div>
    );
};

export default ScheduleManagementContent;
