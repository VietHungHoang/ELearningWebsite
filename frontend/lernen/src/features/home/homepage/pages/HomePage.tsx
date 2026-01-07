import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../../components/ui/Layout';
import Hero from '../components/Hero';
import StepGuideSection from '../components/StepGuideSection';
import WhyChooseUs from '../components/WhyChooseUs';
// import CTASection from '../components/CTASection';
import ExpertGuideSection from '../components/ExpertGuideSection';
import SupportSection from '../components/SupportSection';
import FeatureTutors from '../components/FeatureTutors';
import TestimonialsSection from '../components/TestimonialsSection';
import { useAuth } from '../../../../context/AuthContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAuth();

  useEffect(() => {
    // Redirect tutors to dashboard
    if (state.user?.role === 'tutor') {
      navigate('/dashboard');
    }
  }, [state.user?.role, navigate]);

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