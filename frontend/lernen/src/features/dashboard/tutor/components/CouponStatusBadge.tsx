import React from 'react';
import type { CouponStatus } from '../pages/DealsAndCouponsPage';
import { useTranslation } from 'react-i18next';

interface CouponStatusBadgeProps {
  status: CouponStatus;
}

const CouponStatusBadge: React.FC<CouponStatusBadgeProps> = ({ status }) => {
    const { t } = useTranslation();
    const statusLabels: Record<CouponStatus, string> = {
        Active: t('dashboard.tutor.dealsCoupons.status.active'),
        Expired: t('dashboard.tutor.dealsCoupons.status.expired'),
        Inactive: t('dashboard.tutor.dealsCoupons.status.inactive'),
    };

    const getStatusColor = (status: CouponStatus) => {
        switch (status) {
            case 'Active':
                return 'bg-green-500';
            case 'Expired':
                return 'bg-red-500';
            case 'Inactive':
                return 'bg-gray-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <span className="inline-flex items-center gap-1.5 px-2.25 py-0.5 rounded-full bg-white border border-gray-300 text-xs font-medium text-gray-800">
            <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(status)}`}></span>
            {statusLabels[status]}
        </span>
    );
};

export default CouponStatusBadge;
