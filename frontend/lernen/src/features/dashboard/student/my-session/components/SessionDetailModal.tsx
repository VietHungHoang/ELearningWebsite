import React, { useEffect, useRef, useState } from 'react';
import { FiX, FiVideo, FiCalendar } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import type { Session } from '../../../../../types/class';
import commonUtils from '../../../../../utils/commonUtils';
import BirdLoading from '../../../../../components/ui/BirdLoading';
import { classService } from '../../../../../services/classService';
import { useAuth } from '../../../../../context/AuthContext';

interface SessionDetailModalProps {
    booking: Session;
    position: { top: number; left: number };
    onClose: () => void;
    isAbove?: boolean; // Modal hiển thị phía trên trigger element
    onReschedule?: () => void; // Callback khi click vào button đổi lịch
    onShowToast?: (message: string, type: 'success' | 'error') => void;
}

const SessionDetailModal: React.FC<SessionDetailModalProps> = ({ booking, position, onClose, isAbove = false, onReschedule, onShowToast }) => {
    const { t, i18n } = useTranslation();
    const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
    const { state } = useAuth();
    const modalRef = useRef<HTMLDivElement>(null);
    const [isLeft, setIsLeft] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isStarting, setIsStarting] = useState(false);

    // Handle join session - validate 15min window, call API, then open Zoom
    const handleJoinSession = async () => {
        try {
            // 1. Validate 15-minute window before session start
            const sessionDate = commonUtils.convertUTCToLocalDate(booking.sessionDatetime);
            const now = new Date();
            const minutesUntilSession = (sessionDate.getTime() - now.getTime()) / (1000 * 60);

            // Can only join 15 minutes before session starts
            // if (minutesUntilSession > 15) {
            //     const message = t('dashboard.sidebar.student.session.tooEarlyToJoin', { minutes: 15 });
            //     if (onShowToast) {
            //         onShowToast(message, 'error');
            //     } else {
            //         alert(message);
            //     }
            //     return;
            // }

            // If session has already passed significantly (e.g., > 2 hours), also block
            if (minutesUntilSession < -120) {
                const message = t('dashboard.sidebar.student.session.sessionEnded');
                if (onShowToast) {
                    onShowToast(message, 'error');
                } else {
                    alert(message);
                }
                return;
            }

            setIsStarting(true);

            // 2. Call backend API to mark attendance and get meeting URL
            const studentId = state.user?.id;
            if (!studentId) {
                throw new Error('Student ID not found');
            }

            const response = await classService.startSession(booking.id, studentId);
            
            if (!response.success) {
                throw new Error(response.message || 'Failed to join session');
            }

            // 3. Use meeting URL from booking object
            const meetingUrl = booking.meetingUrl || booking.meetingLink;
            if (!meetingUrl) {
                throw new Error('Meeting link is not available');
            }

            // Convert standard URL to Web Client URL and open in new tab
            let openUrl = meetingUrl;

            // Regex to match /j/{meetingId}
            const match = openUrl.match(/\/j\/(\d+)/);
            if (match && match[1]) {
                const meetingId = match[1];
                // Replace /j/{meetingId} with /wc/{meetingId}/join
                openUrl = openUrl.replace(/\/j\/\d+/, `/wc/${meetingId}/join`);
            }

            // Open meeting URL in new tab
            window.open(openUrl, '_blank');
            console.log("Joining session (Web Client):", booking.id, openUrl);

            // Show success message
            if (onShowToast) {
                onShowToast(t('dashboard.sidebar.student.session.joiningSuccess'), 'success');
            }

            // Close modal after successful join
            onClose();

        } catch (error: any) {
            console.error("Error joining session:", error);
            const message = error.message || t('dashboard.student.errorJoiningSession') || 'Failed to join the session. Please try again.';
            if (onShowToast) {
                onShowToast(message, 'error');
            } else {
                alert(message);
            }
        } finally {
            setIsStarting(false);
        }
    };

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
        if (modalRef.current) {
            const rect = modalRef.current.getBoundingClientRect();
            setIsLeft(rect.left < 0);
        }
    }, [position]);

    // Convert UTC datetime from backend to local timezone
    const localSessionDate = commonUtils.convertUTCToLocalDate(booking.sessionDatetime);
    const formattedDate = localSessionDate.toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    const startTime = localSessionDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: true });
    // Assuming 1 hour duration for now, as it's not provided in Session type
    const endDate = new Date(localSessionDate.getTime() + 60 * 60 * 1000);
    const endTime = endDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: true });
    const formattedTime = `${startTime} - ${endTime}`;

    return (
        <>
            {/* Loading Overlay */}
            {isStarting && (
                <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                    <BirdLoading
                        title={t("dashboard.tutor.startingSession")}
                        description={t("auth.resumeInput.pleaseWait")}
                        size="lg"
                    />
                </div>
            )}

            <div
                ref={modalRef}
                className={`fixed z-30 w-72 bg-white rounded-xl shadow-2xl border border-gray-200/80 p-5 transition-all duration-200 ease-out origin-top-left ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
                style={{ top: position.top, left: position.left }}
            >
                {/* Arrow: dynamically switch side and vertical position */}
                <div className={`absolute w-4 h-4 bg-white border-b border-l border-gray-200/80 transform rotate-45 ${isAbove ? 'bottom-4' : 'top-4'
                    } ${isLeft ? '-right-2' : '-left-2'}`}></div>

                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">
                            {booking.sessionType === 'TRIAL'
                                ? t('dashboard.common.sessionTypes.trial')
                                : (booking.classInfo?.title || 'Session')
                            }
                        </h3>
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
                    <button
                        onClick={handleJoinSession}
                        disabled={isStarting}
                        className="w-full flex items-center justify-center gap-2 bg-[#0b6459] text-white font-semibold py-2.5 rounded-lg text-sm hover:bg-[#084c43] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FiVideo />
                        {t('profile.session.joinClass')}
                    </button>
                    <button
                        onClick={() => {
                            if (onReschedule) {
                                onReschedule();
                            }
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                    >
                        <FiCalendar />
                        {t('profile.session.reschedule')}
                    </button>
                </div>
            </div>
        </>
    );
};

export default SessionDetailModal;

