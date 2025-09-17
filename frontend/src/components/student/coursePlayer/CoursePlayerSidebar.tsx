import React from 'react'
import { ChevronLeft, ChevronDown, ChevronRight, Play, CheckCircle, Lock, Menu, X } from 'lucide-react'

interface Lesson {
  id: string
  title: string
  duration: string
  isCompleted: boolean
  isCurrent: boolean
  isLocked?: boolean
  videoUrl?: string
  description?: string
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
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

const CoursePlayerSidebar: React.FC<CoursePlayerSidebarProps> = ({
  courseTitle,
  sections,
  onBackToCourses,
  onLessonSelect,
  onToggleSection,
  isCollapsed = false,
  onToggleCollapse
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
    <div className={`bg-gray-900 text-white h-screen overflow-y-auto transition-all duration-300 ease-in-out ${
      isCollapsed ? 'w-16' : 'w-80'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        {/* Learn Icon and Toggle Button */}
        <div className="flex items-center justify-between mb-4">
          {!isCollapsed && (
            <img 
              src="/media/homepage/logo-default.svg" 
              alt="Lernen Logo"
              className="w-32 h-12 filter brightness-0 invert transition-opacity duration-300"
            />
          )}
          
          {/* Collapse Toggle Button */}
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <Menu className="w-5 h-5 text-gray-300" />
            ) : (
              <X className="w-5 h-5 text-gray-300" />
            )}
          </button>
        </div>

        {!isCollapsed && (
          <button
            onClick={onBackToCourses}
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">Back to Courses</span>
          </button>
        )}

        {!isCollapsed && (
          <>
            <div className="mb-2">
              <span className="text-xs text-gray-400 uppercase tracking-wide">Course Outline</span>
            </div>
            <h1 className="text-lg font-semibold leading-tight">
              {courseTitle}
            </h1>
          </>
        )}
      </div>

      {/* Course Sections */}
      <div className={`p-4 space-y-4 ${isCollapsed ? 'px-2' : ''}`}>
        {sections.map((section, sectionIndex) => (
          <div key={section.id} className="space-y-2">
            {/* Section Header */}
            {!isCollapsed ? (
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
                  <div className="space-y-1">
                    <div className="text-xs text-gray-400">
                      {section.progress.completed} / {section.progress.total} | {section.progress.duration}
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1">
                      <div 
                        className="bg-green-500 h-1 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${section.progress.total > 0 ? (section.progress.completed / section.progress.total) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </button>
            ) : (
              /* Collapsed Section Indicator */
              <div className="flex items-center justify-center p-2">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-300">{sectionIndex + 1}</span>
                </div>
              </div>
            )}

            {/* Section Lessons */}
            {!isCollapsed && section.isExpanded && (
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
