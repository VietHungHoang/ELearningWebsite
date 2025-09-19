import React from 'react'

interface SkeletonLoaderProps {
  variant?: 'course' | 'lesson' | 'quiz' | 'sidebar'
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ variant = 'course' }) => {
  if (variant === 'course') {
    return (
      <div className="flex h-screen bg-gray-100 animate-pulse">
        {/* Sidebar Skeleton */}
        <div className="w-80 bg-gray-200 p-4">
          <div className="space-y-4">
            <div className="h-8 bg-gray-300 rounded"></div>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-6 bg-gray-300 rounded"></div>
                  {[...Array(2)].map((_, j) => (
                    <div key={j} className="ml-4 h-4 bg-gray-300 rounded"></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 p-6">
          <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="h-16 bg-gray-200 rounded"></div>
            
            {/* Video Player Skeleton */}
            <div className="aspect-video bg-gray-200 rounded-lg"></div>
            
            {/* Tabs Skeleton */}
            <div className="flex space-x-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 w-20 bg-gray-200 rounded"></div>
              ))}
            </div>
            
            {/* Content Skeleton */}
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'lesson') {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-2/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    )
  }

  if (variant === 'quiz') {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-12 bg-gray-200 rounded w-32"></div>
      </div>
    )
  }

  if (variant === 'sidebar') {
    return (
      <div className="w-80 bg-gray-200 p-4 animate-pulse">
        <div className="space-y-4">
          <div className="h-8 bg-gray-300 rounded"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-6 bg-gray-300 rounded"></div>
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="ml-4 h-4 bg-gray-300 rounded"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default SkeletonLoader
