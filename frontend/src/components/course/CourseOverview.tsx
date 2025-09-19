import { useState } from 'react'
import type { Course } from '../../data/course-sample'

interface CourseOverviewProps {
  course: Course
}

const CourseOverview = ({ course }: CourseOverviewProps) => {
  const [showMore, setShowMore] = useState(false)
  const maxLength = 300

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">About This Course</h2>
      <div className="prose prose-gray max-w-none">
        <p className="text-gray-600 leading-relaxed">
          {showMore 
            ? course.description 
            : course.description.substring(0, maxLength) + '...'
          }
        </p>
        {course.description.length > maxLength && (
          <button
            onClick={() => setShowMore(!showMore)}
            className="text-[#134E4A] hover:text-[#0F3A36] font-medium mt-2 transition-colors"
          >
            {showMore ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    </div>
  )
}

export default CourseOverview
