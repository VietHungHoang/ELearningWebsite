import { useState } from 'react'
import { useAppSelector } from '../../store/hooks'
import { User, Mail, Phone, MapPin, Globe, Camera, Save, Edit, Award, BookOpen, Clock } from 'lucide-react'

const ProfilePage = () => {
  const { user } = useAppSelector((state) => state.auth)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    website: '',
    bio: 'Tôi là một học viên đam mê học tập và phát triển kỹ năng.',
  })

  // Mock data - replace with API calls
  const certificates = [
    {
      id: 1,
      courseName: 'JavaScript Fundamentals',
      issuedDate: '2024-01-15',
      certificateUrl: '#',
    },
    {
      id: 2,
      courseName: 'React Development Masterclass',
      issuedDate: '2024-01-10',
      certificateUrl: '#',
    },
    {
      id: 3,
      courseName: 'UI/UX Design Fundamentals',
      issuedDate: '2024-01-05',
      certificateUrl: '#',
    },
  ]

  const completedCourses = [
    {
      id: 1,
      title: 'JavaScript Fundamentals',
      instructor: 'Nguyễn Văn A',
      completedDate: '2024-01-15',
      score: 95,
    },
    {
      id: 2,
      title: 'React Development Masterclass',
      instructor: 'Trần Thị B',
      completedDate: '2024-01-10',
      score: 88,
    },
  ]

  const handleSave = () => {
    // Mock API call to save profile
    console.log('Saving profile:', formData)
    setIsEditing(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
              <p className="text-gray-600 mt-2">
                Quản lý thông tin cá nhân và thành tích học tập
              </p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-primary"
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Lưu thay đổi
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Chỉnh sửa
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-center space-x-6 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {formData.name}
                  </h2>
                  <p className="text-gray-600">{formData.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giới thiệu
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                />
              </div>

              {isEditing && (
                <div className="mt-6 flex space-x-4">
                  <button
                    onClick={handleSave}
                    className="btn-primary"
                  >
                    Lưu thay đổi
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              )}
            </div>

            {/* Certificates */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Chứng chỉ đã nhận
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificates.map((certificate) => (
                  <div key={certificate.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">
                        {certificate.courseName}
                      </h4>
                      <Award className="w-5 h-5 text-primary-600" />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Ngày cấp: {certificate.issuedDate}
                    </p>
                    <a
                      href={certificate.certificateUrl}
                      className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                    >
                      Xem chứng chỉ
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Completed Courses */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Khóa học đã hoàn thành
              </h3>
              <div className="space-y-4">
                {completedCourses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        {course.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Giảng viên: {course.instructor}
                      </p>
                      <p className="text-sm text-gray-500">
                        Hoàn thành: {course.completedDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-600">
                        {course.score}%
                      </div>
                      <div className="text-sm text-gray-600">Điểm số</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Thống kê học tập
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="w-5 h-5 text-primary-600 mr-3" />
                    <span className="text-gray-700">Khóa học đã học</span>
                  </div>
                  <span className="font-semibold text-gray-900">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Award className="w-5 h-5 text-primary-600 mr-3" />
                    <span className="text-gray-700">Chứng chỉ</span>
                  </div>
                  <span className="font-semibold text-gray-900">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-primary-600 mr-3" />
                    <span className="text-gray-700">Thời gian học</span>
                  </div>
                  <span className="font-semibold text-gray-900">45h</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Thao tác nhanh
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <BookOpen className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="text-gray-700">Tìm khóa học mới</span>
                </button>
                <button className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Award className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="text-gray-700">Tải chứng chỉ</span>
                </button>
                <button className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <User className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="text-gray-700">Cài đặt tài khoản</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
