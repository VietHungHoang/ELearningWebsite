import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import CoursePlayerSidebar from '../../components/student/coursePlayer/CoursePlayerSidebar'
import CourseVideoPlayer from '../../components/student/coursePlayer/CourseVideoPlayer'
import { 
  Share, 
  ChevronDown, 
  Bell
} from 'lucide-react'

interface Course {
  id: string
  title: string
  slug: string
  description: string
  shortDescription: string
  progress: number
  thumbnail: string
  instructor: {
    name: string
    avatar: string
    title?: string
  }
  sections: any[]
  duration: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  rating: number
  studentsCount: number
  price: number
  originalPrice?: number
  isEnrolled: boolean
  lastAccessed?: string
  completionPercentage: number
  totalLessons: number
  completedLessons: number
}

// Sample course data
const sampleCourses: Record<string, Course> = {
  'goal-setting-masterclass-achieve-your-dreams': {
    id: '1',
    title: 'Goal Setting Masterclass: Achieve Your Dreams',
    slug: 'goal-setting-masterclass-achieve-your-dreams',
    description: 'Learn the fundamentals of goal setting and achieve your dreams with this comprehensive masterclass. Master proven techniques used by successful people to set, track, and achieve their goals.',
    shortDescription: 'Master the art of goal setting and turn your dreams into reality',
    progress: 15,
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=450&fit=crop',
    instructor: {
      name: 'Steven Ford',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
      title: 'Productivity Expert & Life Coach'
    },
    duration: '2h 30m',
    level: 'Beginner',
    rating: 4.8,
    studentsCount: 12500,
    price: 89,
    originalPrice: 149,
    isEnrolled: true,
    lastAccessed: '2024-01-15',
    completionPercentage: 15,
    totalLessons: 8,
    completedLessons: 1,
    sections: [
      {
        id: 'section-1',
        title: 'Understanding Goals and Why They Matter',
        isExpanded: true,
        progress: { completed: 1, total: 3, duration: '13 mins 5 sec' },
        lessons: [
          {
            id: 'lesson-1',
            title: 'The Importance of Goal Setting',
            duration: '4 mins 30 sec',
            isCompleted: true,
            isCurrent: false
          },
          {
            id: 'lesson-2',
            title: 'Types of Goals: Short-term vs Long-term',
            duration: '4 mins 15 sec',
            isCompleted: false,
            isCurrent: true
          },
          {
            id: 'lesson-3',
            title: 'Creating a Vision Board',
            duration: '4 mins 20 sec',
            isCompleted: false,
            isCurrent: false
          }
        ]
      },
      {
        id: 'section-2',
        title: 'Setting and Achieving Your Goals',
        isExpanded: false,
        progress: { completed: 0, total: 3, duration: '18 mins 30 sec' },
        lessons: [
          {
            id: 'lesson-4',
            title: 'SMART Goals Framework',
            duration: '6 mins 15 sec',
            isCompleted: false,
            isCurrent: false,
            isLocked: true
          },
          {
            id: 'lesson-5',
            title: 'Breaking Down Big Goals',
            duration: '6 mins 30 sec',
            isCompleted: false,
            isCurrent: false,
            isLocked: true
          }
        ]
      }
    ]
  },
  'focus-and-concentration-boost-achieve-more': {
    id: '2',
    title: 'Focus and Concentration Boost: Achieve More',
    slug: 'focus-and-concentration-boost-achieve-more',
    description: 'Master the art of focus and concentration to boost your productivity and achieve more in less time.',
    shortDescription: 'Boost your focus and concentration for maximum productivity',
    progress: 0,
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop',
    instructor: {
      name: 'Steven Ford',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
      title: 'Productivity Expert'
    },
    duration: '1h 45m',
    level: 'Intermediate',
    rating: 4.7,
    studentsCount: 8900,
    price: 79,
    originalPrice: 129,
    isEnrolled: true,
    completionPercentage: 0,
    totalLessons: 6,
    completedLessons: 0,
    sections: [
      {
        id: 'section-1',
        title: 'Introduction to Focus and Concentration',
        isExpanded: true,
        progress: { completed: 0, total: 2, duration: '8 mins' },
        lessons: [
          {
            id: 'lesson-1',
            title: 'What is Focus and Why It Matters',
            duration: '4 mins',
            isCompleted: false,
            isCurrent: true
          },
          {
            id: 'lesson-2',
            title: 'Common Distractions and How to Overcome Them',
            duration: '4 mins',
            isCompleted: false,
            isCurrent: false
          }
        ]
      }
    ]
  }
}

// Helper function to get course by slug
const getCourseBySlug = (slug: string): Course | undefined => {
  return sampleCourses[slug]
}

const CoursePlayerPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState('overview')
  const [courseData, setCourseData] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      setLoading(true)
      const course = getCourseBySlug(slug)
      if (course) {
        setCourseData(course)
      }
      setLoading(false)
    }
  }, [slug])

  const handleBackToCourses = () => {
    navigate('/student/course-list')
  }

  const handleLessonSelect = (_lessonId: string, _sectionId: string) => {
    // Navigate to specific lesson or update current lesson
  }

  const handleToggleSection = (sectionId: string) => {
    if (!courseData) return
    
    const updatedSections = courseData.sections.map(section => 
      section.id === sectionId 
        ? { ...section, isExpanded: !section.isExpanded }
        : section
    )
    
    setCourseData({
      ...courseData,
      sections: updatedSections
    })
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'prerequisites', label: 'Prerequisites & FAQs' },
    { id: 'noticeboard', label: 'Noticeboard' },
    { id: 'course-info', label: 'Course Info' }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    )
  }

  if (!courseData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-4">The course you're looking for doesn't exist.</p>
          <button
            onClick={handleBackToCourses}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <CoursePlayerSidebar
        courseTitle={courseData.title}
        sections={courseData.sections}
        onBackToCourses={handleBackToCourses}
        onLessonSelect={handleLessonSelect}
        onToggleSection={handleToggleSection}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-900 text-white px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Side - Logo and Progress */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
                <span className="font-semibold text-white">Lernen</span>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-300">Course Progress</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${courseData.completionPercentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-white">{courseData.completionPercentage}%</span>
                </div>
              </div>
            </div>

            {/* Right Side - Controls */}
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md transition-colors">
                <Share className="w-4 h-4" />
                <span className="text-sm">Share</span>
              </button>

              <div className="flex items-center space-x-1 text-sm">
                <span>USD $</span>
                <ChevronDown className="w-3 h-3" />
              </div>

              <div className="flex items-center space-x-1 text-sm">
                <img src="https://flagcdn.com/w20/us.png" alt="EN" className="w-4 h-3" />
                <span>En</span>
                <ChevronDown className="w-3 h-3" />
              </div>

              <Bell className="w-5 h-5 text-gray-300 hover:text-white cursor-pointer" />

              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" 
                  alt="User" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
          </div>
        </header>

        {/* Video Player Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6">
            <CourseVideoPlayer
              videoUrl=""
              thumbnail={courseData.thumbnail}
              title={courseData.title}
              instructor={courseData.instructor}
            />
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white border-t border-gray-200">
            <div className="px-6">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white p-6 min-h-32">
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Course Overview</h3>
                <p className="text-gray-600 mb-4">{courseData.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">Duration:</span>
                    <p className="text-gray-600">{courseData.duration}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Level:</span>
                    <p className="text-gray-600">{courseData.level}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Lessons:</span>
                    <p className="text-gray-600">{courseData.totalLessons}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Students:</span>
                    <p className="text-gray-600">{courseData.studentsCount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'prerequisites' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Prerequisites & FAQs</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Prerequisites</h4>
                    <p className="text-gray-600">No prior experience required. Just bring your ambition and willingness to learn!</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Frequently Asked Questions</h4>
                    <div className="space-y-2">
                      <div className="border-l-4 border-green-500 pl-4">
                        <p className="font-medium text-gray-900">How long do I have access to the course?</p>
                        <p className="text-gray-600 text-sm">You have lifetime access to this course once enrolled.</p>
                      </div>
                      <div className="border-l-4 border-green-500 pl-4">
                        <p className="font-medium text-gray-900">Can I get a refund if I'm not satisfied?</p>
                        <p className="text-gray-600 text-sm">Yes, we offer a 30-day money-back guarantee.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'noticeboard' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Noticeboard</h3>
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="font-medium text-blue-900">New Content Added</span>
                    </div>
                    <p className="text-blue-800 text-sm">We've added new lessons to Section 2. Check them out!</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-green-900">Course Update</span>
                    </div>
                    <p className="text-green-800 text-sm">The course has been updated with the latest best practices.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'course-info' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Course Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium text-gray-900">Instructor:</span>
                      <p className="text-gray-600">{courseData.instructor.name}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Rating:</span>
                      <p className="text-gray-600">{courseData.rating}/5.0 ⭐</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Duration:</span>
                      <p className="text-gray-600">{courseData.duration}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Level:</span>
                      <p className="text-gray-600">{courseData.level}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Total Lessons:</span>
                      <p className="text-gray-600">{courseData.totalLessons}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Students Enrolled:</span>
                      <p className="text-gray-600">{courseData.studentsCount.toLocaleString()}</p>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Instructor Bio:</span>
                    <p className="text-gray-600 mt-1">{courseData.instructor.title}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoursePlayerPage
