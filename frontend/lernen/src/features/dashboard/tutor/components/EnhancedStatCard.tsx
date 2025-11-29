import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface EnhancedStatCardProps {
    icon: React.ReactNode;
    title: string;
    value: string;
    change: string;
    isPositive: boolean;
    gradient: string;
    chartData: Array<{ value: number }>;
}

const EnhancedStatCard: React.FC<EnhancedStatCardProps> = ({
    icon,
    title,
    value,
    change,
    isPositive,
    gradient,
    chartData
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 p-6 relative overflow-hidden group">
            {/* Background Gradient Overlay */}
            <div className={`absolute top-0 right-0 w-32 h-32 ${gradient} opacity-10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:opacity-20 transition-opacity duration-300`}></div>

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-2">{title}</p>
                        <p className="text-3xl font-bold text-gray-800">{value}</p>
                        <div className="flex items-center gap-1 mt-2">
                            <span className={`text-xs font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                {isPositive ? '↑' : '↓'} {change}
                            </span>
                            <span className="text-xs text-gray-400">vs last month</span>
                        </div>
                    </div>
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${gradient} shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <div className="text-white">
                            {icon}
                        </div>
                    </div>
                </div>

                {/* Mini Sparkline Chart */}
                <div className="h-16 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke={isPositive ? "#10B981" : "#EF4444"}
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default EnhancedStatCard;
