import React, { useState } from 'react'
import { Play, Heart } from 'lucide-react'

interface Course {
  id: string
  title: string
  slug: string
  instructor: {
    name: string
    avatar: string
  }
  category: string
  thumbnail: string
  progress: number
  duration?: string
  isLiked?: boolean
  enrolledStudents?: number
}

interface CourseCardProps {
  course: Course
  onStartCourse?: (course: Course) => void
  onToggleLike?: (courseId: string) => void
}

const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  onStartCourse, 
  onToggleLike 
}) => {
  const [liked, setLiked] = useState(course.isLiked || false)

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLiked(!liked)
    onToggleLike?.(course.id)
  }

  const handleStartCourse = (e: React.MouseEvent) => {
    e.stopPropagation()
    onStartCourse?.(course)
  }

  const getProgressColor = () => {
    if (course.progress === 0) return 'bg-gray-200'
    if (course.progress < 25) return 'bg-red-400'
    if (course.progress < 50) return 'bg-yellow-400'
    if (course.progress < 75) return 'bg-blue-400'
    return 'bg-green-400'
  }

  const getProgressText = () => {
    if (course.progress === 0) return 'Not Started'
    if (course.progress === 100) return 'Completed'
    return 'In Progress'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Course Thumbnail */}
      <div className="relative aspect-video overflow-hidden group">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleStartCourse}
            className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 transform hover:scale-110 transition-all duration-200"
          >
            <Play className="w-6 h-6 text-gray-800 ml-1" />
          </button>
        </div>

        {/* Like Button */}
        <button
          onClick={handleLikeToggle}
          className="absolute top-3 right-3 p-2 rounded-full bg-white bg-opacity-90 hover:bg-opacity-100 transition-all duration-200"
        >
          <Heart 
            className={`w-5 h-5 ${
              liked 
                ? 'text-red-500 fill-red-500' 
                : 'text-gray-600 hover:text-red-500'
            }`} 
          />
        </button>
      </div>

      {/* Course Content */}
      <div className="p-4">
        {/* Instructor */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img 
              src={course.instructor.avatar} 
              alt={course.instructor.name}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {course.instructor.name}
          </span>
        </div>

        {/* Course Title */}
        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 leading-tight">
          {course.title}
        </h3>

        {/* Category */}
        <div className="mb-4">
          <span className="text-sm text-gray-600">
            In{' '}
            <span className="text-blue-600 hover:text-blue-800 cursor-pointer underline">
              {course.category}
            </span>
          </span>
        </div>

        {/* Progress Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Course Progress</span>
            <span className="text-sm font-bold text-gray-900">{course.progress}%</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
          
          <span className="text-xs text-gray-500">{getProgressText()}</span>
        </div>

        {/* Action Button */}
        <button
          onClick={handleStartCourse}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 px-4 rounded-md transition-colors duration-200 border border-gray-300"
        >
          {course.progress === 0 ? 'Start Course' : course.progress === 100 ? 'Review Course' : 'Continue Course'}
        </button>
      </div>
    </div>
  )
}

export default CourseCard
