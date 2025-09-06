import React from 'react'
import FilterBar from '../components/findTutor/FilterBar'
import TutorCard from '../components/findTutor/TutorCard'
import TipsBox from '../components/findTutor/TipsBox'

const FindTutorPage = () => {
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
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-6">
          <a href="/" className="hover:text-[#134E4A] hover:underline">Home</a> &gt;{" "}
          <span className="text-gray-500">Find a Tutor</span>
        </nav>

        {/* Title */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-4">
            Find Your Perfect Tutor
          </h1>
          <p className="text-gray-500 text-lg">
            Browse hundreds of verified tutors and book your first session today.
          </p>
        </header>

        {/* Filters */}
        <FilterBar />

        <div className="grid grid-cols-12 gap-8 mt-12">
          {/* Tutors */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <TutorCard />
            <TutorCard />
            <TutorCard />
          </div>

          {/* Tips */}
          <aside className="col-span-12 lg:col-span-4">
            <TipsBox />
          </aside>
        </div>
      </div>
    </div>
  );
}

export default FindTutorPage
