import React from 'react';

interface CalendarSkeletonProps {
    view: 'Daily' | 'Weekly' | 'Monthly';
}

const CalendarSkeleton: React.FC<CalendarSkeletonProps> = ({ view }) => {
    if (view === 'Daily') {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="animate-pulse">
                    {/* Header skeleton */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="h-8 bg-gray-200 rounded w-48"></div>
                        <div className="h-6 bg-gray-200 rounded w-32"></div>
                    </div>

                    {/* Time slots skeleton */}
                    <div className="space-y-4">
                        {Array.from({ length: 12 }).map((_, index) => (
                            <div key={index} className="flex items-center space-x-4">
                                <div className="h-4 bg-gray-200 rounded w-16"></div>
                                <div className="flex-1 h-12 bg-gray-100 rounded border border-gray-200"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (view === 'Weekly') {
        return (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="animate-pulse">
                    {/* Header skeleton */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <div className="h-6 bg-gray-200 rounded w-32"></div>
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </div>
                    </div>

                    {/* Days header skeleton */}
                    <div className="grid grid-cols-8 border-b border-gray-200">
                        <div className="p-4 border-r border-gray-200">
                            <div className="h-4 bg-gray-200 rounded w-12"></div>
                        </div>
                        {Array.from({ length: 7 }).map((_, index) => (
                            <div key={index} className="p-4 border-r border-gray-200 last:border-r-0">
                                <div className="h-4 bg-gray-200 rounded w-8 mb-1"></div>
                                <div className="h-3 bg-gray-200 rounded w-6"></div>
                            </div>
                        ))}
                    </div>

                    {/* Time slots skeleton */}
                    <div className="max-h-96 overflow-y-auto">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div key={index} className="grid grid-cols-8 border-b border-gray-200">
                                <div className="p-4 border-r border-gray-200">
                                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                                </div>
                                {Array.from({ length: 7 }).map((_, dayIndex) => (
                                    <div key={dayIndex} className="p-4 border-r border-gray-200 last:border-r-0 min-h-[60px]">
                                        {Math.random() > 0.7 && (
                                            <div className="h-8 bg-gray-100 rounded mb-1"></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Monthly view
    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="animate-pulse">
                {/* Header skeleton */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div className="h-6 bg-gray-200 rounded w-32"></div>
                        <div className="flex space-x-2">
                            {Array.from({ length: 7 }).map((_, index) => (
                                <div key={index} className="h-6 bg-gray-200 rounded w-12"></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Days header skeleton */}
                <div className="grid grid-cols-7 border-b border-gray-200">
                    {Array.from({ length: 7 }).map((_, index) => (
                        <div key={index} className="p-4 border-r border-gray-200 last:border-r-0 text-center">
                            <div className="h-4 bg-gray-200 rounded w-8 mx-auto"></div>
                        </div>
                    ))}
                </div>

                {/* Calendar grid skeleton */}
                <div className="grid grid-cols-7">
                    {Array.from({ length: 35 }).map((_, index) => (
                        <div key={index} className="min-h-[120px] border-r border-b border-gray-200 p-2">
                            <div className="h-4 bg-gray-200 rounded w-6 mb-2"></div>
                            <div className="space-y-1">
                                {Math.random() > 0.8 && (
                                    <div className="h-6 bg-gray-100 rounded"></div>
                                )}
                                {Math.random() > 0.9 && (
                                    <div className="h-6 bg-gray-100 rounded"></div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CalendarSkeleton;