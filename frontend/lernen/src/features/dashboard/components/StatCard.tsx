import React from 'react';
import type { IconType } from 'react-icons';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: IconType;
    borderColor: string;
    bgColor: string;
    loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon: Icon,
    borderColor,
    bgColor,
    loading = false
}) => {
    return (
        <div className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${borderColor}`}>
            {loading ? (
                <div className="animate-pulse">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="h-6 bg-gray-200 rounded w-20 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-32"></div>
                        </div>
                        <div className={`bg-gray-200 p-3 rounded-lg`}>
                            <div className="w-5 h-5 bg-gray-300 rounded"></div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800">{value}</h3>
                        <p className="text-sm font-medium text-gray-500 mt-1">{title}</p>
                    </div>
                    <div className={`${bgColor} p-3 rounded-lg`}>
                        <Icon className="w-5 h-5" style={{ color: borderColor.replace('border-l-', '') }} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default StatCard;