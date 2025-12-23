import React, { useState, useEffect, useRef } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import TutorStatsGrid from './components/TutorStatsGrid';
import { useBreadcrumb } from '../../context/BreadcrumbContext';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../context/AuthContext';
import ScheduleAndCalendar from './components/ScheduleAndCalendar';
import ChartComp from './components/ChartComp';

// Types for API responses
// (Charts data is now handled by ChartComp component)

// Mock data for recent activity
// (Removed - charts data is now handled by ChartComp component)

const TutorDashboardPage: React.FC = () => {
    const [timePeriod, setTimePeriod] = useState<'this month' | 'all'>('this month');
    const [isTimePeriodOpen, setIsTimePeriodOpen] = useState(false);
    const timePeriodRef = useRef<HTMLDivElement>(null);
    const { setBreadcrumb } = useBreadcrumb();
    const { t } = useTranslation();
    const { state } = useAuth();

    // API loading states
    // (Charts loading is now handled by ChartComp component)

    // API data states
    // (Charts data is now handled by ChartComp component)

    useEffect(() => {
        setBreadcrumb([
            { label: t('dashboard.header.breadcrumb.dashboard'), path: '/dashboard' },
            { label: t('dashboard.header.breadcrumb.analysis') }
        ]);

        // Fetch charts data is now handled by ChartComp component
    }, []);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (timePeriodRef.current && !timePeriodRef.current.contains(event.target as Node)) {
                setIsTimePeriodOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getTimePeriodDisplayText = (period: string) => {
        switch (period) {
            case 'this month':
                return t('dashboard.tutor.thisMonth');
            case 'all':
                return t('dashboard.tutor.all');
            default:
                return period;
        }
    };

    return (
        <div className="min-h-screen p-4 mt-2 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-3">
                <h1 className="text-2xl font-bold text-gray-800">
                    {t('dashboard.tutor.welcome')}, {state.user?.name || 'User'}! 👋
                </h1>
                <div className="flex items-center justify-between">
                    <p className="text-gray-500">{t('dashboard.tutor.overview')}</p>

                    {/* Time */}
                    <div className="relative" ref={timePeriodRef}>
                        <button
                            onClick={() => setIsTimePeriodOpen(!isTimePeriodOpen)}
                            className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <span>{getTimePeriodDisplayText(timePeriod)}</span>
                            <HiChevronDown className={`w-4 h-4 transition-transform ${isTimePeriodOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isTimePeriodOpen && (
                            <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-lg shadow-xl z-50 p-2 border border-gray-100">
                                <ul className="space-y-1">
                                    <li
                                        onClick={() => {
                                            setTimePeriod('this month');
                                            setIsTimePeriodOpen(false);
                                        }}
                                        className={`p-2 text-sm font-medium text-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 text-center ${
                                            timePeriod === 'this month' ? 'bg-gray-100' : ''
                                        }`}
                                    >
                                        {t('dashboard.tutor.thisMonth')}
                                    </li>
                                    <li
                                        onClick={() => {
                                            setTimePeriod('all');
                                            setIsTimePeriodOpen(false);
                                        }}
                                        className={`p-2 text-sm font-medium text-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 text-center ${
                                            timePeriod === 'all' ? 'bg-gray-100' : ''
                                        }`}
                                    >
                                        {t('dashboard.tutor.all')}
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <TutorStatsGrid timePeriod={timePeriod} />
            <ScheduleAndCalendar />

            <ChartComp />

            {/* Recent Activity */}
            {/* <div>
                <RecentActivity activities={recentActivities} />
            </div> */}
        </div >
    );
};

export default TutorDashboardPage;