import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../store/hooks'
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice'
import { Eye, EyeOff, BookOpen, Star, MapPin, Book, Users, Plus } from 'lucide-react'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState<'tutor' | 'student' | 'admin'>('student')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ'
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    dispatch(loginStart())

    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simulate successful login
      const mockUser = {
        id: 1,
        name: 'Nguyễn Văn A',
        email: formData.email,
        role: 'student' as const,
      }
      const mockToken = 'mock-jwt-token'

      dispatch(loginSuccess({ user: mockUser, token: mockToken }))
      navigate('/dashboard')
    } catch (error) {
      dispatch(loginFailure('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row w-full">
      {/* Left Panel - Marketing Section */}
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
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-semibold ml-1">4.8/5.0</span>
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

      {/* Right Panel - Login Form */}
      <div className="w-full lg:flex-1 bg-gray-50 flex items-center justify-center px-4 sm:px-8 py-8 lg:py-12 lg:min-h-screen">
        <div className="w-full max-w-md relative">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
            <p className="text-gray-600">We're glad to have you back.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember Me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-green-600 hover:text-green-500">
                  Forgot Password?
                </a>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Login
            </button>

            {/* User Type Selection */}
            <div>
              <p className="text-sm text-gray-700 mb-3">Login as</p>
              <div className="grid grid-cols-3 gap-2">
                {(['tutor', 'student', 'admin'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setUserType(type)}
                    className={`py-2 px-4 rounded-lg border text-sm font-medium transition-colors duration-200 ${
                      userType === type
                        ? 'bg-green-50 border-green-300 text-green-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-gray-700">
                Don't have an Account?{' '}
                <Link
                  to="/auth/register"
                  className="font-medium text-green-600 hover:text-green-500"
                >
                  Sign up
                </Link>
              </p>
            </div>

            {/* OR Separator */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">OR</span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>
          </form>

        </div>
        
        {/* Help Button */}
        <div className="absolute top-8 right-8">
          <button className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors duration-200">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
