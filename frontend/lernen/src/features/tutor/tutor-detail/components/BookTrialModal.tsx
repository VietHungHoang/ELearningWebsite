import React, { useState, useEffect } from 'react';
import { FiX, FiCheckCircle, FiLoader } from 'react-icons/fi';
import ModalLayout from '../../../../components/ui/ModalLayout';
import { classService } from '../../../../services/classService';
import type { TrialSessionRequest } from '../../../../types/api';
import type { TutorResponse } from '../../../../types/tutor';
import Toast from '../../../../components/ui/Toast';
import { useAuth } from '../../../../context/AuthContext';
import Avatar from 'react-avatar';
import { useTranslation } from 'react-i18next';

interface BookTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorId: string;
  tutorData?: any;
  selectedTimes: string[];
  selectedTimezone?: any;
  onSuccess?: () => void;
}

const TrialBenefit: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start gap-2">
        <div className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"><FiCheckCircle /></div>
        <span className="text-gray-600">{children}</span>
    </li>
);

const BookTrialModal: React.FC<BookTrialModalProps> = ({ isOpen, onClose, tutorId, tutorData, selectedTimes, selectedTimezone, onSuccess }) => {
    const [tutor, setTutor] = useState<TutorResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  const { state } = useAuth();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (!isOpen) return;
    if (tutorData) {
      setTutor(tutorData);
      setLoading(false);
      setError(null);
    }
  }, [isOpen, tutorData]);

  if (loading || !tutor) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const title = t('tutorDetail.bookTrialModal.title');
  const subtitle = t('tutorDetail.bookTrialModal.withTutor', { tutorName: tutor.fullName });
  const benefitsTitle = t('tutorDetail.bookTrialModal.benefitsTitle');
  const benefits = [
    t('tutorDetail.bookTrialModal.benefit1'),
    t('tutorDetail.bookTrialModal.benefit2'),
    t('tutorDetail.bookTrialModal.benefit3')
  ];
  const buttonText = t('tutorDetail.bookTrialModal.buttonText');
  const footerText = t('tutorDetail.bookTrialModal.footerText');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedTimes.length === 0) {
      setToast({ message: t('tutorDetail.bookTrialModal.selectTimeSlot'), type: 'error' });
      return;
    }

    if (!state.user?.id) {
      setToast({ message: t('tutorDetail.bookTrialModal.loginRequired'), type: 'error' });
      return;
    }

    setIsLoading(true);
    
    try {
      // selectedTimes already contains UTC+0 ISO strings, no need to convert
      const utcDateTime = selectedTimes[0];
      
      const request: TrialSessionRequest = {
        tutorId: tutor.id,
        studentId: state.user?.id,
        sessionDateTime: utcDateTime, // Already UTC+0
        message: message.trim() || ''
      };
      
      const response = await classService.requestTrialSession(request);
      
      if (response.success) {
        setToast({ message: t('tutorDetail.bookTrialModal.requestSuccess'), type: 'success' });
        // Call success callback
        onSuccess?.();
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setToast({ message: response.message || t('tutorDetail.bookTrialModal.requestFailed'), type: 'error' });
      }
    } catch (error: any) {
      console.error('Error requesting trial session:', error);
      setToast({ message: error.message || t('tutorDetail.bookTrialModal.requestError'), type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ModalLayout isOpen={isOpen} onClose={onClose} maxWidth="md">
        <div className="p-6">
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
              <p className="font-semibold text-sm text-gray-800">{t('tutorDetail.bookTrialModal.selectedTimes')}</p>
              <div className="flex flex-wrap gap-2">
                  {selectedTimes.map((utcISOString, index) => {
                      // selectedTimes is already in UTC+0, convert to user's selected timezone
                      const utcDate = new Date(utcISOString);
                      
                      if (!selectedTimezone) {
                          // No timezone, display UTC
                          const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
                          const formattedDate = utcDate.toLocaleDateString(locale, {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              timeZone: 'UTC'
                          });
                          const formattedTime = utcDate.toLocaleTimeString(locale, {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true,
                              timeZone: 'UTC'
                          });
                          
                          return (
                              <span key={index} className="text-sm font-medium text-gray-800">
                                  {formattedDate} {t('tutorDetail.bookTrialModal.at')} {formattedTime}
                              </span>
                          );
                      }
                      
                      // Convert UTC+0 to user's selected timezone using timeZone option
                      // This ensures we only convert once, not twice
                      const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
                      const formattedDate = utcDate.toLocaleDateString(locale, {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          timeZone: selectedTimezone.name // Use the timezone name (e.g., 'Asia/Ho_Chi_Minh')
                      });
                      const formattedTime = utcDate.toLocaleTimeString(locale, {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                          timeZone: selectedTimezone.name // Use the timezone name
                      });
                      
                      return (
                          <span key={index} className="text-sm font-medium text-gray-800">
                              {formattedDate} {t('tutorDetail.bookTrialModal.at')} {formattedTime}
                          </span>
                      );
                  })}
              </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="trial-message" className="text-sm font-medium text-gray-700 block mb-2">
                  {t('tutorDetail.bookTrialModal.addMessage')}
                </label>
                <textarea 
                  id="trial-message" 
                  rows={3}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={t('tutorDetail.bookTrialModal.messagePlaceholder')}
                  className="w-full bg-white border border-transparent rounded-lg px-4 py-2.5 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#0b6459] hover:border-gray-400 resize-none transition-all duration-100 ease-in-out hover:shadow-sm box-border"
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
              {isLoading ? t('tutorDetail.bookTrialModal.sendingRequest') : buttonText}
            </button>
          </form>
        </div>
        </ModalLayout>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
};

export default BookTrialModal;