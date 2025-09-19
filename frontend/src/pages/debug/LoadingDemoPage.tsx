import React, { useState } from 'react'
import { LoadingScreen, QuickLoader, SkeletonLoader } from '../../components/common/loading'

const LoadingDemoPage: React.FC = () => {
  const [showLoading, setShowLoading] = useState(false)
  const [loadingVariant, setLoadingVariant] = useState<'default' | 'minimal' | 'course' | 'skeleton'>('default')

  const handleShowLoading = (variant: typeof loadingVariant) => {
    setLoadingVariant(variant)
    setShowLoading(true)
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      setShowLoading(false)
    }, 3000)
  }

  if (showLoading) {
    return (
      <LoadingScreen
        variant={loadingVariant}
        message="Loading demo..."
        subMessage="This is a demonstration of the loading screen"
        showProgress={true}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Loading Components Demo</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Loading Screen Variants */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Loading Screen Variants</h2>
            <div className="space-y-3">
              <button
                onClick={() => handleShowLoading('default')}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Default Loading
              </button>
              <button
                onClick={() => handleShowLoading('minimal')}
                className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Minimal Loading
              </button>
              <button
                onClick={() => handleShowLoading('course')}
                className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
              >
                Course Loading
              </button>
              <button
                onClick={() => handleShowLoading('skeleton')}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Skeleton Loading
              </button>
            </div>
          </div>

          {/* Quick Loader Variants */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Loader Variants</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <QuickLoader size="sm" color="green" text="Small" />
              </div>
              <div className="flex items-center space-x-4">
                <QuickLoader size="md" color="blue" text="Medium" />
              </div>
              <div className="flex items-center space-x-4">
                <QuickLoader size="lg" color="gray" text="Large" />
              </div>
            </div>
          </div>

          {/* Skeleton Loader Variants */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Skeleton Loader Variants</h2>
            <div className="space-y-4">
              <div className="border rounded p-4">
                <h3 className="text-sm font-medium mb-2">Course Skeleton</h3>
                <SkeletonLoader variant="course" />
              </div>
              <div className="border rounded p-4">
                <h3 className="text-sm font-medium mb-2">Lesson Skeleton</h3>
                <SkeletonLoader variant="lesson" />
              </div>
              <div className="border rounded p-4">
                <h3 className="text-sm font-medium mb-2">Quiz Skeleton</h3>
                <SkeletonLoader variant="quiz" />
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Loading Screen</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Multiple variants (default, minimal, course, skeleton)</li>
                <li>• Customizable messages and progress bars</li>
                <li>• Animated elements and floating particles</li>
                <li>• Responsive design</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Quick Loader</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Lightweight and fast</li>
                <li>• Multiple sizes and colors</li>
                <li>• Perfect for inline loading states</li>
                <li>• Minimal performance impact</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Skeleton Loader</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Mimics actual content structure</li>
                <li>• Reduces perceived loading time</li>
                <li>• Multiple layout variants</li>
                <li>• Smooth animations</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Performance</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Optimized animations</li>
                <li>• Minimal re-renders</li>
                <li>• Memory efficient</li>
                <li>• Fast loading times</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingDemoPage
