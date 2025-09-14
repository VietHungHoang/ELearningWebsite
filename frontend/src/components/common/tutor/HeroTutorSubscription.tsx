// Hero section for Tutor Subscription page. Copy design from StudentSubscription with tutor-specific content.
import React from 'react';
import TutorMockupVisual from './TutorMockupVisual';

const HeroTutorSubscription: React.FC = () => {
  return (
    <section className="grid lg:grid-cols-2 gap-10 items-center">
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#134E4A]">
            <span className="inline-block w-10 h-[2px] bg-[#134E4A]" aria-hidden />
            Premium Features Unlocked
          </div>
          <h1 className="mt-3 text-3xl md:text-4xl font-extrabold text-gray-900">
            <span className="italic text-[#134E4A]">Tutor</span> Subscription
            <span className="block text-gray-800 font-semibold">and tools for an enhanced teaching experience.</span>
          </h1>
        </div>
        <p className="text-gray-600 max-w-prose">Access advanced teaching tools, personalized support, and exclusive features for a smoother teaching experience.</p>
        <div className="flex flex-wrap gap-3">
          <button className="px-5 py-2.5 rounded-full bg-[#134E4A] text-white focus:outline-none focus:ring-2 focus:ring-[#134E4A]">Tutor Packages</button>
          <button className="px-5 py-2.5 rounded-full border border-[#134E4A] text-[#134E4A] bg-white focus:outline-none focus:ring-2 focus:ring-[#134E4A]">Student Packages</button>
        </div>
      </div>

      <TutorMockupVisual />
    </section>
  );
};

export default HeroTutorSubscription;
