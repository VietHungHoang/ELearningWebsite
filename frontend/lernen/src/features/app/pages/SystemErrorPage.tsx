import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SystemErrorPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">{t('errors.systemError.title')}</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">{t('errors.systemError.subtitle')}</h2>
        <p className="text-gray-600 mb-8">
          {t('errors.systemError.description')}
        </p>
        <Link
          to="/"
          className="inline-block bg-[#0b6459] text-white px-6 py-3 rounded-lg hover:bg-[#084c43] transition-colors"
        >
          {t('errors.systemError.goHome')}
        </Link>
      </div>
    </div>
  );
};

export default SystemErrorPage;
