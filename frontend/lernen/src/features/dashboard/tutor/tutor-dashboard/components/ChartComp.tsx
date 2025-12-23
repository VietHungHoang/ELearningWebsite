import React, { useState, useEffect } from 'react';
import RevenueChart from '../components/RevenueChart';
import StudentsChart from '../components/StudentsChart';
import { tutorService } from '../../../../../services/tutorService';
import type { ChartsData } from '../../../../../services/tutorService';

const ChartComp: React.FC = () => {
    const [chartsLoading, setChartsLoading] = useState(true);
    const [chartsData, setChartsData] = useState<ChartsData | null>(null);

    useEffect(() => {
        const loadChartsData = async () => {
            try {
                setChartsLoading(true);
                const response = await tutorService.getTutorChartsData();

                if (response.success && response.data) {
                    setChartsData(response.data);
                }
            } catch (error) {
                console.error('Error loading charts data:', error);
                setChartsData({ incomes: [], students: [] });
            } finally {
                setChartsLoading(false);
            }
        };

        loadChartsData();
    }, []);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {chartsLoading ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                </div>
            ) : (
                <RevenueChart data={chartsData?.incomes || []} />
            )}
            {chartsLoading ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                </div>
            ) : (
                <StudentsChart data={chartsData?.students || []} />
            )}
        </div>
    );
};

export default ChartComp;