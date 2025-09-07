import { useAppSelector } from '../store/hooks'
import { Link } from 'react-router-dom'
import { BookOpen, Clock, Award, TrendingUp, Play, Check, Calendar } from 'lucide-react'

const DashboardPage = () => {
  const { user } = useAppSelector((state) => state.auth)

  // Mock data - replace with API calls
  const stats = [
    {
      title: 'Khóa học đang học',
      value: '3',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Thời gian học hôm nay',
      value: '2h 30m',
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Chứng chỉ đã nhận',
      value: '5',
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Điểm số trung bình',
      value: '8.5',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  const enrolledCourses = [
    {
      id: 1,
      title: 'React Development Masterclass',
      instructor: 'Nguyễn Văn A',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
      progress: 65,
      lastLesson: 'Props và State',
      nextLesson: 'React Hooks',
    },
    {
      id: 2,
      title: 'UI/UX Design Fundamentals',
      instructor: 'Trần Thị B',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
      progress: 30,
      lastLesson: 'Typography Basics',
      nextLesson: 'Color Theory',
    },
    {
      id: 3,
      title: 'Digital Marketing Strategy',
      instructor: 'Lê Văn C',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
      progress: 15,
      lastLesson: 'Market Research',
      nextLesson: 'Content Strategy',
    },
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'lesson_completed',
      title: 'Hoàn thành bài học "React Components cơ bản"',
      course: 'React Development Masterclass',
      time: '2 giờ trước',
    },
    {
      id: 2,
      type: 'course_enrolled',
      title: 'Đăng ký khóa học "Digital Marketing Strategy"',
      course: 'Digital Marketing Strategy',
      time: '1 ngày trước',
    },
    {
      id: 3,
      type: 'certificate_earned',
      title: 'Nhận chứng chỉ "JavaScript Fundamentals"',
      course: 'JavaScript Fundamentals',
      time: '3 ngày trước',
    },
  ]

  const upcomingDeadlines = [
    {
      id: 1,
      title: 'Bài tập React Hooks',
      course: 'React Development Masterclass',
      deadline: '2024-01-20',
      type: 'assignment',
    },
    {
      id: 2,
      title: 'Dự án cuối khóa',
      course: 'UI/UX Design Fundamentals',
      deadline: '2024-01-25',
      type: 'project',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Chào mừng trở lại, {user?.name}!
            </h1>
            <p className="text-gray-600 mt-2">
              Tiếp tục hành trình học tập của bạn
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enrolled Courses */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Khóa học đang học
                </h2>
                <Link
                  to="/courses"
                  className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                >
                  Xem tất cả
                </Link>
              </div>

              <div className="space-y-6">
                {enrolledCourses.map((course) => (
                  <div key={course.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Giảng viên: {course.instructor}
                      </p>
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                          <span>Tiến độ</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Bài học tiếp theo: {course.nextLesson}
                      </p>
                    </div>
                    <Link
                      to={`/courses/${course.id}`}
                      className="btn-primary"
                    >
                      Tiếp tục
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Hoạt động gần đây
              </h2>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {activity.type === 'lesson_completed' && <Check className="w-4 h-4 text-primary-600" />}
                      {activity.type === 'course_enrolled' && <BookOpen className="w-4 h-4 text-primary-600" />}
                      {activity.type === 'certificate_earned' && <Award className="w-4 h-4 text-primary-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        {activity.course} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Deadline sắp tới
              </h3>
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {deadline.title}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        deadline.type === 'assignment'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {deadline.type === 'assignment' ? 'Bài tập' : 'Dự án'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {deadline.course}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {deadline.deadline}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Thao tác nhanh
              </h3>
              <div className="space-y-3">
                <Link
                  to="/courses"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <BookOpen className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="text-gray-700">Tìm khóa học mới</span>
                </Link>
                <Link
                  to="/dashboard/profile"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Award className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="text-gray-700">Xem chứng chỉ</span>
                </Link>
                <button className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Play className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="text-gray-700">Tiếp tục học</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
