import React, { useState } from 'react';
import { FiX, FiCheckCircle, FiLoader } from 'react-icons/fi';
import ModalLayout from '../../../../components/ui/ModalLayout';
import { classService } from '../../../../services/classService';
import type { TrialSessionRequest } from '../../../../types/api';
import type { TutorDetail } from '../../../../types/tutor';
import Toast from '../../../../components/ui/Toast';
import { useAuth } from '../../../../context/AuthContext';
import Avatar from 'react-avatar';

interface BookTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutor: TutorDetail;
  selectedTimes: string[];
  onSuccess?: () => void;
}

const TrialBenefit: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start gap-2">
        <div className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"><FiCheckCircle /></div>
        <span className="text-gray-600">{children}</span>
    </li>
);

const BookTrialModal: React.FC<BookTrialModalProps> = ({ isOpen, onClose, tutor, selectedTimes, onSuccess }) => {
  const { state } = useAuth();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const title = 'Request a Free Trial Lesson';
  const subtitle = `with ${tutor.fullName}`;
  const benefitsTitle = 'In your free trial, you\'ll get:';
  const benefits = [
    'A 30-minute introductory lesson with your tutor.',
    'An assessment of your current skill level.',
    'A discussion about your personalized learning plan.'
  ];
  const buttonText = 'Request Your Free Trial';
  const footerText = '100% free, no payment information required.';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedTimes.length === 0) {
      setToast({ message: 'Please select a time slot', type: 'error' });
      return;
    }

    if (!state.user?.id) {
      setToast({ message: 'You must be logged in to request a trial session', type: 'error' });
      return;
    }

    setIsLoading(true);
    
    try {
      const utcDateTime = selectedTimes[0];
      
      const request: TrialSessionRequest = {
        tutorId: tutor.id,
        studentId: state.user?.id,
        sessionDateTime: utcDateTime,
        message: message.trim() || ''
      };
      
      const response = await classService.requestTrialSession(request);
      
      if (response.success) {
        setToast({ message: 'Trial session request sent successfully!', type: 'success' });
        // Call success callback
        onSuccess?.();
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setToast({ message: response.message || 'Failed to send trial session request', type: 'error' });
      }
    } catch (error: any) {
      console.error('Error requesting trial session:', error);
      setToast({ message: error.message || 'An error occurred while sending the trial session request', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ModalLayout isOpen={isOpen} onClose={onClose} maxWidth="md">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
              <Avatar
                src={tutor.avatarUrl}
                name={tutor.fullName}
                size="56"
                round="8px"
                className="w-14 h-14"
              />
              <div>
                <h2 id="book-trial-title" className="text-xl font-bold text-gray-800">{title}</h2>
                <p className="text-sm text-gray-500">{subtitle}</p>
              </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 hover:rounded-md transition-all p-2 w-8 h-8 flex items-center justify-center" aria-label="Close modal">
              <FiX className="w-6 h-6" />
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

          <div className="flex items-center gap-2 mb-6">
              <p className="font-semibold text-sm text-gray-800">Selected Times:</p>
              <div className="flex flex-wrap gap-2">
                  {selectedTimes.map((utcDateTime, index) => {
                      const date = new Date(utcDateTime);
                      const formattedDate = date.toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                      });
                      const formattedTime = date.toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit', 
                          hour12: true 
                      });
                      return (
                          <span key={index} className="text-sm font-medium text-gray-800">
                              {formattedDate} at {formattedTime}
                          </span>
                      );
                  })}
              </div>
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
              disabled={isLoading}
              className="w-full mt-6 bg-[#0b6459] text-white font-bold py-3.5 rounded-lg hover:bg-[#084c43] transition-colors text-base disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <FiLoader className="animate-spin" />}
              {isLoading ? 'Sending Request...' : buttonText}
            </button>
          </form>
        </ModalLayout>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
};

export default BookTrialModal;