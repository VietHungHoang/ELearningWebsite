import React, { useState } from 'react';
import { ChevronDown, User, FileText, Calendar, DollarSign, MessageCircle } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  icon: React.ReactNode;
  answer: string;
}

const TutorFAQAccordion: React.FC = () => {
  const [activeItem, setActiveItem] = useState<number | null>(0);

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'How do I become a tutor?',
      icon: <User className="w-5 h-5 text-emerald-600" />,
      answer: 'Click on the "Become a Tutor" link and follow the instructions to sign up, create your profile, and submit the necessary documentation for approval.'
    },
    {
      id: '2',
      question: 'What qualifications do I need to become a tutor?',
      icon: <FileText className="w-5 h-5 text-emerald-600" />,
      answer: 'You need a relevant degree or certification in your subject area, teaching experience, and excellent communication skills. We also require a background check and references.'
    },
    {
      id: '3',
      question: 'How do I set my availability?',
      icon: <Calendar className="w-5 h-5 text-emerald-600" />,
      answer: 'Use our calendar system to set your available time slots. You can block out specific times, set recurring availability, and manage your schedule in real-time.'
    },
    {
      id: '4',
      question: 'How do I get paid?',
      icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
      answer: 'We offer multiple payment methods including direct bank transfer, PayPal, and Stripe. Payments are processed weekly, and you can track your earnings in your tutor dashboard.'
    },
    {
      id: '5',
      question: 'What should I do if a student cancels a session?',
      icon: <MessageCircle className="w-5 h-5 text-emerald-600" />,
      answer: 'If a student cancels more than 24 hours in advance, you\'ll receive full payment. For last-minute cancellations, you\'ll receive 50% payment. Always communicate with students about our cancellation policy.'
    },
    {
      id: '6',
      question: 'What teaching tools are available?',
      icon: <FileText className="w-5 h-5 text-emerald-600" />,
      answer: 'We provide a comprehensive suite of teaching tools including virtual whiteboard, screen sharing, file sharing, video recording, and interactive quizzes to enhance your teaching experience.'
    },
    {
      id: '7',
      question: 'How much can I earn as a tutor?',
      icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
      answer: 'Earnings vary based on your subject expertise, experience level, and subscription plan. Basic tutors earn $15-25/hour, Pro tutors earn $25-40/hour, and Elite tutors earn $40-60/hour.'
    },
    {
      id: '8',
      question: 'Is there support available for tutors?',
      icon: <MessageCircle className="w-5 h-5 text-emerald-600" />,
      answer: 'Yes! We provide 24/7 support for all tutors, including technical assistance, teaching resources, and professional development opportunities to help you succeed.'
    }
  ];

  const toggleItem = (index: number) => {
    setActiveItem(activeItem === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-px bg-emerald-200"></div>
          <span className="px-4 text-sm font-medium text-emerald-600 uppercase tracking-wider">
            Frequently Asked Questions
          </span>
          <div className="w-16 h-px bg-emerald-200"></div>
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Unlock Your Teaching Potential!
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover Common Solutions and Access Official Guidance for Tutors
        </p>
      </div>

      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                {item.icon}
                <span className="text-lg font-semibold text-gray-900">
                  {item.question}
                </span>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                  activeItem === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            {activeItem === index && (
              <div className="px-6 pb-4">
                <div className="pl-9">
                  <p className="text-gray-600 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TutorFAQAccordion;
