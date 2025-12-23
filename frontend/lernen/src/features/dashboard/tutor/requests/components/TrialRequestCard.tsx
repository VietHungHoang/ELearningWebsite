import React, { useState } from 'react';
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
            // TODO: Implement decline API call
            setToast({ message: t('dashboard.tutor.requests.trial.declineSuccess'), type: 'success' });
            onRequestProcessed?.(request.id);
        } catch (error) {
            setToast({ message: t('dashboard.tutor.requests.trial.declineError'), type: 'error' });
        } finally {
            setIsDeclining(false);
        }
    };
    const CardHeader = () => {
        if (viewMode === 'tutor') {
            return (
                <div className="flex items-center gap-4">
                    {request.student && (
                        <img src={request.student.avatarUrl} alt={request.student.fullName} className="w-12 h-12 rounded-full" />
                    )}
                    <div>
                        <p className="font-bold text-gray-800">{request.student?.fullName || t('dashboard.tutor.requests.trial.unknownStudent')}</p>
                    </div>
                </div>
            );
        }
        // Student view
        return (
             <div className="flex items-center gap-4">
                {request.tutor?.avatarUrl && <img src={request.tutor.avatarUrl} alt={request.tutor.fullName} className="w-12 h-12 rounded-full" />}
                <div>
                    <p className="text-sm text-gray-500">{t('dashboard.tutor.requests.trial.sentTo')}</p>
                    <p className="font-bold text-gray-800">{request.tutor?.fullName || t('dashboard.tutor.requests.trial.unknownTutor')}</p>
                </div>
            </div>
        );
    };

    return (
        <>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-4">
            {/* Top section */}
            <div>
                <div className="flex items-start justify-between gap-4">
                    <CardHeader />
                    <p className="text-xs text-gray-400 flex-shrink-0">
                        {new Date(request.createdAt).toLocaleString()}
                    </p>
                </div>
                <div className="mt-4">
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800">
                        {t('dashboard.tutor.requests.trial.badge')}
                    </span>
                </div>
            </div>

            {/* Middle section */}
            <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3 text-sm flex-grow">
                        <div>
                            <p className="font-semibold text-gray-500 text-xs uppercase tracking-wider">{t('dashboard.tutor.requests.trial.sessionTime')}</p>
                            <div className="mt-1 inline-block text-green-800 bg-green-50 px-3 py-1.5 rounded-md font-medium border border-green-200">
                                {new Date(request.sessionDateTime).toLocaleString()}
                            </div>
                        </div>
                    </div>
                    {/* Action buttons */}
                    {viewMode === 'tutor' && (
                        <div className="flex flex-col items-center gap-2 w-28 flex-shrink-0">
                            <button 
                                onClick={handleAccept} 
                                disabled={isAccepting}
                                className="w-full py-2 text-sm font-semibold bg-[#0b6459] text-white rounded-lg hover:bg-[#084c43] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isAccepting ? t('dashboard.tutor.requests.trial.accepting') : t('dashboard.tutor.requests.trial.accept')}
                            </button>
                            <button onClick={onChat} className="w-full py-2 text-sm font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">{t('dashboard.tutor.requests.trial.chat')}</button>
                            <button 
                                onClick={handleDecline} 
                                disabled={isDeclining}
                                className="w-full py-2 text-sm font-semibold bg-red-50 text-red-700 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDeclining ? t('dashboard.tutor.requests.trial.declining') : t('dashboard.tutor.requests.trial.decline')}
                            </button>
                        </div>
                    )}
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200/80">
                    <p className="text-sm text-gray-600 italic">"{request.message}"</p>
                </div>

                {viewMode === 'student' && (
                    <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                        <RequestStatusBadge status={request.status} />
                        {request.status === 'PENDING' && (
                            <button onClick={onCancel} className="text-sm font-semibold text-red-600 hover:underline">
                                {t('dashboard.tutor.requests.trial.cancelRequest')}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
            {toast ? <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} /> : null}
        </>
    );
};

export default TrialRequestCard;