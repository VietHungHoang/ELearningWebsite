import React from 'react'
import { ChevronLeft, ChevronDown, ChevronRight, Play, CheckCircle, Lock, Menu, X, Brain } from 'lucide-react'

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

interface Quiz {
  id: string
  title: string
  description?: string
  questions: any[]
  passingScore: number
  timeLimit?: number
  isActive: boolean
}

interface CourseSection {
  id: string
  title: string
  lessons: Lesson[]
  quiz?: Quiz
  quizCompleted?: boolean
  isUnlocked?: boolean
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
  onQuizSelect: (quizId: string, sectionId: string) => void
  onToggleSection: (sectionId: string) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

const CoursePlayerSidebar: React.FC<CoursePlayerSidebarProps> = ({
  courseTitle,
  sections,
  onBackToCourses,
  onLessonSelect,
  onQuizSelect,
  onToggleSection,
  isCollapsed = false,
  onToggleCollapse
}) => {
  // Debug log to check if component receives updated data
  console.log('DEBUG: CoursePlayerSidebar rendered with sections:', sections.map(s => ({
    id: s.id,
    title: s.title,
    lessons: s.lessons.map(l => ({ id: l.id, title: l.title, isCompleted: l.isCompleted }))
  })))
  const handleLessonClick = (lesson: Lesson, sectionId: string) => {
    if (lesson.isLocked) return
    onLessonSelect(lesson.id, sectionId)
  }

  const handleQuizClick = (quiz: Quiz, sectionId: string) => {
    if (!quiz.isActive) return
    onQuizSelect(quiz.id, sectionId)
  }

  const getLessonIcon = (lesson: Lesson, isLessonLocked?: boolean) => {
    if (lesson.isLocked || isLessonLocked) {
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
                {section.lessons.map((lesson) => {
                  // Check if lesson should be locked based on new logic
                  // Only lock lessons if section is not unlocked (not first section)
                  const isFirstSection = section.id.includes('section-1')
                  const isLessonLocked = lesson.isLocked || 
                    (!isFirstSection && !section.isUnlocked)
                  
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => handleLessonClick(lesson, section.id)}
                      disabled={isLessonLocked}
                      className={`w-full flex items-center space-x-3 p-2 rounded-md text-left transition-colors ${
                        lesson.isCurrent
                          ? 'bg-blue-600 text-white'
                          : lesson.isCompleted
                          ? 'bg-green-600/10 text-green-400 hover:bg-green-600/20'
                          : isLessonLocked
                          ? 'text-gray-500 cursor-not-allowed'
                          : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      {getLessonIcon(lesson, isLessonLocked)}
                      <div className="flex-1">
                        <div className="text-sm font-medium">{lesson.title}</div>
                        <div className="text-xs opacity-80">
                          {isLessonLocked ? 'Cần hoàn thành quiz section trước' : lesson.duration}
                        </div>
                      </div>
                    </button>
                  )
                })}
                
                {/* Section Quiz - Only show if all lessons are completed */}
                {section.quiz && section.quiz.isActive && (() => {
                  const allLessonsCompleted = section.lessons.every(lesson => lesson.isCompleted)
                  const isQuizLocked = !allLessonsCompleted && !section.quizCompleted
                  
                  return (
                    <button
                      onClick={() => handleQuizClick(section.quiz!, section.id)}
                      disabled={isQuizLocked}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                        isQuizLocked
                          ? 'bg-gray-600/10 text-gray-500 cursor-not-allowed border border-gray-600/20'
                          : section.quizCompleted
                          ? 'bg-green-600/10 text-green-400 hover:bg-green-600/20 border border-green-600/20'
                          : 'bg-purple-600/10 text-purple-400 hover:bg-purple-600/20 border border-purple-600/20'
                      }`}
                    >
                      <Brain className="w-4 h-4 text-purple-400" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{section.quiz.title}</div>
                        <div className="text-xs opacity-80">
                          {isQuizLocked 
                            ? 'Hoàn thành tất cả lessons trước' 
                            : section.quizCompleted
                            ? 'Đã hoàn thành'
                            : `${section.quiz.questions.length} questions • ${section.quiz.timeLimit || 10} min`
                          }
                        </div>
                      </div>
                    </button>
                  )
                })()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CoursePlayerSidebar
