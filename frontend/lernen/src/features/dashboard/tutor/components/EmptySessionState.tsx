import React from 'react';
import { useTranslation } from 'react-i18next';
import { HiCalendar } from 'react-icons/hi';

const EmptySessionState: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4">
                <HiCalendar className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{t("dashboard.tutor.noSessionsTitle")}</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
                {t("dashboard.tutor.noSessionsDescription")}
            </p>
        </div>
    );
};

export default EmptySessionState;
