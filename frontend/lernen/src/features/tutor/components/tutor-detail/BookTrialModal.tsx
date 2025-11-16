import React, { useState, useEffect } from 'react';
import { FiX, FiCheckCircle } from 'react-icons/fi';

interface BookTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutor: { name: string; avatar: string; };
  mode?: 'trial' | 'purchase';
}

const TrialBenefit: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start gap-2">
        <div className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"><FiCheckCircle /></div>
        <span className="text-gray-600">{children}</span>
    </li>
);

const BookTrialModal: React.FC<BookTrialModalProps> = ({ isOpen, onClose, tutor, mode = 'trial' }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [message, setMessage] = useState('');

  const isTrial = mode === 'trial';
  const title = isTrial ? 'Request a Free Trial Lesson' : 'Purchase Course';
  const subtitle = isTrial ? `with ${tutor.name}` : `from ${tutor.name}`;
  const benefitsTitle = isTrial ? 'In your free trial, you\'ll get:' : 'With this course, you\'ll get:';
  const benefits = isTrial ? [
    'A 30-minute introductory lesson with your tutor.',
    'An assessment of your current skill level.',
    'A discussion about your personalized learning plan.'
  ] : [
    'Full access to all course materials.',
    'Personalized tutoring sessions.',
    'Certificate upon completion.'
  ];
  const buttonText = isTrial ? 'Request Your Free Trial' : 'Purchase Course';
  const footerText = isTrial ? '100% free, no payment information required.' : 'Secure payment processing.';

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setMessage('');
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Trial lesson request sent!');
    onClose();
  };

  if (!shouldRender) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity duration-300"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-trial-title"
    >
      <div className={`bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8 relative transition-all duration-300 ${isOpen ? 'animate-modal-in' : 'animate-modal-out'}`}>
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
              <img src={tutor.avatar} alt={tutor.name} className="w-14 h-14 rounded-full" />
              <div>
                <h2 id="book-trial-title" className="text-xl font-bold text-gray-800">{title}</h2>
                <p className="text-sm text-gray-500">{subtitle}</p>
              </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full" aria-label="Close modal">
            <FiX />
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200/80 mb-6">
            <p className="font-semibold text-sm text-gray-800 mb-2">{benefitsTitle}</p>
            <ul className="space-y-2 text-sm">
                {benefits.map((benefit, index) => (
                    <TrialBenefit key={index}>{benefit}</TrialBenefit>
                ))}
            </ul>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="trial-message" className="text-sm font-medium text-gray-700 block mb-1">
                Add a message (Optional)
              </label>
              <textarea 
                id="trial-message" 
                rows={3}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Let the tutor know your learning goals..."
                className="w-full bg-gray-100 border-transparent rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0b6459] resize-none"
              ></textarea>
            </div>
             <p className="text-xs text-center text-gray-500">
                {footerText}
             </p>
          </div>
          
          <button 
            type="submit" 
            className="w-full mt-6 bg-[#0b6459] text-white font-bold py-3.5 rounded-lg hover:bg-[#084c43] transition-colors btn-scale text-base"
          >
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookTrialModal;