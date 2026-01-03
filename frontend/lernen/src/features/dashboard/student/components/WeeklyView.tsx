import React from 'react';
import { useTranslation } from 'react-i18next';
import commonUtils from '../../../../utils/commonUtils';
import type { Session } from '../../../../types/class';

interface WeeklyViewProps {
    currentDate: Date;
    bookings: Session[];
    onSessionClick: (session: Session, event: React.MouseEvent) => void;
}

const WeeklyView: React.FC<WeeklyViewProps> = ({ currentDate, bookings, onSessionClick }) => {
    const { t, i18n } = useTranslation();
    const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
    const getWeekDays = (baseDate: Date) => {
        const startOfWeek = new Date(baseDate);
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(baseDate.getDate() - baseDate.getDay()); // Go back to Sunday
        return Array.from({ length: 7 }, (_, i) => {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            return day;
        });
    };

    const weekDays = getWeekDays(currentDate);

    return (
        <div className="border border-gray-200 rounded-lg overflow-x-auto">
            <div className="grid grid-cols-7 min-w-[800px]">
                {/* Header */}
                {weekDays.map((day, index) => (
                    <div key={index} className={`p-3 text-center border-b border-gray-200 bg-gray-50 ${index < 6 ? 'border-r' : ''}`}>
                        <p className="font-bold text-gray-800 text-sm">
                            {day.toLocaleDateString(locale, { day: 'numeric' })} {day.toLocaleDateString(locale, { month: 'long' })}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {day.toLocaleDateString(locale, { weekday: 'short' })}
                        </p>
                    </div>
                ))}
                {/* Body */}
                {weekDays.map((day, index) => {
                    const sessionsForDay = bookings.filter(session => {
                        // Convert UTC datetime from backend to local timezone
                        const localSessionDate = commonUtils.convertUTCToLocalDate(session.sessionDatetime);
                        return localSessionDate.toDateString() === day.toDateString();
                    });
                    return (
                        <div key={index} className={`h-[400px] p-2 space-y-1 ${index < 6 ? 'border-r' : ''} border-gray-200`}>
                            {sessionsForDay.length > 0 ? (
                                sessionsForDay.map(session => {
                                    // Convert UTC datetime to local timezone for display
                                    const localSessionDate = commonUtils.convertUTCToLocalDate(session.sessionDatetime);
                                    return (
                                        <div
                                            key={session.id}
                                            onClick={(e) => onSessionClick(session, e)}
                                            className="text-xs font-semibold py-1 px-1.5 rounded-md text-left truncate cursor-pointer bg-[#0b6459] text-white"
                                        >
                                            <p className="font-bold">
                                                {session.sessionType === 'TRIAL' 
                                                    ? t('dashboard.common.sessionTypes.trial') 
                                                    : (session.classInfo?.title || 'Session')
                                                }
                                            </p>
                                            <p>{localSessionDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="bg-[#FBF6EE] text-[#B58A3F] text-xs font-semibold py-1.5 px-2 rounded-lg text-center">
                                    {t('dashboard.common.noSessions')}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default WeeklyView;
