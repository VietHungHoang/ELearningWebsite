import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Booking } from '../types';

interface MonthlyViewProps {
    currentDate: Date;
    bookings: Booking[];
    onSessionClick: (booking: Booking, event: React.MouseEvent) => void;
}

const MonthlyView: React.FC<MonthlyViewProps> = ({ currentDate, bookings, onSessionClick }) => {
    const { t } = useTranslation();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const daysInMonth = lastDayOfMonth.getDate();
    const startDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday

    const calendarDays = [];

    // Days from previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
        calendarDays.push({ day: prevMonthLastDay - i, isCurrentMonth: false });
    }

    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push({ day: i, isCurrentMonth: true });
    }

    // Days from next month
    const remainingCells = 42 - calendarDays.length; // 6 weeks * 7 days
    for (let i = 1; i <= remainingCells; i++) {
        calendarDays.push({ day: i, isCurrentMonth: false });
    }

    const weekDays = [t('dashboard.common.days.sun'), t('dashboard.common.days.mon'), t('dashboard.common.days.tue'), t('dashboard.common.days.wed'), t('dashboard.common.days.thu'), t('dashboard.common.days.fri'), t('dashboard.common.days.sat')];

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                {weekDays.map(day => (
                    <div key={day} className="p-3 text-center text-sm font-semibold text-gray-600">
                        {day}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 grid-rows-6">
                {calendarDays.map((d, index) => {
                    const dayDate = d.isCurrentMonth ? new Date(year, month, d.day) : null;
                    const sessionsForDay = dayDate
                        ? bookings.filter(booking => booking.date.toDateString() === dayDate.toDateString())
                        : [];

                    return (
                        <div key={index} className={`calendar-day-cell h-28 p-2 border-r border-b border-gray-200 ${!d.isCurrentMonth ? 'bg-gray-50' : ''}`}>
                            <p className={`text-sm font-semibold ${d.isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}`}>{d.day}</p>
                            {d.isCurrentMonth && sessionsForDay.length > 0 && (
                                <div className="mt-1 space-y-1 overflow-y-auto max-h-20 custom-scrollbar">
                                    {sessionsForDay.map(session => (
                                        <div
                                            key={session.id}
                                            onClick={(e) => onSessionClick(session, e)}
                                            className={`text-xs font-semibold py-1 px-1.5 rounded-md text-left truncate cursor-pointer ${session.color}`}
                                        >
                                            {session.title}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default MonthlyView;
