// Accessible tabs container. Swap panels with real content when integrating.
import React, { useId, useState } from 'react';
import OverviewPanel from './OverviewPanel.tsx';
import PrereqFAQPanel from './PrereqFAQPanel.tsx';
import DiscussionPanel from './DiscussionPanel.tsx';

type Course = any;

type Props = { course: Course };

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'prereq', label: 'Prerequisites & FAQs' },
  { id: 'discussion', label: 'Discussion forum' },
  { id: 'notice', label: 'Noticeboard' },
];

const CourseTabs: React.FC<Props> = ({ course }) => {
  const [active, setActive] = useState('overview');
  const base = useId();

  return (
    <div className="bg-white rounded-2xl shadow-lg">
      <div role="tablist" aria-label="Course information" className="flex flex-wrap gap-4 md:gap-6 px-6 pt-5 border-b border-gray-100">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`${base}-tab-${t.id}`}
            aria-selected={active === t.id}
            aria-controls={`${base}-panel-${t.id}`}
            className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#134E4A] transition-colors border-b-2 ${
              active === t.id ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-6 space-y-6">
        <section
          role="tabpanel"
          id={`${base}-panel-overview`}
          aria-labelledby={`${base}-tab-overview`}
          hidden={active !== 'overview'}
        >
          <OverviewPanel course={course} />
        </section>
        <section
          role="tabpanel"
          id={`${base}-panel-prereq`}
          aria-labelledby={`${base}-tab-prereq`}
          hidden={active !== 'prereq'}
        >
          <PrereqFAQPanel faqs={course.faqs} prerequisites={course.prerequisites} />
        </section>
        <section
          role="tabpanel"
          id={`${base}-panel-discussion`}
          aria-labelledby={`${base}-tab-discussion`}
          hidden={active !== 'discussion'}
        >
          <DiscussionPanel />
        </section>
        <section
          role="tabpanel"
          id={`${base}-panel-notice`}
          aria-labelledby={`${base}-tab-notice`}
          hidden={active !== 'notice'}
        >
          <div className="text-sm text-gray-600">No notices yet.</div>
        </section>
      </div>
    </div>
  );
};

export default CourseTabs;
