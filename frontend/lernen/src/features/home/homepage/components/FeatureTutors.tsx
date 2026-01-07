import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface Tutor {
  id: number
  name: string
  teachingSubjects: string
  hourlyRate: number
  rating: number
  reviewCount: number
  activeStudents: number
  videoThumbnail: string
  videoSource: string
  profileImage: string
  subjects: string[]
}

const FeatureTutors: React.FC = () => {
  const { t } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [playingVideos, setPlayingVideos] = useState<{ [key: number]: boolean }>({})
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({})

  const tutors: Tutor[] = [
    {
      id: 1,
      name: "Nguyễn Văn An",
      teachingSubjects: "Toán lớp 9, Toán lớp 10, Toán lớp 11, Lý lớp 10, Lý lớp 11",
      hourlyRate: 400000,
      rating: 4.8,
      reviewCount: 15,
      activeStudents: 8,
      videoThumbnail: "/media/homepage/Anthony Shao.png",
      videoSource: "/media/homepage/tutor-video-1.mp4",
      profileImage: "/media/homepage/Anthony Shao.png",
      subjects: ["Toán", "Lý"]
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      teachingSubjects: "Tiếng Anh lớp 3, Tiếng Anh lớp 4, Tiếng Anh lớp 5, Văn lớp 6, Văn lớp 7",
      hourlyRate: 500000,
      rating: 5.0,
      reviewCount: 23,
      activeStudents: 12,
      videoThumbnail: "/media/homepage/Steven Ford.png",
      videoSource: "/media/homepage/tutor-video-2.mp4",
      profileImage: "/media/homepage/Steven Ford.png",
      subjects: ["Tiếng Anh", "Văn"]
    },
    {
      id: 3,
      name: "Lê Minh Cường",
      teachingSubjects: "Hóa lớp 10, Hóa lớp 11, Hóa lớp 12, Sinh lớp 11, Sinh lớp 12",
      hourlyRate: 350000,
      rating: 4.7,
      reviewCount: 18,
      activeStudents: 6,
      videoThumbnail: "/media/homepage/Anthony Shao.png",
      videoSource: "/media/homepage/tutor-video-3.mp4",
      profileImage: "/media/homepage/Anthony Shao.png",
      subjects: ["Hóa", "Sinh"]
    },
    {
      id: 4,
      name: "Phạm Thị Dung",
      teachingSubjects: "Toán lớp 1, Toán lớp 2, Toán lớp 3, Lý lớp 8, Lý lớp 9",
      hourlyRate: 600000,
      rating: 4.9,
      reviewCount: 31,
      activeStudents: 15,
      videoThumbnail: "/media/homepage/Steven Ford.png",
      videoSource: "/media/homepage/tutor-video-4.mp4",
      profileImage: "/media/homepage/Steven Ford.png",
      subjects: ["Toán", "Lý"]
    },
    {
      id: 5,
      name: "Hoàng Văn Em",
      teachingSubjects: "Văn lớp 8, Văn lớp 9, Sử lớp 10, Sử lớp 11, Địa lớp 10",
      hourlyRate: 300000,
      rating: 4.6,
      reviewCount: 12,
      activeStudents: 5,
      videoThumbnail: "/media/homepage/Anthony Shao.png",
      videoSource: "/media/homepage/tutor-video-1.mp4",
      profileImage: "/media/homepage/Anthony Shao.png",
      subjects: ["Văn", "Sử", "Địa"]
    }
  ]

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const cardWidth = 320 // Approximate card width + gap
      const newIndex = Math.max(0, currentIndex - 1)
      setCurrentIndex(newIndex)
      container.scrollTo({
        left: newIndex * cardWidth,
        behavior: 'smooth'
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const cardWidth = 320 // Approximate card width + gap
      const maxIndex = Math.max(0, tutors.length - 4) // Show 4 cards at once
      const newIndex = Math.min(maxIndex, currentIndex + 1)
      setCurrentIndex(newIndex)
      container.scrollTo({
        left: newIndex * cardWidth,
        behavior: 'smooth'
      })
    }
  }

  const toggleVideo = (tutorId: number) => {
    const video = videoRefs.current[tutorId]
    if (video) {
      if (playingVideos[tutorId]) {
        video.pause()
        setPlayingVideos(prev => ({ ...prev, [tutorId]: false }))
      } else {
        // Pause all other videos
        Object.keys(playingVideos).forEach(id => {
          const otherVideo = videoRefs.current[parseInt(id)]
          if (otherVideo && parseInt(id) !== tutorId) {
            otherVideo.pause()
          }
        })
        setPlayingVideos({ [tutorId]: true })
        video.play()
      }
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ))
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#065A46]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
          <div className="flex-1">
            {/* Subtitle */}
            <div className="flex items-center mb-4">
              <div className="h-px bg-white/30 flex-1"></div>
              <span className="px-4 text-white/80 text-sm font-medium">{t('featureTutors.sectionLabel')}</span>
              <div className="h-px bg-white/30 flex-1"></div>
            </div>
            
            {/* Main Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              {t('featureTutors.title')}
            </h2>
            
            {/* Description */}
            <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
              {t('featureTutors.description')}
            </p>
          </div>
          
          {/* View All Button */}
          <div className="mt-8 lg:mt-0 lg:ml-8">
            <button 
              onClick={() => window.location.href = '/find-tutors'}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {t('featureTutors.viewAllTutors')}
            </button>
          </div>
        </div>

        {/* Tutor Cards Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={scrollLeft}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={scrollRight}
            disabled={currentIndex >= Math.max(0, tutors.length - 4)}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Scrollable Cards */}
          <div
            ref={scrollContainerRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {tutors.map((tutor) => (
              <motion.div
                key={tutor.id}
                className="flex-shrink-0 w-72 bg-white rounded-xl shadow-md overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Video Preview */}
                <div className="relative aspect-video bg-gray-100 cursor-pointer" onClick={() => toggleVideo(tutor.id)}>
                  <video
                    ref={(el) => { videoRefs.current[tutor.id] = el }}
                    className="w-full h-full object-cover"
                    poster={tutor.videoThumbnail}
                    muted
                    loop
                    playsInline
                    onEnded={() => setPlayingVideos(prev => ({ ...prev, [tutor.id]: false }))}
                  >
                    <source src={tutor.videoSource} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  
                  {/* Play/Pause Button Overlay */}
                  {!playingVideos[tutor.id] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <button className="w-16 h-16 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors">
                        <svg className="w-6 h-6 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 7l8 5-8 5V7z" />
                        </svg>
                      </button>
                    </div>
                  )}
                  
                  {/* Video Controls */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-xs">
                    <span>0:00</span>
                    <div className="flex items-center space-x-2">
                      <button className="hover:bg-white/20 rounded p-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                        </svg>
                      </button>
                      <button className="hover:bg-white/20 rounded p-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                        </svg>
                      </button>
                      <button className="hover:bg-white/20 rounded p-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tutor Information */}
                <div className="p-4 flex flex-col flex-1">
                  {/* Profile Section */}
                  <div className="flex items-start space-x-2.5 mb-3">
                    <img
                      src={tutor.profileImage}
                      alt={tutor.name}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-base truncate">{tutor.name}</h3>
                      <p className="text-gray-600 text-xs line-clamp-2">
                        {tutor.teachingSubjects.split(', ').slice(0, 2).join(', ')}
                        {tutor.teachingSubjects.split(', ').length > 2 && '...'}
                      </p>
                    </div>
                  </div>

                  {/* Pricing and Reviews */}
                  <div className="space-y-2 mb-4 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-900">{tutor.hourlyRate.toLocaleString('vi-VN')}₫{t('featureTutors.perHour')}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1.5">
                      <div className="flex items-center space-x-0.5">
                        {renderStars(tutor.rating)}
                      </div>
                      <span className="text-gray-600 text-xs">
                        {tutor.rating.toFixed(1)}/5.0 ({tutor.reviewCount} {t('featureTutors.reviews')})
                      </span>
                    </div>
                    
                    <div className="text-gray-600 text-xs">
                      {tutor.activeStudents} {t('featureTutors.activeStudents')}
                    </div>
                  </div>

                  {/* View Profile Button */}
                  <button className="w-full bg-[#065A46] hover:bg-[#054A3A] text-white py-2.5 rounded-lg font-semibold text-sm transition-colors mt-auto">
                    {t('featureTutors.viewProfile')}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeatureTutors
