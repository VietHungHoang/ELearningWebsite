import React from 'react';
import { SearchIcon } from '../../../icon/SearchIcon';
import IntroducePanel from '../../../components/auth/IntroducePanel';
const Hero: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[50%_50%] gap-12 items-center">
        {/* Left Column */}
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center bg-gray-100 rounded-full px-4 py-2 text-sm font-medium text-gray-700 animate-fade-in-up">
            <span className="text-xl mr-2">👍</span> 100% Brighter Learning Platform
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 mt-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <span className="text-[#0b6459]">Empower Your Future:</span>
            <br />
            Learning Today for a Brighter Tomorrow
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Achieve your goals with personalized tutoring from top experts. Connect with dedicated tutors for success.
          </p>
          <div className="mt-8 relative max-w-lg mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <input 
              type="text" 
              placeholder="Search for tutors by subject..."
              className="w-full pl-6 pr-20 py-4 text-base bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0b6459]"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-800 hover:bg-gray-900 rounded-full flex items-center justify-center transition-transform hover:scale-110">
              <SearchIcon />
            </button>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="relative scale-[0.85] flex items-center justify-center">
          <div className="transform animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <IntroducePanel />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;