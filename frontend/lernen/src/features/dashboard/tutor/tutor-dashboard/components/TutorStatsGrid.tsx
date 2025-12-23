import React, { useState, useEffect } from 'react';
import { HiCurrencyDollar, HiUserGroup, HiClock, HiDocumentText } from 'react-icons/hi';
import StatCard from '../../../components/StatCard';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../../../../../context/CurrencyContext';
import { formatCurrency, convertFromVND } from '../../../../../utils/currencyHelper';
import { tutorService } from '../../../../../services/tutorService';

// Types for API responses
interface StatsData {
    totalEarnings: number;
    totalStudents: number;
    teachingHours: number;
    newReviews: number;
}

const TutorStatsGrid: React.FC<{ timePeriod: 'this month' | 'all' }> = ({ timePeriod }) => {
    const { t } = useTranslation();
    const { selectedCurrency } = useCurrency();

    // Component-specific state
    const [statsLoading, setStatsLoading] = useState(true);
    const [statsData, setStatsData] = useState<StatsData | null>(null);

    useEffect(() => {
        const loadStats = async () => {
            try {
                setStatsLoading(true);
                const isAll = timePeriod === 'all';
                const response = await tutorService.getTutorStats(isAll);
                if (response.success && response.data) {
                    setStatsData(response.data);
                } else {
                    throw new Error(response.message || 'Failed to fetch stats');
                }
                setStatsLoading(false);
            } catch (error) {
                console.error('Error loading stats:', error);
                setStatsLoading(false);
            }
        };

        loadStats();
    }, [timePeriod]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
                title={t('dashboard.tutor.totalEarnings')}
                value={formatCurrency(convertFromVND(statsData?.totalEarnings || 0, selectedCurrency), selectedCurrency)}
                icon={HiCurrencyDollar}
                borderColor="border-l-[#0b6459]"
                bgColor="bg-[#0b6459]/10"
                loading={statsLoading}
            />

            <StatCard
                title={t('dashboard.tutor.totalStudents')}
                value={statsData?.totalStudents || 0}
                icon={HiUserGroup}
                borderColor="border-l-blue-600"
                bgColor="bg-blue-100"
                loading={statsLoading}
            />

            <StatCard
                title={t('dashboard.tutor.teachingHours')}
                value={statsData?.teachingHours || 0}
                icon={HiClock}
                borderColor="border-l-amber-600"
                bgColor="bg-amber-100"
                loading={statsLoading}
            />

            <StatCard
                title={t('dashboard.tutor.newReviews')}
                value={statsData?.newReviews || 0}
                icon={HiDocumentText}
                borderColor="border-l-purple-600"
                bgColor="bg-purple-100"
                loading={statsLoading}
            />
        </div>
    );
};

export default TutorStatsGrid;