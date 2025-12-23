import React, { useEffect, useRef, useState } from 'react';
import { FiX, FiVideo, FiCalendar } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import type { Session } from '../../../../../types/class';
import commonUtils from '../../../../../utils/commonUtils';

interface SessionDetailModalProps {
  booking: Session;
  position: { top: number; left: number };
  onClose: () => void;
  isAbove?: boolean; // Modal hiển thị phía trên trigger element
}

const SessionDetailModal: React.FC<SessionDetailModalProps> = ({ booking, position, onClose, isAbove = false }) => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLDivElement>(null);
    const [isLeft, setIsLeft] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    useEffect(() => {
        if(modalRef.current) {
            const rect = modalRef.current.getBoundingClientRect();
            setIsLeft(rect.left < 0);
        }
    }, [position]);

    // Convert UTC datetime from backend to local timezone
    const localSessionDate = commonUtils.convertUTCToLocalDate(booking.sessionDatetime);
    const formattedDate = localSessionDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    const startTime = localSessionDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    // Assuming 1 hour duration for now, as it's not provided in Session type
    const endDate = new Date(localSessionDate.getTime() + 60 * 60 * 1000);
    const endTime = endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const formattedTime = `${startTime} - ${endTime}`;

    return (
        <div
            ref={modalRef}
            className={`fixed z-30 w-72 bg-white rounded-xl shadow-2xl border border-gray-200/80 p-5 transition-all duration-200 ease-out origin-top-left ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
            style={{ top: position.top, left: position.left }}
        >
            {/* Arrow: dynamically switch side and vertical position */}
            <div className={`absolute w-4 h-4 bg-white border-b border-l border-gray-200/80 transform rotate-45 ${
                isAbove ? 'bottom-4' : 'top-4'
            } ${isLeft ? '-right-2' : '-left-2'}`}></div>

            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-gray-800">{booking.classInfo?.title || 'Session'}</h3>
                    <p className="text-sm text-gray-500">{formattedDate}</p>
                </div>
                <button onClick={onClose} className="p-1 -mr-2 -mt-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                    <FiX />
                </button>
            </div>

            {/* Tutor Info */}
            <div className="my-2">
                <p className="text-sm font-semibold text-gray-800">{booking.tutor?.fullName || 'Tutor'}</p>
            </div>

            {/* Time */}
            <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-sm font-semibold text-gray-700">{formattedTime}</p>
            </div>

            {/* Actions */}
            <div className="mt-4 flex flex-col gap-2">
                <button className="w-full flex items-center justify-center gap-2 bg-[#0b6459] text-white font-semibold py-2.5 rounded-lg text-sm hover:bg-[#084c43] transition-colors">
                    <FiVideo />
                    {t('profile.session.joinClass')}
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                    <FiCalendar />
                    {t('profile.session.reschedule')}
                </button>
            </div>
        </div>
    );
};

export default SessionDetailModal;

