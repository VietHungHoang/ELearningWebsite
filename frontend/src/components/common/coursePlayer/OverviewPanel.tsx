// Overview content for course. Replace mock data fields when integrating API.
import React, { useState } from 'react';

type Props = { course: any };

const OverviewPanel: React.FC<Props> = ({ course }) => {
  const [expanded, setExpanded] = useState(false);
  const desc = expanded ? course.description : (course.description || '').slice(0, 520);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-lg font-semibold">{course.subtitle}</span>
        <span className="inline-flex items-center gap-1 text-sm px-2 py-0.5 rounded-full bg-green-50 text-green-700">5.0 <span className="text-gray-400">(6 Reviews)</span></span>
        <span className="text-sm text-gray-500">Last updated: {course.lastUpdated}</span>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        <div><span className="font-medium">Level:</span> {course.level}</div>
        <div><span className="font-medium">Language:</span> {course.language}</div>
        <div><span className="font-medium">Enrolments:</span> {course.enrolments}</div>
        <div><span className="font-medium">Views:</span> {course.views}</div>
      </div>

      <div className="text-gray-700 leading-7">
        {desc}
        {course.description && course.description.length > 520 && (
          <button onClick={() => setExpanded((s) => !s)} className="ml-2 text-[#134E4A] font-medium focus:outline-none focus:ring-2 focus:ring-[#134E4A] rounded">
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    </div>
  );
};

export default OverviewPanel;


