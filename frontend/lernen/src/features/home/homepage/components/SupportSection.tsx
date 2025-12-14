import React from 'react'
import { useTranslation } from 'react-i18next'

const SupportSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Illustration */}
          <div className="relative">
            <div className="relative w-full h-96 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden">
              <img
                src="/media/homepage/support.png"
                alt="Support illustration"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div>
            <div className="text-[#065A46] text-sm font-semibold uppercase tracking-wide mb-4">
              {t('support.sectionLabel')}
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t('support.title')}
            </h2>
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>
                {t('support.description1')}
              </p>
              <p>
                {t('support.description2')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SupportSection
