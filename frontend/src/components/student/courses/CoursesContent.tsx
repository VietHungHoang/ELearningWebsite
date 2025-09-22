import { useState } from 'react'
import { Search } from 'lucide-react'
import CourseCard from './CourseCard'
import type { CourseDto } from '../../../services/courseApi'

interface CoursesContentProps {
  courses?: CourseDto[]
  onStartCourse?: (course: CourseDto) => void
  onToggleLike?: (courseId: string) => void
}

const CoursesContent: React.FC<CoursesContentProps> = ({ 
  courses = [], 
  onStartCourse,
  onToggleLike 
}) => {
  const [searchQuery, setSearchQuery] = useState('')

  // Filter courses based on search query
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.level.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleStartCourse = (course: CourseDto) => {
    onStartCourse?.(course)
    // Navigate to course player or course detail page
  }

  const handleToggleLike = (courseId: string) => {
    onToggleLike?.(courseId)
  }

  // Course statistics
  const completedCourses = courses.filter(course => course.progress === 100).length
  const inProgressCourses = courses.filter(course => course.progress > 0 && course.progress < 100).length
  const notStartedCourses = courses.filter(course => course.progress === 0).length

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">My Learning</h1>
            <p className="text-gray-600">
              Browse and manage all your courses in one convenient place.
            </p>
          </div>

          {/* Course Statistics */}
          <div className="hidden lg:flex items-center space-x-6 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completedCourses}</div>
              <div className="text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{inProgressCourses}</div>
              <div className="text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{notStartedCourses}</div>
              <div className="text-gray-600">Not Started</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Controls */}
      <div className="flex items-center justify-end mb-6">
        {/* Search Box */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by keyword"
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onStartCourse={handleStartCourse}
              onToggleLike={handleToggleLike}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No courses found
          </h3>
          <p className="text-gray-600">
            {searchQuery 
              ? `No courses match "${searchQuery}". Try a different search term.`
              : 'No courses available at the moment.'
            }
          </p>
        </div>
      )}

      {/* Mobile Statistics */}
      <div className="lg:hidden mt-8 grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-xl font-bold text-green-600">{completedCourses}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-xl font-bold text-blue-600">{inProgressCourses}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-xl font-bold text-gray-600">{notStartedCourses}</div>
          <div className="text-sm text-gray-600">Not Started</div>
        </div>
      </div>
    </div>
  )
}

export default CoursesContent
