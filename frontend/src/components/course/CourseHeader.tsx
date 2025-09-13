import { Star, Globe, Users, Eye } from 'lucide-react'
import type { Course } from '../../data/course-sample'

interface CourseHeaderProps {
  course: Course
}

const CourseHeader = ({ course }: CourseHeaderProps) => {
  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500">
        <ol className="flex items-center space-x-2">
          <li>
            <a href="/" className="hover:underline">Home</a>
          </li>
          <li>/</li>
          <li>
            <a href="/courses/productivity" className="hover:underline">Productivity</a>
          </li>
          <li>/</li>
          <li aria-current="page" className="text-gray-900 font-medium">
            Time Management
          </li>
        </ol>
      </nav>

      <div className="space-y-4">
        {/* Course Title */}
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
          {course.title}
        </h1>

        {/* Tagline */}
        <p className="text-base text-gray-600 leading-relaxed">
          {course.tagline}
        </p>

        {/* Meta Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-900">
                {course.rating} ({course.reviews} Reviews)
              </span>
            </div>
            <span className="bg-green-50 text-green-600 px-2 py-1 rounded text-xs font-medium">
              {course.rating}
            </span>
          </div>

          {/* Last Updated */}
          <span className="text-sm text-gray-500">
            Last updated: {course.lastUpdated}
          </span>

          {/* Language */}
          <div className="flex items-center gap-1">
            <Globe className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">{course.language}</span>
          </div>

          {/* Students & Views */}
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{course.enrolledStudents} students</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{course.totalViews.toLocaleString()} views</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseHeader
