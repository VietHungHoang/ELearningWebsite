import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface Tutor {
  id: number
  name: string
  degree: string
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
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [playingVideos, setPlayingVideos] = useState<{ [key: number]: boolean }>({})
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({})

  const tutors: Tutor[] = [
    {
      id: 1,
      name: "Inocencia",
      degree: "Bachelor of Computer Science",
      hourlyRate: 40.00,
      rating: 0.0,
      reviewCount: 0,
      activeStudents: 0,
      videoThumbnail: "/media/homepage/Anthony Shao.png",
      videoSource: "/media/homepage/tutor-video-1.mp4",
      profileImage: "/media/homepage/Anthony Shao.png",
      subjects: ["Computer Science", "Programming"]
    },
    {
      id: 2,
      name: "Antony Clara",
      degree: "Bachelor of Computer Science",
      hourlyRate: 20.00,
      rating: 5.0,
      reviewCount: 2,
      activeStudents: 3,
      videoThumbnail: "/media/homepage/Steven Ford.png",
      videoSource: "/media/homepage/tutor-video-2.mp4",
      profileImage: "/media/homepage/Steven Ford.png",
      subjects: ["Computer Science", "Web Development"]
    },
    {
      id: 3,
      name: "Simonth Chapman",
      degree: "Bachelor of Computer Science",
      hourlyRate: 20.00,
      rating: 4.0,
      reviewCount: 1,
      activeStudents: 1,
      videoThumbnail: "/media/homepage/Anthony Shao.png",
      videoSource: "/media/homepage/tutor-video-3.mp4",
      profileImage: "/media/homepage/Anthony Shao.png",
      subjects: ["Computer Science", "Data Science"]
    },
    {
      id: 4,
      name: "Swinney Swinney",
      degree: "Bachelor of Computer Science",
      hourlyRate: 40.00,
      rating: 4.0,
      reviewCount: 1,
      activeStudents: 1,
      videoThumbnail: "/media/homepage/Steven Ford.png",
      videoSource: "/media/homepage/tutor-video-4.mp4",
      profileImage: "/media/homepage/Steven Ford.png",
      subjects: ["Computer Science", "AI/ML"]
    },
    {
      id: 5,
      name: "John Smith",
      degree: "Bachelor of Computer Science",
      hourlyRate: 20.00,
      rating: 4.0,
      reviewCount: 3,
      activeStudents: 2,
      videoThumbnail: "/media/homepage/Anthony Shao.png",
      videoSource: "/media/homepage/tutor-video-1.mp4",
      profileImage: "/media/homepage/Anthony Shao.png",
      subjects: ["Computer Science", "Mobile Development"]
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
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
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
              <span className="px-4 text-white/80 text-sm font-medium">Feature Tutors</span>
              <div className="h-px bg-white/30 flex-1"></div>
            </div>
            
            {/* Main Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Explore Our Handpicked Tutors
            </h2>
            
            {/* Description */}
            <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
              Explore a wealth of articles, guides, tutorials, and more, curated by our experts to enhance your learning experience.
            </p>
          </div>
          
          {/* View All Button */}
          <div className="mt-8 lg:mt-0 lg:ml-8">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              View All Tutors
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
                className="flex-shrink-0 w-80 bg-white rounded-xl shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Video Preview */}
                <div className="relative aspect-video bg-gray-100 cursor-pointer" onClick={() => toggleVideo(tutor.id)}>
                  <video
                    ref={(el) => (videoRefs.current[tutor.id] = el)}
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
                <div className="p-6">
                  {/* Profile Section */}
                  <div className="flex items-start space-x-3 mb-4">
                    <img
                      src={tutor.profileImage}
                      alt={tutor.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{tutor.name}</h3>
                      <p className="text-gray-600 text-sm">{tutor.degree}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Reviews */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">${tutor.hourlyRate.toFixed(2)}/hr</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {renderStars(tutor.rating)}
                      </div>
                      <span className="text-gray-600 text-sm">
                        {tutor.rating.toFixed(1)}/5.0 ({tutor.reviewCount} reviews)
                      </span>
                    </div>
                    
                    <div className="text-gray-600 text-sm">
                      {tutor.activeStudents} Active Students
                    </div>
                  </div>

                  {/* View Profile Button */}
                  <button className="w-full bg-[#065A46] hover:bg-[#054A3A] text-white py-3 rounded-lg font-semibold transition-colors">
                    View Profile
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
