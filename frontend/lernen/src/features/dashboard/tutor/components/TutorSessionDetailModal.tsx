import React, { useEffect, useRef, useState } from 'react';
import { HiX, HiPlay, HiCalendar } from 'react-icons/hi';
import type { Session } from '../../../../types/class';
import { useTranslation } from 'react-i18next';
import BirdLoading from '../../../../components/ui/BirdLoading';

interface TutorSessionDetailModalProps {
    session: Session;
    position: { top: number; left: number };
    onClose: () => void;
}

const TutorSessionDetailModal: React.FC<TutorSessionDetailModalProps> = ({ session, position, onClose }) => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLDivElement>(null);
    const [isLeft, setIsLeft] = useState(false);
    const [isStarting, setIsStarting] = useState(false);

    // Handle start session - call API then convert Zoom URL to Web Client URL and open in new tab
    const handleStartSession = async () => {
        try {
            if (!session?.meetingUrl) {
                console.error("No meeting URL found for session:", session?.id);
                return;
            }

            setIsStarting(true);

            // Call API to start session (updates status to BOOKED)
            const { classService } = await import('../../../../services/classService');
            await classService.startSessionByTutor(session.id);
            console.log("Session started via API:", session.id);

            // Convert standard URL to Web Client URL to allow joining via browser
            // Format: https://zoom.us/wc/{meetingId}/join?pwd={password}
            let openUrl = session.meetingUrl;

            // Regex to match /j/{meetingId}
            const match = openUrl.match(/\/j\/(\d+)/);
            if (match && match[1]) {
                const meetingId = match[1];
                // Replace /j/{meetingId} with /wc/{meetingId}/join
                openUrl = openUrl.replace(/\/j\/\d+/, `/wc/${meetingId}/join`);
            }

            // Open meeting URL in new tab
            window.open(openUrl, '_blank');
            console.log("Opening Zoom (Web Client):", session.id, openUrl);

        } catch (error) {
            console.error("Error starting session:", error);
        } finally {
            setIsStarting(false);
        }
    };

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

    const sessionDate = new Date(session.sessionDatetime);
    const formattedDate = sessionDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    const formattedTime = sessionDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

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
                className="fixed z-30 w-80 bg-white rounded-xl shadow-2xl border border-gray-200/80 p-5"
                style={{ top: position.top, left: position.left }}
            >
                <div className={`absolute top-4 w-4 h-4 bg-white border-b border-l border-gray-200/80 transform rotate-45 ${isLeft ? '-right-2' : '-left-2'}`}></div>

                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">{session.className}</h3>
                        <p className="text-sm text-gray-500 mt-1">{formattedDate}</p>
                        {session.sessionType && (
                            <p className="text-xs text-blue-600 mt-1">{session.sessionType} Session</p>
                        )}
                    </div>
                    <button onClick={onClose} className="p-1 -mr-2 -mt-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                        <HiX className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex items-center gap-3 my-4">
                    <img src={session.students[0]?.avatarUrl} alt={session.students[0]?.fullName} className="w-10 h-10 rounded-full" />
                    <div>
                        <p className="text-sm font-semibold text-gray-800">
                            {session.students.length === 1
                                ? session.students[0]?.fullName
                                : `${session.students[0]?.fullName} (+${session.students.length - 1} more)`
                            }
                        </p>
                        <p className="text-xs text-gray-500">
                            {session.students.length === 1 ? 'Student' : `${session.students.length} Students`}
                        </p>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-sm font-semibold text-gray-700">{formattedTime}</p>
                </div>

                {session.notes && (
                    <div className="bg-blue-50 rounded-lg p-3 mt-3">
                        <p className="text-sm text-blue-800">{session.notes}</p>
                    </div>
                )}

                <div className="mt-4 flex flex-col gap-2">
                    <button
                        onClick={handleStartSession}
                        disabled={isStarting}
                        className="w-full flex items-center justify-center gap-2 bg-[#0b6459] text-white font-semibold py-2.5 rounded-lg text-sm hover:bg-[#084c43] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <HiPlay className="w-4 h-4" />
                        {t('dashboard.tutor.startSession')}
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                        <HiCalendar className="w-4 h-4" />
                        {t('profile.session.reschedule')}
                    </button>
                </div>
            </div>
        </>
    );
};

export default TutorSessionDetailModal;
