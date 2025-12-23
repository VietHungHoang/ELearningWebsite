import React from 'react';
import { useTranslation } from 'react-i18next';
import { HiUserAdd, HiStar, HiCheckCircle, HiCurrencyDollar } from 'react-icons/hi';
import { formatDistanceToNow } from 'date-fns';
import type { Activity } from '../../types';

interface RecentActivityProps {
    activities: Activity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
    const { t } = useTranslation();
    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'enrollment':
                return <HiUserAdd className="w-5 h-5 text-blue-600" />;
            case 'review':
                return <HiStar className="w-5 h-5 text-yellow-600" />;
            case 'completion':
                return <HiCheckCircle className="w-5 h-5 text-green-600" />;
            case 'payment':
                return <HiCurrencyDollar className="w-5 h-5 text-emerald-600" />;
            default:
                return null;
        }
    };

    const getActivityBgColor = (type: string) => {
        switch (type) {
            case 'enrollment':
                return 'bg-blue-100';
            case 'review':
                return 'bg-yellow-100';
            case 'completion':
                return 'bg-green-100';
            case 'payment':
                return 'bg-emerald-100';
            default:
                return 'bg-gray-100';
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{t('dashboard.common.recentActivity')}</h3>

            <div className="space-y-4">
                {activities.map((activity, index) => (
                    <div key={activity.id} className="relative">
                        {/* Timeline line */}
                        {index !== activities.length - 1 && (
                            <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200"></div>
                        )}

                        <div className="flex gap-4 items-start">
                            {/* Icon */}
                            <div className={`${getActivityBgColor(activity.type)} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                                {getActivityIcon(activity.type)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800">{activity.title}</p>
                                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>

                                        {/* Metadata */}
                                        {activity.metadata && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {activity.metadata.rating && (
                                                    <div className="flex items-center gap-1 text-xs bg-yellow-50 px-2 py-1 rounded-md">
                                                        <HiStar className="w-3 h-3 text-yellow-500" />
                                                        <span className="font-semibold text-yellow-700">{activity.metadata.rating}/5</span>
                                                    </div>
                                                )}
                                                {activity.metadata.amount && (
                                                    <div className="text-xs bg-green-50 px-2 py-1 rounded-md font-semibold text-green-700">
                                                        +${activity.metadata.amount}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <span className="text-xs text-gray-400 whitespace-nowrap">
                                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {activities.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-400">{t('dashboard.common.noRecentActivity')}</p>
                </div>
            )}
        </div>
    );
};

export default RecentActivity;
