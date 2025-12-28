import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Session } from '../../../types/class';
import commonUtils from '../../../../utils/commonUtils';

interface DailyViewProps {
    currentDate: Date;
    bookings: Session[];
    onSessionClick: (session: Session, event: React.MouseEvent) => void;
}

const DailyView: React.FC<DailyViewProps> = ({ currentDate, bookings, onSessionClick }) => {
    const { t, i18n } = useTranslation();
    const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
    const times = Array.from({ length: 18 }, (_, i) => i + 6); // 6 AM to 11 PM (23:00)
    const bookingsForDay = bookings.filter(session => {
        // Convert UTC datetime from backend to local timezone
        const localSessionDate = commonUtils.convertUTCToLocalDate(session.sessionDatetime);
        return localSessionDate.toDateString() === currentDate.toDateString();
    });
    const rowHeight = 52; // increased from 48px

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex text-sm font-semibold text-gray-600 bg-white border-b border-gray-200">
                <div className="p-3 border-r border-gray-200 w-32 flex-shrink-0 text-center">{t('dashboard.common.time')}</div>
                <div className="p-3 flex-1 text-center">{currentDate.toLocaleDateString(locale, { month: 'long', day: 'numeric', year: 'numeric' })}</div>
            </div>
            <div className="relative flex">
                <div className="w-32 flex-shrink-0 divide-y divide-gray-200">
                    {times.map((hour, index) => (
                        <div key={hour} className={`border-r border-gray-200 px-3 py-2 text-sm text-gray-500 font-normal text-center flex items-center justify-center ${index % 2 === 0 ? 'bg-gray-50' : ''}`} style={{ height: `${rowHeight}px` }}>
                            <span>{`${String(hour % 12 === 0 ? 12 : hour % 12).padStart(2, '0')}:00 ${hour < 12 ? 'am' : 'pm'}`}</span>
                        </div>
                    ))}
                </div>
                <div className="flex-1 relative">
                    <div className="divide-y divide-gray-200">
                        {times.map((hour, index) => (
                            <div key={hour} className={index % 2 === 0 ? 'bg-gray-50' : ''} style={{ height: `${rowHeight}px` }}></div>
                        ))}
                    </div>
                    <div className="absolute top-0 left-0 right-0 bottom-0">
                        {bookingsForDay.map(session => {
                            // Convert UTC datetime to local timezone
                            const localSessionDate = commonUtils.convertUTCToLocalDate(session.sessionDatetime);
                            const startHour = localSessionDate.getHours();
                            const top = (startHour - 6) * rowHeight;
                            const height = 1 * rowHeight; // Default 1 hour duration
                            return (
                                <div
                                    key={session.id}
                                    onClick={(e) => onSessionClick(session, e)}
                                    className="absolute px-3 py-1 rounded-lg cursor-pointer bg-[#0b6459] text-white"
                                    style={{ top: `${top}px`, height: `${height - 4}px`, left: '2px', right: '2px', width: 'calc(100% - 4px)' }}
                                >
                                    <p className="font-bold text-sm">{session.classInfo?.title || 'Session'}</p>
                                    <p className="text-xs">{session.tutor?.fullName || 'Tutor'}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyView;
