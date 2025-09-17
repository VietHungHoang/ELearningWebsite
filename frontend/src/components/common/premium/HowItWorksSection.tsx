// Green band with steps. Replace mock visuals later.
import React from 'react';
import HowStepCard from './HowStepCard';

const HowItWorksSection: React.FC = () => {
  return (
    <section className="bg-[#134E4A] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Upgrade for a better eLearning experience.</h2>
            <p className="text-white/80 max-w-prose">Upgrade your subscription to unlock advanced eLearning features and resources.</p>
          </div>
          <button className="self-start lg:self-auto bg-[#F97316] text-white px-5 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-white">Join as a Student</button>
        </div>

        <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
          <HowStepCard step="Step 1" title="Choose Plans" description="Explore a range of options designed to suit your needs and goals.">
            <img src="/media/student-subscriptions/howitwork-img01.png" alt="Choose plans mockup" className="w-full rounded-lg border shadow-sm" loading="lazy" />
          </HowStepCard>
          <HowStepCard step="Step 2" title="Choose your payment method" description="Select your preferred payment option for a seamless subscription experience.">
            <img src="/media/student-subscriptions/howitwork-img02.png" alt="Payment methods mockup" className="w-full rounded-lg border shadow-sm" loading="lazy" />
          </HowStepCard>
          <HowStepCard step="Step 3" title="Join Live Calls with Zoom Integration" description="Join live interactive sessions seamlessly with Zoom integration.">
            <img src="/media/student-subscriptions/howitwork-img03.png" alt="Live calls preview" className="w-full rounded-lg border shadow-sm" loading="lazy" />
          </HowStepCard>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;


