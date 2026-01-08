import React, { useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { enUS, vi } from 'date-fns/locale';

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
    loading = false
}) => {
    const { t, i18n } = useTranslation();
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const today = new Date();

    // Get locale for date formatting
    const getLocale = () => {
        return i18n.language === 'vi' ? vi : enUS;
    };

    // Calculate sessions in current month
    const sessionsThisMonth = sessionDates.filter(date =>
        date.getMonth() === currentMonth.getMonth() && date.getFullYear() === currentMonth.getFullYear()
    ).length;

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
        return currentMonth.getMonth() === today.getMonth() &&
               currentMonth.getFullYear() === today.getFullYear();
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
        return format(currentMonth, 'MMMM yyyy', { locale: getLocale() });
    };

    // Get localized day names
    const getLocalizedDayNames = () => {
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => {
            // For Vietnamese, we need to map to localized names
            if (i18n.language === 'vi') {
                const viDayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
                const enIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(day);
                return viDayNames[enIndex];
            }
            return day;
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 h-full">
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
                            <div key={index} className="aspect-square">
                                <div className="w-full h-full bg-gray-200 rounded-lg animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    <div className="mb-2">
                        <h3 className="text-lg font-bold text-gray-800">{t('dashboard.tutor.common.sessionCalendar')}</h3>
                        <div className="text-sm text-gray-500 mt-1">
                            {t('dashboard.tutor.sessionsThisMonth', { count: sessionsThisMonth })}
                        </div>
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between mb-1">
                        <button
                            onClick={goToPreviousMonth}
                            disabled={isCurrentMonth()}
                            className={`p-2 rounded-lg transition-colors ${
                                isCurrentMonth()
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'hover:bg-gray-100 text-gray-600'
                            }`}
                        >
                            <HiChevronLeft className="w-5 h-5" />
                        </button>
                        <h3 className="text-lg font-bold text-gray-800">
                            {getLocalizedMonthYear()}
                        </h3>
                        <button
                            onClick={goToNextMonth}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <HiChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Day names */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {getLocalizedDayNames().map(day => (
                            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {days.map((date, index) => (
                            <div key={index} className="aspect-square">
                                {date ? (
                                    <button
                                        onClick={() => handleDateClick(date)}
                                        disabled={isPastDate(date)}
                                        className={`
                                            w-full h-full rounded-lg text-sm font-medium transition-all duration-200
                                            flex items-center justify-center relative
                                            ${isPastDate(date)
                                                ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                                                : isSelected(date)
                                                    ? 'bg-[#065A46] text-white shadow-md'
                                                    : isToday(date)
                                                        ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                                        : hasSessions(date)
                                                            ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                                            : 'text-gray-700 hover:bg-gray-100'
                                            }
                                        `}
                                    >
                                        {date.getDate()}
                                        {hasSessions(date) && (
                                            <div className="absolute -top-1 -right-1 bg-[#065A46] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
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

export default CustomCalendar;