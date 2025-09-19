import { useState } from 'react'
import { Search } from 'lucide-react'
import CourseCard from './CourseCard'

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

interface CoursesContentProps {
  courses?: Course[]
  onStartCourse?: (course: Course) => void
  onToggleLike?: (courseId: string) => void
}

const CoursesContent: React.FC<CoursesContentProps> = ({ 
  courses = [], 
  onStartCourse,
  onToggleLike 
}) => {
  const [searchQuery, setSearchQuery] = useState('')

  // Temporary sample courses data
  const sampleCourses: Course[] = [
    {
      id: '1',
      title: 'Goal Setting Masterclass: Achieve Your Dreams',
      slug: 'goal-setting-masterclass-achieve-your-dreams',
      instructor: {
        name: 'Steven Ford',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
      },
      category: 'Productivity',
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=225&fit=crop',
      progress: 15,
      duration: '2h 30m',
      isLiked: false
    },
    {
      id: '2',
      title: 'Focus and Concentration Boost: Achieve More',
      slug: 'focus-and-concentration-boost-achieve-more',
      instructor: {
        name: 'Steven Ford',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
      },
      category: 'Productivity',
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=225&fit=crop',
      progress: 0,
      duration: '1h 45m',
      isLiked: false
    },
    {
      id: '3',
      title: 'React Development Mastery: From Zero to Hero',
      slug: 'react-development-mastery-zero-to-hero',
      instructor: {
        name: 'Anthony Shao',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
      },
      category: 'Programming',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop',
      progress: 45,
      duration: '12h 30m',
      isLiked: true
    },
    {
      id: '4',
      title: 'Design Thinking for Innovation',
      slug: 'design-thinking-for-innovation',
      instructor: {
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face'
      },
      category: 'Design',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop',
      progress: 0,
      duration: '3h 15m',
      isLiked: false
    },
    {
      id: '5',
      title: 'Time Management Mastery: Get More Done',
      slug: 'time-management-mastery',
      instructor: {
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face'
      },
      category: 'Productivity',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
      progress: 0,
      duration: '2h 15m',
      isLiked: false
    },
    {
      id: '6',
      title: 'Business Strategy Fundamentals',
      slug: 'business-strategy-fundamentals',
      instructor: {
        name: 'Michael Chen',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face'
      },
      category: 'Business',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
      progress: 0,
      duration: '4h 20m',
      isLiked: false
    }
  ]

  const transformedCourses: Course[] = sampleCourses

  const allCourses = courses.length > 0 ? courses : transformedCourses

  // Filter courses based on search query
  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleStartCourse = (course: Course) => {
    onStartCourse?.(course)
    // Navigate to course player or course detail page
  }

  const handleToggleLike = (courseId: string) => {
    onToggleLike?.(courseId)
  }

  // Course statistics
  const completedCourses = allCourses.filter(course => course.progress === 100).length
  const inProgressCourses = allCourses.filter(course => course.progress > 0 && course.progress < 100).length
  const notStartedCourses = allCourses.filter(course => course.progress === 0).length

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
