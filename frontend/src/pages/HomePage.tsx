import React from 'react'
import Hero from '../components/homepage/Hero'
import FeatureTutors from '../components/homepage/FeatureTutors'
import TestimonialsSection from '../components/homepage/TestimonialsSection'
import WhyChooseUs from '../components/homepage/WhyChooseUs'
import StepGuideSection from '../components/homepage/StepGuideSection'
import ExploreCourses from '../components/homepage/ExploreCourses'
import SupportSection from '../components/homepage/SupportSection'
import ExpertGuideSection from '../components/homepage/ExpertGuideSection'

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <main>
        <Hero />
        <StepGuideSection />
        <WhyChooseUs />
        <ExploreCourses />
        <SupportSection />
        <ExpertGuideSection />
        <FeatureTutors />
        <TestimonialsSection />
      </main>
    </div>
  )
}

export default HomePage
