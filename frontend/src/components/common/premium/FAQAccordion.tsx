// FAQ accordion list. Replace static items with backend content when available.
import React from 'react';
import FAQItem from './FAQItem';

const FAQAccordion: React.FC = () => {
  const items = [
    { q: 'How do I find a tutor?', a: 'Use the Find Tutors page to filter by subject, language, and availability.' },
    { q: 'How do I book a session?', a: 'Open a tutor profile and choose a slot that works for you.' },
    { q: 'What if I need to cancel or reschedule?', a: 'You can manage bookings from your dashboard subject to cancellation policy.' },
    { q: 'How do I pay for sessions?', a: 'We support PayPal, Stripe, and bank transfers.' },
  ];
  return (
    <section>
      <div className="text-center mb-8">
        <div className="text-xs uppercase tracking-wider text-gray-500">Frequently Asked Questions</div>
        <h2 className="mt-2 text-2xl md:text-3xl font-bold text-gray-900">Unlock Your eLearning Potential!</h2>
        <p className="text-sm text-gray-600">Discover common solutions and access official guidance</p>
      </div>
      <div className="space-y-3">
        {items.map((it, i) => (
          <FAQItem key={i} question={it.q} answer={it.a} defaultOpen={i === 0} />
        ))}
      </div>
    </section>
  );
};

export default FAQAccordion;


