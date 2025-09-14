import React, { useState, useRef } from 'react'

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
    <>
      <style>{`
        @keyframes floating {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes rotating {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes swaying {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(8px) rotate(1deg); }
        }

        .modern-video-frame {
          clip-path: polygon(0% 0%, 100% 0%, 100% 80%, 75% 100%, 0% 100%);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .modern-video-frame::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(0,0,0,0.1) 100%);
          pointer-events: none;
          z-index: 1;
        }

        .modern-video-frame:hover {
          clip-path: polygon(0% 0%, 100% 0%, 100% 82%, 77% 100%, 0% 100%);
          transform: scale(1.03) translateY(-4px);
          box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);
        }

        .modern-screen-inner {
          clip-path: polygon(0% 0%, 100% 0%, 100% 78%, 73% 100%, 0% 100%);
        }

        .modern-video-content {
          clip-path: polygon(0% 0%, 100% 0%, 100% 76%, 71% 100%, 0% 100%);
        }

        .modern-laptop-base {
          clip-path: polygon(12px 0%, calc(100% - 12px) 0%, 100% 100%, 0% 100%);
        }

        .floating-glow {
          animation: floatingGlow 6s ease-in-out infinite;
        }

        @keyframes floatingGlow {
          0%, 100% { 
            transform: translateY(0px) scale(1);
            opacity: 0.7;
          }
          50% { 
            transform: translateY(-8px) scale(1.05);
            opacity: 1;
          }
        }
      `}</style>

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
            <div className="bg-[#065A46] rounded-3xl p-6 sm:p-8 relative overflow-hidden h-[32rem] lg:h-[36rem] flex flex-col">

              {/* Rotating circle (top-left corner) */}
              <div
                className="hidden sm:block absolute -top-3 -left-3"
                style={{ animation: 'rotating 20s linear infinite' }}
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
              </div>

              {/* Tutor rating badge (overlay top-left) */}
              <div
                className="absolute top-4 left-4 sm:top-6 sm:left-6"
                style={{ animation: 'floating 3s ease-in-out infinite' }}
              >
                <img
                  src="/media/homepage/tutor-rating.png"
                  alt="Tutor Rating"
                  className="w-auto h-16 sm:h-20 shadow-lg"
                />
              </div>

              {/* Hand with pencil (top-right) */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                <div className="relative">
                  <svg className="w-12 h-12 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                </div>
              </div>

              {/* Modern Laptop with video call - Centered */}
              <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-lg relative floating-glow">
                  {/* Modern Laptop Frame */}
                  <div className="relative">
                    {/* Laptop Screen - Modern Design with Enhanced Diagonal Cut */}
                    <div 
                      className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 p-3 shadow-2xl modern-video-frame"
                      style={{
                        boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      {/* Screen Bezel */}
                      <div 
                        className="bg-gradient-to-b from-slate-900 to-black p-1.5 shadow-inner modern-screen-inner"
                      >
                        {/* Webcam */}
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-600 rounded-full border border-slate-500 shadow-inner z-10">
                          <div className="w-1 h-1 bg-slate-800 rounded-full absolute top-0.5 left-0.5"></div>
                        </div>

                        {/* Modern Video Display Area */}
                        <div 
                          className="relative bg-black overflow-hidden cursor-pointer modern-video-content"
                          onClick={togglePlayPause}
                        >
                          {/* Video Content */}
                          <div className="aspect-video relative">
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

                            {/* Professional Video UI Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none">
                              {/* Corner Tech Accents */}
                              <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-emerald-400/60"></div>
                              <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-emerald-400/60"></div>
                              <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-emerald-400/60"></div>
                              <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-emerald-400/60"></div>

                              {/* Live Indicator */}
                              <div className="absolute top-3 left-3 flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-white text-xs font-medium">LIVE</span>
                              </div>

                              {/* Professional Play Button */}
                              {!isPlaying && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform border border-white/20">
                                    <div className="w-0 h-0 border-l-[12px] border-l-slate-800 border-y-[8px] border-y-transparent ml-1"></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Professional Screen Brand Badge */}
                      <div className="absolute bottom-1 right-1 bg-slate-600/50 backdrop-blur-sm rounded px-2 py-0.5">
                        <span className="text-white text-[8px] font-medium opacity-60">ProDisplay</span>
                      </div>
                    </div>
                    
                    {/* Modern Laptop Base */}
                    <div className="relative mt-2">
                      {/* Main Base */}
                      <div 
                        className="h-4 bg-gradient-to-b from-slate-300 via-slate-400 to-slate-500 shadow-xl modern-laptop-base"
                        style={{
                          boxShadow: '0 12px 32px -8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                        }}
                      ></div>
                      
                      {/* Laptop Hinge */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 rounded-full shadow-inner"></div>
                      
                      {/* Trackpad */}
                      <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 w-10 h-2 bg-slate-600 rounded-lg border border-slate-700 shadow-inner"></div>
                      
                      {/* Keyboard Indication */}
                      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
                        <div className="w-1.5 h-0.5 bg-slate-700 rounded-full"></div>
                        <div className="w-1.5 h-0.5 bg-slate-700 rounded-full"></div>
                        <div className="w-1.5 h-0.5 bg-slate-700 rounded-full"></div>
                        <div className="w-1.5 h-0.5 bg-slate-700 rounded-full"></div>
                      </div>
                    </div>

                    {/* Modern Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/15 via-blue-500/15 to-purple-500/15 blur-2xl -z-10 scale-125"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-emerald-400/10 to-blue-500/10 blur-xl -z-10 scale-110"></div>
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
                  <div style={{ animation: 'swaying 4s ease-in-out infinite' }}>
                    <img
                      src="/media/homepage/talents-img.png"
                      alt="Tutor Info"
                      className="w-auto h-20 sm:h-24 shadow-lg"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>
    </>
  )
}

export default Hero