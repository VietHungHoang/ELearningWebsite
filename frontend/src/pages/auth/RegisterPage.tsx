import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../store/hooks'
import { loginSuccess } from '../../store/slices/authSlice'
import { Eye, EyeOff, Mail, BookOpen, Users, MapPin, Book, Plus } from 'lucide-react'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'Tên là bắt buộc'
    if (!formData.lastName.trim()) newErrors.lastName = 'Họ là bắt buộc'

    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ'
    }

    if (!formData.phone.trim()) newErrors.phone = 'Số điện thoại là bắt buộc'

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp'
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = 'Bạn cần đồng ý với điều khoản'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    // Mock API call - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 1000))

    const mockUser = {
      id: 1,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      role: 'student' as const,
    }
    const mockToken = 'mock-jwt-token'

    dispatch(loginSuccess({ user: mockUser, token: mockToken }))
    navigate('/dashboard')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row w-full">
      {/* Left Panel - Marketing Section (same style as Login) */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-green-800 to-green-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center px-6 lg:px-12 text-center w-full py-8">
          {/* Logo */}
          <div className="mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3">
                <BookOpen className="w-6 h-6 text-green-800" />
              </div>
              <h1 className="text-3xl font-bold text-white">Lernen</h1>
            </div>
          </div>

          {/* Main Message */}
          <div className="mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-green-200 mb-2">
              Yes! we're making progress!
            </h2>
            <p className="text-lg lg:text-xl text-green-300">
              every minute & every second
            </p>
          </div>

          {/* Laptop Image */}
          <div className="relative mb-6">
            <div className="w-56 lg:w-72 h-36 lg:h-44 bg-gray-200 rounded-lg shadow-2xl transform rotate-3 relative overflow-hidden">
              {/* Mock laptop screen with video call */}
              <div className="absolute inset-2 bg-blue-100 rounded">
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded flex items-center justify-center">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4k+ Registered Tutors Section */}
          <div className="mb-6 bg-white rounded-lg p-4 shadow-lg w-full max-w-xs">
            <div className="text-sm font-semibold text-gray-800 mb-3">4k+ Registered Tutors</div>
            <div className="flex items-center justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  {i === 5 ? (
                    <Plus className="w-4 h-4 text-gray-600" />
                  ) : (
                    <div className="w-6 h-6 bg-green-500 rounded-full" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tutor Profile Card */}
          <div className="mb-6 bg-white rounded-lg p-4 shadow-lg w-full max-w-xs">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800 text-sm">Albert Flores</div>
                <div className="flex items-center text-xs text-gray-600 mb-1">
                  <Book className="w-3 h-3 mr-1" />
                  Science
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <MapPin className="w-3 h-3 mr-1" />
                  Manchester, UK
                </div>
              </div>
            </div>
          </div>

          {/* Circular Badge */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-28 h-28 lg:w-32 lg:h-32 bg-green-800 border-4 border-green-300 rounded-full flex items-center justify-center">
              <div className="text-center text-green-200 text-xs font-semibold leading-tight">
                EXPLORE & FIND<br />THE BEST TUTOR
              </div>
            </div>
            <div className="max-w-xs text-center">
              <p className="text-green-200 text-sm leading-relaxed">
                Begin your learning journey today and experience the transformative power of personalized education.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="w-full lg:flex-1 bg-[#FAF8F6] flex items-center justify-center px-4 sm:px-8 py-8 lg:py-12 lg:min-h-screen">
        <div className="w-full max-w-xl">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-1">Create Your Account</h2>
            <p className="text-gray-600">Join our learning community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Names Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-sm ${errors.firstName ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="First Name"
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-sm ${errors.lastName ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="Last Name"
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-sm ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="Email address"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone number *</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-3 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-sm ${errors.phone ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Enter phone number"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2.5 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-sm ${errors.password ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-3 py-2.5 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-sm ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="Confirm Password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <div className="flex items-center">
              <input
                id="agreeTerms"
                name="agreeTerms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-600 border-gray-300 rounded"
              />
              <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-700">
                Tôi chấp nhận <a className="text-green-700 hover:text-green-800" href="#">Điều khoản dịch vụ</a> & <a className="text-green-700 hover:text-green-800" href="#">Chính sách bảo mật</a>
              </label>
            </div>
            {errors.agreeTerms && <p className="-mt-2 text-sm text-red-600">{errors.agreeTerms}</p>}

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-green-700 text-white py-2.5 px-4 rounded-md font-medium hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 transition-colors text-sm"
            >
              Register
            </button>

            {/* Already have account */}
            <p className="text-sm text-gray-700">
              Already have an Account?{' '}
              <Link to="/auth/login" className="font-medium text-green-700 hover:text-green-800">Sign in</Link>
            </p>

            {/* OR + Google */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#FAF8F6] text-gray-500">OR</span>
              </div>
            </div>
            <button
              type="button"
              className="w-full bg-white border border-gray-300 text-gray-700 py-2.5 px-4 rounded-md font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-600 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Sign in with Google</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
