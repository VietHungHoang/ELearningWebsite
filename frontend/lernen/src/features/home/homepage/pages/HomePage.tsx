import React from 'react';
import Layout from '../../../../components/ui/Layout';
import Hero from '../components/Hero';
import StepGuideSection from '../components/StepGuideSection';
import WhyChooseUs from '../components/WhyChooseUs';
// import CTASection from '../components/CTASection';
import ExpertGuideSection from '../components/ExpertGuideSection';
import SupportSection from '../components/SupportSection';
import FeatureTutors from '../components/FeatureTutors';
import TestimonialsSection from '../components/TestimonialsSection';

const HomePage: React.FC = () => {
  return (
    <Layout>
      <Hero />
      <StepGuideSection />
      <WhyChooseUs />
      <SupportSection />
      <ExpertGuideSection />
      <FeatureTutors />
      <TestimonialsSection />
    </Layout>
  );
};

export default HomePage;