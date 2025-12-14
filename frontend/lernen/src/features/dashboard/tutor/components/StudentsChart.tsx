import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StudentsChartProps {
    data: Array<{ month: string; students: number }>;
}

const StudentsChart: React.FC<StudentsChartProps> = ({ data }) => {
    const [viewMode, setViewMode] = useState<'6months' | '12months'>('6months');

    const displayData = viewMode === '6months' ? data.slice(-6) : data;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">Students Growth</h3>
                    <p className="text-sm text-gray-500 mt-1">Track your student enrollment over time</p>
                </div>
                <div className="bg-gray-100 p-1 rounded-xl inline-flex items-center gap-1">
                    <button
                        onClick={() => setViewMode('6months')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${viewMode === '6months'
                                ? 'bg-white text-gray-800 shadow-sm'
                                : 'text-gray-500 hover:bg-white/50'
                            }`}
                    >
                        6 Months
                    </button>
                    <button
                        onClick={() => setViewMode('12months')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${viewMode === '12months'
                                ? 'bg-white text-gray-800 shadow-sm'
                                : 'text-gray-500 hover:bg-white/50'
                            }`}
                    >
                        12 Months
                    </button>
                </div>
            </div>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={displayData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="month"
                            stroke="#9ca3af"
                            style={{ fontSize: '12px', fontWeight: '500' }}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            style={{ fontSize: '12px', fontWeight: '500' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                border: 'none',
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                padding: '12px'
                            }}
                            formatter={(value: number) => [value, 'Students']}
                        />
                        <Line
                            type="monotone"
                            dataKey="students"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ fill: '#3b82f6', r: 4 }}
                            activeDot={{ r: 6 }}
                            animationDuration={1000}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default StudentsChart;
