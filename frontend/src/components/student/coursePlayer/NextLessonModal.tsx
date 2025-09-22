import type { LessonDto } from '../../services/courseApi'

interface NextLessonModalProps {
  show: boolean
  nextLesson: LessonDto | null
  onContinue: () => void
  onSkip: () => void
  onRewatch: () => void
}

const NextLessonModal = ({ 
  show, 
  nextLesson, 
  onContinue, 
  onSkip, 
  onRewatch 
}: NextLessonModalProps) => {
  if (!show || !nextLesson) return null

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-2xl flex items-center justify-center z-50">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 border border-white/20">
        <div className="text-center">
          {/* Success Icon with Enhanced Animation */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-full animate-ping opacity-20"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          {/* Title */}
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
            🎉 Lesson Completed!
          </h3>
          
          <p className="text-gray-600 mb-8 text-lg font-medium">
            Excellent work! What would you like to do next?
          </p>
          
          {/* Next Lesson Preview */}
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 mb-8 border border-blue-200/50 shadow-lg">
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-bold text-gray-900 mb-2 text-lg">
                  {nextLesson.title}
                </h4>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {nextLesson.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 font-medium">Duration: {nextLesson.duration}</span>
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-sm font-semibold shadow-sm">
                    Next Lesson
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Rewatch Current Lesson */}
            <button
              onClick={onRewatch}
              className="group w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg flex items-center justify-center space-x-3 border border-purple-400/20"
            >
              <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="font-semibold text-lg">Rewatch This Lesson</span>
            </button>
            
            {/* Continue to Next Lesson */}
            <button
              onClick={onContinue}
              className="group w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg flex items-center justify-center space-x-3 border border-green-400/20"
            >
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <span className="font-semibold text-lg">Continue to Next Lesson</span>
            </button>
            
            {/* Maybe Later */}
            <button
              onClick={onSkip}
              className="w-full px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-2xl hover:border-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-all duration-300 font-medium"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NextLessonModal
