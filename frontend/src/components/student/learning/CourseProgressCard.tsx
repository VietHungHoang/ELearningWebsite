import React from 'react'
import { BookOpen, Clock, Award, Play } from 'lucide-react'

interface Course {
  id: string
  title: string
  instructor: string
  progress: number
  totalLessons: number
  completedLessons: number
  duration: string
  thumbnail: string
}

interface CourseProgressCardProps {
  course: Course
  onClick?: (course: Course) => void
}

const CourseProgressCard: React.FC<CourseProgressCardProps> = ({ course, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick?.(course)}
    >
      {/* Course Thumbnail */}
      <div className="relative h-32 overflow-hidden">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <Play className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Course Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2">
          {course.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3">
          by {course.instructor}
        </p>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{course.completedLessons}/{course.totalLessons} lessons</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Course Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Award className="w-4 h-4" />
            <span>{course.progress}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseProgressCard
