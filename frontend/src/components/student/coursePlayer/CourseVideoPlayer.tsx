import React, { useState } from 'react'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
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
}

const CourseVideoPlayer: React.FC<CourseVideoPlayerProps> = ({
  videoUrl,
  thumbnail,
  title,
  instructor,
  onVideoEnd,
  onProgress
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(300) // 5 minutes default
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration
    setCurrentTime(newTime)
    onProgress?.(parseFloat(e.target.value))
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const skip = (seconds: number) => {
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds))
    setCurrentTime(newTime)
  }

  const progressPercentage = (currentTime / duration) * 100

  return (
    <div className="relative bg-black rounded-lg overflow-hidden group">
      {/* Video Container */}
      <div className="relative aspect-video">
        {/* Video Thumbnail/Player */}
        <img 
          src={thumbnail} 
          alt={title}
          className="w-full h-full object-cover"
        />

        {/* Play Button Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <button
              onClick={togglePlayPause}
              className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-6 transform hover:scale-110 transition-all duration-200 shadow-2xl"
            >
              <Play className="w-12 h-12 text-gray-800 ml-2" />
            </button>
          </div>
        )}

        {/* Instructor Info Overlay */}
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-80 rounded-lg p-3 flex items-center space-x-3">
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

        {/* Video Controls */}
        {showControls && isPlaying && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Control Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              {/* Progress Bar */}
              <div className="mb-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressPercentage}
                  onChange={handleProgressChange}
                  className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-4">
                  {/* Play/Pause */}
                  <button
                    onClick={togglePlayPause}
                    className="hover:bg-white/20 rounded-full p-2 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5 ml-0.5" />
                    )}
                  </button>

                  {/* Skip Buttons */}
                  <button
                    onClick={() => skip(-10)}
                    className="hover:bg-white/20 rounded-full p-2 transition-colors"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => skip(10)}
                    className="hover:bg-white/20 rounded-full p-2 transition-colors"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>

                  {/* Volume */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={toggleMute}
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
                      className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Time */}
                  <span className="text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Settings */}
                  <button className="hover:bg-white/20 rounded-full p-2 transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>

                  {/* Fullscreen */}
                  <button className="hover:bg-white/20 rounded-full p-2 transition-colors">
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  )
}

export default CourseVideoPlayer
