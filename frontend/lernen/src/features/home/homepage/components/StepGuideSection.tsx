import React from 'react'

const StepGuideSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            <div className="h-px w-12 bg-gray-300"></div>
            <span className="mx-4 text-sm font-semibold text-[#065A46] tracking-wide uppercase">
              A Step-by-Step Guide
            </span>
            <div className="h-px w-12 bg-gray-300"></div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Unlock Your Potential with Easy Steps
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Learn how our platform simplifies finding and booking top tutors to enhance your skills and achieve your learning goals
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="flex flex-col rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300" style={{ backgroundColor: 'rgb(250, 248, 245)' }}>
            <div className="p-6 flex-1 text-center">
              <div className="inline-flex items-center px-3 py-1 text-[11px] font-semibold rounded-full bg-gray-100 text-gray-700 mx-auto">
                STEP 1
              </div>
              <div className="mt-5 w-28 h-28 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden mx-auto">
                <img 
                  src="/media/homepage/step-one.png" 
                  alt="Step 1 - Sign Up" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-[#065A46]">Sign Up</h3>
              <p className="mt-2 text-gray-600">
                Create your account quickly to get started with our platform
              </p>
            </div>
            <div className="px-6 pb-6">
              <button className="w-full rounded-lg bg-gray-100 text-gray-800 text-sm font-medium py-2.5 border border-gray-300 hover:bg-gray-200 transition-colors">
                Get Started
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300" style={{ backgroundColor: 'rgb(250, 248, 245)' }}>
            <div className="p-6 flex-1 text-center">
              <div className="inline-flex items-center px-3 py-1 text-[11px] font-semibold rounded-full bg-gray-100 text-gray-700 mx-auto">
                STEP 2
              </div>
              <div className="mt-5 w-28 h-28 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden mx-auto">
                <img 
                  src="/media/homepage/step-two.png" 
                  alt="Step 2 - Find a Tutor" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-[#065A46]">Find a Tutor</h3>
              <p className="mt-2 text-gray-600">
                Browse & select from qualified tutors based on your need
              </p>
            </div>
            <div className="px-6 pb-6">
              <button className="w-full rounded-lg bg-gray-100 text-gray-800 text-sm font-medium py-2.5 border border-gray-300 hover:bg-gray-200 transition-colors">
                Search Now
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300" style={{ backgroundColor: 'rgb(250, 248, 245)' }}>
            <div className="p-6 flex-1 text-center">
              <div className="inline-flex items-center px-3 py-1 text-[11px] font-semibold rounded-full bg-gray-100 text-gray-700 mx-auto">
                STEP 3
              </div>
              <div className="mt-5 w-28 h-28 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden mx-auto">
                <img 
                  src="/media/homepage/step-three.png" 
                  alt="Step 3 - Schedule a Lesson" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-[#065A46]">Schedule a Lesson</h3>
              <p className="mt-2 text-gray-600">
                Book a convenient time for your lesson with ease
              </p>
            </div>
            <div className="px-6 pb-6">
              <button className="w-full rounded-lg bg-gray-100 text-gray-800 text-sm font-medium py-2.5 border border-gray-300 hover:bg-gray-200 transition-colors">
                Let's Begin
              </button>
            </div>
          </div>

          {/* Card 4 - Emphasized */}
          <div className="flex flex-col rounded-2xl bg-[#065A46] text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="p-6 flex-1 text-center">
              <div className="mt-5 w-28 h-28 rounded-xl bg-[#054A3A] flex items-center justify-center overflow-hidden mx-auto">
                <img 
                  src="/media/homepage/step-one.png" 
                  alt="Step 4 - Start Your Journey" 
                  className="w-full h-full object-contain filter brightness-0 invert"
                />
              </div>
              <h3 className="mt-5 text-xl font-semibold">Start Your Journey</h3>
              <p className="mt-2 text-white/80">
                Begin your educational journey with us. Find a tutor and book your first session today!
              </p>
            </div>
            <div className="px-6 pb-6">
              <button className="w-full rounded-lg bg-orange-500 text-white text-sm font-semibold py-2.5 hover:bg-orange-600 transition-colors flex items-center justify-center">
                Get Started Now
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StepGuideSection