import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { StudentInfo } from '../../my-class/components/EditClassModal';
import RequestStatusBadge from '../../components/RequestStatusBadge';
import type { RequestStatus } from '../../../../../types/api';
import { classService } from '../../../../../services/classService';
import Toast from '../../../../../components/ui/Toast';
import ConfirmModal from '../../../../../components/ui/ConfirmModal';

export interface Schedule {
    day: string;
    time: string;
}

export interface RescheduleRequestData {
    id: string;
    type: 'Reschedule';
    student?: StudentInfo;
    tutor?: { name: string, avatar: string };
    courseTitle: string;
    originalSchedule?: Schedule;
    proposedSchedules: Schedule[];
    reason: string;
    timestamp: string;
    date: Date;
    status: RequestStatus;
}

interface RescheduleRequestCardProps {
    request: RescheduleRequestData;
    viewMode: 'tutor' | 'student';
    onChat?: () => void;
    onCancel?: () => void;
    onRequestProcessed?: (requestId: string) => void;
}

const RescheduleRequestCard: React.FC<RescheduleRequestCardProps> = ({ request, viewMode, onChat, onCancel, onRequestProcessed }) => {
    const { t } = useTranslation();
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [isAccepting, setIsAccepting] = useState(false);
    const [isDeclining, setIsDeclining] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMessageExpanded, setIsMessageExpanded] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const messageRef = useRef<HTMLParagraphElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    const handleAccept = async () => {
        setIsAccepting(true);
        try {
            const result = await classService.acceptRescheduleRequest(request.id);
            if (result.success) {
                setToast({ message: t('dashboard.tutor.requests.reschedule.acceptSuccess'), type: 'success' });
                onRequestProcessed?.(request.id);
            } else {
                setToast({ message: result.message || t('dashboard.tutor.requests.reschedule.acceptFailed'), type: 'error' });
            }
        } catch (error) {
            setToast({ message: t('dashboard.tutor.requests.reschedule.acceptError'), type: 'error' });
        } finally {
            setIsAccepting(false);
        }
    };

    const handleDecline = async () => {
        setIsDeclining(true);
        try {
            setToast({ message: t('dashboard.tutor.requests.reschedule.declineSuccess'), type: 'success' });
            onRequestProcessed?.(request.id);
        } catch (error) {
            setToast({ message: t('dashboard.tutor.requests.reschedule.declineError'), type: 'error' });
        } finally {
            setIsDeclining(false);
        }
    };

    const { title, badgeClass, isRecurring } = useMemo(() => {
        // For reschedule requests, they are always one-time (not recurring)
        return {
            title: t('dashboard.tutor.requests.reschedule.oneTimeTitle'),
            badgeClass: 'bg-purple-100 text-purple-800',
            isRecurring: false
        };
    }, [t]);

    // Format original schedule - format day and time like proposed schedule
    const formatOriginalSchedule = (schedule: Schedule | undefined): string => {
        if (!schedule) return '';
        // Format like proposed schedule: "day at time"
        return `${schedule.day} at ${schedule.time}`;
    };

    // Format proposed schedule with full date information (only for one-time schedules)
    const formatProposedSchedule = (schedule: Schedule, isRecurring: boolean): string => {
        if (isRecurring) {
            return t('dashboard.tutor.requests.reschedule.everyDayAt', { day: schedule.day, time: schedule.time });
        }
        
        // For one-time schedules, use the already formatted day and time
        // schedule.day already contains the full formatted date from locale
        return `${schedule.day} at ${schedule.time}`;
    };

    // Check if message needs truncation
    const [needsTruncation, setNeedsTruncation] = useState(true); // Default to true to prevent flash
    
    useEffect(() => {
        const checkTruncation = () => {
            if (messageRef.current) {
                const element = messageRef.current;
                // Temporarily remove line-clamp to get actual height
                element.classList.remove('line-clamp-3');
                
                // Force reflow
                void element.offsetHeight;
                
                const lineHeight = parseFloat(getComputedStyle(element).lineHeight) || 20;
                const maxHeight = lineHeight * 3;
                const needsTrunc = element.scrollHeight > maxHeight;
                
                // Restore line-clamp if needed and not expanded
                if (needsTrunc && !isMessageExpanded) {
                    element.classList.add('line-clamp-3');
                }
                
                setNeedsTruncation(needsTrunc);
            }
        };
        
        // Check immediately and after a short delay to ensure DOM is ready
        checkTruncation();
        const timeoutId = setTimeout(checkTruncation, 0);
        
        window.addEventListener('resize', checkTruncation);
        
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', checkTruncation);
        };
    }, [request.reason, isMessageExpanded]);

    return (
        <div className="bg-white p-5 pt-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 flex flex-col gap-4 relative">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            
            {/* Status badge - Top left corner */}
            <RequestStatusBadge status={request.status} />
            
            {/* Timestamp - Top right corner */}
            {request.timestamp && (
                <div className="absolute top-0 right-0 z-10 pt-2 pr-6">
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                        {request.timestamp.startsWith('•') ? request.timestamp.replace('•', '').trim() : request.timestamp}
                    </span>
                </div>
            )}
            
            {/* Header: Badge, Actions */}
            <div className="pb-3 border-b border-gray-100">
                {/* Row 1: Badge + Cancel button (student) / Menu button (tutor) */}
                <div className="flex items-center justify-end gap-3">
                    {/* Badge: Loại đổi lịch - bên trái thùng rác/menu button */}
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${badgeClass}`}>
                        {title}
                    </span>
                    {viewMode === 'student' && request.status === 'PENDING' && (
                        <button
                            onClick={() => setShowCancelConfirm(true)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Cancel request"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}
                    {viewMode === 'tutor' && (
                            <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                aria-label="Menu"
                            >
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                            </button>
                            {isMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-auto min-w-fit bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 whitespace-nowrap">
                                    <button
                                        onClick={() => {
                                            handleAccept();
                                            setIsMenuOpen(false);
                                        }}
                                        disabled={isAccepting}
                                        className="w-full px-4 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                    >
                                        {isAccepting ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>{t('dashboard.tutor.requests.reschedule.accepting')}</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4 text-[#0b6459]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>{t('dashboard.tutor.requests.reschedule.accept')}</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => {
                                            onChat?.();
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full px-4 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        <span>{t('dashboard.tutor.requests.reschedule.chat')}</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleDecline();
                                            setIsMenuOpen(false);
                                        }}
                                        disabled={isDeclining}
                                        className="w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                    >
                                        {isDeclining ? (
                                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                <span>{t('dashboard.tutor.requests.reschedule.decline')}</span>
                                            </>
                                        )}
                                    </button>
                                    </div>
                                )}
                            </div>
                        )}
                </div>
            </div>

            {/* Schedule Section */}
            <div className="space-y-4">
                {request.originalSchedule && (
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <p className="text-xs font-semibold text-gray-600 mb-2">
                            {t('dashboard.tutor.requests.reschedule.original')}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-800">
                            <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-medium">{formatOriginalSchedule(request.originalSchedule)}</span>
                        </div>
                    </div>
                )}
                <div className="bg-[#0b6459]/5 rounded-lg p-3 border border-[#0b6459]/20">
                    <p className="text-xs font-semibold text-[#0b6459] mb-2">
                        {t('dashboard.tutor.requests.reschedule.proposed')}
                    </p>
                    {isRecurring ? (
                        <div className="flex flex-wrap gap-2">
                            {request.proposedSchedules.map((s, idx) => (
                                <div 
                                    key={idx}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-white text-[#0b6459] border border-[#0b6459]/30"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{t('dashboard.tutor.requests.reschedule.everyDayAt', { day: s.day, time: s.time })}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-sm text-[#0b6459]">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">{formatProposedSchedule(request.proposedSchedules[0], false)}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Message Section */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p 
                    ref={messageRef}
                    className={`text-sm text-gray-700 leading-relaxed ${!isMessageExpanded && needsTruncation ? 'line-clamp-3' : ''}`}
                    style={!isMessageExpanded && !needsTruncation ? { WebkitLineClamp: 'unset' } : undefined}
                >
                    "{request.reason}"
                </p>
                {needsTruncation && (
                    <button
                        onClick={() => setIsMessageExpanded(!isMessageExpanded)}
                        className="mt-2 text-xs font-medium text-[#0b6459] hover:text-[#084c43] transition-colors flex items-center gap-1"
                    >
                        {isMessageExpanded ? (
                            <>
                                <span>{t('dashboard.tutor.requests.reschedule.showLess')}</span>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                            </>
                        ) : (
                            <>
                                <span>{t('dashboard.tutor.requests.reschedule.showMore')}</span>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </>
                        )}
                    </button>
                )}
            </div>

            <ConfirmModal
                isOpen={showCancelConfirm}
                title={t('dashboard.tutor.requests.reschedule.cancelRequest')}
                message={t('dashboard.tutor.requests.reschedule.cancelConfirmMessage')}
                confirmText={t('dashboard.tutor.requests.reschedule.cancelRequest')}
                cancelText={t('common.cancel', { defaultValue: 'Cancel' })}
                onConfirm={() => {
                    onCancel?.();
                    setShowCancelConfirm(false);
                }}
                onCancel={() => setShowCancelConfirm(false)}
                confirmButtonColor="red"
            />
        </div>
    );
};

export default RescheduleRequestCard;
