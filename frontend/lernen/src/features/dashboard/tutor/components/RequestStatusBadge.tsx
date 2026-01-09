import React from 'react';
import { useTranslation } from 'react-i18next';
import type { RequestStatus } from '../../../../types/api';


interface RequestStatusBadgeProps {
    status: RequestStatus;
}

const RequestStatusBadge: React.FC<RequestStatusBadgeProps> = ({ status }) => {
    const { t } = useTranslation();

    const getStatusColor = (status: RequestStatus): string => {
        switch (status) {
            case 'APPROVED':
            case 'ACCEPTED':
                return 'bg-[#065A46]'; // Primary color - success state (same as active/completed in quiz)
            case 'PENDING':
                return 'bg-[#a16207]'; // Warm amber - working/pending state (same as draft/in_progress in quiz)
            case 'DECLINED':
                return 'bg-[#475569]'; // Dark slate - inactive state (same as archived/not_started in quiz)
            case 'REJECTED':
                return 'bg-[#475569]'; // Dark slate - inactive state (same as declined)
            case 'CANCELLED':
                return 'bg-[#dc2626]'; // Red - cancelled state
            default:
                return 'bg-[#64748b]';
        }
    };

    const statusLabels: Record<RequestStatus, string> = {
        PENDING: t('dashboard.tutor.requests.status.pending'),
        APPROVED: t('dashboard.tutor.requests.status.approved'),
        ACCEPTED: t('dashboard.tutor.requests.status.accepted'),
        DECLINED: t('dashboard.tutor.requests.status.declined'),
        REJECTED: t('dashboard.tutor.requests.status.rejected'),
        CANCELLED: t('dashboard.tutor.requests.status.cancelled'),
    };

    return (
        <div className="absolute top-0 left-0 z-10">
            <div className={`${getStatusColor(status)} text-white text-[10px] font-semibold px-2.5 py-1 rounded-tl-xl rounded-br-lg flex items-center gap-1 shadow-sm`}>
                <div className="w-1 h-1 rounded-full bg-white/80"></div>
                <span className="uppercase tracking-wide">{statusLabels[status]}</span>
            </div>
        </div>
    );
};

export default RequestStatusBadge;