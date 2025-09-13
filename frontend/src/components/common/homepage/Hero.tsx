import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Hero: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }
  return (
    <section className="py-10 sm:py-14 lg:py-16 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14 items-center">
        {/* Left column - Larger */}
        <div className="lg:col-span-2">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full bg-gray-100 border border-gray-200 px-4 py-2 text-sm text-gray-800 shadow-sm">
            <span className="mr-2">👍</span>
            100% Brighter Learning Platform
          </div>

          {/* Heading */}
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            <span className="text-[#065A46]">Empower Your Future:</span>
            <br />
            <span className="text-gray-900">Learning Today for a</span>
            <br />
            <span className="text-gray-900">Brighter Tomorrow</span>
          </h1>

          {/* Subtext */}
          <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed max-w-xl">
            Achieve your goals with personalized tutoring from top experts. Connect with dedicated tutors for
            success.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-lg flex">
            <input
              type="text"
              placeholder="Search for tutors by subject..."
              className="flex-1 rounded-l-lg bg-gray-100 border border-gray-200 px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#065A46] focus:border-transparent"
            />
            <button
              aria-label="Search"
              className="rounded-r-lg bg-gray-900 hover:bg-black transition-colors px-4 sm:px-5 flex items-center justify-center"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right column - Smaller */}
        <div className="relative lg:col-span-1">
          {/* Green container - Vertical rectangle */}
          <div className="bg-[#065A46] rounded-2xl p-4 sm:p-6 relative overflow-hidden h-96 lg:h-[500px] flex flex-col">

            {/* Rotating circle (top-left corner) */}
            <motion.div
              className="hidden sm:block absolute -top-3 -left-3"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, ease: 'easeOut', repeat: Infinity }}
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <path id="rotPath" d="M 50,50 m -45,0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0" />
                  </defs>
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="283"
                    strokeDashoffset="70"
                    transform="rotate(-90 50 50)"
                  />
                  <text className="fill-white text-[9px] font-medium">
                    <textPath xlinkHref="#rotPath" startOffset="0%">
                      EXPLORE & FIND THE BEST TUTOR
                    </textPath>
                  </text>
                </svg>
              </div>
            </motion.div>

            {/* Tutor rating badge (overlay top-left) */}
            <motion.div
              className="absolute top-4 left-4 sm:top-6 sm:left-6"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatType: 'loop', delay: 0.2 }}
            >
              <img
                src="/media/homepage/tutor-rating.png"
                alt="Tutor Rating"
                className="w-auto h-16 sm:h-20 shadow-lg"
              />
            </motion.div>

            {/* Hand with pencil (top-right) */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
              <div className="relative">
                <svg className="w-12 h-12 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
              </div>
            </div>

            {/* Laptop with video call - Centered */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-xs">
                {/* Laptop frame */}
                <div className="relative">
                  {/* Laptop screen */}
                  <div className="bg-gray-800 rounded-t-lg p-1.5">
                    <div className="bg-white rounded-lg overflow-hidden">
                      {/* Video call interface */}
                      <div className="aspect-video relative bg-gray-100 cursor-pointer" onClick={togglePlayPause}>
                        <video
                          ref={videoRef}
                          className="w-full h-full object-cover"
                          poster="/media/homepage/banner-video.mp4"
                          muted
                          loop
                          playsInline
                        >
                          <source src="/media/homepage/banner-video.mp4" type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        
                        
                      </div>
                    </div>
                  </div>
                  
                  {/* Laptop base */}
                  <div className="bg-gray-300 h-1.5 rounded-b-lg"></div>
                  <div className="bg-gray-400 h-0.5 w-12 rounded-full mx-auto mt-1"></div>
                </div>
              </div>
            </div>

            {/* Bottom section with proper spacing */}
            <div className="mt-4 flex flex-col space-y-4">
              {/* Text section */}
              <div className="flex items-start justify-between">
                <p className="text-white/90 text-sm leading-relaxed flex-1 pr-4">
                  Begin your learning journey today and experience the transformative power of personalized education.
                </p>
                
                {/* Circular badge */}
                <div className="relative w-16 h-16 flex-shrink-0">
                  <svg viewBox="0 0 100 100" className="w-16 h-16">
                    <defs>
                      <path id="bottomCirclePath" d="M 50,50 m -45,0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0" />
                    </defs>
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeDasharray="283"
                      strokeDashoffset="70"
                      transform="rotate(-90 50 50)"
                    />
                    <text className="fill-white text-[6px] font-medium">
                      <textPath xlinkHref="#bottomCirclePath" startOffset="0%">
                        EXPLORE & FIND THE BEST TUTOR
                      </textPath>
                    </text>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-amber-400">
                      <path
                        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Tutor info card - positioned at bottom right */}
              <div className="flex justify-end">
                <motion.div
                  animate={{ y: [0, 8, 0], rotate: [-1, 1, -1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', repeatType: 'loop' }}
                >
                  <img
                    src="/media/homepage/talents-img.png"
                    alt="Tutor Info"
                    className="w-auto h-20 sm:h-24 shadow-lg"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
