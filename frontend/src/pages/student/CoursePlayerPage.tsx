import { useState } from 'react'
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

const CoursePlayerPage = () => {
  const navigate = useNavigate()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

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

  const {
    hasPreviousLesson,
    hasNextLesson,
    handleLessonSelect,
    handlePreviousLesson,
    handleNextLesson
  } = useLessonNavigation(courseData, currentLesson, setCourseData, setCurrentLesson)

  const {
    showQuiz,
    currentQuiz,
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
  const testUpdateProgress = () => {
    if (currentLesson && updateLessonProgress) {
      console.log('DEBUG: Testing updateLessonProgress directly')
      updateLessonProgress(currentLesson.id, true)
    }
  }

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
          onBackToCourses={handleBackToCourses}
          onLessonSelect={handleLessonSelect}
          onQuizSelect={handleQuizSelect}
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
                onComplete={handleQuizComplete}
                onSkip={handleQuizSkip}
                isRequired={false}
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