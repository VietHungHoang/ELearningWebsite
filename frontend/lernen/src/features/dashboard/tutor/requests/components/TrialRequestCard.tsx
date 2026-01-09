import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import RequestStatusBadge from '../../components/RequestStatusBadge';
import type { TrialSessionRequestResponse } from '../../../../../types/api';
import { classService } from '../../../../../services/classService';
import Toast from '../../../../../components/ui/Toast';
import BirdLoading from '../../../../../components/ui/BirdLoading';

// Delete Confirm Popup Component - Similar to Step 5
interface DeleteConfirmPopupProps {
    onConfirm: () => void;
    onCancel: () => void;
    confirmText: string;
    cancelText: string;
    deleteText: string;
}

const DeleteConfirmPopup: React.FC<DeleteConfirmPopupProps> = ({
    onConfirm,
    onCancel,
    confirmText,
    cancelText,
    deleteText,
}) => {
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onCancel();
            }
        };

        // Delay để tránh close ngay khi click button mở
        const timer = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 0);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onCancel]);

    return (
        <div
            ref={popupRef}
            className="absolute right-0 top-full mt-1 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-3 min-w-[200px]"
        >
            <p className="text-sm text-gray-700 mb-3">{confirmText}</p>
            <div className="flex gap-2 justify-end">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onCancel();
                    }}
                    className="px-2 py-1 text-xs text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition"
                >
                    {cancelText}
                </button>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onConfirm();
                    }}
                    className="px-2 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700 transition"
                >
                    {deleteText}
                </button>
            </div>
        </div>
    );
};

interface TrialRequestCardProps {
    request: TrialSessionRequestResponse;
    viewMode: 'tutor' | 'student';
    onChat?: () => void;
    onCancel?: () => void;
    onRequestProcessed?: (requestId: string) => void;
}

const TrialRequestCard: React.FC<TrialRequestCardProps> = ({ request, viewMode, onChat, onCancel, onRequestProcessed }) => {
    const { t, i18n } = useTranslation();
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [isAccepting, setIsAccepting] = useState(false);
    const [isDeclining, setIsDeclining] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMessageExpanded, setIsMessageExpanded] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const messageRef = useRef<HTMLParagraphElement>(null);

    // Get person info based on viewMode
    const person = viewMode === 'tutor'
        ? request.student
        : ((request as any).tutor || { fullName: 'Unknown Tutor', avatarUrl: 'https://i.pravatar.cc/150?img=1' });

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
                const maxHeight = lineHeight * 3; // 3 lines
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

        // Also check on window resize
        window.addEventListener('resize', checkTruncation);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', checkTruncation);
        };
    }, [request.message, isMessageExpanded]);

    const handleAccept = async () => {
        setIsAccepting(true);
        try {
            const result = await classService.acceptTrialRequest(request.id);
            if (result.success) {
                setToast({ message: t('dashboard.tutor.requests.trial.acceptSuccess'), type: 'success' });
                onRequestProcessed?.(request.id);
            } else {
                setToast({ message: result.message || t('dashboard.tutor.requests.trial.acceptFailed'), type: 'error' });
            }
        } catch (error) {
            setToast({ message: t('dashboard.tutor.requests.trial.acceptError'), type: 'error' });
        } finally {
            setIsAccepting(false);
        }
    };

    const handleDecline = async () => {
        setIsDeclining(true);
        try {
            const result = await classService.rejectTrialRequest(request.id);
            if (result.success) {
                setToast({ message: t('dashboard.tutor.requests.trial.declineSuccess'), type: 'success' });
                onRequestProcessed?.(request.id);
            } else {
                setToast({ message: result.message || t('dashboard.tutor.requests.trial.declineFailed'), type: 'error' });
            }
        } catch (error) {
            setToast({ message: t('dashboard.tutor.requests.trial.declineError'), type: 'error' });
        } finally {
            setIsDeclining(false);
        }
    };

    const formatDateTime = (dateString: string): string => {
        // Parse sessionDateTime from UTC format
        const utcDate = new Date(dateString.endsWith('Z') ? dateString : dateString + 'Z');

        // Format according to current locale
        const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';

        // Format: "Mon, Jan 5, 02:00 AM"
        const formattedDate = utcDate.toLocaleDateString(locale, {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });

        const formattedTime = utcDate.toLocaleTimeString(locale, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        return `${formattedDate}, ${formattedTime}`;
    };

    const formatTimestamp = (dateString: string): string => {
        // Parse createdAt from backend format: "2026-01-02T06:57:17.923084" (LocalDateTime, no timezone)
        // Backend stores in UTC, so we treat it as UTC for accurate relative time calculation

        let utcDate: Date;

        // Check if string already has timezone indicator (Z, +HH:MM, or -HH:MM)
        const hasTimezone = dateString.endsWith('Z') ||
            /[+-]\d{2}:\d{2}$/.test(dateString) ||
            /[+-]\d{4}$/.test(dateString);

        // Normalize the date string: handle microseconds (JavaScript Date only supports milliseconds)
        // Format: "2026-01-02T06:57:17.923084" -> "2026-01-02T06:57:17.923Z"
        let normalizedDateString = dateString;
        if (normalizedDateString.includes('.')) {
            const parts = normalizedDateString.split('.');
            if (parts.length === 2) {
                const fractionalPart = parts[1];
                // Extract timezone if present (Z, +HH:MM, -HH:MM)
                const tzMatch = fractionalPart.match(/^(\d+)([Z+-].*)?$/);
                if (tzMatch) {
                    const fractionalSeconds = tzMatch[1];
                    const tzPart = tzMatch[2] || '';
                    // Truncate microseconds to milliseconds (first 3 digits, pad if needed)
                    const milliseconds = fractionalSeconds.substring(0, 3).padEnd(3, '0');
                    normalizedDateString = `${parts[0]}.${milliseconds}${tzPart}`;
                }
            }
        }

        if (hasTimezone) {
            // Already has timezone info, parse directly
            utcDate = new Date(normalizedDateString);
        } else {
            // No timezone info, treat as UTC (backend stores LocalDateTime in UTC)
            // Add 'Z' to indicate UTC
            utcDate = new Date(normalizedDateString + 'Z');
        }

        // Validate parsed date
        if (isNaN(utcDate.getTime())) {
            // Fallback: try parsing without fractional seconds
            const withoutFractional = normalizedDateString.split('.')[0];
            utcDate = new Date(hasTimezone ? withoutFractional : withoutFractional + 'Z');
        }

        // Get current time (JavaScript Date is always in UTC internally)
        const now = new Date();
        const diffInMs = now.getTime() - utcDate.getTime();
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInMinutes < 1) {
            return t('dashboard.tutor.requests.trial.justNow');
        } else if (diffInMinutes < 60) {
            return t('dashboard.tutor.requests.trial.minutesAgo', { count: diffInMinutes });
        } else if (diffInHours < 24) {
            return t('dashboard.tutor.requests.trial.hoursAgo', { count: diffInHours });
        } else if (diffInDays < 7) {
            return t('dashboard.tutor.requests.trial.daysAgo', { count: diffInDays });
        } else {
            // Format date according to current locale and timezone
            const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
            return utcDate.toLocaleDateString(locale, {
                month: 'short',
                day: 'numeric',
                year: utcDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
            });
        }
    };


    return (
        <>
            {/* Bird Loading Overlay when accepting */}
            {isAccepting && (
                <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                    <BirdLoading
                        title={t('dashboard.tutor.requests.trial.accepting')}
                        size="lg"
                    />
                </div>
            )}

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 flex flex-col gap-4 relative">
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

                {/* Status badge - Top left corner */}
                <RequestStatusBadge status={request.status} />

                {viewMode === 'tutor' ? (
                    /* Tutor View: Original UI - Avatar + Name + Menu */
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                        {person && (
                            <div className="flex-shrink-0">
                                <img
                                    src={person.avatarUrl || person.avatar || 'https://i.pravatar.cc/150?img=1'}
                                    alt={person.fullName || person.name || 'Unknown'}
                                    className="w-12 h-12 rounded-lg object-cover border-2 border-black"
                                />
                            </div>
                        )}
                        <h3 className="font-semibold text-gray-900 text-base leading-tight break-words flex-1">
                            {person?.fullName || person?.name || t('dashboard.tutor.requests.trial.unknownStudent')}
                        </h3>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0 -mr-5">
                            {request.createdAt && (
                                <span className="text-xs text-gray-400 whitespace-nowrap mr-4">
                                    {formatTimestamp(request.createdAt)}
                                </span>
                            )}
                            {/* Badge: Học thử - bên phải dưới timestamp */}
                            <div className="mr-4">
                                <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                                    {t('dashboard.tutor.requests.trial.badge')}
                                </span>
                            </div>
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
                                                    <span>{t('dashboard.tutor.requests.trial.accepting')}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4 text-[#0b6459]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span>{t('dashboard.tutor.requests.trial.accept')}</span>
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
                                            <span>{t('dashboard.tutor.requests.trial.chat')}</span>
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
                                                    <span>{t('dashboard.tutor.requests.trial.decline')}</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Student View: Clean Layout - 2 rows */
                    <div className="flex flex-col gap-2 pb-3 border-b border-gray-100">
                        {/* Row 1: Avatar + Name + Timestamp */}
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                                <img
                                    src={person?.avatarUrl || person?.avatar || 'https://i.pravatar.cc/150?img=1'}
                                    alt={person?.fullName || person?.name || 'Unknown'}
                                    className="w-12 h-12 rounded-lg object-cover border-2 border-black"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 text-base leading-tight break-words">
                                    {person?.fullName || person?.name || 'Unknown Tutor'}
                                </h3>
                            </div>
                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                {request.createdAt && (
                                    <span className="text-xs text-gray-400 whitespace-nowrap">
                                        {formatTimestamp(request.createdAt)}
                                    </span>
                                )}
                                {/* Badge: Học thử - bên phải dưới timestamp */}
                                <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                                    {t('dashboard.tutor.requests.trial.badge')}
                                </span>
                            </div>
                        </div>
                        {/* Row 2: Nút xóa */}
                        <div className="flex items-center justify-end">
                            {request.status === 'PENDING' && (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowCancelConfirm(true)}
                                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                        aria-label="Cancel request"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                    {/* Small Delete Confirmation Popup - Similar to Step 5 */}
                                    {showCancelConfirm && (
                                        <DeleteConfirmPopup
                                            onConfirm={() => {
                                                onCancel?.();
                                                setShowCancelConfirm(false);
                                            }}
                                            onCancel={() => setShowCancelConfirm(false)}
                                            confirmText={t('dashboard.tutor.requests.trial.cancelConfirmMessage')}
                                            cancelText={t('common.cancel', { defaultValue: 'Cancel' })}
                                            deleteText={t('dashboard.tutor.requests.trial.cancelRequest')}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Schedule */}
                <div>
                    <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                        {t('dashboard.tutor.requests.trial.sessionTime')}
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-[#0b6459]/10 text-[#0b6459] border border-[#0b6459]/20">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDateTime(request.sessionDateTime)}</span>
                    </div>
                </div>

                {/* Message */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p
                        ref={messageRef}
                        className={`text-sm text-gray-700 leading-relaxed ${!isMessageExpanded && needsTruncation ? 'line-clamp-3' : ''}`}
                        style={!isMessageExpanded && !needsTruncation ? { WebkitLineClamp: 'unset' } : undefined}
                    >
                        "{request.message || 'No message provided'}"
                    </p>
                    {needsTruncation && (
                        <button
                            onClick={() => setIsMessageExpanded(!isMessageExpanded)}
                            className="mt-2 text-xs font-medium text-[#0b6459] hover:text-[#084c43] transition-colors flex items-center gap-1"
                        >
                            {isMessageExpanded ? (
                                <>
                                    <span>Show less</span>
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                </>
                            ) : (
                                <>
                                    <span>Show more</span>
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </>
                            )}
                        </button>
                    )}
                </div>

            </div>
        </>
    );
};

export default TrialRequestCard;