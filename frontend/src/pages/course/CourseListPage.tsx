import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Star, Users, Clock, BookOpen } from 'lucide-react'

const CourseListPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')

  const categories = [
    'Tất cả',
    'Lập trình',
    'Thiết kế',
    'Marketing',
    'Kinh doanh',
    'Ngoại ngữ',
    'Âm nhạc',
  ]

  const levels = [
    'Tất cả',
    'Cơ bản',
    'Trung cấp',
    'Nâng cao',
  ]

  const courses = [
    {
      id: 1,
      title: 'React Development Masterclass',
      instructor: 'Nguyễn Văn A',
      rating: 4.8,
      students: 1250,
      duration: '12 giờ',
      price: 299000,
      originalPrice: 599000,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
      category: 'Lập trình',
      level: 'Trung cấp',
      isBestseller: true,
    },
    {
      id: 2,
      title: 'UI/UX Design Fundamentals',
      instructor: 'Trần Thị B',
      rating: 4.9,
      students: 890,
      duration: '8 giờ',
      price: 199000,
      originalPrice: 399000,
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
      category: 'Thiết kế',
      level: 'Cơ bản',
      isBestseller: false,
    },
    {
      id: 3,
      title: 'Digital Marketing Strategy',
      instructor: 'Lê Văn C',
      rating: 4.7,
      students: 2100,
      duration: '15 giờ',
      price: 399000,
      originalPrice: 799000,
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
      category: 'Marketing',
      level: 'Nâng cao',
      isBestseller: true,
    },
    {
      id: 4,
      title: 'JavaScript ES6+ Complete Guide',
      instructor: 'Phạm Thị D',
      rating: 4.6,
      students: 1800,
      duration: '10 giờ',
      price: 249000,
      originalPrice: 499000,
      thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=250&fit=crop',
      category: 'Lập trình',
      level: 'Trung cấp',
      isBestseller: false,
    },
    {
      id: 5,
      title: 'Business Analytics Fundamentals',
      instructor: 'Hoàng Văn E',
      rating: 4.5,
      students: 950,
      duration: '14 giờ',
      price: 349000,
      originalPrice: 699000,
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
      category: 'Kinh doanh',
      level: 'Cơ bản',
      isBestseller: false,
    },
    {
      id: 6,
      title: 'English for Business Communication',
      instructor: 'Nguyễn Thị F',
      rating: 4.8,
      students: 3200,
      duration: '20 giờ',
      price: 199000,
      originalPrice: 399000,
      thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=250&fit=crop',
      category: 'Ngoại ngữ',
      level: 'Trung cấp',
      isBestseller: true,
    },
  ]

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === '' || selectedCategory === 'Tất cả' || course.category === selectedCategory
    const matchesLevel = selectedLevel === '' || selectedLevel === 'Tất cả' || course.level === selectedLevel
    
    return matchesSearch && matchesCategory && matchesLevel
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Khám phá khóa học
            </h1>
            <p className="text-xl text-gray-600">
              Hơn 500+ khóa học từ các chuyên gia hàng đầu
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                {levels.map(level => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('')
                setSelectedLevel('')
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Tìm thấy <span className="font-semibold">{filteredCourses.length}</span> khóa học
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden card-hover">
              <div className="relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                {course.isBestseller && (
                  <div className="absolute top-4 left-4 bg-accent-500 text-white px-2 py-1 rounded text-sm font-medium">
                    Bán chạy
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-primary-600 text-white px-2 py-1 rounded text-sm">
                  {course.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 mb-4">Giảng viên: {course.instructor}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 text-gray-700">{course.rating}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{course.students.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-primary-600">
                      {course.price.toLocaleString('vi-VN')}đ
                    </span>
                    {course.originalPrice > course.price && (
                      <span className="text-gray-500 line-through">
                        {course.originalPrice.toLocaleString('vi-VN')}đ
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{course.level}</span>
                </div>

                <Link
                  to={`/courses/${course.id}`}
                  className="w-full btn-primary text-center block"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy khóa học
            </h3>
            <p className="text-gray-600">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseListPage
