import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import RequestStatusBadge from '../../components/RequestStatusBadge';
import type { TrialSessionRequestResponse } from '../../../../../types/api';
import { classService } from '../../../../../services/classService';
import Toast from '../../../../../components/ui/Toast';

interface TrialRequestCardProps {
    request: TrialSessionRequestResponse;
    viewMode: 'tutor' | 'student';
    onChat?: () => void;
    onCancel?: () => void;
    onRequestProcessed?: (requestId: string) => void;
}

const TrialRequestCard: React.FC<TrialRequestCardProps> = ({ request, viewMode, onChat, onCancel, onRequestProcessed }) => {
    const { t } = useTranslation();
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [isAccepting, setIsAccepting] = useState(false);
    const [isDeclining, setIsDeclining] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMessageExpanded, setIsMessageExpanded] = useState(false);
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
            setToast({ message: t('dashboard.tutor.requests.trial.declineSuccess'), type: 'success' });
            onRequestProcessed?.(request.id);
        } catch (error) {
            setToast({ message: t('dashboard.tutor.requests.trial.declineError'), type: 'error' });
        } finally {
            setIsDeclining(false);
        }
    };

    const formatDateTime = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60));
        
        if (diffInHours < 24) {
            return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        } else if (diffInHours < 48) {
            return `Tomorrow, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
        } else {
            return date.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            });
        }
    };

    const formatTimestamp = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInMinutes < 1) {
            return 'just now';
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
        } else if (diffInDays < 7) {
            return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
        } else {
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
            });
        }
    };

    return (
        <>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 flex flex-col gap-4">
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
                
                {/* Header: Avatar + Name + Menu */}
                <div className="flex items-center gap-3">
                    {request.student && (
                        <div className="flex-shrink-0">
                            <img 
                                src={request.student.avatarUrl} 
                                alt={request.student.fullName} 
                                className="w-12 h-12 rounded-lg object-cover border-2 border-black" 
                            />
                        </div>
                    )}
                    <h3 className="font-semibold text-gray-900 text-base leading-tight break-words flex-1">
                        {request.student?.fullName || t('dashboard.tutor.requests.trial.unknownStudent')}
                    </h3>
                    {viewMode === 'tutor' && (
                        <div className="flex flex-col items-end gap-2 flex-shrink-0 -mr-5">
                            {request.createdAt && (
                                <span className="text-xs text-gray-400 whitespace-nowrap">
                                    • {formatTimestamp(request.createdAt)}
                                </span>
                            )}
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
                    )}
                </div>

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

                {viewMode === 'student' && (
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <RequestStatusBadge status={request.status} />
                        {request.status === 'PENDING' && (
                            <button 
                                onClick={onCancel} 
                                className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                            >
                                {t('dashboard.tutor.requests.trial.cancelRequest')}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default TrialRequestCard;