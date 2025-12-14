import React from 'react';
import { FiSearch, FiChevronDown } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import IntroducePanel from '../../../../components/auth/IntroducePanel';

const Hero: React.FC = () => {
  const { t } = useTranslation();
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight - 100,
      behavior: 'smooth'
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[52%_48%] gap-30 items-center">
        {/* Left Column */}
        <div className="text-center lg:text-left">
          {/* Badge */}
          <div className="inline-flex items-center bg-gray-100 rounded-full px-4 py-1.5 text-sm font-semibold text-gray-700 animate-fade-in-up">
            <span className="text-lg mr-1.5">✨</span>
            <span className="bg-gradient-to-r from-[#0b6459] to-teal-600 bg-clip-text text-transparent">
              {t('home.hero.badge')}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 mt-5 leading-tight animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <span className="bg-gradient-to-r from-[#0b6459] via-teal-600 to-[#0b6459] bg-clip-text text-transparent">
              {t('home.hero.title')}
            </span>{' '}
            <br />
            <span className="text-gray-700">{t('home.hero.subtitle')}</span>
          </h1>

          {/* Subheading */}
          <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {t('home.hero.description', { expertTutors: t('home.hero.expertTutors') })}
          </p>

          {/* Search Bar */}
          <div className="mt-6 relative max-w-lg mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="relative group">
              <input
                type="text"
                placeholder={t('home.hero.searchPlaceholder')}
                className="w-full pl-5 pr-16 py-3.5 text-base bg-white border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0b6459] focus:border-transparent transition-all hover:shadow-md placeholder-gray-400"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-gradient-to-r from-[#0b6459] to-teal-600 hover:from-teal-600 hover:to-[#0b6459] rounded-lg flex items-center justify-center transition-all hover:scale-105 shadow-md">
                <FiSearch size={20} color='white' />
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500 flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <span>{t('home.hero.tutorsOnline', { count: 500 })}</span>
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-gray-600 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <div className="flex items-center gap-1.5">
              <span className="text-yellow-500 text-sm">★★★★★</span>
              <span className="font-semibold">{t('home.hero.rating')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg">🎓</span>
              <span className="font-semibold">{t('home.hero.studentsCount')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg">🏆</span>
              <span className="font-semibold">{t('home.hero.certifiedTutors')}</span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="relative flex items-center justify-center lg:justify-start">
          <div className="transform animate-fade-in-up w-full max-w-md" style={{ animationDelay: '0.3s' }}>
            <IntroducePanel />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="flex justify-center mt-8">
        <button
          onClick={scrollToContent}
          className="animate-bounce cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-full p-2 shadow-sm transition-all"
          aria-label="Scroll to content"
        >
          <FiChevronDown size={20} className="text-[#0b6459]" />
        </button>
      </div>
    </section>
  );
};

export default Hero;