import React from 'react';
import { HiStar } from 'react-icons/hi';

interface QuickStatsProps {
    averageRating: number;
    totalReviews: number;
    completionRate: number;
    responseTime: string;
}

const QuickStats: React.FC<QuickStatsProps> = ({
    averageRating,
    totalReviews,
    completionRate,
    responseTime
}) => {
    return (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl shadow-lg p-6 border border-emerald-100 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Stats</h3>

            <div className="space-y-4">
                {/* Average Rating */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">Average Rating</span>
                        <span className="text-2xl font-bold text-gray-800">{averageRating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <HiStar
                                key={star}
                                className={`w-5 h-5 ${star <= Math.floor(averageRating)
                                        ? 'text-yellow-400 fill-current'
                                        : star - 0.5 <= averageRating
                                            ? 'text-yellow-400 fill-current opacity-50'
                                            : 'text-gray-300'
                                    }`}
                            />
                        ))}
                        <span className="text-xs text-gray-500 ml-2">({totalReviews} reviews)</span>
                    </div>
                </div>

                {/* Completion Rate */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">Course Completion</span>
                        <span className="text-lg font-bold text-gray-800">{completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full transition-all duration-500 shadow-sm"
                            style={{ width: `${completionRate}%` }}
                        ></div>
                    </div>
                </div>

                {/* Response Time */}
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Avg. Response Time</span>
                        <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            {responseTime}
                        </span>
                    </div>
                </div>

                {/* Highlights Badge */}
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-4 text-white">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🏆</span>
                        <div>
                            <p className="text-sm font-semibold">This Month's Highlight</p>
                            <p className="text-xs opacity-90">Top rated tutor in your category!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickStats;
