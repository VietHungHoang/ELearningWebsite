import React from 'react'
import { Clock, BookOpen } from 'lucide-react'

interface CourseBundleProps {
  id: string
  title: string
  description: string
  instructor: {
    name: string
    avatar: string
  }
  courseCount: number
  price: number
  originalPrice?: number
  duration: string
  thumbnail: string
  discount?: string
  badgeText?: string
}

interface CourseBundleCardProps {
  bundle: CourseBundleProps
}

const CourseBundleCard: React.FC<CourseBundleCardProps> = ({ bundle }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex-shrink-0 w-80 mx-2">
      {/* Course Thumbnail */}
      <div className="relative">
        <div 
          className="h-48 bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500 flex items-center justify-center relative overflow-hidden"
          style={{
            background: bundle.id === '1' ? 'linear-gradient(135deg, #ff6b35, #f7931e)' :
                        bundle.id === '2' ? 'linear-gradient(135deg, #1e3c72, #2a5298)' :
                        bundle.id === '3' ? 'linear-gradient(135deg, #56ab2f, #a8e6cf)' :
                        'linear-gradient(135deg, #ff7b7b, #667eea)'
          }}
        >
          {/* Badge Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-center p-4">
              <div className="text-lg font-bold mb-2">{bundle.badgeText}</div>
              {bundle.id === '1' && (
                <div className="text-4xl">🤖</div>
              )}
              {bundle.id === '2' && (
                <div className="text-3xl">📈</div>
              )}
              {bundle.id === '3' && (
                <div className="flex items-center justify-center space-x-2">
                  <div className="text-2xl">💡</div>
                  <div className="text-xs">LEARN WITH JOHN DOE</div>
                </div>
              )}
              {bundle.id === '4' && (
                <div className="text-3xl">⚡</div>
              )}
            </div>
          </div>
          
          {/* Discount Badge */}
          {bundle.discount && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              {bundle.discount}
            </div>
          )}
        </div>
        
        {/* Instructor Info */}
        <div className="absolute bottom-4 left-4 flex items-center space-x-2">
          <img 
            src={bundle.instructor.avatar} 
            alt={bundle.instructor.name}
            className="w-8 h-8 rounded-full border-2 border-white"
          />
          <span className="text-white text-sm font-medium">{bundle.instructor.name}</span>
          <div className="flex items-center space-x-1 text-white text-sm">
            <BookOpen className="w-4 h-4" />
            <span>{bundle.courseCount} Courses</span>
          </div>
        </div>
      </div>

      {/* Course Details */}
      <div className="p-6">
        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-1">
          {bundle.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {bundle.description}
        </p>
        
        {/* Price and Duration */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              ${bundle.price}
            </span>
            {bundle.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${bundle.originalPrice}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-1 text-gray-500 text-sm">
            <Clock className="w-4 h-4" />
            <span>{bundle.duration}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseBundleCard
