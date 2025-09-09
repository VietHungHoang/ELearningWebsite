// Grid of pricing plans. Replace mock plans with API data when ready.
import React from 'react';
import PlanCard from './PlanCard';

type Plan = { id: string; name: string; description: string; price: string; period: string; features: string[]; recommended?: boolean; image?: string };

const PlansGrid: React.FC<{ plans: Plan[] }> = ({ plans }) => {
  return (
    <section>
      <div className="mb-6">
        <div className="text-xs uppercase tracking-wider text-[#134E4A]">Premium Features Unlocked</div>
        <h2 className="mt-2 text-2xl md:text-3xl font-bold text-gray-900">Acheive more with Student Plans</h2>
        <p className="text-sm text-gray-600">Upgrade to a plan that matches your learning goals!</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((p, idx) => (
          <PlanCard
            key={p.id}
            plan={{
              ...p,
              image:
                idx === 0
                  ? '/media/student-subscriptions/3f67e4ccf63d4d294cfb08f91e1993.png'
                  : idx === 1
                  ? '/media/student-subscriptions/f712dfcbe3adc52c099018410e3012.png'
                  : '/media/student-subscriptions/74d691ebcb3d5d0008dbcbf4f94101.png',
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default PlansGrid;


