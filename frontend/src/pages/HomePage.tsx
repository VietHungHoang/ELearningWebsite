import React from 'react'
import { 
  Hero, 
  FeatureTutors, 
  TestimonialsSection, 
  WhyChooseUs, 
  StepGuideSection, 
  ExploreCourses, 
  SupportSection, 
  ExpertGuideSection 
} from '../components'

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
