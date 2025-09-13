// FAQ & Prerequisites. Accessible accordion.
import React, { useState } from 'react';

type FAQ = { q: string; a: string };
type Props = { prerequisites: string[]; faqs: FAQ[] };

const PrereqFAQPanel: React.FC<Props> = ({ prerequisites, faqs }) => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-white border rounded-2xl p-4">
        <h3 className="font-semibold mb-3">Prerequisites</h3>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          {prerequisites.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </div>
      <div className="bg-white border rounded-2xl">
        <h3 className="font-semibold px-4 pt-4">FAQs</h3>
        <ul>
          {faqs.map((f, i) => {
            const expanded = open === i;
            return (
              <li key={i} className="border-t last:border-b">
                <button
                  className="w-full text-left px-4 py-3 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#134E4A]"
                  aria-expanded={expanded}
                  onClick={() => setOpen(expanded ? null : i)}
                >
                  <span className="font-medium">{f.q}</span>
                  <span className={`transition-transform ${expanded ? 'rotate-180' : ''}`}>⌄</span>
                </button>
                <div className={`px-4 pb-4 text-sm text-gray-700 overflow-hidden transition-all ${expanded ? 'max-h-[500px]' : 'max-h-0'}`}>{f.a}</div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default PrereqFAQPanel;


