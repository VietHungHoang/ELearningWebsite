// Premium Features main page container. Replace mock data imports with API hooks when ready.
import React from 'react';
import { HeroPremium, PlansGrid, HowItWorksSection, FAQAccordion } from '../../components';
import { plans } from '../../data/premium-plans';

const PremiumFeaturesPage: React.FC = () => {
  return (
    <div className="bg-[#FAF8F6]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <HeroPremium />
        <div className="mt-16">
          <PlansGrid plans={plans} />
        </div>
      </div>

      <HowItWorksSection />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <FAQAccordion />
      </div>
    </div>
  );
};

export default PremiumFeaturesPage;


