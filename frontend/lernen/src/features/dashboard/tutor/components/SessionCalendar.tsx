import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './SessionCalendar.css';

interface SessionCalendarProps {
    sessionDates: Date[];
    onDateSelect: (date: Date) => void;
}

const SessionCalendar: React.FC<SessionCalendarProps> = ({ sessionDates, onDateSelect }) => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const handleDateChange = (value: any) => {
        setSelectedDate(value);
        onDateSelect(value);
    };

    const tileClassName = ({ date }: { date: Date }) => {
        // Check if this date has sessions
        const hasSession = sessionDates.some(
            sessionDate =>
                sessionDate.getDate() === date.getDate() &&
                sessionDate.getMonth() === date.getMonth() &&
                sessionDate.getFullYear() === date.getFullYear()
        );
        return hasSession ? 'has-session' : '';
    };

    const tileContent = ({ date }: { date: Date }) => {
        // Count sessions on this date
        const sessionCount = sessionDates.filter(
            sessionDate =>
                sessionDate.getDate() === date.getDate() &&
                sessionDate.getMonth() === date.getMonth() &&
                sessionDate.getFullYear() === date.getFullYear()
        ).length;

        return sessionCount > 0 ? (
            <div className="session-badge">{sessionCount}</div>
        ) : null;
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Session Calendar</h3>
            <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                tileClassName={tileClassName}
                tileContent={tileContent}
                className="modern-calendar"
            />
        </div>
    );
};

export default SessionCalendar;
