import { Play, BookOpen, Clock } from 'lucide-react'
import type { Course } from '../../data/course-sample'

interface SidebarCourseCardProps {
  course: Course
}

const SidebarCourseCard = ({ course }: SidebarCourseCardProps) => {
  const totalLessons = course.curriculum.reduce((acc, chapter) => acc + chapter.lessons.length, 0)

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      {/* Video Thumbnail */}
      <div className="relative mb-6">
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <img
            src={course.videoThumbnail}
            alt={`${course.title} preview`}
            className="w-full h-48 object-cover"
          />
          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <button className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 transition-all duration-200 hover:scale-105">
              <Play className="w-8 h-8 text-gray-800" />
            </button>
          </div>
          {/* Duration Badge */}
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm font-medium">
            {course.videoDuration}
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-bold text-[#134E4A]">${course.price.toFixed(2)}</span>
          <span className="text-gray-500">/session</span>
        </div>
        {course.originalPrice && course.discount && (
          <div className="flex items-center gap-2">
            <span className="text-lg text-gray-500 line-through">
              ${course.originalPrice.toFixed(2)}
            </span>
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded font-medium">
              {course.discount}% OFF
            </span>
          </div>
        )}
      </div>

      {/* CTA Button */}
      <button className="w-full bg-[#134E4A] text-white rounded-lg py-3 font-medium hover:bg-[#0F3A36] transition-colors mb-6">
        View Course
      </button>

      {/* Price Includes */}
      <div className="space-y-3">
        <h3 className="font-medium text-gray-900">Price includes:</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BookOpen className="w-4 h-4 text-[#134E4A]" />
            <span>{course.curriculum.length} Topics</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Play className="w-4 h-4 text-[#134E4A]" />
            <span>{totalLessons} Lessons</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-[#134E4A]" />
            <span>Duration {course.videoDuration}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SidebarCourseCard
