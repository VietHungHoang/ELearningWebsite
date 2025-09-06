import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, Users, Clock, Play, Check, ChevronDown, ChevronUp, BookOpen, Award, Globe } from 'lucide-react'

const CourseDetailPage = () => {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [expandedLessons, setExpandedLessons] = useState<number[]>([])

  // Mock course data - replace with API call
  const course = {
    id: 1,
    title: 'React Development Masterclass',
    instructor: {
      name: 'Nguyễn Văn A',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      bio: 'Chuyên gia React với 8 năm kinh nghiệm, đã đào tạo hơn 10,000 học viên.',
      rating: 4.9,
      students: 5000,
    },
    rating: 4.8,
    totalStudents: 1250,
    totalLessons: 45,
    duration: '12 giờ',
    level: 'Trung cấp',
    category: 'Lập trình',
    price: 299000,
    originalPrice: 599000,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    description: 'Khóa học React toàn diện từ cơ bản đến nâng cao, giúp bạn trở thành React Developer chuyên nghiệp.',
    whatYouWillLearn: [
      'Hiểu sâu về React Hooks và Functional Components',
      'Xây dựng ứng dụng React hoàn chỉnh',
      'Quản lý state với Redux và Context API',
      'Tối ưu hiệu suất ứng dụng React',
      'Testing và deployment',
      'Best practices và design patterns',
    ],
    requirements: [
      'Kiến thức cơ bản về JavaScript',
      'Hiểu biết về HTML và CSS',
      'Máy tính có kết nối internet',
    ],
    targetAudience: [
      'Developers muốn học React',
      'Sinh viên IT/Computer Science',
      'Freelancers muốn nâng cao kỹ năng',
    ],
    lessons: [
      {
        id: 1,
        title: 'Giới thiệu khóa học',
        duration: '15 phút',
        isFree: true,
        type: 'video',
      },
      {
        id: 2,
        title: 'Cài đặt môi trường phát triển',
        duration: '20 phút',
        isFree: true,
        type: 'video',
      },
      {
        id: 3,
        title: 'React Components cơ bản',
        duration: '45 phút',
        isFree: false,
        type: 'video',
      },
      {
        id: 4,
        title: 'Props và State',
        duration: '60 phút',
        isFree: false,
        type: 'video',
      },
      {
        id: 5,
        title: 'Bài tập thực hành',
        duration: '30 phút',
        isFree: false,
        type: 'assignment',
      },
    ],
    reviews: [
      {
        id: 1,
        user: 'Trần Văn B',
        rating: 5,
        comment: 'Khóa học rất hay, giảng viên dạy dễ hiểu và thực tế.',
        date: '2024-01-15',
      },
      {
        id: 2,
        user: 'Lê Thị C',
        rating: 4,
        comment: 'Nội dung chất lượng, bài tập thực hành tốt.',
        date: '2024-01-10',
      },
    ],
  }

  const toggleLesson = (lessonId: number) => {
    setExpandedLessons(prev => 
      prev.includes(lessonId) 
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    )
  }

  const tabs = [
    { id: 'overview', label: 'Tổng quan' },
    { id: 'curriculum', label: 'Nội dung khóa học' },
    { id: 'reviews', label: 'Đánh giá' },
    { id: 'instructor', label: 'Giảng viên' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                  {course.category}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                {course.description}
              </p>
              
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-gray-700">{course.rating}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{course.totalStudents.toLocaleString()} học viên</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <BookOpen className="w-4 h-4 mr-1" />
                  <span>{course.totalLessons} bài học</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="text-sm text-gray-600">Giảng viên</p>
                  <p className="font-medium text-gray-900">{course.instructor.name}</p>
                </div>
              </div>
            </div>

            {/* Course Card */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 sticky top-8">
                <div className="mb-4">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-3xl font-bold text-primary-600">
                    {course.price.toLocaleString('vi-VN')}đ
                  </span>
                  <span className="text-gray-500 line-through">
                    {course.originalPrice.toLocaleString('vi-VN')}đ
                  </span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    -50%
                  </span>
                </div>

                <button className="w-full btn-primary mb-4">
                  Đăng ký khóa học
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Hoặc{' '}
                    <Link to="/auth/login" className="text-primary-600 hover:text-primary-500">
                      đăng nhập
                    </Link>{' '}
                    để xem thêm
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>Quyền truy cập vĩnh viễn</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>Chứng chỉ hoàn thành</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span>Hỗ trợ 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Bạn sẽ học được gì?
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {course.whatYouWillLearn.map((item, index) => (
                          <div key={index} className="flex items-start">
                            <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Yêu cầu
                      </h3>
                      <ul className="space-y-2">
                        {course.requirements.map((req, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Đối tượng học viên
                      </h3>
                      <ul className="space-y-2">
                        {course.targetAudience.map((audience, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{audience}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Curriculum Tab */}
                {activeTab === 'curriculum' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Nội dung khóa học
                      </h3>
                      <span className="text-sm text-gray-600">
                        {course.totalLessons} bài học • {course.duration}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {course.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Play className="w-5 h-5 text-gray-400" />
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {lesson.title}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {lesson.duration} • {lesson.type === 'video' ? 'Video' : 'Bài tập'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {lesson.isFree && (
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                  Miễn phí
                                </span>
                              )}
                              <button
                                onClick={() => toggleLesson(lesson.id)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                {expandedLessons.includes(lesson.id) ? (
                                  <ChevronUp className="w-5 h-5" />
                                ) : (
                                  <ChevronDown className="w-5 h-5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Đánh giá từ học viên
                      </h3>
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="ml-1 text-gray-700">{course.rating}</span>
                        <span className="ml-2 text-gray-600">
                          ({course.reviews.length} đánh giá)
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {course.reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 pb-6">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{review.user}</h4>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700 mb-2">{review.comment}</p>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Instructor Tab */}
                {activeTab === 'instructor' && (
                  <div>
                    <div className="flex items-start space-x-4">
                      <img
                        src={course.instructor.avatar}
                        alt={course.instructor.name}
                        className="w-20 h-20 rounded-full"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {course.instructor.name}
                        </h3>
                        <p className="text-gray-600 mb-4">{course.instructor.bio}</p>
                        
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center">
                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                            <span className="ml-1 text-gray-700">{course.instructor.rating}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Users className="w-4 h-4 mr-1" />
                            <span>{course.instructor.students.toLocaleString()} học viên</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Khóa học liên quan
              </h3>
              <div className="space-y-4">
                {/* Related courses would go here */}
                <p className="text-gray-600 text-sm">
                  Không có khóa học liên quan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetailPage
