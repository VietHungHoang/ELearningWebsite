import { useState } from 'react'
import { ChevronDown, ChevronRight, Play, FileText, HelpCircle } from 'lucide-react'
import type { Chapter } from '../../data/course-sample'

interface CurriculumAccordionProps {
  curriculum: Chapter[]
}

const CurriculumAccordion = ({ curriculum }: CurriculumAccordionProps) => {
  const [expandedChapters, setExpandedChapters] = useState<number[]>([])

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    )
  }

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="w-4 h-4" />
      case 'pdf':
        return <FileText className="w-4 h-4" />
      case 'quiz':
        return <HelpCircle className="w-4 h-4" />
      default:
        return <Play className="w-4 h-4" />
    }
  }

  const totalLessons = curriculum.reduce((acc, chapter) => acc + chapter.lessons.length, 0)
  const totalDuration = "23 mins: 56 sec"

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Course Curriculum</h2>
        <p className="text-gray-600 mt-2">
          {curriculum.length} topics • {totalLessons} lessons • {totalDuration} total length
        </p>
      </div>

      <div className="space-y-3">
        {curriculum.map((chapter) => (
          <div key={chapter.id} className="bg-white rounded-lg border border-gray-100 shadow-sm">
            <button
              onClick={() => toggleChapter(chapter.id)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              aria-expanded={expandedChapters.includes(chapter.id)}
            >
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{chapter.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {chapter.lectures} lectures • {chapter.duration}
                </p>
              </div>
              {expandedChapters.includes(chapter.id) ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {expandedChapters.includes(chapter.id) && (
              <div className="border-t border-gray-100">
                <div className="px-4 py-3 space-y-3">
                  {chapter.lessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center gap-3 py-2">
                      <div className="flex-shrink-0">
                        {getLessonIcon(lesson.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">
                            {lesson.title}
                          </span>
                          {lesson.isPreview && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              Preview
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{lesson.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CurriculumAccordion
