import React from 'react'
import FilterBar from '../../components/findTutor/FilterBar'
import TutorCard from '../../components/findTutor/TutorCard'
import TipsBox from '../../components/findTutor/TipsBox'

const FindTutorPage: React.FC = () => {
  // Mock data for tutors
  const tutors = [
    {
      id: 1,
      name: "Cynthia Hunter",
      title: "Empowering Students with Customized Learning Support",
      rating: 5.0,
      reviewCount: 1,
      bookedSessions: 74,
      sessions: 0,
      languages: ["Armenian", "Asturian"],
      price: 40.00,
      videoThumbnail: "/media/homepage/Anthony Shao.png",
      videoSource: "/media/homepage/tutor-video-1.mp4",
      description: "Hi! I am Cynthia Hunter, a dedicated and experienced tutor with a passion for helping students excel in their academic pursuits. With expertise across a variety of subjects, including mathematics, science, and language arts, I provide personalized learning experiences tailored to each student's unique needs and learning style."
    },
    {
      id: 2,
      name: "Antony Clara",
      title: "Expert Mathematics and Science Tutor",
      rating: 4.8,
      reviewCount: 12,
      bookedSessions: 156,
      sessions: 3,
      languages: ["English", "Spanish"],
      price: 35.00,
      videoThumbnail: "/media/homepage/Steven Ford.png",
      videoSource: "/media/homepage/tutor-video-2.mp4",
      description: "Hello! I'm Antony Clara, a passionate educator with over 5 years of experience in tutoring mathematics and science. I specialize in making complex concepts simple and engaging for students of all levels. My approach focuses on building confidence and critical thinking skills."
    },
    {
      id: 3,
      name: "Sarah Johnson",
      title: "Language Arts and Literature Specialist",
      rating: 4.9,
      reviewCount: 8,
      bookedSessions: 89,
      sessions: 2,
      languages: ["English", "French"],
      price: 45.00,
      videoThumbnail: "/media/homepage/Anthony Shao.png",
      videoSource: "/media/homepage/tutor-video-3.mp4",
      description: "Hi there! I'm Sarah Johnson, a literature enthusiast and experienced tutor specializing in English language arts, creative writing, and literature analysis. I help students develop strong communication skills and a love for reading and writing."
    }
  ]

  return (
    <div className="min-h-screen bg-[#FAF8F6]">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-sm text-gray-500">
            <span className="hover:text-gray-700 cursor-pointer">Home</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Find tutor</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Discover a skilled online tutor for your studies
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Master your studies with personalized online tutoring from expert educators. Our skilled tutors are here to help you build strong foundations and achieve your academic goals.
          </p>
        </div>

        {/* Filter Bar */}
        <FilterBar />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Tutor Listings */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Available Tutors ({tutors.length})
              </h2>
            </div>
            
            {/* Tutor Cards */}
            <div className="space-y-6">
              {tutors.map((tutor) => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-8">
              <button className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Load More Tutors
              </button>
            </div>
          </div>

          {/* Right Column - Tips Box */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <TipsBox />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FindTutorPage