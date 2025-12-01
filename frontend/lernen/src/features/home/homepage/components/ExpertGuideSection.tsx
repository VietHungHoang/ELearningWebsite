import React from 'react'

const ExpertGuideSection: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Content */}
          <div>
            <div className="text-[#065A46] text-sm font-semibold uppercase tracking-wide mb-4">
              User Guide
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our Experts Will Guide You to Mastery
            </h2>
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>
                Learn from our carefully selected expert tutors who bring years of knowledge, experience, and personalized instruction to help you succeed in your learning journey.
              </p>
              <p>
                Whether you're looking to improve your grades, prepare for exams, learn new skills, or follow a customized learning plan, our experts will guide you to achieve your full potential.
              </p>
            </div>
          </div>

          {/* Right Side - Illustration */}
          <div className="relative">
            <div className="relative w-full h-96 bg-white rounded-2xl flex items-center justify-center overflow-hidden">
              <img
                src="/media/homepage/user-guide.png"
                alt="User guide illustration"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ExpertGuideSection