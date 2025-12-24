import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { addDays, startOfToday, format, startOfMonth, endOfMonth } from "date-fns";
import { enUS, vi } from "date-fns/locale";
import type { Locale } from "date-fns";
import EmptySessionState from "../../components/EmptySessionState";
import CustomCalendar from "./CustomCalendar";
import { HiChatAlt, HiVideoCamera } from "react-icons/hi";
import { MdAccessTime, MdDateRange } from "react-icons/md";
import type { Session } from "../../../../../types/class";
import { classService } from "../../../../../services/classService";

interface LoadingOverlayProps {
    sessionStarting: boolean;
    t: any;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ sessionStarting, t }) => {
    if (!sessionStarting) return null;

    return (
        <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50">
            <div className="flex items-center gap-3">
                <div
                    className="animate-spin rounded-full border-b-2 border-[#0b6459] flex-none"
                    style={{ width: 32, height: 32 }}
                ></div>
                <span className="text-lg font-medium text-white">{t("dashboard.tutor.startingSession")}</span>
            </div>
        </div>
    );
};

const ScheduleAndCalendar: React.FC = () => {
    const { t, i18n } = useTranslation();

    // Get locale for date formatting
    const getLocale = () => {
        return i18n.language === "vi" ? vi : enUS;
    };

    // Component state
    const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
    const [filterMode, setFilterMode] = useState<"today" | "week">("today");
    const [sessionsLoading, setSessionsLoading] = useState(true);
    const [sessionsData, setSessionsData] = useState<Session[]>([]);
    const [isCustomDateFilter, setIsCustomDateFilter] = useState(false);
    const [sessionStarting, setSessionStarting] = useState(false);

    const today = startOfToday();

    useEffect(() => {
        const loadSessions = async () => {
            try {
                setSessionsLoading(true);
                const currentDate = new Date();
                const startOfMonthDate = startOfMonth(currentDate);
                const endOfMonthDate = endOfMonth(currentDate);

                const startTime = startOfMonthDate.toISOString();
                const endTime = endOfMonthDate.toISOString();

                const response = await classService.getSessionsByTime(startTime, endTime);

                if (response.success && response.data) {
                    setSessionsData(response.data);
                    setSessionsLoading(false);
                } else {
                    console.error("Failed to fetch sessions:", response.message);
                    return [];
                }
            } catch (error) {
                console.error("Error loading sessions:", error);
                setSessionsLoading(false);
            }
        };
        loadSessions();
    }, []);

    // Get session dates for calendar
    const sessionDates = sessionsData.map((session) => new Date(session.sessionDatetime));

    // Filter sessions based on selected date and filter mode
    const filteredSessions = sessionsData.filter((session) => {
        const sessionDate = new Date(session.sessionDatetime);
        if (isCustomDateFilter) {
            // When custom date is selected, show sessions for that specific date
            return sessionDate.toDateString() === selectedDate.toDateString();
        } else if (filterMode === "today") {
            return sessionDate.toDateString() === today.toDateString();
        } else if (filterMode === "week") {
            const weekFromNow = addDays(today, 7);
            return sessionDate >= today && sessionDate <= weekFromNow;
        }
        return true;
    });

    const handleFilterChange = (mode: "today" | "week") => {
        setFilterMode(mode);
        setSelectedDate(today);
        setIsCustomDateFilter(false);
    };

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setIsCustomDateFilter(true);
    };

    // Handle start session
    const handleStartSession = async (sessionId: string) => {
        try {
            setSessionStarting(true);
            // TODO: Call API to start session
            // await startSessionAPI(sessionId);

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000));

            console.log("Starting session:", sessionId);
        } catch (error) {
            console.error("Error starting session:", error);
        } finally {
            setSessionStarting(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 mb-8 relative">
            <LoadingOverlay sessionStarting={sessionStarting} t={t} />
            {/* Upcoming Sessions - Takes remaining width */}
            <div className="flex-1">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 h-[405px] overflow-y-auto">
                    {sessionsLoading ? (
                        <LoadingSkeleton />
                    ) : (
                        <>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800">
                                        {t("dashboard.tutor.upcomingSessions")}
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {t(
                                            filteredSessions.length === 1
                                                ? "dashboard.tutor.sessionScheduled"
                                                : "dashboard.tutor.sessionScheduled_plural",
                                            {
                                                count: filteredSessions.length,
                                                period: isCustomDateFilter
                                                    ? selectedDate.toDateString() === today.toDateString()
                                                        ? t("dashboard.tutor.todayPeriod")
                                                        : format(
                                                              selectedDate,
                                                              i18n.language === "vi" ? "dd MMMM" : "MMMM dd",
                                                              { locale: getLocale() }
                                                          )
                                                    : filterMode === "today"
                                                    ? t("dashboard.tutor.todayPeriod")
                                                    : t("dashboard.tutor.weekPeriod"),
                                            }
                                        )}
                                    </p>
                                </div>

                                {/* Filter Buttons */}
                                <div className="bg-gray-100 p-1 rounded-xl inline-flex items-center gap-1">
                                    <button
                                        onClick={() => handleFilterChange("today")}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                            filterMode === "today" && !isCustomDateFilter
                                                ? "bg-white text-gray-800 shadow-sm"
                                                : "text-gray-500 hover:bg-white/50"
                                        } ${isCustomDateFilter ? "opacity-50" : ""}`}
                                    >
                                        {t("dashboard.tutor.today")}
                                    </button>
                                    <button
                                        onClick={() => handleFilterChange("week")}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                            filterMode === "week" && !isCustomDateFilter
                                                ? "bg-white text-gray-800 shadow-sm"
                                                : "text-gray-500 hover:bg-white/50"
                                        } ${isCustomDateFilter ? "opacity-50" : ""}`}
                                    >
                                        {t("dashboard.tutor.week")}
                                    </button>
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
                                        />
                                    ))
                                ) : (
                                    <EmptySessionState />
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Sidebar */}
            <div className="w-80 space-y-6">
                {/* Calendar */}
                <div className="max-w-sm max-h-[28rem] overflow-hidden">
                    <CustomCalendar
                        sessionDates={sessionDates}
                        onDateSelect={handleDateSelect}
                        selectedDate={selectedDate}
                        loading={sessionsLoading}
                    />
                </div>
            </div>
        </div>
    );
};

const LoadingSkeleton: React.FC = () => (
    <div className="animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
                <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="bg-gray-200 p-1 rounded-xl inline-flex items-center gap-1">
                <div className="h-8 bg-gray-300 rounded w-16"></div>
                <div className="h-8 bg-gray-300 rounded w-20"></div>
            </div>
        </div>
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
            ))}
        </div>
    </div>
);

interface SessionCardProps {
    session: Session;
    locale: Locale;
    language: string;
    t: any;
    onStartSession: (sessionId: string) => Promise<void>;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, locale, language, t, onStartSession }) => {
    const sessionDate = new Date(session.sessionDatetime);
    const today = startOfToday();
    const isToday = sessionDate.toDateString() === today.toDateString();

    const getStatusColor = (sessionType: string) => {
        switch (sessionType) {
            case "ONE_ON_ONE":
            case "1-on-1":
                return "bg-blue-100 text-blue-700";
            case "GROUP":
                return "bg-green-100 text-green-700";
            case "TRIAL":
                return "bg-purple-100 text-purple-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusText = (sessionType: string) => {
        switch (sessionType) {
            case "ONE_ON_ONE":
            case "1-on-1":
                return t('dashboard.tutor.sessionTypes.oneOnOne');
            case "GROUP":
                return t('dashboard.tutor.sessionTypes.group');
            case "TRIAL":
                return t('dashboard.tutor.sessionTypes.trial');
            default:
                return sessionType;
        }
    };

    return (
        <div
            className="relative border border-gray-200 rounded-lg p-3.5 hover:shadow-md transition-shadow duration-200"
            style={{ backgroundColor: "#F7F7F8" }}
        >
            <div className="flex items-center justify-between gap-4">
                {/* Left: Session Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-800 text-base">{session.classInfo.title}</h4>
                        <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(
                                session.sessionType
                            )}`}
                        >
                            {getStatusText(session.sessionType)}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <span className="font-medium">{session.students[0]?.fullName || "Unknown Student"}</span>
                        </div>
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
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onStartSession(session.id)}
                        className="bg-[#0b6459] text-white px-3 py-2 rounded-lg font-semibold text-sm hover:bg-[#094d44] transition-colors duration-200 flex items-center gap-2"
                    >
                        <HiVideoCamera className="w-4 h-4" />
                        {t("dashboard.tutor.startSession")}
                    </button>
                    <button
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                        title="Chat"
                    >
                        <HiChatAlt className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleAndCalendar;
