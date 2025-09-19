// Tutor Subscription main page container. Copy design from StudentSubscription with tutor-specific content.
import React from 'react';
import { HeroTutorSubscription, PlansGrid, HowItWorksSection, TutorFAQAccordion } from '../../components';
import { plans } from '../../data/premium-plans';

const TutorSubscriptionPage: React.FC = () => {
  return (
    <div className="bg-[#FAF8F6]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <HeroTutorSubscription />
        <div className="mt-16">
          <PlansGrid plans={plans} />
        </div>
      </div>

      <HowItWorksSection />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <TutorFAQAccordion />
      </div>
    </div>
  );
};

export default TutorSubscriptionPage;
