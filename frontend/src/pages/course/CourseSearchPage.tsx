import { useState } from 'react'
import { Search, ChevronUp, ChevronDown, Star, Clock, Users, Play } from 'lucide-react'

interface Course {
  id: number
  title: string
  instructor: {
    id: number
    name: string
    avatar: string
  }
  thumbnail: string
  category: string
  rating: number
  reviews: number
  level: 'Beginner' | 'Intermediate' | 'Expert' | 'All'
  language: string
  lessons: number
  duration: string
  price: number
  originalPrice?: number
  discount?: number
  isFree: boolean
}

interface FilterState {
  keyword: string
  categories: string[]
  ratings: number[]
  duration: string[]
  level: string[]
  priceRange: [number, number]
  isFree: boolean
  languages: string[]
}

const CourseSearchPage = () => {
  const [filters, setFilters] = useState<FilterState>({
    keyword: '',
    categories: ['Productivity'],
    ratings: [],
    duration: ['0-1 Hour'],
    level: [],
    priceRange: [0, 1000],
    isFree: false,
    languages: ['English']
  })

  const [sortBy, setSortBy] = useState('newest')
  const [showPerPage, setShowPerPage] = useState(9)
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    ratings: true,
    duration: true,
    level: true,
    price: true,
    language: true
  })

  // Mock data
  const courses: Course[] = [
    {
      id: 1,
      title: "Time Management Mastery: Boost Your Productivity",
      instructor: { id: 1, name: "Antony C", avatar: "/media/instructors/antony.jpg" },
      thumbnail: "/media/courses/time-management.jpg",
      category: "Productivity",
      rating: 5.0,
      reviews: 6,
      level: "Intermediate",
      language: "English",
      lessons: 27,
      duration: "23 mins: 56 sec",
      price: 132.00,
      discount: 19,
      isFree: false
    },
    {
      id: 2,
      title: "Decision-Making Mastery: Make Better Choices",
      instructor: { id: 1, name: "Antony C", avatar: "/media/instructors/antony.jpg" },
      thumbnail: "/media/courses/decision-making.jpg",
      category: "Productivity",
      rating: 5.0,
      reviews: 6,
      level: "Expert",
      language: "English",
      lessons: 9,
      duration: "9 mins: 15 sec",
      price: 398.52,
      originalPrice: 492.00,
      discount: 19,
      isFree: false
    },
    {
      id: 3,
      title: "Stress Management: Achieve Inner Peace",
      instructor: { id: 1, name: "Antony C", avatar: "/media/instructors/antony.jpg" },
      thumbnail: "/media/courses/stress-management.jpg",
      category: "Productivity",
      rating: 5.0,
      reviews: 6,
      level: "All",
      language: "English",
      lessons: 9,
      duration: "9 mins: 15 sec",
      price: 242.00,
      isFree: false
    },
    {
      id: 4,
      title: "Effective Communication Skills: Connect and Influence",
      instructor: { id: 1, name: "Antony C", avatar: "/media/instructors/antony.jpg" },
      thumbnail: "/media/courses/communication.jpg",
      category: "Productivity",
      rating: 5.0,
      reviews: 6,
      level: "All",
      language: "English",
      lessons: 9,
      duration: "9 mins: 15 sec",
      price: 233.60,
      originalPrice: 320.00,
      discount: 27,
      isFree: false
    },
    {
      id: 5,
      title: "Work-Life Balance: Achieve Harmony and Well-being",
      instructor: { id: 2, name: "Anthony S", avatar: "/media/instructors/anthony-s.jpg" },
      thumbnail: "/media/courses/work-life-balance.jpg",
      category: "Productivity",
      rating: 5.0,
      reviews: 6,
      level: "Intermediate",
      language: "English",
      lessons: 9,
      duration: "9 mins: 15 sec",
      price: 330.00,
      isFree: false
    },
    {
      id: 6,
      title: "Leadership Essentials: Inspire and Influence",
      instructor: { id: 2, name: "Anthony S", avatar: "/media/instructors/anthony-s.jpg" },
      thumbnail: "/media/courses/leadership.jpg",
      category: "Productivity",
      rating: 5.0,
      reviews: 6,
      level: "Expert",
      language: "English",
      lessons: 9,
      duration: "9 mins: 35 sec",
      price: 110.16,
      originalPrice: 216.00,
      discount: 49,
      isFree: false
    },
    {
      id: 7,
      title: "Innovation and Creativity: Think Outside the Box",
      instructor: { id: 2, name: "Anthony S", avatar: "/media/instructors/anthony-s.jpg" },
      thumbnail: "/media/courses/innovation.jpg",
      category: "Productivity",
      rating: 5.0,
      reviews: 6,
      level: "Beginner",
      language: "English",
      lessons: 9,
      duration: "9 mins: 15 sec",
      price: 309.00,
      isFree: false
    },
    {
      id: 8,
      title: "Continuous Learning: Embrace Lifelong Education",
      instructor: { id: 2, name: "Anthony S", avatar: "/media/instructors/anthony-s.jpg" },
      thumbnail: "/media/courses/continuous-learning.jpg",
      category: "Productivity",
      rating: 5.0,
      reviews: 6,
      level: "Beginner",
      language: "English",
      lessons: 9,
      duration: "9 mins: 25 sec",
      price: 112.14,
      originalPrice: 176.00,
      discount: 37,
      isFree: false
    },
    {
      id: 9,
      title: "Effective Networking: Build Meaningful Connections",
      instructor: { id: 3, name: "Steven F", avatar: "/media/instructors/steven.jpg" },
      thumbnail: "/media/courses/networking.jpg",
      category: "Productivity",
      rating: 5.0,
      reviews: 6,
      level: "Expert",
      language: "English",
      lessons: 9,
      duration: "9 mins: 40 sec",
      price: 258.00,
      isFree: false
    }
  ]

  const categories = [
    { name: 'Productivity', count: 12 },
    { name: '3D & Animation', count: 0 },
    { name: 'Creative Software Tools', count: 0 },
    { name: 'Digital Art & Illustration', count: 0 },
    { name: 'Fashion & Textile', count: 0 }
  ]

  const languages = [
    { name: 'English', count: 12 },
    { name: 'Afrikaans', count: 0 },
    { name: 'Albanian', count: 0 },
    { name: 'Amharic', count: 0 },
    { name: 'Arabic', count: 0 }
  ]

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }))
  }

  const handleLanguageChange = (language: string) => {
    setFilters(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }))
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Search Courses</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Narrow search</h2>

              {/* Search by keyword */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search by keyword
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={filters.keyword}
                    onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Search courses..."
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Category */}
              <div className="mb-6">
                <button
                  onClick={() => toggleSection('category')}
                  className="flex items-center justify-between w-full text-sm font-medium text-gray-700 mb-3"
                >
                  Category
                  {expandedSections.category ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {expandedSections.category && (
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category.name} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(category.name)}
                          onChange={() => handleCategoryChange(category.name)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {category.name} ({category.count})
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Ratings */}
              <div className="mb-6">
                <button
                  onClick={() => toggleSection('ratings')}
                  className="flex items-center justify-between w-full text-sm font-medium text-gray-700 mb-3"
                >
                  Ratings
                  {expandedSections.ratings ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {expandedSections.ratings && (
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <label key={rating} className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <div className="ml-2 flex items-center">
                          <div className="flex">
                            {renderStars(rating)}
                          </div>
                          <span className="ml-2 text-sm text-gray-700">
                            {rating} ({rating === 5 ? 0 : rating === 4 ? 2 : rating === 3 ? 6 : rating === 2 ? 4 : 0})
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Course Duration */}
              <div className="mb-6">
                <button
                  onClick={() => toggleSection('duration')}
                  className="flex items-center justify-between w-full text-sm font-medium text-gray-700 mb-3"
                >
                  Course Duration
                  {expandedSections.duration ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {expandedSections.duration && (
                  <div className="space-y-2">
                    {['0-1 Hour', '1-3 Hour', '3-6 Hour', '6-17 Hour', '17+ Hour'].map((duration) => (
                      <label key={duration} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.duration.includes(duration)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {duration} ({duration === '0-1 Hour' ? 12 : 0})
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Level */}
              <div className="mb-6">
                <button
                  onClick={() => toggleSection('level')}
                  className="flex items-center justify-between w-full text-sm font-medium text-gray-700 mb-3"
                >
                  Level
                  {expandedSections.level ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {expandedSections.level && (
                  <div className="space-y-2">
                    {['Beginner', 'Intermediate', 'Expert', 'All'].map((level) => (
                      <label key={level} className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {level} ({level === 'Beginner' ? 2 : level === 'Intermediate' ? 2 : level === 'Expert' ? 4 : 4})
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="mb-6">
                <button
                  onClick={() => toggleSection('price')}
                  className="flex items-center justify-between w-full text-sm font-medium text-gray-700 mb-3"
                >
                  Price
                  {expandedSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {expandedSections.price && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">All (12)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Paid (12)</span>
                      </label>
                    </div>
                    <div className="px-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>$0</span>
                        <span>$1000</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={filters.priceRange[1]}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Language */}
              <div className="mb-6">
                <button
                  onClick={() => toggleSection('language')}
                  className="flex items-center justify-between w-full text-sm font-medium text-gray-700 mb-3"
                >
                  Language
                  {expandedSections.language ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {expandedSections.language && (
                  <div className="space-y-2">
                    {languages.map((language) => (
                      <label key={language.name} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.languages.includes(language.name)}
                          onChange={() => handleLanguageChange(language.name)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {language.name} ({language.count})
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Course Listing */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  {courses.length} Courses available
                </h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700">Sort by:</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="newest">Newest first</option>
                      <option value="popular">Popular</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700">Show per page:</label>
                    <select
                      value={showPerPage}
                      onChange={(e) => setShowPerPage(Number(e.target.value))}
                      className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value={6}>6</option>
                      <option value={9}>9</option>
                      <option value={12}>12</option>
                      <option value={24}>24</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Course Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {courses.map((course) => (
                  <div key={course.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Thumbnail */}
                    <div className="relative">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                        <div className="bg-white bg-opacity-90 rounded-full p-3">
                          <Play className="h-6 w-6 text-gray-800" />
                        </div>
                      </div>
                      {course.discount && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          {course.discount}%OFF
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {/* Instructor */}
                      <div className="flex items-center mb-2">
                        <img
                          src={course.instructor.avatar}
                          alt={course.instructor.name}
                          className="w-6 h-6 rounded-full mr-2"
                        />
                        <a
                          href={`/tutor/${course.instructor.id || 1}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-600 hover:text-primary-600 hover:underline transition-colors"
                        >
                          {course.instructor.name}
                        </a>
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {course.title}
                      </h3>

                      {/* Category */}
                      <div className="mb-2">
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          {course.category}
                        </span>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          {renderStars(course.rating)}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {course.rating} ({course.reviews} Reviews)
                        </span>
                      </div>

                      {/* Level & Language */}
                      <div className="flex items-center gap-4 mb-2 text-sm text-gray-600">
                        <span>{course.level}</span>
                        <span>{course.language}</span>
                      </div>

                      {/* Lessons & Duration */}
                      <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {course.lessons} Lessons
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {course.duration}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {course.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              ${course.originalPrice.toFixed(2)}
                            </span>
                          )}
                          <span className="text-lg font-bold text-gray-900">
                            ${course.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(1)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    currentPage === 1
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  1
                </button>
                <button
                  onClick={() => setCurrentPage(2)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    currentPage === 2
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  2
                </button>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage === 2}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CourseSearchPage
