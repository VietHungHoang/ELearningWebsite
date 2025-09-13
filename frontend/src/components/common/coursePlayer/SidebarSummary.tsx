// Right sidebar summary card and related sections. Replace with real pricing and enrollment actions.
import React from 'react';
import InstructorMiniCard from './InstructorMiniCard';

type Props = { course: any };

const ReviewExcerpt: React.FC<{ review: any }> = ({ review }) => (
  <div className="bg-white rounded-2xl shadow-sm p-4">
    <div className="flex items-center gap-3">
      <img src={review.avatar} alt="Reviewer avatar" className="w-8 h-8 rounded-full" loading="lazy" />
      <div className="text-sm font-medium">{review.name}</div>
    </div>
    <p className="mt-2 text-sm text-gray-700 line-clamp-4">{review.text}</p>
  </div>
);

const SidebarSummary: React.FC<Props> = ({ course }) => {
  const price = course.discount ? (
    <div className="flex items-end gap-2">
      <span className="text-2xl font-semibold text-emerald-700">{course.price}</span>
      <span className="text-sm line-through text-gray-400">{course.originalPrice}</span>
      <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">-{course.discount}%</span>
    </div>
  ) : (
    <span className="text-2xl font-semibold text-emerald-700">{course.price}</span>
  );

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-lg p-4">
        {price}
        <button className="mt-3 w-full bg-[#134E4A] text-white py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#134E4A]">{course.ctaText || 'View Course'}</button>
        <ul className="mt-4 text-sm text-gray-700 space-y-1">
          <li>• {course.videosCount} Videos of {course.totalDuration}</li>
          <li>• {course.lessonsCount} Lessons</li>
        </ul>
      </div>

      <ReviewExcerpt review={course.reviews?.[0]} />

      <InstructorMiniCard instructor={course.instructor} />
    </div>
  );
};

export default SidebarSummary;


