import React from 'react'
import SkeletonLoader from './SkeletonLoader'

interface LoadingScreenProps {
  message?: string
  subMessage?: string
  showProgress?: boolean
  variant?: 'default' | 'minimal' | 'course' | 'skeleton'
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading...",
  subMessage = "Please wait while we prepare everything for you",
  showProgress = true,
  variant = 'default'
}) => {
  if (variant === 'skeleton') {
    return <SkeletonLoader variant="course" />
  }

  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 relative">
            <div className="absolute inset-0 border-4 border-transparent border-t-green-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">{message}</p>
        </div>
      </div>
    )
  }

  if (variant === 'course') {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center relative">
          {/* Animated Logo/Icon */}
          <div className="relative mb-8">
            <div className="w-20 h-20 mx-auto relative">
              {/* Outer rotating ring */}
              <div className="absolute inset-0 border-4 border-transparent border-t-green-500 border-r-green-400 rounded-full animate-spin"></div>
              {/* Inner pulsing circle */}
              <div className="absolute inset-2 bg-gradient-to-br from-green-500 to-green-600 rounded-full animate-pulse"></div>
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>

          {/* Loading text with animation */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-2">
              {message.split('').map((char, index) => (
                <span 
                  key={index}
                  className="inline-block animate-bounce" 
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h2>
            
            <p className="text-gray-300 text-lg font-medium">{subMessage}</p>
            
            {/* Progress bar */}
            {showProgress && (
              <div className="w-64 mx-auto">
                <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full animate-pulse"
                    style={{
                      animation: 'progress 2s ease-in-out infinite'
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-green-400 rounded-full opacity-20 animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Custom CSS for progress animation */}
        <style jsx>{`
          @keyframes progress {
            0% { width: 0%; }
            50% { width: 70%; }
            100% { width: 100%; }
          }
        `}</style>
      </div>
    )
  }

  // Default variant
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        {/* Animated Logo/Icon */}
        <div className="relative mb-8">
          <div className="w-16 h-16 mx-auto relative">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-blue-400 rounded-full animate-spin"></div>
            {/* Inner pulsing circle */}
            <div className="absolute inset-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full animate-pulse"></div>
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
        </div>

        {/* Loading text */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 mb-2">{message}</h2>
          <p className="text-gray-600">{subMessage}</p>
          
          {/* Progress bar */}
          {showProgress && (
            <div className="w-48 mx-auto">
              <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full animate-pulse"
                  style={{
                    animation: 'progress 2s ease-in-out infinite'
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Custom CSS for progress animation */}
        <style jsx>{`
          @keyframes progress {
            0% { width: 0%; }
            50% { width: 70%; }
            100% { width: 100%; }
          }
        `}</style>
      </div>
    </div>
  )
}

export default LoadingScreen
