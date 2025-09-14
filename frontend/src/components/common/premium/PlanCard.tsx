// Single plan card. Wire buy action to checkout when backend is ready.
import React from 'react';
import { useNavigate } from 'react-router-dom';

type Plan = { id: string; name: string; description: string; price: string; period: string; features: string[]; recommended?: boolean; image?: string };

const PlanCard: React.FC<{ plan: Plan }> = ({ plan }) => {
  const navigate = useNavigate();

  const handleBuyNow = () => {
    // Navigate to checkout with plan data
    navigate('/checkout', { 
      state: { 
        planData: {
          title: plan.name,
          duration: plan.period,
          price: parseFloat(plan.price.replace('$', '')),
          originalPrice: plan.recommended ? parseFloat(plan.price.replace('$', '')) * 1.2 : undefined
        }
      }
    });
  };

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-md border hover:translate-y-1 hover:shadow-lg transition h-[550px] w-[415px] flex flex-col ${plan.recommended ? 'ring-1 ring-emerald-600' : ''}`}>
      <div className="flex items-center gap-3">
        {plan.image ? (
          <img src={plan.image} alt="Plan icon" className="w-10 h-10 rounded-full border object-cover" loading="lazy" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-emerald-100" />
        )}
        <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
      </div>
      <p className="mt-3 text-sm text-gray-600 leading-6">{plan.description}</p>
      <div className="mt-5 text-2xl font-bold text-gray-900">{plan.price} <span className="text-base font-medium text-gray-600">/ {plan.period}</span></div>

      <div className="my-6 border-t border-gray-200" />
      <h4 className="text-lg font-semibold text-gray-900">Features</h4>
      <ul className="mt-3 space-y-3 text-sm text-gray-700">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2"><span className="mt-1 inline-block w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 text-[10px] leading-4 text-center">✓</span>{f}</li>
        ))}
      </ul>
      <button
        onClick={handleBuyNow}
        className="mt-auto w-full cursor-pointer rounded-xl bg-white text-orange-700 border-2 border-orange-500 py-3 shadow-sm hover:bg-orange-600 hover:text-white hover:border-orange-600 hover:shadow-md active:translate-y-[1px] transition-all focus:outline-none focus:ring-2 focus:ring-[#134E4A]"
      >
        Buy Now
      </button>
    </div>
  );
};

export default PlanCard;


