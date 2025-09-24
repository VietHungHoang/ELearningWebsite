import React, { useState, useRef, useEffect } from 'react'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  SkipBack, 
  SkipForward,
  Settings
} from 'lucide-react'

interface CourseVideoPlayerProps {
  videoUrl: string
  thumbnail: string
  title: string
  instructor: {
    name: string
    avatar: string
    title?: string
  }
  onVideoEnd?: () => void
  onProgress?: (progress: number) => void
  onPreviousLesson?: () => void
  onNextLesson?: () => void
  hasPreviousLesson?: boolean
  hasNextLesson?: boolean
  isSidebarCollapsed?: boolean
}

const CourseVideoPlayer: React.FC<CourseVideoPlayerProps> = ({
  videoUrl,
  thumbnail,
  title,
  instructor,
  onVideoEnd,
  onProgress,
  onPreviousLesson,
  onNextLesson,
  hasPreviousLesson = false,
  hasNextLesson = false,
  isSidebarCollapsed = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hideControlsTimeoutRef = useRef<number | null>(null)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isReady, setIsReady] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setIsLoading(false)
      setIsReady(true)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
      const progress = (video.currentTime / video.duration) * 100
      onProgress?.(progress)
    }

    const handleEnded = () => {
      console.log('🎯 Video ended, calling onVideoEnd')
      setIsPlaying(false)
      onVideoEnd?.()
    }

    const handlePlay = () => {
      setIsPlaying(true)
    }
    
    const handlePause = () => {
      setIsPlaying(false)
    }

    const handleCanPlay = () => {
      setIsLoading(false)
      setIsReady(true)
    }

    const handleError = () => {
      setIsLoading(false)
      setIsReady(false)
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)
    }
  }, [onProgress, onVideoEnd])

  // Reset state when video URL changes
  useEffect(() => {
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    setIsLoading(true)
    setIsReady(false)
    
    // Force video to load new source
    const video = videoRef.current
    if (video && videoUrl) {
      video.load()
    }
  }, [videoUrl])

  // Update video volume and muted state
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.volume = volume
    video.muted = isMuted
  }, [volume, isMuted])

  // Fullscreen event handlers
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement
      setIsFullscreen(isCurrentlyFullscreen)
      
      // FIXED: Show controls immediately when entering fullscreen
      if (isCurrentlyFullscreen) {
        setShowControls(true)
      } else {
        setShowControls(false)
        // Clear any pending hide timeout when exiting fullscreen
        if (hideControlsTimeoutRef.current) {
          clearTimeout(hideControlsTimeoutRef.current)
          hideControlsTimeoutRef.current = null
        }
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        toggleFullscreen()
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
      document.removeEventListener('keydown', handleKeyDown)
      
      // Cleanup timeout on unmount
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current)
      }
    }
  }, [isFullscreen])

  // Auto-hide controls in fullscreen - Only on mouse move, not on click
  useEffect(() => {
    if (!isFullscreen) {
      setShowControls(false)
      return
    }

    let timeoutId: number

    const showControls = () => {
      setShowControls(true)
      clearTimeout(timeoutId)
      // Only auto-hide if video is playing
      if (isPlaying) {
        timeoutId = setTimeout(() => {
          setShowControls(false)
        }, 3000)
      }
    }

    const handleMouseMove = () => {
      showControls()
    }

    // Show controls initially
    showControls()

    // Add event listeners to video element
    const videoElement = videoRef.current
    if (videoElement) {
      videoElement.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener('mousemove', handleMouseMove)
      }
      clearTimeout(timeoutId)
    }
  }, [isFullscreen, isPlaying])

  // Separate effect to handle video play/pause events
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => {
      setIsPlaying(true)
    }
    
    const handlePause = () => {
      setIsPlaying(false)
    }

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
  }, [])

  // Keyboard shortcuts - Global
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when video is ready
      if (!isReady) {
        return
      }

      // Check if we should handle this key
      const handledKeys = ['Space', 'ArrowLeft', 'ArrowRight', 'KeyF', 'KeyM', 'Escape']
      if (!handledKeys.includes(e.code)) {
        return
      }

      // Always prevent default for our handled keys
      e.preventDefault()
      e.stopPropagation()

      // Show shortcuts when any key is pressed
      setShowShortcuts(true)

      switch (e.code) {
        case 'Space':
          // Play/Pause
          console.log('Space pressed, current isPlaying:', isPlaying)
          togglePlayPause()
          break
        case 'ArrowLeft':
          // Skip back 10s
          console.log('ArrowLeft pressed')
          skip(-10)
          break
        case 'ArrowRight':
          // Skip forward 10s
          console.log('ArrowRight pressed')
          skip(10)
          break
        case 'Escape':
          // Exit fullscreen
          if (isFullscreen) {
            toggleFullscreen()
          }
          break
        case 'KeyF':
          // Toggle fullscreen
          toggleFullscreen()
          break
        case 'KeyM':
          // Toggle mute
          console.log('KeyM pressed')
          toggleMute()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown, true)
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [isReady, isFullscreen, isPlaying])

  // Auto-hide shortcuts panel after 5 seconds
  useEffect(() => {
    if (!showShortcuts) return

    const timeoutId = setTimeout(() => {
      setShowShortcuts(false)
    }, 5000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [showShortcuts])

  // Show shortcuts when video is ready
  useEffect(() => {
    if (isReady) {
      setShowShortcuts(true)
    }
  }, [isReady])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const togglePlayPause = (e?: React.MouseEvent) => {
    // Prevent event bubbling if clicked on controls
    if (e && (e.target as HTMLElement).closest('button, input, [role="slider"]')) {
      return
    }

    const video = videoRef.current
    if (!video || !isReady || !videoUrl) return

    console.log('togglePlayPause called, current isPlaying:', isPlaying, 'video.paused:', video.paused)

    try {
      if (video.paused) {
        video.play().catch(error => {
          console.error('Error playing video:', error)
          setIsReady(false)
        })
        // Show controls when playing in fullscreen
        if (isFullscreen) {
          setShowControls(true)
          if (hideControlsTimeoutRef.current) {
            clearTimeout(hideControlsTimeoutRef.current)
          }
          hideControlsTimeoutRef.current = setTimeout(() => {
            setShowControls(false)
            hideControlsTimeoutRef.current = null
          }, 3000)
        }
      } else {
        video.pause()
        // Clear any auto-hide timeout when manually pausing
        if (hideControlsTimeoutRef.current) {
          clearTimeout(hideControlsTimeoutRef.current)
          hideControlsTimeoutRef.current = null
        }
      }
    } catch (error) {
      console.error('Error in togglePlayPause:', error)
    }
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video || !isReady) return

    const newTime = (parseFloat(e.target.value) / 100) * duration
    video.currentTime = newTime
    setCurrentTime(newTime)
    onProgress?.(parseFloat(e.target.value))
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    
    console.log('toggleMute called, current isMuted:', isMuted, 'video.muted:', video.muted)
    
    // Use video.muted instead of state
    if (video.muted) {
      video.muted = false
      setIsMuted(false)
    } else {
      video.muted = true
      setIsMuted(true)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const skip = (seconds: number) => {
    const video = videoRef.current
    if (!video || !isReady) return

    const newTime = Math.max(0, Math.min(duration, video.currentTime + seconds))
    video.currentTime = newTime
    setCurrentTime(newTime)
    
    console.log('Skip called:', seconds, 'seconds, new time:', newTime)
    
    // Show controls when skipping in fullscreen
    if (isFullscreen) {
      setShowControls(true)
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current)
      }
      hideControlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
        hideControlsTimeoutRef.current = null
      }, 3000)
    }
  }

  const toggleFullscreen = async () => {
    if (!videoRef.current) return

    try {
      if (!isFullscreen) {
        if (videoRef.current.requestFullscreen) {
          await videoRef.current.requestFullscreen()
        } else if ((videoRef.current as any).webkitRequestFullscreen) {
          await (videoRef.current as any).webkitRequestFullscreen()
        } else if ((videoRef.current as any).msRequestFullscreen) {
          await (videoRef.current as any).msRequestFullscreen()
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen()
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen()
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen()
        }
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error)
    }
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className={`video-player-container relative bg-black rounded-lg overflow-hidden group transition-all duration-300 ${
      isFullscreen 
        ? 'fixed inset-0 z-50 rounded-none' 
        : isSidebarCollapsed 
          ? 'max-w-6xl mx-auto' 
          : 'max-w-7xl mx-auto'
    }`}>
      {/* Video Container */}
      <div 
        className={`relative ${isFullscreen ? 'h-full cursor-pointer' : 'aspect-video cursor-pointer'}`}
        onClick={togglePlayPause}
      >
        {/* Video Player */}
        {videoUrl ? (
          <video
            key={videoUrl}
            ref={videoRef}
            src={videoUrl}
            poster={thumbnail}
            className={`w-full h-full ${isFullscreen ? 'object-contain' : 'object-cover'}`}
            preload="metadata"
          />
        ) : (
          <img 
            src={thumbnail} 
            alt={title}
            className={`w-full h-full ${isFullscreen ? 'object-contain' : 'object-cover'}`}
          />
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {/* Play Button Overlay - Only when paused and ready */}
        {!isPlaying && isReady && !isLoading && videoUrl && (
          <div className={`absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center ${
            isFullscreen ? 'z-30' : 'z-15'
          }`}>
            <div className={`bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full transform hover:scale-110 transition-all duration-200 shadow-2xl ${
              isFullscreen ? 'p-8' : 'p-6'
            }`}>
              <Play className={`text-gray-800 ml-2 ${isFullscreen ? 'w-16 h-16' : 'w-12 h-12'}`} />
            </div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && !isReady && videoUrl && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-15">
            <div className="text-white text-center">
              <div className="text-lg font-medium mb-2">Video Error</div>
              <div className="text-sm text-gray-300">Unable to load video</div>
            </div>
          </div>
        )}

        {/* Instructor Info Overlay - FIXED: Hide in fullscreen when controls are hidden */}
        <div className={`absolute bottom-4 right-4 bg-black bg-opacity-80 rounded-lg p-3 flex items-center space-x-3 transition-opacity duration-300 ${
          isFullscreen && !showControls ? 'opacity-0' : 'opacity-100'
        }`}>
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img 
              src={instructor.avatar} 
              alt={instructor.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-white">
            <div className="font-medium text-sm">{instructor.name}</div>
            {instructor.title && (
              <div className="text-xs text-gray-300">{instructor.title}</div>
            )}
          </div>
        </div>

        {/* Keyboard Shortcuts Info - Auto-hide after 5s */}
        {isReady && showShortcuts && (
          <div className={`absolute top-4 right-4 bg-black bg-opacity-80 rounded-lg p-3 text-white text-xs transition-opacity duration-500 ${
            isFullscreen && !showControls ? 'opacity-0' : 'opacity-100'
          }`}>
            <div className="font-medium mb-2">Keyboard Shortcuts:</div>
            <div className="space-y-1">
              <div><kbd className="bg-gray-700 px-1 rounded text-xs">Space</kbd> Play/Pause</div>
              <div><kbd className="bg-gray-700 px-1 rounded text-xs">←</kbd> <kbd className="bg-gray-700 px-1 rounded text-xs">→</kbd> Skip 10s</div>
              <div><kbd className="bg-gray-700 px-1 rounded text-xs">F</kbd> Fullscreen</div>
              <div><kbd className="bg-gray-700 px-1 rounded text-xs">M</kbd> Mute</div>
              <div><kbd className="bg-gray-700 px-1 rounded text-xs">Esc</kbd> Exit</div>
            </div>
          </div>
        )}

        {/* Video Controls - Same behavior for both normal and fullscreen */}
        {isReady && (
          <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 z-20 ${
            isFullscreen 
              ? (showControls ? 'opacity-100' : 'opacity-0')
              : 'opacity-0 group-hover:opacity-100'
          }`}>
            {/* Control Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              {/* Enhanced Progress Bar */}
              <div className="mb-6">
                <div className="relative group">
                  {/* Progress Bar Container */}
                  <div className="relative h-2 bg-gray-700/80 rounded-full overflow-hidden shadow-inner">
                    {/* Buffered Progress */}
                    <div className="absolute top-0 left-0 h-full bg-gray-500/50 rounded-full transition-all duration-300"></div>
                    
                    {/* Current Progress */}
                    <div 
                      className="relative h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-200 ease-out shadow-lg"
                      style={{ width: `${progressPercentage}%` }}
                    >
                      {/* Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                    </div>
                    
                    {/* Progress Handle */}
                    <div 
                      className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
                      style={{ left: `calc(${progressPercentage}% - 8px)` }}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-white to-gray-200 rounded-full shadow-inner"></div>
                    </div>
                  </div>
                  
                  {/* Time Display */}
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-300">
                    <span className="font-mono">{formatTime(currentTime)}</span>
                    <span className="font-mono">{formatTime(duration)}</span>
                  </div>
                  
                  {/* Hidden Range Input for Interaction */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progressPercentage}
                    onChange={handleProgressChange}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-4">
                  {/* Play/Pause */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      togglePlayPause()
                    }}
                    className="hover:bg-white/20 rounded-full p-2 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5 ml-0.5" />
                    )}
                  </button>

                  {/* Lesson Navigation */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onPreviousLesson?.()
                    }}
                    disabled={!hasPreviousLesson}
                    className={`hover:bg-white/20 rounded-full p-2 transition-colors ${
                      !hasPreviousLesson ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    title="Previous Lesson"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onNextLesson?.()
                    }}
                    disabled={!hasNextLesson}
                    className={`hover:bg-white/20 rounded-full p-2 transition-colors ${
                      !hasNextLesson ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    title="Next Lesson"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>

                  {/* Volume */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleMute()
                      }}
                      className="hover:bg-white/20 rounded-full p-2 transition-colors"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                    
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={isMuted ? 0 : volume * 100}
                      onChange={handleVolumeChange}
                      onClick={(e) => e.stopPropagation()}
                      className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Time */}
                  <span className="text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {/* 10s Skip Buttons */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      skip(-10)
                    }}
                    className="hover:bg-white/20 rounded-full p-2 transition-colors"
                    title="Skip back 10s"
                  >
                    <div className="w-5 h-5 relative">
                      <div className="w-5 h-5 border-2 border-white rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">10</span>
                      </div>
                      <svg className="absolute -top-0.5 -right-0.5 w-4 h-4 text-white" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8C3 5 6 5 6 8C6 11 3 11 3 8Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                        <path d="M6 5L9 8L6 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      skip(10)
                    }}
                    className="hover:bg-white/20 rounded-full p-2 transition-colors"
                    title="Skip forward 10s"
                  >
                    <div className="w-5 h-5 relative">
                      <div className="w-5 h-5 border-2 border-white rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">10</span>
                      </div>
                      <svg className="absolute -top-0.5 -left-0.5 w-4 h-4 text-white" viewBox="0 0 16 16" fill="none">
                        <path d="M13 8C13 5 10 5 10 8C10 11 13 11 13 8Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                        <path d="M10 5L7 8L10 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </button>

                  {/* Settings */}
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="hover:bg-white/20 rounded-full p-2 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                  </button>

                  {/* Fullscreen */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFullscreen()
                    }}
                    className="hover:bg-white/20 rounded-full p-2 transition-colors"
                    title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                  >
                    {isFullscreen ? (
                      <Minimize className="w-4 h-4" />
                    ) : (
                      <Maximize className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Timeline Styles */}
      <style>{`
        /* Custom scrollbar for better UX */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
        
        /* Smooth transitions for all interactive elements */
        * {
          transition: all 0.2s ease-out;
        }
        
        /* Prevent scroll when space is pressed */
        .video-player-container {
          scroll-behavior: auto;
        }
        
        .video-player-container:focus {
          outline: none;
        }
      `}</style>
    </div>
  )
}

export default CourseVideoPlayer