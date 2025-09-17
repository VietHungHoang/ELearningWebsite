// Instructor mini profile card. Replace with link to instructor profile route.
import React from 'react';

type Instructor = {
  id: string;
  name: string;
  avatar: string;
  verified?: boolean;
  stats?: { students?: number; courses?: number };
  languages?: string[];
  bio?: string;
};

const InstructorMiniCard: React.FC<{ instructor: Instructor }> = ({ instructor }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4">
      <div className="flex items-center gap-3">
        <img src={instructor.avatar} alt={`${instructor.name} avatar`} className="w-12 h-12 rounded-full" loading="lazy" />
        <div>
          <div className="font-semibold flex items-center gap-1">
            {instructor.name}
            {instructor.verified && <span title="Verified" aria-label="Verified" className="text-emerald-600">✔</span>}
          </div>
          <div className="text-xs text-gray-500">{instructor.languages?.join(', ')}</div>
        </div>
      </div>
      <div className="mt-3 text-sm text-gray-700">{instructor.bio}</div>
      <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
        {typeof instructor.stats?.students === 'number' && <span>{instructor.stats?.students} Active students</span>}
        {typeof instructor.stats?.courses === 'number' && <span>{instructor.stats?.courses} Courses</span>}
      </div>
      <button className="mt-4 w-full border rounded-lg py-2 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#134E4A]">View Profile</button>
    </div>
  );
};

export default InstructorMiniCard;


