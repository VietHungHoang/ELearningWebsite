// Accessible FAQ item. Replace mock content with CMS data later.
import React, { useState } from 'react';

const FAQItem: React.FC<{ question: string; answer: string; defaultOpen?: boolean }> = ({ question, answer, defaultOpen }) => {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="rounded-lg bg-[#fffaf7] border px-6 py-4">
      <button
        className="w-full flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-[#134E4A]"
        aria-expanded={open}
        role="button"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-medium text-gray-900">{question}</span>
        <span className={`transition-transform text-gray-500 ${open ? 'rotate-180' : ''}`}>⌄</span>
      </button>
      <div className={`text-sm text-gray-600 overflow-hidden transition-all ${open ? 'max-h-64 mt-2' : 'max-h-0'}`}>{answer}</div>
    </div>
  );
};

export default FAQItem;


