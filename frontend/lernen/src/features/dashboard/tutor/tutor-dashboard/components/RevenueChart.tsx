import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency, convertFromVND } from '../../../../../utils/currencyHelper';
import { useCurrency } from '../../../../../context/CurrencyContext';
import { useTranslation } from 'react-i18next';

interface RevenueChartProps {
    data: Array<{ month: string; income: number }>; // month format: "YYYY-MM"
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
    const [viewMode, setViewMode] = useState<'6months' | '12months'>('6months');
    const { selectedCurrency } = useCurrency();
    const { t } = useTranslation();

    // Function to convert month string (YYYY-MM) to display name
    const getMonthDisplayName = (monthString: string): string => {
        const month = monthString.split('-')[1];
        return t(`dashboard.common.months.${month}`, monthString);
    };

    // Map data to include display names
    const mappedData = data.map(item => ({
        ...item,
        displayMonth: getMonthDisplayName(item.month)
    }));

    const displayData = viewMode === '6months' ? mappedData.slice(-6) : mappedData;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">{t('dashboard.tutor.revenueChart.title')}</h3>
                    <p className="text-sm text-gray-500 mt-1">{t('dashboard.tutor.revenueChart.description')}</p>
                </div>
                <div className="bg-gray-100 p-1 rounded-xl inline-flex items-center gap-1">
                    <button
                        onClick={() => setViewMode('6months')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${viewMode === '6months'
                                ? 'bg-white text-gray-800 shadow-sm'
                                : 'text-gray-500 hover:bg-white/50'
                            }`}
                    >
                        {t('dashboard.tutor.revenueChart.sixMonths')}
                    </button>
                    <button
                        onClick={() => setViewMode('12months')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${viewMode === '12months'
                                ? 'bg-white text-gray-800 shadow-sm'
                                : 'text-gray-500 hover:bg-white/50'
                            }`}
                    >
                        {t('dashboard.tutor.revenueChart.twelveMonths')}
                    </button>
                </div>
            </div>

            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={displayData}>
                        <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="displayMonth"
                            stroke="#9ca3af"
                            style={{ fontSize: '12px', fontWeight: '500' }}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            style={{ fontSize: '12px', fontWeight: '500' }}
                            tickFormatter={(value) => formatCurrency(convertFromVND(value, selectedCurrency), selectedCurrency, false)}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                border: 'none',
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                padding: '12px'
                            }}
                            formatter={(value: number) => [formatCurrency(convertFromVND(value, selectedCurrency), selectedCurrency), t('dashboard.tutor.revenueChart.revenue')]}
                        />
                        <Area
                            type="monotone"
                            dataKey="income"
                            stroke="#059669"
                            strokeWidth={3}
                            fill="url(#revenueGradient)"
                            animationDuration={1000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RevenueChart;
