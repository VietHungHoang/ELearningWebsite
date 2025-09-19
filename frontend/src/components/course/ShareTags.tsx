import { Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react'
import type { Course } from '../../data/course-sample'

interface ShareTagsProps {
  course: Course
}

const ShareTags = ({ course }: ShareTagsProps) => {
  const shareButtons = [
    { platform: 'facebook', icon: Facebook, color: 'hover:bg-blue-100 hover:text-blue-600' },
    { platform: 'twitter', icon: Twitter, color: 'hover:bg-blue-100 hover:text-blue-600' },
    { platform: 'linkedin', icon: Linkedin, color: 'hover:bg-blue-100 hover:text-blue-600' },
    { platform: 'instagram', icon: Instagram, color: 'hover:bg-pink-100 hover:text-pink-600' },
    { platform: 'youtube', icon: Youtube, color: 'hover:bg-red-100 hover:text-red-600' }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Share this course</h3>
        <div className="flex gap-2">
          {shareButtons.map(({ platform, icon: Icon, color }) => (
            <button
              key={platform}
              className={`w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 transition-colors ${color}`}
              title={`Share on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-gray-900 mb-3">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {course.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ShareTags
