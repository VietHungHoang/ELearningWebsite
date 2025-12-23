import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

interface RequestSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SessionType = 'Private' | 'Group';

const RequestSessionModal: React.FC<RequestSessionModalProps> = ({ isOpen, onClose }) => {
  const [sessionType, setSessionType] = useState<SessionType>('Private');
  const [shouldRender, setShouldRender] = useState(isOpen);
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); 
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) {
    return null;
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t('tutorDetail.requestSessionModal.requestSent'));
    onClose();
  };

  const SessionTypeButton: React.FC<{ type: SessionType }> = ({ type }) => (
    <button
      type="button"
      onClick={() => setSessionType(type)}
      className={`w-1/2 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none ${
        sessionType === type
          ? 'bg-white shadow'
          : 'text-gray-600 hover:bg-white/50'
      }`}
    >
      {type} {t('tutorDetail.requestSessionModal.session')}
    </button>
  );

  return (
    <div 
      className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="request-session-title"
    >
      <div className={`bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 sm:p-8 relative ${isOpen ? 'animate-modal-in' : 'animate-modal-out'}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 id="request-session-title" className="text-2xl font-bold text-gray-800">{t('tutorDetail.requestSessionModal.title')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close modal">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-[#F9F3EB] p-1 rounded-xl flex mb-6">
            <SessionTypeButton type="Private" />
            <SessionTypeButton type="Group" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="first-name" className="text-sm font-medium text-gray-700 block mb-1">
                {t('tutorDetail.requestSessionModal.firstName')} <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                id="first-name" 
                name="firstName" 
                defaultValue="Sarah"
                required 
                className="w-full bg-gray-100 border-transparent rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0b6459]" 
              />
            </div>
            <div>
              <label htmlFor="last-name" className="text-sm font-medium text-gray-700 block mb-1">
                {t('tutorDetail.requestSessionModal.lastName')} <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                id="last-name" 
                name="lastName" 
                defaultValue="Chapman"
                required 
                className="w-full bg-gray-100 border-transparent rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0b6459]" 
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-1">
              {t('tutorDetail.requestSessionModal.emailAddress')} <span className="text-red-500">*</span>
            </label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              defaultValue="student@amentotech.com"
              required 
              className="w-full bg-gray-100 border-transparent rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0b6459]" 
            />
          </div>

          <div className="mb-6">
            <label htmlFor="message" className="text-sm font-medium text-gray-700 block mb-1">
              {t('tutorDetail.requestSessionModal.message')} <span className="text-red-500">*</span>
            </label>
            <textarea 
              id="message" 
              name="message" 
              rows={5}
              required 
              placeholder={t('tutorDetail.requestSessionModal.messagePlaceholder')}
              className="w-full bg-gray-100 border-transparent rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0b6459] resize-none"
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-[#345B55] text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-colors btn-scale"
          >
            {t('tutorDetail.requestSessionModal.sendRequest')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestSessionModal;