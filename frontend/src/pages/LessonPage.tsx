import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Play, Pause, Volume2, VolumeX, Maximize, ChevronLeft, ChevronRight, BookOpen, Clock, Check } from 'lucide-react'

const LessonPage = () => {
  const { courseId, lessonId } = useParams()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Mock lesson data - replace with API call
  const lesson = {
    id: 1,
    title: 'React Components cơ bản',
    description: 'Học về cách tạo và sử dụng React Components, hiểu về JSX và cách render components.',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    duration: '45 phút',
    courseId: 1,
    courseTitle: 'React Development Masterclass',
    isCompleted: false,
    notes: [
      'React Components là các khối xây dựng cơ bản của ứng dụng React',
      'JSX cho phép viết HTML trong JavaScript',
      'Components có thể được tái sử dụng và kết hợp với nhau',
    ],
    resources: [
      {
        id: 1,
        name: 'Slide bài giảng',
        type: 'pdf',
        url: '#',
      },
      {
        id: 2,
        name: 'Code mẫu',
        type: 'zip',
        url: '#',
      },
    ],
  }

  const courseLessons = [
    { id: 1, title: 'Giới thiệu khóa học', duration: '15 phút', isCompleted: true },
    { id: 2, title: 'Cài đặt môi trường phát triển', duration: '20 phút', isCompleted: true },
    { id: 3, title: 'React Components cơ bản', duration: '45 phút', isCompleted: false },
    { id: 4, title: 'Props và State', duration: '60 phút', isCompleted: false },
    { id: 5, title: 'Bài tập thực hành', duration: '30 phút', isCompleted: false },
  ]

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleMuteToggle = () => {
    setIsMuted(!isMuted)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to={`/courses/${courseId}`}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Quay lại khóa học
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{lesson.title}</h1>
                <p className="text-sm text-gray-600">{lesson.courseTitle}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="btn-primary">
                Đánh dấu hoàn thành
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Video Player */}
            <div className="bg-black rounded-lg overflow-hidden mb-6">
              <div className="relative aspect-video">
                <video
                  className="w-full h-full"
                  poster="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop"
                >
                  <source src={lesson.videoUrl} type="video/mp4" />
                  Trình duyệt của bạn không hỗ trợ video.
                </video>
                
                {/* Video Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={handlePlayPause}
                        className="text-white hover:text-gray-300"
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                      </button>
                      
                      <div className="flex items-center space-x-2 text-white">
                        <span className="text-sm">{formatTime(currentTime)}</span>
                        <div className="w-64 h-1 bg-gray-600 rounded-full">
                          <div className="w-1/3 h-full bg-white rounded-full" />
                        </div>
                        <span className="text-sm">{formatTime(duration)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleMuteToggle}
                        className="text-white hover:text-gray-300"
                      >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                      <button className="text-white hover:text-gray-300">
                        <Maximize className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lesson Content */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {lesson.title}
              </h2>
              <p className="text-gray-600 mb-6">
                {lesson.description}
              </p>

              {/* Lesson Notes */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Ghi chú bài học
                </h3>
                <ul className="space-y-2">
                  {lesson.notes.map((note, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Tài liệu đính kèm
                </h3>
                <div className="space-y-2">
                  {lesson.resources.map((resource) => (
                    <a
                      key={resource.id}
                      href={resource.url}
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <BookOpen className="w-5 h-5 text-primary-600 mr-3" />
                      <span className="text-gray-700">{resource.name}</span>
                      <span className="ml-auto text-sm text-gray-500 uppercase">
                        {resource.type}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Bài trước
              </button>
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                Bài tiếp theo
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Nội dung khóa học
              </h3>
              
              <div className="space-y-2">
                {courseLessons.map((courseLesson) => (
                  <div
                    key={courseLesson.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      courseLesson.id === parseInt(lessonId || '0')
                        ? 'bg-primary-50 border border-primary-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          courseLesson.isCompleted
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {courseLesson.isCompleted ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <span className="text-xs">{courseLesson.id}</span>
                          )}
                        </div>
                        <div>
                          <h4 className={`text-sm font-medium ${
                            courseLesson.id === parseInt(lessonId || '0')
                              ? 'text-primary-600'
                              : 'text-gray-900'
                          }`}>
                            {courseLesson.title}
                          </h4>
                          <p className="text-xs text-gray-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {courseLesson.duration}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Tiến độ</span>
                  <span className="text-sm text-gray-600">40%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full" style={{ width: '40%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LessonPage
