import { useState } from 'react'
// Course components
import { 
  CourseHeader, 
  CourseTabsMain as CourseTabs, 
  CourseOverview, 
  LearningOutcomes, 
  CurriculumAccordion, 
  CourseFAQAccordion as FAQAccordion, 
  Prerequisites, 
  ReviewsSummary, 
  SidebarCourseCard, 
  CourseInstructorMiniCard as InstructorMiniCard, 
  ShareTags 
} from '../../components'
import { courseData, instructorData, reviewsData } from '../../data/course-sample'

const CourseDetailPage = () => {
  const [activeTab, setActiveTab] = useState('overview')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <CourseOverview course={courseData} />
            <LearningOutcomes outcomes={courseData.outcomes} />
          </div>
        )
      case 'objectives':
  return (
          <div className="space-y-8">
            <LearningOutcomes outcomes={courseData.outcomes} />
              </div>
        )
      case 'curriculum':
        return (
          <div className="space-y-8">
            <CurriculumAccordion curriculum={courseData.curriculum} />
                </div>
        )
      case 'prerequisites':
        return (
          <div className="space-y-8">
            <Prerequisites prerequisites={courseData.prerequisites} />
            <FAQAccordion faqs={courseData.faqs} />
          </div>
        )
      case 'reviews':
        return (
          <div className="space-y-8">
            <ReviewsSummary reviews={reviewsData} />
                </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F6]">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <CourseHeader course={courseData} />
            
            {/* Tabs Navigation */}
            <CourseTabs activeTab={activeTab} onTabChange={setActiveTab} />
            
            {/* Tab Content */}
            {renderTabContent()}
                    </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-5 space-y-6">
              {/* Course Summary Card */}
              <SidebarCourseCard course={courseData} />
              
               {/* Instructor Card */}
               <InstructorMiniCard instructor={instructorData} />
               
               {/* Share & Tags */}
               <ShareTags course={courseData} />
                            </div>
                          </div>
                        </div>
      </main>
    </div>
  )
}

export default CourseDetailPage