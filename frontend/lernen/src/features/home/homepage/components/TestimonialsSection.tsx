import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Testimonial {
  id: number
  text: string
  name: string
  title: string
  profileImage: string
  companyIcon: string
  companyName: string
}

const TestimonialsSection: React.FC = () => {
  const { t } = useTranslation();
  const [expandedCards, setExpandedCards] = useState<{ [key: number]: boolean }>({});

  const testimonials: Testimonial[] = [
    {
      id: 1,
      text: t('testimonials.items.0.text'),
      name: t('testimonials.items.0.name'),
      title: t('testimonials.items.0.title'),
      profileImage: "/media/homepage/Anthony Shao.png",
      companyIcon: "A",
      companyName: t('testimonials.items.0.companyName')
    },
    {
      id: 2,
      text: t('testimonials.items.1.text'),
      name: t('testimonials.items.1.name'),
      title: t('testimonials.items.1.title'),
      profileImage: "/media/homepage/Steven Ford.png",
      companyIcon: "L",
      companyName: t('testimonials.items.1.companyName')
    },
    {
      id: 3,
      text: t('testimonials.items.2.text'),
      name: t('testimonials.items.2.name'),
      title: t('testimonials.items.2.title'),
      profileImage: "/media/homepage/Anthony Shao.png",
      companyIcon: "W",
      companyName: t('testimonials.items.2.companyName')
    },
    {
      id: 4,
      text: t('testimonials.items.3.text'),
      name: t('testimonials.items.3.name'),
      title: t('testimonials.items.3.title'),
      profileImage: "/media/homepage/Steven Ford.png",
      companyIcon: "X",
      companyName: t('testimonials.items.3.companyName')
    },
    {
      id: 5,
      text: t('testimonials.items.4.text'),
      name: t('testimonials.items.4.name'),
      title: t('testimonials.items.4.title'),
      profileImage: "/media/homepage/Anthony Shao.png",
      companyIcon: "G",
      companyName: t('testimonials.items.4.companyName')
    },
    {
      id: 6,
      text: t('testimonials.items.5.text'),
      name: t('testimonials.items.5.name'),
      title: t('testimonials.items.5.title'),
      profileImage: "/media/homepage/Steven Ford.png",
      companyIcon: "E",
      companyName: t('testimonials.items.5.companyName')
    }
  ]

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className="w-4 h-4 text-yellow-400"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ))
  }


  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          {/* Subtitle */}
          <div className="flex items-center justify-center mb-4">
            <div className="h-px bg-[#065A46] flex-1 max-w-20"></div>
            <span className="px-4 text-[#065A46] text-sm font-medium">{t('testimonials.sectionLabel')}</span>
            <div className="h-px bg-[#065A46] flex-1 max-w-20"></div>
          </div>
          
          {/* Main Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t('testimonials.title')}
          </h2>
          
          {/* Description */}
          <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
            {t('testimonials.description')}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              {/* Review Text */}
              <p className={`text-gray-700 leading-relaxed mb-2 text-sm ${expandedCards[testimonial.id] ? '' : 'line-clamp-3'}`}>
                "{testimonial.text}"
              </p>
              
              {/* Expand/Collapse Button */}
              {testimonial.text.length > 150 && (
                <button
                  onClick={() => setExpandedCards(prev => ({ ...prev, [testimonial.id]: !prev[testimonial.id] }))}
                  className="text-[#065A46] text-xs font-medium mb-2 hover:underline self-start"
                >
                  {expandedCards[testimonial.id] ? 'Thu gọn' : 'Xem thêm'}
                </button>
              )}
              
              {/* Star Rating */}
              <div className="flex items-center space-x-1 mb-3">
                {renderStars()}
              </div>
              
              {/* Reviewer Information */}
              <div className="flex items-center">
                <div className="flex items-center space-x-3">
                  {/* Profile Picture */}
                  <img
                    src={testimonial.profileImage}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  
                  {/* Name and Title */}
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{testimonial.name}</h4>
                    <p className="text-gray-600 text-xs">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
