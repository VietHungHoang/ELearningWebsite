import React, { useState } from "react";
import { FiCalendar, FiEdit } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { format, startOfToday } from "date-fns";
import { enUS, vi } from "date-fns/locale";
import type { Locale } from "date-fns";
import { HiVideoCamera, HiChevronLeft, HiChevronRight, HiChevronDown } from "react-icons/hi";
import { MdAccessTime, MdDateRange } from "react-icons/md";
import type { Session } from "../../../../../../types/class";
import LoadingOverlay from "../../LoadingOverlay";
import { useAuth } from "../../../../../../context/AuthContext";
import { classService } from "../../../../../../services/classService";

interface ScheduleTabProps {
    upcomingSessions: Session[];
    pastSessions: any[];
    onOpenReschedule: (sessionDate: string) => void;
    onViewPastSession: (session: any) => void;
}

interface SessionCardProps {
    session: Session;
    locale: Locale;
    language: string;
    t: any;
    onStartSession: (session: Session) => void;
    onReschedule: (sessionDate: string) => void;
    onAddNote: (sessionId: string) => void;
}

// Helper function to compare dates (only date part, ignoring time)
// Uses local date for comparison to match calendar display
const isSameDate = (date1: Date, date2: Date): boolean => {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
};

// Helper function to get date at midnight in local timezone
const getDateAtMidnight = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const SessionCard: React.FC<SessionCardProps> = ({
    session,
    locale,
    language,
    t,
    onStartSession,
    onReschedule,
    onAddNote,
}) => {
    const sessionDate = new Date(session.sessionDatetime);
    const today = getDateAtMidnight(new Date());
    const sessionDateLocal = getDateAtMidnight(sessionDate);
    const isToday = isSameDate(sessionDateLocal, today);

    return (
        <div
            className="relative border border-gray-200 rounded-lg p-3.5 hover:shadow-md transition-shadow duration-200"
            style={{ backgroundColor: "#F7F7F8" }}
        >
            <div className="flex items-center justify-between gap-4">
                {/* Left: Session Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <MdAccessTime className="w-4 h-4 text-gray-500" />
                            <span>{format(sessionDate, "HH:mm")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MdDateRange className="w-4 h-4 text-gray-500" />
                            <span>
                                {isToday
                                    ? t("dashboard.tutor.todayPeriod")
                                    : format(sessionDate, language === "vi" ? "dd MMMM" : "MMMM dd", { locale })}
                            </span>
                        </div>
                    </div>
                    {session.notes && (
                        <div className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">{t("dashboard.tutor.scheduleTab.note")}:</span>{" "}
                            {session.notes}
                        </div>
                    )}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onStartSession(session)}
                        className="bg-[#0b6459] text-white px-3 py-2 rounded-lg font-semibold text-sm hover:bg-[#094d44] transition-colors duration-200 flex items-center gap-2"
                    >
                        <HiVideoCamera className="w-4 h-4" />
                        {t("dashboard.tutor.startSession")}
                    </button>
                    <button
                        onClick={() => onReschedule(session.sessionDatetime)}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                        title={t("dashboard.tutor.scheduleTab.reschedule")}
                    >
                        <FiCalendar className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                        onClick={() => onAddNote(session.id)}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                        title={t("dashboard.tutor.scheduleTab.addNoteTitle")}
                    >
                        <FiEdit className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Internal skeleton components (kept local to this file)
const UpcomingSkeleton: React.FC = () => (
    <>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
        </div>
        <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3.5">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-4 text-sm mb-2">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                            </div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mb-2"></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
                            <div className="h-8 bg-gray-200 rounded animate-pulse w-8"></div>
                            <div className="h-8 bg-gray-200 rounded animate-pulse w-8"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </>
);

const PastSessionsSkeleton: React.FC = () => (
    <>
        <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
        </div>
        <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-gray-300 h-2 rounded-full animate-pulse w-3/4"></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
                        </div>
                        <div className="h-8 bg-gray-200 rounded animate-pulse w-24"></div>
                    </div>
                </div>
            ))}
        </div>
    </>
);
interface CustomCalendarProps {
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
    sessionDates: Date[];
    loading?: boolean;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
    selectedDate,
    onDateSelect,
    sessionDates,
    loading = false,
}) => {
    const { t, i18n } = useTranslation();
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const today = new Date();

    // Get locale for date formatting
    const getLocale = () => {
        return i18n.language === "vi" ? vi : enUS;
    };

    // Get days in month
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    const days = getDaysInMonth(currentMonth);

    // Helper function to compare dates (only date part, ignoring time)
    // Uses local date for comparison to match calendar display
    const isSameDate = (date1: Date, date2: Date): boolean => {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    };

    // Helper function to get date at midnight in local timezone
    const getDateAtMidnight = (date: Date): Date => {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    // Check if date has sessions (local date comparison)
    const hasSessions = (date: Date) => {
        const dateLocal = getDateAtMidnight(date);
        return sessionDates.some((sessionDate) => {
            const sessionDateLocal = getDateAtMidnight(sessionDate);
            return isSameDate(sessionDateLocal, dateLocal);
        });
    };

    // Count sessions on date (local date comparison)
    const getSessionCount = (date: Date) => {
        const dateLocal = getDateAtMidnight(date);
        return sessionDates.filter((sessionDate) => {
            const sessionDateLocal = getDateAtMidnight(sessionDate);
            return isSameDate(sessionDateLocal, dateLocal);
        }).length;
    };

    // Check if date is selected (local date comparison)
    const isSelected = (date: Date) => {
        const dateLocal = getDateAtMidnight(date);
        const selectedDateLocal = getDateAtMidnight(selectedDate);
        return isSameDate(dateLocal, selectedDateLocal);
    };

    // Check if date is today (local date comparison)
    const isToday = (date: Date) => {
        const dateLocal = getDateAtMidnight(date);
        const todayLocal = getDateAtMidnight(today);
        return isSameDate(dateLocal, todayLocal);
    };

    // Check if date is in the past (local date comparison)
    const isPastDate = (date: Date) => {
        const dateLocal = getDateAtMidnight(date);
        const todayLocal = getDateAtMidnight(today);
        return dateLocal < todayLocal;
    };

    // Check if current month is the current month
    const isCurrentMonth = () => {
        return currentMonth.getMonth() === today.getMonth() && currentMonth.getFullYear() === today.getFullYear();
    };

    // Navigate to previous month
    const goToPreviousMonth = () => {
        if (!isCurrentMonth()) {
            setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
        }
    };

    // Navigate to next month
    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    // Handle date click
    const handleDateClick = (date: Date) => {
        if (!isPastDate(date)) {
            onDateSelect(date);
        }
    };

    // Get localized month and year
    const getLocalizedMonthYear = () => {
        return format(currentMonth, "MMMM yyyy", { locale: getLocale() });
    };

    // Get localized day names
    const getLocalizedDayNames = () => {
        return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => {
            // For Vietnamese, we need to map to localized names
            if (i18n.language === "vi") {
                const viDayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
                const enIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(day);
                return viDayNames[enIndex];
            }
            return day;
        });
    };

    return (
        <div className="h-full">
            {loading ? (
                // Skeleton loading state
                <>
                    <div className="mb-2">
                        <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    </div>

                    {/* Header skeleton */}
                    <div className="flex items-center justify-between mb-1">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                        <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
                        <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>

                    {/* Day names skeleton */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {Array.from({ length: 7 }).map((_, index) => (
                            <div key={index} className="text-center py-2">
                                <div className="h-4 bg-gray-200 rounded animate-pulse mx-auto w-8"></div>
                            </div>
                        ))}
                    </div>

                    {/* Calendar grid skeleton */}
                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: 35 }).map((_, index) => (
                            <div key={index} className="w-9 h-9">
                                <div className="w-full h-full bg-gray-200 rounded-lg animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    <div className="mb-2">
                        <h3 className="text-lg font-bold text-gray-800">{t("dashboard.tutor.common.sessionCalendar")}</h3>
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between mb-1">
                        <button
                            onClick={goToPreviousMonth}
                            disabled={isCurrentMonth()}
                            className={`p-2 rounded-lg transition-colors ${
                                isCurrentMonth()
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "hover:bg-gray-100 text-gray-600"
                            }`}
                        >
                            <HiChevronLeft className="w-5 h-5" />
                        </button>
                        <h3 className="text-lg font-bold text-gray-800">{getLocalizedMonthYear()}</h3>
                        <button onClick={goToNextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <HiChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Day names */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {getLocalizedDayNames().map((day) => (
                            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {days.map((date, index) => (
                            <div key={index} className="w-9 h-9">
                                {date ? (
                                    <button
                                        onClick={() => handleDateClick(date)}
                                        disabled={isPastDate(date)}
                                        className={`
                                            w-full h-full rounded-lg text-sm font-medium transition-all duration-200
                                            flex items-center justify-center relative
                                            ${
                                                isPastDate(date)
                                                    ? "text-gray-300 cursor-not-allowed bg-gray-50"
                                                    : isSelected(date)
                                                    ? "bg-[#065A46] text-white shadow-md"
                                                    : isToday(date)
                                                    ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                                                    : hasSessions(date)
                                                    ? "bg-green-50 text-green-700 hover:bg-green-100"
                                                    : "text-gray-700 hover:bg-gray-100"
                                            }
                                        `}
                                    >
                                        {date.getDate()}
                                        {hasSessions(date) && (
                                            <div className="absolute -top-1 -right-1 bg-[#065A46] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                                                {getSessionCount(date)}
                                            </div>
                                        )}
                                    </button>
                                ) : (
                                    <div className="w-full h-full"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

const ScheduleTab: React.FC<ScheduleTabProps> = ({
    upcomingSessions,
    pastSessions,
    onOpenReschedule,
}) => {
    const { t, i18n } = useTranslation();
    const { state } = useAuth();
    const isStudent = state.user?.role === 'student';
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showAddNoteModal, setShowAddNoteModal] = useState(false);
    const [noteContent, setNoteContent] = useState("");
    const [selectedSessionId, setSelectedSessionId] = useState<string>("");
    const [expandedSessions, setExpandedSessions] = useState<Set<number>>(new Set());

    // Toggle expand/collapse for past sessions
    const toggleExpand = (sessionId: number) => {
        setExpandedSessions((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(sessionId)) {
                newSet.delete(sessionId);
            } else {
                newSet.add(sessionId);
            }
            return newSet;
        });
    };

    // Get locale for date formatting
    const getLocale = () => {
        return i18n.language === "vi" ? vi : enUS;
    };

    const convertToWebLink = (link: string): string => {
        // Convert zoommtg:// protocol to https:// for web
        if (link.startsWith('zoommtg://')) {
            link = link.replace('zoommtg://', 'https://');
        }
        
        // Convert Zoom meeting link to web client format
        // Change /j/ to /wc/join/ to force web browser instead of app
        // Example: https://us05web.zoom.us/j/83597249421?pwd=... 
        //          -> https://us05web.zoom.us/wc/join/83597249421?pwd=...
        if (link.includes('zoom.us/j/')) {
            // Replace /j/ with /wc/join/ to force web client
            link = link.replace(/zoom\.us\/j\//, 'zoom.us/wc/join/');
        }
        
        return link;
    };

    const handleStartSession = async (session: Session) => {
        try {
            let zoomUrl = session.meetingLink;

            // Check cache first - if already started/joined, open directly
            const { default: sessionCacheService } = await import('../../../../../../services/sessionCacheService');
            const cachedUrl = sessionCacheService.getCachedZoomUrl(session.id);
            
            if (cachedUrl) {
                console.log("Using cached Zoom URL for session:", session.id);
                zoomUrl = cachedUrl;
            } else {
                // Call appropriate API based on user role
                if (isStudent) {
                    // Student: call joinSession API
                    const studentId = state.user?.id;
                    if (!studentId) {
                        console.error("Student ID not found");
                        return;
                    }

                    const response = await classService.joinSession(session.id, { studentId });
                    console.log("Student joined session via API:", session.id, response);

                    if (response.success && response.data) {
                        // Cache the session state
                        sessionCacheService.saveSessionState(
                            session.id,
                            response.data.status,
                            response.data.zoomJoinUrl,
                            response.data.meetingLink,
                            response.data.attendanceStatus,
                            response.data.zoomPassword
                        );

                        // Use the Zoom URL from API response
                        zoomUrl = response.data.zoomJoinUrl || response.data.meetingLink;
                    }
                } else {
                    // Tutor: call startSessionByTutor API
                    const response = await classService.startSessionByTutor(session.id);
                    console.log("Tutor started session via API:", session.id, response);

                    if (response.success && response.data) {
                        // Cache the session state
                        sessionCacheService.saveSessionState(
                            session.id,
                            response.data.status,
                            response.data.zoomJoinUrl,
                            response.data.meetingLink,
                            response.data.attendanceStatus,
                            response.data.zoomPassword
                        );

                        // Use the Zoom URL from API response
                        zoomUrl = response.data.zoomJoinUrl || response.data.meetingLink;
                    }
                }
            }

            if (!zoomUrl) {
                console.warn("No meeting URL available for session:", session.id);
                return;
            }
            
            // Convert to web link and open in new tab
            const webLink = convertToWebLink(zoomUrl);
            window.open(webLink, '_blank', 'noopener,noreferrer');
        } catch (error) {
            console.error("Error starting session:", error);
        }
    };

    const handleAddNote = (sessionId: string) => {
        setSelectedSessionId(sessionId);
        setShowAddNoteModal(true);
    };

    const handleSaveNote = () => {
        console.log("Saving note for session:", selectedSessionId, "Content:", noteContent);
        // TODO: Save note to API
        setShowAddNoteModal(false);
        setNoteContent("");
        setSelectedSessionId("");
    };

    const handleCancelNote = () => {
        setShowAddNoteModal(false);
        setNoteContent("");
        setSelectedSessionId("");
    };

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
    };

    // Get all session dates for calendar
    const sessionDates = upcomingSessions.map((session) => new Date(session.sessionDatetime));

    // Filter sessions based on selected date (local date comparison)
    const filteredSessions = React.useMemo(() => {
        if (!selectedDate) {
            return upcomingSessions;
        }
        
        const selectedDateLocal = getDateAtMidnight(selectedDate);
        
        return upcomingSessions.filter((session) => {
            const sessionDate = new Date(session.sessionDatetime);
            const sessionDateLocal = getDateAtMidnight(sessionDate);
            return isSameDate(sessionDateLocal, selectedDateLocal);
        });
    }, [upcomingSessions, selectedDate]);

    return (
        <>
            <div className="space-y-6">
                {/* Upcoming Sessions and Calendar */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Upcoming Sessions */}
                    <div className="flex-1 h-[370px] overflow-y-auto border border-gray-200 p-4 rounded-xl shadow-sm">
                        {false /* loading state disabled */ ? (
                            <UpcomingSkeleton />
                        ) : (
                            <>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-800">
                                            {t("dashboard.tutor.scheduleTab.upcomingSessions")}
                                        </h2>
                                    </div>
                                </div>

                                {/* Sessions Timeline */}
                                <div className="space-y-4">
                                    {filteredSessions.length > 0 ? (
                                        filteredSessions.map((session) => (
                                            <SessionCard
                                                key={session.id}
                                                session={session}
                                                locale={getLocale()}
                                                language={i18n.language}
                                                t={t}
                                                onStartSession={handleStartSession}
                                                onReschedule={onOpenReschedule}
                                                onAddNote={handleAddNote}
                                            />
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <FiCalendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-500">
                                                {t("dashboard.tutor.scheduleTab.noUpcomingSessions")}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Calendar View */}
                    <div className="w-80 h-[370px] overflow-y-auto border border-gray-200 p-4 rounded-xl shadow-sm flex-shrink-0">
                        <CustomCalendar
                            selectedDate={selectedDate}
                            onDateSelect={handleDateSelect}
                            sessionDates={sessionDates}
                        />
                    </div>
                </div>

                {/* Past Sessions - Only show for tutors */}
                {!isStudent && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                        {false /* loading state disabled */ ? (
                            <PastSessionsSkeleton />
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-gray-800">
                                        {t("dashboard.tutor.scheduleTab.pastSessions")}
                                    </h3>
                                    <span className="text-sm text-gray-500 font-medium">
                                        {pastSessions.length}{" "}
                                        {pastSessions.length === 1
                                            ? t("dashboard.tutor.scheduleTab.session")
                                            : t("dashboard.tutor.scheduleTab.sessions")}
                                    </span>
                                </div>

                                {pastSessions.length > 0 ? (
                                    <div className="space-y-4">
                                        {pastSessions.map((session) => {
                                    const isExpanded = expandedSessions.has(session.id);
                                    const totalStudents =
                                        session.participantsCount + (session.absentStudents?.length || 0);

                                    return (
                                        <div
                                            key={session.id}
                                            className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:bg-gray-100 transition-colors"
                                        >
                                            {/* Progress Bar Row */}
                                            <div className="mb-3">
                                                <div className="flex items-center justify-between text-sm mb-1">
                                                    <span className="text-gray-600 font-medium">
                                                        {t("dashboard.tutor.scheduleTab.attendance")}
                                                    </span>
                                                    <span className="font-semibold text-gray-800">
                                                        {session.participantsCount}/{totalStudents}{" "}
                                                        {t("dashboard.tutor.scheduleTab.students")} (
                                                        {totalStudents > 0
                                                            ? Math.round(
                                                                  (session.participantsCount / totalStudents) * 100
                                                              )
                                                            : 0}
                                                        %)
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-[#0b6459] h-2 rounded-full transition-all duration-300"
                                                        style={{
                                                            width: `${
                                                                totalStudents > 0
                                                                    ? (session.participantsCount / totalStudents) * 100
                                                                    : 0
                                                            }%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>

                                            {/* View Details and Basic Info Row */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <FiCalendar className="w-4 h-4" />
                                                    <span className="font-medium text-gray-700">{session.date}</span>
                                                    <MdAccessTime className="w-4 h-4" />
                                                    <span>
                                                        {session.actualStartTime} - {session.actualEndTime}
                                                    </span>
                                                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs ml-2">
                                                        {session.duration}
                                                    </span>
                                                </div>

                                                <button
                                                    onClick={() => toggleExpand(session.id)}
                                                    className="text-sm text-[#0b6459] font-medium hover:underline flex items-center gap-1 flex-shrink-0"
                                                >
                                                    {isExpanded
                                                        ? t("dashboard.tutor.scheduleTab.hideDetails")
                                                        : t("dashboard.tutor.scheduleTab.viewDetails")}
                                                    <HiChevronDown
                                                        className={`w-4 h-4 transition-transform ${
                                                            isExpanded ? "rotate-180" : ""
                                                        }`}
                                                    />
                                                </button>
                                            </div>

                                            {/* Expanded: Attendance History & Notes */}
                                            {isExpanded && (
                                                <div className="mt-4 pt-4 border-t border-gray-100">
                                                    {/* Notes if any */}
                                                    {session.notes && (
                                                        <div className="mb-4 bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                                                            <span className="font-semibold">
                                                                {t("dashboard.tutor.scheduleTab.note")}:
                                                            </span>{" "}
                                                            {session.notes}
                                                        </div>
                                                    )}

                                                    {/* Attendance List */}
                                                    <div>
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h5 className="text-sm font-semibold text-gray-700">
                                                                {t("dashboard.tutor.scheduleTab.attendanceHistory")}
                                                            </h5>
                                                            <span className="text-xs text-gray-500">
                                                                {session.participantsCount}/{totalStudents}{" "}
                                                                {t("dashboard.tutor.scheduleTab.present")}
                                                            </span>
                                                        </div>
                                                        <div className="space-y-2">
                                                            {/* Present */}
                                                            {session.attendanceHistory.map(
                                                                (record: any, idx: number) => (
                                                                    <div
                                                                        key={idx}
                                                                        className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0"
                                                                    >
                                                                        <span className="text-gray-800">
                                                                            {record.studentName}
                                                                        </span>
                                                                        <div className="flex items-center gap-3 text-gray-500 text-xs">
                                                                            <span>
                                                                                {record.joinTime} - {record.leaveTime}
                                                                            </span>
                                                                            <span className="text-xs font-medium px-2.25 py-0.5 rounded-full bg-white border border-gray-300 flex items-center gap-1.5">
                                                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                                                {t(
                                                                                    "dashboard.tutor.scheduleTab.present"
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )}
                                                            {/* Absent */}
                                                            {session.absentStudents?.map(
                                                                (student: any, idx: number) => (
                                                                    <div
                                                                        key={`absent-${idx}`}
                                                                        className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0"
                                                                    >
                                                                        <span className="text-gray-800">
                                                                            {student.studentName}
                                                                        </span>
                                                                        <div className="flex items-center gap-3 text-gray-500 text-xs">
                                                                            <span>
                                                                                {student.reason ||
                                                                                    t(
                                                                                        "dashboard.tutor.scheduleTab.noReason"
                                                                                    )}
                                                                            </span>
                                                                            <span className="text-xs font-medium px-2.25 py-0.5 rounded-full bg-white border border-gray-300 flex items-center gap-1.5">
                                                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                                                                {t(
                                                                                    "dashboard.tutor.scheduleTab.absent"
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 text-sm">
                                            {t("dashboard.tutor.scheduleTab.noPastSessions")}
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
            <LoadingOverlay sessionStarting={false} t={t} />

            {/* Add Note Modal */}
            {showAddNoteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">
                            {t("dashboard.tutor.scheduleTab.addNote")}
                        </h3>
                        <textarea
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            placeholder={t("dashboard.tutor.scheduleTab.enterNotePlaceholder")}
                            className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#0b6459] focus:border-transparent"
                        />
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={handleCancelNote}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                {t("dashboard.tutor.scheduleTab.cancel")}
                            </button>
                            <button
                                onClick={handleSaveNote}
                                className="px-4 py-2 bg-[#0b6459] text-white rounded-lg hover:bg-[#094d44] transition-colors"
                            >
                                {t("dashboard.tutor.scheduleTab.saveNote")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ScheduleTab;
