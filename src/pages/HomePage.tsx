import React from 'react'
import Hero from '../components/Hero'
import FeatureTutors from '../components/FeatureTutors'
import TestimonialsSection from '../components/TestimonialsSection'
import WhyChooseUs from '../components/WhyChooseUs'
import StepGuideSection from '../components/StepGuideSection'
import ExploreCourses from '../components/ExploreCourses'
import SupportSection from '../components/SupportSection'
import ExpertGuideSection from '../components/ExpertGuideSection'

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
