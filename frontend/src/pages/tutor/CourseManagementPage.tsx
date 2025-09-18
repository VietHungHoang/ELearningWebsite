import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronDown, ChevronRight, CheckCircle, Settings } from 'lucide-react'

// Interface for sidebar menu items
interface MenuItem {
  id: string
  title: string
  icon: string
  completed?: boolean
  required?: boolean
  children?: MenuItem[]
  progress?: number
}

// Interface for course data
interface CourseData {
  id: string
  title: string
  category: string
  level: string
  status: 'draft' | 'review' | 'published'
  createdAt: string
  progress: number
  estimatedTime?: string
}

// Component for sidebar menu item
const SidebarMenuItem: React.FC<{
  item: MenuItem
  activeItem: string
  onItemClick: (id: string) => void
  level?: number
}> = ({ item, activeItem, onItemClick, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const isActive = activeItem === item.id
  const hasChildren = item.children && item.children.length > 0

  return (
    <div className={`${level > 0 ? 'ml-3' : ''}`}>
      <button
        onClick={() => {
          if (hasChildren) {
            setIsExpanded(!isExpanded)
          } else {
            onItemClick(item.id)
          }
        }}
        className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm rounded-xl transition-all duration-200 ${
          isActive
            ? 'bg-[#065A46] text-white shadow-lg'
            : 'text-gray-700 hover:bg-gray-50 hover:text-[#065A46]'
        }`}
      >
        <div className="flex items-center space-x-3">
          <span className="text-lg">{item.icon}</span>
          <span className="font-medium">{item.title}</span>
          {item.required && !item.completed && (
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
          )}
          {item.completed && (
            <CheckCircle className="w-4 h-4 text-green-500" />
          )}
          {item.progress !== undefined && item.progress > 0 && !item.completed && (
            <div className="flex items-center space-x-1">
              <div className="w-8 h-1 bg-gray-200 rounded-full">
                <div 
                  className="h-1 bg-[#065A46] rounded-full transition-all duration-300"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">{item.progress}%</span>
            </div>
          )}
        </div>
        {hasChildren && (
          <span className={`transform transition-transform duration-200`}>
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </span>
        )}
      </button>
      
      {hasChildren && isExpanded && (
        <div className="mt-2 space-y-1">
          {item.children?.map((child) => (
            <SidebarMenuItem
              key={child.id}
              item={child}
              activeItem={activeItem}
              onItemClick={onItemClick}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Component for different content sections
const ContentSection: React.FC<{ activeSection: string; courseData: CourseData }> = ({ 
  activeSection, 
  courseData 
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleChooseFile = () => {
    fileInputRef.current?.click()
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'course-landing-page':
        return (
          <div className="space-y-8">
            <div className="flex items-start justify-between">
              <div className="flex-1 mr-8">
                <h2 className="text-3xl font-bold text-gray-900">Course Landing Page</h2>
                <p className="text-gray-600 mt-2 text-md">Your course landing page is crucial to your success on our platform. If it's done right, it can also help you gain visibility in search engines like Google. As you complete this section, think about creating a compelling Course Landing Page that demonstrates why someone would want to enroll in your course.</p>
                
                {/* <p className="text-gray-600 mt-3 text-sm">Focus on student benefits, use relevant keywords for SEO, highlight your expertise, and ensure your course image and promotional video work together to create a professional first impression.</p> */}
              </div>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                60% Complete
              </div>
            </div>

            <div className="space-y-8">
              {/* Course Title - Full width */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-xl font-semibold text-[#065A46] mb-4">Course Title</h3>
                <input
                  type="text"
                  defaultValue={courseData.title}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#065A46] focus:border-transparent"
                  placeholder="Enter course title"
                />
                <p className="text-sm text-gray-500 mt-2">Your title should be a mix of attention-grabbing, informative, and optimized for search</p>
              </div>

              {/* Course Subtitle - Full width */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-xl font-semibold text-[#065A46] mb-4">Course Subtitle</h3>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#065A46] focus:border-transparent"
                  placeholder="Enter course subtitle"
                />
                <p className="text-sm text-gray-500 mt-2">Use 1 or 2 related keywords, and mention 3-4 of the most important areas</p>
              </div>

              {/* Basic Info - Language, Level, Category in one row */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-xl font-semibold text-[#065A46] mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#065A46] focus:border-transparent">
                      <option value="">Select language</option>
                      <option value="vietnamese">Tiếng Việt</option>
                      <option value="english">English</option>
                      <option value="chinese">中文 (Chinese)</option>
                      <option value="japanese">日本語 (Japanese)</option>
                      <option value="korean">한국어 (Korean)</option>
                      <option value="french">Français (French)</option>
                      <option value="spanish">Español (Spanish)</option>
                      <option value="german">Deutsch (German)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#065A46] focus:border-transparent">
                      <option value="">Select level</option>
                      <option value="beginner">Beginner Level</option>
                      <option value="intermediate">Intermediate Level</option>
                      <option value="advanced">Advanced Level</option>
                      <option value="all-levels">All Levels</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#065A46] focus:border-transparent">
                      <option value="">Select category</option>
                      <option value="development">Development</option>
                      <option value="business">Business</option>
                      <option value="finance-accounting">Finance & Accounting</option>
                      <option value="it-software">IT & Software</option>
                      <option value="office-productivity">Office Productivity</option>
                      <option value="personal-development">Personal Development</option>
                      <option value="design">Design</option>
                      <option value="marketing">Marketing</option>
                      <option value="lifestyle">Lifestyle</option>
                      <option value="photography-video">Photography & Video</option>
                      <option value="health-fitness">Health & Fitness</option>
                      <option value="music">Music</option>
                      <option value="teaching-academics">Teaching & Academics</option>
                    </select>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-3">Choose the primary language, difficulty level, and most relevant category for your course</p>
              </div>

              {/* Course Description - Full width */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-xl font-semibold text-[#065A46] mb-4">Course Description</h3>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#065A46] focus:border-transparent"
                  placeholder="Enter course description"
                />
                <p className="text-sm text-gray-500 mt-2">Description should have minimum 200 words</p>
              </div>

              {/* Media Upload Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-[#065A46] mb-4">Course Image</h3>
                  
                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                    {imagePreview ? (
                      <div className="space-y-4">
                        <img 
                          src={imagePreview} 
                          alt="Course preview" 
                          className="w-full h-48 object-cover rounded-lg mx-auto"
                        />
                        <div className="flex items-center justify-center space-x-4">
                          <button 
                            onClick={handleChooseFile}
                            className="px-4 py-2 bg-[#065A46] text-white rounded-xl hover:bg-[#054A3A]"
                          >
                            Change Image
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedImage(null)
                              setImagePreview(null)
                              if (fileInputRef.current) fileInputRef.current.value = ''
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </div>
                        {selectedImage && (
                          <p className="text-xs text-gray-500">
                            {selectedImage.name} ({(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
                          </p>
                        )}
                      </div>
                    ) : (
                      <>
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-600">Upload your course image</p>
                        <p className="text-xs text-gray-500">750x422 pixels recommended</p>
                        <button 
                          onClick={handleChooseFile}
                          className="mt-4 px-4 py-2 bg-[#065A46] text-white rounded-xl hover:bg-[#054A3A]"
                        >
                          Choose File
                        </button>
                      </>
                    )}
                  </div>
                  <p className="text-gray-600 mt-3 text-sm">Your course image is the first impression for potential students. Use high-quality images (750x422px recommended) with bright colors and visual elements that represent your subject. Keep text minimal and ensure professional quality for better enrollment rates.</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-[#065A46] mb-4">Promotional Video</h3>
                  
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v26.38a.75.75 0 01-1.28.53l-4.72-4.72H8.25a.75.75 0 01-.75-.75V11.25c0-.414.336-.75.75-.75h7.5z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">Upload promotional video</p>
                    <p className="text-xs text-gray-500">Students can preview this video before enrolling</p>
                    <button className="mt-4 px-4 py-2 bg-[#065A46] text-white rounded-xl hover:bg-[#054A3A]">
                      Upload Video
                    </button>
                  </div>
                  <p className="text-gray-600 mt-3 text-sm">Create a 1-2 minute video to connect with potential students. Introduce yourself, show course previews, and maintain clear audio quality. This personal touch significantly increases enrollment rates as students get to know your teaching style.</p>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'curriculum-editor':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Curriculum</h2>
                <p className="text-gray-600 mt-2">Start putting together your course by creating sections, lectures, and practice activities.</p>
              </div>
              <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
                30% Complete
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold mb-2">Create your first section</h3>
                <p className="text-gray-600 mb-6">A good course should have at least 5 lectures and be at least 30 minutes of video.</p>
                <button className="px-6 py-3 bg-[#065A46] text-white rounded-xl hover:bg-[#054A3A] font-medium">
                  + Add Section
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
                <div className="text-3xl mb-2">🎯</div>
                <h4 className="font-semibold mb-2">Plan your course</h4>
                <p className="text-sm text-gray-600">Outline your course content and learning objectives</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
                <div className="text-3xl mb-2">🎥</div>
                <h4 className="font-semibold mb-2">Record your content</h4>
                <p className="text-sm text-gray-600">Create engaging video lessons for your students</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
                <div className="text-3xl mb-2">✅</div>
                <h4 className="font-semibold mb-2">Add activities</h4>
                <p className="text-sm text-gray-600">Include quizzes and assignments to enhance learning</p>
              </div>
            </div>
          </div>
        )
      
      case 'pricing':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Pricing</h2>
                <p className="text-gray-600 mt-2">Set a price for your course and manage promotional campaigns.</p>
              </div>
              <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium">
                Not Started
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-xl font-semibold text-[#065A46] mb-4">Course Price</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (USD)</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#065A46]">
                      <option>Free</option>
                      <option>$19.99</option>
                      <option>$29.99</option>
                      <option>$39.99</option>
                      <option>$49.99</option>
                      <option>$59.99</option>
                      <option>$69.99</option>
                      <option>$79.99</option>
                      <option>$89.99</option>
                      <option>$99.99</option>
                    </select>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <h4 className="font-medium text-blue-900 mb-2">💡 Pricing Tips</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Consider your course length and depth</li>
                      <li>• Research competitor pricing</li>
                      <li>• Start with a competitive price</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-xl font-semibold text-[#065A46] mb-4">Revenue Share</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                    <span className="font-medium">Your Revenue</span>
                    <span className="text-[#065A46] font-bold">63%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                    <span className="font-medium">Platform Fee</span>
                    <span className="text-gray-600">37%</span>
                  </div>
                  <p className="text-sm text-gray-600">Revenue share applies to organic sales through the marketplace</p>
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return (
          <div className="space-y-8">
            <div className="text-center py-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Course Management!</h2>
              <p className="text-gray-600 text-lg mb-8">
                Complete all the required sections to publish your course and start teaching.
              </p>
              
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-[#065A46]">Course: {courseData.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    courseData.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    courseData.status === 'review' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {courseData.status === 'draft' ? 'Draft' : 
                     courseData.status === 'review' ? 'Under Review' : 'Published'}
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Overall Progress</span>
                    <span className="font-semibold text-[#065A46]">{courseData.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-[#065A46] h-3 rounded-full transition-all duration-500"
                      style={{ width: `${courseData.progress}%` }}
                    />
                  </div>
                  {courseData.estimatedTime && (
                    <p className="text-sm text-gray-500">{courseData.estimatedTime}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  return <div className="flex-1 p-8">{renderContent()}</div>
}

// Main CourseManagementPage component
const CourseManagementPage: React.FC = () => {
  const navigate = useNavigate()
  const { courseId } = useParams<{ courseId: string }>()
  const [activeSection, setActiveSection] = useState('course-landing-page')

  // Mock course data - in real app, fetch from API
  const courseData: CourseData = {
    id: courseId || '123',
    title: 'Lập trình React từ cơ bản đến nâng cao',
    category: 'Development',
    level: 'beginner',
    status: 'draft',
    createdAt: '2024-01-15',
    progress: 25,
    estimatedTime: '2 weeks remaining'
  }

  // Sidebar menu structure
  const menuItems: MenuItem[] = [
    {
      id: 'course-setup',
      title: 'Course Setup',
      icon: '⚙️',
      children: [
        { id: 'course-landing-page', title: 'Course Landing Page', icon: '🏠', completed: false, required: true, progress: 60 },
        { id: 'intended-learners', title: 'Intended Learners', icon: '👥', completed: false, required: true, progress: 0 },
        { id: 'course-structure', title: 'Course Structure', icon: '📚', completed: false, required: true, progress: 20 },
        { id: 'setup-test', title: 'Setup & Test Video', icon: '📹', completed: false, required: false, progress: 0 }
      ]
    },
    {
      id: 'curriculum',
      title: 'Curriculum',
      icon: '📖',
      children: [
        { id: 'curriculum-editor', title: 'Curriculum Editor', icon: '✏️', completed: false, required: true, progress: 30 },
        { id: 'bulk-uploader', title: 'Bulk Uploader', icon: '�', completed: false, required: false, progress: 0 },
        { id: 'captions', title: 'Captions', icon: '📝', completed: false, required: false, progress: 0 }
      ]
    },
    {
      id: 'film-edit',
      title: 'Film & Edit',
      icon: '🎬',
      children: [
        { id: 'film-yourself', title: 'Film Yourself', icon: '📹', completed: false, required: false, progress: 0 },
        { id: 'audio-video', title: 'Audio & Video', icon: '🔊', completed: false, required: false, progress: 0 },
        { id: 'mashup', title: 'Mashup', icon: '🎭', completed: false, required: false, progress: 0 }
      ]
    },
    {
      id: 'publish',
      title: 'Publish',
      icon: '🚀',
      children: [
        { id: 'pricing', title: 'Pricing', icon: '💰', completed: false, required: true, progress: 0 },
        { id: 'promotions', title: 'Promotions', icon: '🏷️', completed: false, required: false, progress: 0 },
        { id: 'course-messages', title: 'Course Messages', icon: '💬', completed: true, required: false },
        { id: 'accessibility', title: 'Accessibility', icon: '♿', completed: false, required: false, progress: 0 }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Fixed Top Header Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              <button
                onClick={() => navigate('/tutor/courses')}
                className="flex items-center space-x-2 text-gray-600 hover:text-[#065A46] transition-colors mt-1"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">Back to courses</span>
              </button>
              
              {/* Course Info - 2 rows */}
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-4">
                  <h1 className="text-lg font-semibold text-gray-900">
                    {courseData.title}
                  </h1>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide">
                    {courseData.status === 'draft' ? 'DRAFT' : 
                     courseData.status === 'review' ? 'REVIEW' : 'PUBLISHED'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                className="bg-[#065A46] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#054A3A] transition-colors"
                onClick={() => {
                  console.log('Saving...')
                }}
              >
                Save
              </button>
              <button className="text-gray-500 hover:text-[#065A46] transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with top padding to account for fixed header */}
      <div className="pt-20 flex">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <SidebarMenuItem
                key={item.id}
                item={item}
                activeItem={activeSection}
                onItemClick={setActiveSection}
              />
            ))}
          </nav>

          {/* Overall Progress */}
          <div className="p-6 border-t border-gray-200 mt-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                <span className="text-lg font-bold text-[#065A46]">{courseData.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#065A46] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${courseData.progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">Complete all sections to publish your course</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <ContentSection activeSection={activeSection} courseData={courseData} />
        </div>
      </div>
    </div>
  )
}

export default CourseManagementPage