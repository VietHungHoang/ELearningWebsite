import { CheckCircle, Users, BookOpen } from 'lucide-react'
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react'

interface Instructor {
  id: number
  name: string
  avatar: string
  isVerified: boolean
  activeStudents: number
  courses: number
  languages: string[]
  socialProfiles: { platform: string; url: string }[]
}

interface InstructorMiniCardProps {
  instructor: Instructor
}

const InstructorMiniCard = ({ instructor }: InstructorMiniCardProps) => {
  const renderSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="w-4 h-4" />
      case 'twitter':
        return <Twitter className="w-4 h-4" />
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />
      case 'instagram':
        return <Instagram className="w-4 h-4" />
      case 'youtube':
        return <Youtube className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <img
          src={instructor.avatar}
          alt={instructor.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{instructor.name}</h3>
            {instructor.isVerified && (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{instructor.activeStudents} Active students</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              <span>{instructor.courses} Courses</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {instructor.languages.join(', ')}
        </p>
      </div>

      <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors mb-4">
        View Profile
      </button>

      <div className="flex gap-2">
        {instructor.socialProfiles.map((social, index) => (
          <a
            key={index}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
            title={`Follow on ${social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}`}
          >
            {renderSocialIcon(social.platform)}
          </a>
        ))}
      </div>
    </div>
  )
}

export default InstructorMiniCard
