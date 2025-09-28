import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CoursePlayerSidebar from '../../components/student/coursePlayer/CoursePlayerSidebar'
import CourseVideoPlayer from '../../components/student/coursePlayer/CourseVideoPlayer'
import CoursePlayerHeader from '../../components/student/coursePlayer/CoursePlayerHeader'
import CoursePlayerTabs from '../../components/student/coursePlayer/CoursePlayerTabs'
import NextLessonModal from '../../components/student/coursePlayer/NextLessonModal'
import LoadingScreen from '../../components/student/coursePlayer/LoadingScreen'
import ErrorScreen from '../../components/student/coursePlayer/ErrorScreen'
import LessonQuizComponent from '../../components/student/learning/LessonQuiz'
import { useCoursePlayer } from '../../hooks/useCoursePlayer'
import { useLessonNavigation } from '../../hooks/useLessonNavigation'
import { useQuizManagement } from '../../hooks/useQuizManagement'
import { useLessonCompletion } from '../../hooks/useLessonCompletion'
// import { certificateApi } from '../../services/certificateApi' // COMMENTED FOR TESTING
import { Award, CheckCircle, Clock, BookOpen } from 'lucide-react'

const CoursePlayerPage = () => {
  const navigate = useNavigate()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [finalTestCompleted, setFinalTestCompleted] = useState(false)

  // Custom hooks
  const {
    courseData,
    currentLesson,
    loading,
    error,
    setCourseData,
    setCurrentLesson,
    updateLessonProgress,
    findNextLesson
  } = useCoursePlayer()

  // Debug courseData
  React.useEffect(() => {
    if (courseData) {
      console.log('📚 Course Data Loaded:', {
        title: courseData.title,
        sections: courseData.sections?.length,
        finalQuiz: courseData.finalQuiz ? 'exists' : 'null',
        finalQuizTitle: courseData.finalQuiz?.title,
        finalQuizQuestions: courseData.finalQuiz?.questions?.length
      })
    }
  }, [courseData])

  const {
    hasPreviousLesson,
    hasNextLesson,
    handleLessonSelect: originalHandleLessonSelect,
    handlePreviousLesson,
    handleNextLesson
  } = useLessonNavigation(courseData, currentLesson, setCourseData, setCurrentLesson)

  // Override handleLessonSelect to check section unlock (like code cũ)
  const handleLessonSelect = (lessonId: string, sectionId: string) => {
    if (!courseData) return
    
    // Find the section containing the lesson
    const targetSection = courseData.sections.find(section => section.id === sectionId)
    if (!targetSection) return

    // Check if this section is unlocked (first section is always unlocked)
    const currentSectionIndex = courseData.sections.findIndex(section => section.id === sectionId)
    const isFirstSection = currentSectionIndex === 0
    if (!isFirstSection && !targetSection.isUnlocked) {
      alert('Bạn phải hoàn thành quiz của section trước đó trước khi có thể xem section này!')
      return
    }

    // Call original lesson select
    originalHandleLessonSelect(lessonId, sectionId)
  }

  const {
    showQuiz,
    currentQuiz,
    setCurrentQuiz,
    setShowQuiz,
    handleQuizComplete,
    handleQuizSkip,
    handleQuizSelect
  } = useQuizManagement(courseData, setCourseData, () => {
    // Lesson completion callback
    if (currentLesson && courseData) {
    updateLessonProgress(currentLesson.id, true)
    const next = findNextLesson(courseData, currentLesson.id)
    if (next) {
        // This will be handled by useLessonCompletion hook
      }
    }
  })

  const {
    showNextLessonModal,
    nextLesson,
    handleVideoEnd,
    handleContinueToNextLesson,
    handleSkipNextLesson,
    handleRewatchCurrentLesson
  } = useLessonCompletion(
    courseData,
    currentLesson,
    updateLessonProgress,
    findNextLesson,
    setCourseData,
    setCurrentLesson
  )

  // Debug log to check if updateLessonProgress is available
  console.log('DEBUG: updateLessonProgress function available:', typeof updateLessonProgress)
  
  // Test the function directly

  // Event handlers
  const handleBackToCourses = () => {
    navigate('/student/course-list')
  }

  const handleToggleSection = (sectionId: string) => {
    if (!courseData) return
    
    const updatedSections = courseData.sections.map(section => 
      section.id === sectionId 
        ? { ...section, isExpanded: !section.isExpanded }
        : section
    )
    
    setCourseData({
      ...courseData,
      sections: updatedSections
    })
  }

  // Check if all lessons are completed
  const areAllLessonsCompleted = () => {
    if (!courseData) return false
    
    // Debug each section and lesson
    const sectionStatus = courseData.sections.map(section => ({
      sectionTitle: section.title,
      totalLessons: section.lessons.length,
      completedLessons: section.lessons.filter(lesson => lesson.isCompleted).length,
      allCompleted: section.lessons.every(lesson => lesson.isCompleted)
    }))
    
    const completed = courseData.sections.every(section => 
      section.lessons.every(lesson => lesson.isCompleted)
    )
    
    console.log('🎯 Final Quiz Check:', {
      allLessonsCompleted: completed,
      finalQuizExists: !!courseData?.finalQuiz,
      sectionStatus: sectionStatus.map(s => ({
        title: s.sectionTitle,
        completed: s.completedLessons + '/' + s.totalLessons,
        allCompleted: s.allCompleted
      }))
    })
    return completed
  }

  // Handle final test start
  const handleStartFinalTest = () => {
    console.log('Starting final test...')
    // Set current quiz to final quiz
    if (courseData?.finalQuiz) {
      setCurrentQuiz(courseData.finalQuiz as any)
      setShowQuiz(true)
    }
  }

  // Handle final test completion
  const handleFinalTestComplete = async (result: any) => {
    const score = result.score || result
    try {
      console.log('🎯 Final test completed with score:', score)
      
      if (!courseData?.id) {
        throw new Error('Course ID not found')
      }
      
      // TODO: Call certificate API to complete final test and generate certificate (COMMENTED FOR TESTING)
      // const certificate = await certificateApi.finalTest.completeFinalTest(courseData.id, score)
      
      // MOCK DATA: Simulate certificate generation
      console.log('🎯 MOCK: Simulating certificate generation')
      const mockCertificate = {
        id: 'cert-' + Date.now(),
        certificateId: 'cert-' + Date.now(),
        templateId: 'template-001',
        verificationUrl: 'https://verify.example.com/cert-' + Date.now(),
        downloadUrl: 'https://download.example.com/cert-' + Date.now() + '.pdf'
      }
      
      if (mockCertificate) {
        console.log('✅ MOCK: Certificate generated successfully:', mockCertificate)
        setFinalTestCompleted(true)
        setShowQuiz(false)
        setCurrentQuiz(null)
        
        // Show success message with certificate info
        alert(`🎉 Chúc mừng! Bạn đã hoàn thành khóa học với điểm ${score}%!\n\n📜 Chứng chỉ đã được tạo thành công!\n\nCertificate ID: ${mockCertificate.id}\nKhóa học: ${courseData.title}\n\nTải xuống: ${mockCertificate.downloadUrl}`)
      } else {
        throw new Error('Certificate generation failed')
      }
    } catch (error) {
      console.error('❌ Error completing final test:', error)
      alert('❌ Có lỗi xảy ra khi hoàn thành final test. Vui lòng thử lại.')
    }
  }

  // Loading state
  if (loading) {
    return <LoadingScreen message="Loading course..." />
  }

  // Error state
  if (error || !courseData) {
    return (
      <ErrorScreen 
        error={error || 'Course not found'} 
        slug={undefined}
        onBackToCourses={handleBackToCourses} 
      />
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Fixed Sidebar */}
      <div className={`fixed left-0 top-0 h-full z-30 transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'w-16' : 'w-80'
      }`}>
        <CoursePlayerSidebar
          courseTitle={courseData.title}
          sections={courseData.sections}
          finalQuiz={courseData.finalQuiz}
          finalQuizCompleted={finalTestCompleted}
          onBackToCourses={handleBackToCourses}
          onLessonSelect={handleLessonSelect}
          onQuizSelect={handleQuizSelect}
          onFinalQuizSelect={handleStartFinalTest}
          onToggleSection={handleToggleSection}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* Main Content with Fixed Header */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'ml-16' : 'ml-80'
      }`}>
        {/* Fixed Header */}
        <CoursePlayerHeader 
          courseProgress={courseData.progress}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Scrollable Content Area */}
        <div className="flex-1 pt-20 overflow-y-auto">
          <div className={`transition-all duration-300 ${
            isSidebarCollapsed ? 'p-4' : 'p-6'
          }`}>
            {showQuiz && currentQuiz ? (
              <LessonQuizComponent
                quiz={currentQuiz}
                onComplete={currentQuiz.id.startsWith('final-quiz-') ? handleFinalTestComplete : (result) => {
                  console.log('🎯 CoursePlayerPage onComplete called with:', result)
                  console.log('🎯 Calling handleQuizComplete...')
                  handleQuizComplete(result)
                }}
                onSkip={handleQuizSkip}
                isRequired={currentQuiz.id.startsWith('final-quiz-')}
              />
            ) : (
              <CourseVideoPlayer
                videoUrl={currentLesson?.videoUrl || courseData.videoUrl || ""}
                thumbnail={courseData.thumbnail}
                title={currentLesson?.title || courseData.title}
                instructor={courseData.instructor}
                onVideoEnd={handleVideoEnd}
                onPreviousLesson={handlePreviousLesson}
                onNextLesson={handleNextLesson}
                hasPreviousLesson={hasPreviousLesson()}
                hasNextLesson={hasNextLesson()}
                isSidebarCollapsed={isSidebarCollapsed}
              />
            )}
          </div>

          {/* Final Test Section */}
          {(() => {
            const shouldShow = courseData && !showQuiz && areAllLessonsCompleted() && !finalTestCompleted && courseData.finalQuiz
            console.log('🎯 Final Test Display Check:', {
              courseData: !!courseData,
              showQuiz,
              allLessonsCompleted: areAllLessonsCompleted(),
              finalTestCompleted,
              hasFinalQuiz: !!courseData?.finalQuiz,
              shouldShow
            })
            return shouldShow
          })() && (
            <div className={`transition-all duration-300 ${
            isSidebarCollapsed ? 'p-4' : 'p-6'
          }`}>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                  </div>
                  <div>
                      <h3 className="text-lg font-semibold text-gray-900">{courseData.finalQuiz?.title}</h3>
                      <p className="text-sm text-gray-600">{courseData.finalQuiz?.description}</p>
                  </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Score required:</span>
                    <span className="text-sm font-semibold text-blue-600">{courseData.finalQuiz?.passingScore}%</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Course Completion</span>
                  </div>
                    <p className="text-xs text-gray-500 mt-1">All lessons completed</p>
                      </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Final Test</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Pass with 70% or higher</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Certificate</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Auto-generated upon completion</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                      <span className="text-sm text-gray-500">Estimated time: {courseData.finalQuiz?.timeLimit || 30} minutes</span>
                </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                      <span className="text-sm text-gray-500">{courseData.finalQuiz?.questions?.length || 5} questions</span>
                  </div>
                    </div>
                <button
                    onClick={handleStartFinalTest}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center space-x-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Start Final Test</span>
                </button>
            </div>
          </div>
        </div>
      )}

          {/* Certificate Completion Section */}
          {courseData && finalTestCompleted && (
            <div className={`transition-all duration-300 ${
              isSidebarCollapsed ? 'p-4' : 'p-6'
            }`}>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Congratulations!</h3>
                      <p className="text-sm text-gray-600">You've successfully completed the course and earned your certificate</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-semibold text-green-600">Certificate Generated</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-gray-900">Course Completed</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">All lessons finished</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-gray-900">Final Test Passed</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Score: 85%</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-medium text-gray-900">Certificate Ready</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Available in My Certificates</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Completed: {new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Certificate ID: CERT-{Date.now().toString().slice(-8)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/student/certificates')}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center space-x-2"
                  >
                    <Award className="w-4 h-4" />
                    <span>View Certificate</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <CoursePlayerTabs 
            courseData={courseData}
            isSidebarCollapsed={isSidebarCollapsed}
          />
        </div>
      </div>

      {/* Next Lesson Modal */}
      <NextLessonModal
        show={showNextLessonModal}
        nextLesson={nextLesson}
        onContinue={handleContinueToNextLesson}
        onSkip={handleSkipNextLesson}
        onRewatch={handleRewatchCurrentLesson}
      />
    </div>
  )
}

export default CoursePlayerPage