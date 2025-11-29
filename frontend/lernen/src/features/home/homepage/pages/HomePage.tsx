import React from 'react';
import Layout from '../../../../components/ui/Layout';
import Hero from '../components/Hero';
import FeaturesSection from '../components/FeaturesSection';
import StatsSection from '../components/StatsSection';
import CTASection from '../components/CTASection';

const HomePage: React.FC = () => {
  return (
    <Layout>
      <Hero />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
      {/* <HowItWorks />
      <PopularCourses />
      <TopTutors />
      <Testimonials /> */}
    </Layout>
  );
};

export default HomePage;