import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const WhyChooseUs = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: '🗓️',
      title: t('whyChooseUs.features.flexibleScheduling.title'),
      description: t('whyChooseUs.features.flexibleScheduling.description')
    },
    {
      icon: '👨‍🏫',
      title: t('whyChooseUs.features.expertTutors.title'),
      description: t('whyChooseUs.features.expertTutors.description')
    },
    {
      icon: '💰',
      title: t('whyChooseUs.features.affordableRates.title'),
      description: t('whyChooseUs.features.affordableRates.description')
    },
    {
      icon: '📚',
      title: t('whyChooseUs.features.personalizedLearning.title'),
      description: t('whyChooseUs.features.personalizedLearning.description')
    },
    {
      icon: '🎯',
      title: t('whyChooseUs.features.wideRangeSubjects.title'),
      description: t('whyChooseUs.features.wideRangeSubjects.description')
    },
    {
      icon: '🌍',
      title: t('whyChooseUs.features.learnersCommunity.title'),
      description: t('whyChooseUs.features.learnersCommunity.description')
    }
  ]

  return (
    <section className="relative bg-gradient-to-br from-[#065A46] via-[#065A46] to-[#054A3A] py-20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#065A46]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#065A46]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-[#065A46]/10 rounded-full blur-2xl"></div>
      </div>

      {/* Sparkle decorations */}
      <div className="absolute top-20 right-1/4 text-yellow-400 animate-pulse">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5L12 2z"/>
        </svg>
      </div>
      <div className="absolute bottom-32 left-1/4 text-yellow-300 animate-pulse" style={{ animationDelay: '1s' }}>
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5L12 2z"/>
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            {/* Icon header */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400/20 backdrop-blur rounded-2xl border border-yellow-400/30">
              <span className="text-2xl">📋</span>
            </div>

            {/* Section label */}
            <div className="flex items-center space-x-4">
              <div className="h-px w-12 bg-white/30"></div>
              <span className="text-white/80 text-sm font-medium tracking-wider uppercase">{t('whyChooseUs.sectionLabel')}</span>
              <div className="h-px w-12 bg-white/30"></div>
            </div>

            {/* Main heading */}
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                {t('whyChooseUs.title')}
              </h2>
              <p className="text-white/80 text-lg">
                {t('whyChooseUs.description')}
              </p>
            </div>

            {/* Features list */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-start space-x-3 group cursor-pointer transition-all duration-200 hover:translate-x-1"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#065A46]/20 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-white/80" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-white/90 group-hover:text-white transition-colors">
                    {feature.title}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Link
                to="/get-started"
                className="inline-flex items-center px-8 py-3.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-all duration-200 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105"
              >
                {t('whyChooseUs.getStarted')}
              </Link>
            </div>
          </div>

          {/* Right content - Simple image */}
          <div className="relative lg:pl-8">
            <div className="relative">
              <img 
                src="/media/homepage/homepage-laptop.png" 
                alt="Lernen Platform"
                className="w-full h-auto rounded-2xl shadow-2xl"
                style={{ objectPosition: 'center 25%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs