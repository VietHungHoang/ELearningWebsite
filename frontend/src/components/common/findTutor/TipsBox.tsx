import React, { useState, useRef } from 'react'

const TipsBox: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

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

  const handleVideoEnded = () => {
    setIsPlaying(false)
  }

  const tips = [
    "Filter your requirements",
    "Check qualifications and experience",
    "Read reviews and ratings",
    "Consider availability and time zones",
    "Test communication compatibility",
    "Compare pricing and packages"
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Video Thumbnail */}
      <div className="relative">
        <video
          ref={videoRef}
          className="w-full h-48 object-cover"
          poster="/media/homepage/homepage-laptop.png"
          muted
          loop
          playsInline
          onClick={togglePlayPause}
          onEnded={handleVideoEnded}
        >
          <source src="/media/homepage/banner-video.mp4" type="video/mp4" />
        </video>
        
        {/* Play/Pause Overlay */}
        {!isPlaying && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 cursor-pointer"
            onClick={togglePlayPause}
          >
            <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all">
              <svg className="w-6 h-6 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Tips to find the best Tutor
        </h3>
        
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          Choosing the right tutor online requires careful consideration. Here are tips to help you make an informed decision.
        </p>

        {/* Tips List */}
        <ul className="space-y-3">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start">
              <div className="flex-shrink-0 w-5 h-5 bg-[#065A46] rounded-full flex items-center justify-center mt-0.5 mr-3">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-gray-600 leading-relaxed">{tip}</span>
            </li>
          ))}
        </ul>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-[#FAF8F6] rounded-lg">
          <p className="text-xs text-gray-500 leading-relaxed">
            Remember to schedule a trial session to ensure the tutor's teaching style matches your learning preferences and goals.
          </p>
        </div>
      </div>
    </div>
  )
}

export default TipsBox