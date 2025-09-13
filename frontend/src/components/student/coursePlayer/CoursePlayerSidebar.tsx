import React from 'react'
import { ChevronLeft, ChevronDown, ChevronRight, Play, CheckCircle, Lock } from 'lucide-react'

interface Lesson {
  id: string
  title: string
  duration: string
  isCompleted: boolean
  isCurrent: boolean
  isLocked?: boolean
}

interface CourseSection {
  id: string
  title: string
  lessons: Lesson[]
  isExpanded: boolean
  progress: {
    completed: number
    total: number
    duration: string
  }
}

interface CoursePlayerSidebarProps {
  courseTitle: string
  sections: CourseSection[]
  onBackToCourses: () => void
  onLessonSelect: (lessonId: string, sectionId: string) => void
  onToggleSection: (sectionId: string) => void
}

const CoursePlayerSidebar: React.FC<CoursePlayerSidebarProps> = ({
  courseTitle,
  sections,
  onBackToCourses,
  onLessonSelect,
  onToggleSection
}) => {
  const handleLessonClick = (lesson: Lesson, sectionId: string) => {
    if (lesson.isLocked) return
    onLessonSelect(lesson.id, sectionId)
  }

  const getLessonIcon = (lesson: Lesson) => {
    if (lesson.isLocked) {
      return <Lock className="w-4 h-4 text-gray-400" />
    }
    if (lesson.isCompleted) {
      return <CheckCircle className="w-4 h-4 text-green-600" />
    }
    if (lesson.isCurrent) {
      return <Play className="w-4 h-4 text-blue-600 fill-blue-600" />
    }
    return <Play className="w-4 h-4 text-gray-400" />
  }

  return (
    <div className="w-80 bg-gray-900 text-white h-screen overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <button
          onClick={onBackToCourses}
          className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm">Back to Courses</span>
        </button>

        <div className="mb-2">
          <span className="text-xs text-gray-400 uppercase tracking-wide">Course Outline</span>
        </div>
        <h1 className="text-lg font-semibold leading-tight">
          {courseTitle}
        </h1>
      </div>

      {/* Course Sections */}
      <div className="p-4 space-y-4">
        {sections.map((section, sectionIndex) => (
          <div key={section.id} className="space-y-2">
            {/* Section Header */}
            <button
              onClick={() => onToggleSection(section.id)}
              className="w-full flex items-center justify-between text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium">
                    {sectionIndex + 1}. {section.title}
                  </span>
                  {section.isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div className="text-xs text-gray-400">
                  {section.progress.completed} / {section.progress.total} | {section.progress.duration}
                </div>
              </div>
            </button>

            {/* Section Lessons */}
            {section.isExpanded && (
              <div className="ml-4 space-y-1">
                {section.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => handleLessonClick(lesson, section.id)}
                    disabled={lesson.isLocked}
                    className={`w-full flex items-center space-x-3 p-2 rounded-md text-left transition-colors ${
                      lesson.isCurrent
                        ? 'bg-blue-600 text-white'
                        : lesson.isCompleted
                        ? 'bg-green-600/10 text-green-400 hover:bg-green-600/20'
                        : lesson.isLocked
                        ? 'text-gray-500 cursor-not-allowed'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    {getLessonIcon(lesson)}
                    <div className="flex-1">
                      <div className="text-sm font-medium">{lesson.title}</div>
                      <div className="text-xs opacity-80">{lesson.duration}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CoursePlayerSidebar
