import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // Temporarily commented - using window.open instead
import { FaPlay, FaHeart } from 'react-icons/fa';
import { FiCalendar, FiMessageSquare } from 'react-icons/fi';
import { VscVerified } from 'react-icons/vsc';
import { PiStar, PiStudentLight, PiCalendar, PiBookOpenTextLight } from 'react-icons/pi';
import { HiOutlineLanguage } from 'react-icons/hi2';
import Avatar from 'react-avatar';
import { useTranslation } from 'react-i18next';
import type { Tutor } from '../../../../types/tutor';
import type { Subject } from '../../../../types/common';
import { getCountryFlag } from '../../../../lib/countryUtils';
import { flagComponents } from '../../../../lib/flagMapping';
import { useCurrency } from '../../../../context/CurrencyContext';
import { useChat } from '../../../../context/ChatContext';
import { convertFromVND, formatCurrency } from '../../../../utils/currencyHelper';
import useVideoThumbnail from '../../../../hooks/useVideoThumbnail';
import VideoModal from './VideoModal';

// Flag Icon Component
export const FlagIcon: React.FC<{ countryCode: string; className?: string }> = ({ countryCode, className = "" }) => {
  const FlagComponent = flagComponents[countryCode];

  if (FlagComponent) {
    return <FlagComponent className={`w-5.5 h-3.5 rounded-sm ${className}`} title={`${countryCode} flag`} />;
  }

  // Fallback to emoji if flag component not found
  return (
    <span className={`inline-flex items-center justify-center w-6 h-4 rounded-sm text-sm ${className}`} style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji' }} title={`${countryCode} flag`}>
      {getCountryFlag(countryCode)}
    </span>
  );
};

interface TutorCardProps {
  tutor: Tutor;
  onBookTrial?: (tutor: Tutor) => void; // Temporarily optional - commented out
}

const TutorCard: React.FC<TutorCardProps> = ({ tutor, onBookTrial: _onBookTrial }) => {
  const { t, i18n } = useTranslation();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);
  // const navigate = useNavigate(); // Temporarily commented - using window.open instead
  const { selectedCurrency } = useCurrency();
  const { openChatWithTutor } = useChat();

  // Auto-generate thumbnail from video
  const videoThumbnail = useVideoThumbnail(tutor.videoUrl);

  const toggleBio = () => setShowFullBio(!showFullBio);

  // Helper function to format VND as "200k" instead of "200,000"
  const formatVNDWithK = (amount: number): string => {
    const roundedAmount = Math.round(amount);
    if (roundedAmount >= 1000) {
      const thousands = roundedAmount / 1000;
      // If it's a whole number, show without decimals, otherwise show 1 decimal
      const formatted = thousands % 1 === 0 ? thousands.toString() : thousands.toFixed(1);
      return `₫${formatted}k`;
    }
    return `₫${roundedAmount}`;
  };

  // Convert price from VND (DB currency) to selected currency
  const convertedPrice = convertFromVND(tutor.currentSessionFee || 0, selectedCurrency);
  // Use custom format for VND, otherwise use standard formatCurrency
  const formattedPrice = selectedCurrency === 'VND'
    ? formatVNDWithK(convertedPrice)
    : formatCurrency(convertedPrice, selectedCurrency);

  const handlePlayClick = () => {
    setIsVideoModalOpen(true);
  };

  const handleTutorClick = () => {
    // Open tutor detail page in new tab
    const detailUrl = `/tutors/${tutor.id}`;
    window.open(detailUrl, '_blank');
  };

  const handleSendMessage = () => {
    openChatWithTutor(tutor.id, tutor.fullName);
  };

  const truncatedBio = tutor.introduction && tutor.introduction.length > 250 ? tutor.introduction.substring(0, 250) + '...' : (tutor.introduction || '');

  const StatItem = ({ icon, text }: { icon: React.ReactNode, text: React.ReactNode }) => (
    <div className="flex items-center text-sm text-gray-600">
      <div className="w-5 h-5 mr-1.5 flex-shrink-0 flex items-center justify-center">{icon}</div>
      <span>{text}</span>
    </div>
  );

  return (
    <>
      <div
        className="bg-white rounded-2xl p-5 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
        onClick={(e) => {
          // Only navigate if clicking on the card itself, not on buttons or interactive elements
          const target = e.target as HTMLElement;
          if (!target.closest('button') && !target.closest('video') && !target.closest('a')) {
            handleTutorClick();
          }
        }}
      >
        {/* Left side: Video and actions */}
        <div className="flex-shrink-0 w-full md:w-[300px] flex flex-col">
          <div className="relative aspect-[18/10] rounded-2xl overflow-hidden shadow-lg p-2 bg-white mb-3 group">
            <img
              src={videoThumbnail || tutor.avatarUrl}
              alt={tutor.fullName}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center cursor-pointer"
              onClick={handlePlayClick}
            >
              <button
                aria-label="Play video"
                className="w-14 h-14 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/50 transition-transform duration-300 group-hover:scale-110"
              >
                <FaPlay />
              </button>
            </div>
          </div>
          <div className="space-y-2 flex-grow">
            {/* Temporarily commented: Book trial session button */}
            {/* <button 
            onClick={() => onBookTrial(tutor)}
            className="w-full flex items-center justify-center bg-[#295C51] hover:bg-[#27574c] text-white font-bold py-2.25 px-4 rounded-lg">
              <span className="mr-2 text-sm font-medium">{t('findTutors.tutorCard.bookSession')}</span>
              <FiCalendar  />
            </button> */}
            {/* Replace with "View Details" button that opens in new tab */}
            <button
              onClick={handleTutorClick}
              className="w-full flex items-center justify-center bg-[#295C51] hover:bg-[#27574c] text-white font-bold py-2.25 px-4 rounded-lg">
              <span className="mr-2 text-sm font-medium">{t('findTutors.tutorCard.viewDetails')}</span>
              <FiCalendar />
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSendMessage}
                className="w-full flex items-center justify-center bg-gray-100 text-[#585858] font-bold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <span className="mr-2  text-sm font-medium">{t('findTutors.tutorCard.sendMessage')}</span>
                <FiMessageSquare />
              </button>
              <button className="p-2.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 hover:text-red-500 transition-colors">
                <FaHeart />
              </button>
            </div>
          </div>
        </div>

        {/* Right side: Tutor info */}
        <div className="flex-grow flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              {tutor.avatarUrl ? (
                <img src={tutor.avatarUrl} alt={tutor.fullName} className="w-13 h-13 rounded-lg object-cover cursor-pointer" onClick={handleTutorClick} />
              ) : (
                <div className="cursor-pointer" onClick={handleTutorClick}>
                  <Avatar name={tutor.fullName} size="52" round="8px" className="w-13 h-13" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-1">
                  <h3 className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-[#295C51] transition-colors" onClick={handleTutorClick}>{tutor.fullName}</h3>
                  {tutor.isVerified && <VscVerified style={{ color: 'rgb(51, 204, 94)', fontSize: '18px' }} title={t('findTutors.tutorCard.verifiedTutor')} />}
                  <FlagIcon countryCode={tutor.country.code} className="ml-1" />
                </div>
                <p className="text-sm text-gray-500 mt-1">{tutor.headline}</p>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <div className="flex items-center justify-end gap-2">
                <p className="text-xs text-gray-500">{t('findTutors.tutorCard.sessionFee')}</p>
              </div>
              <p className="text-2xl font-bold text-gray-800">{formattedPrice}<span className="text-sm font-normal text-gray-500">{t('findTutors.tutorCard.per1Hour')}</span></p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 mb-0.5">
            {/* Left stats column */}
            <div className="space-y-2">
              <StatItem
                icon={<PiStar style={{ color: 'rgb(88, 88, 88)', fontSize: '17px' }} />}
                text={<><span className="font-medium" style={{ color: 'rgb(88, 88, 88)' }}>{((tutor as any).averageRating || 0).toFixed(1)}/5.0</span> ({(tutor as any).reviewCount || 0} {((tutor as any).reviewCount !== 1 ? t('findTutors.tutorCard.reviews') : t('findTutors.tutorCard.review'))})</>}
              />
              <StatItem
                icon={<PiCalendar style={{ color: 'rgb(88, 88, 88)', fontSize: '17px' }} />}
                text={<><span className="font-medium" style={{ color: 'rgb(88, 88, 88)' }}>{tutor.bookedSessionsCount}</span> {t('findTutors.tutorCard.bookedSessions')}</>}
              />
              <StatItem
                icon={<PiStudentLight style={{ color: 'rgb(88, 88, 88)', fontSize: '17px' }} />}
                text={<><span className="font-medium" style={{ color: 'rgb(88, 88, 88)' }}>{tutor.studentCount}</span> {t('findTutors.tutorCard.students')}</>}
              />
            </div>
            {/* Right stats column */}
            <div className="space-y-2">
              <StatItem
                icon={<HiOutlineLanguage style={{ color: 'rgb(88, 88, 88)', fontSize: '17px' }} />}
                text={<><span className="font-medium" style={{ color: 'rgb(88, 88, 88)' }}>{t('findTutors.tutorCard.languages')}</span> {tutor.languages?.map((lang, index) => (
                  <React.Fragment key={lang.language.code}>
                    {lang.language.name}
                    {lang.isNative && <span className="ml-1 px-1 py-0.5 bg-gray-100 text-xs font-medium rounded">{t('findTutors.tutorCard.native')}</span>}
                    {index < tutor.languages.length - 1 && ', '}
                  </React.Fragment>
                )) || t('findTutors.tutorCard.notAvailable')}</>}
              />
              <StatItem
                icon={<PiBookOpenTextLight style={{ color: 'rgb(88, 88, 88)', fontSize: '17px' }} />}
                text={<><span className="font-medium" style={{ color: 'rgb(88, 88, 88)' }}>{t('findTutors.tutorCard.iCanTeach')}</span> {tutor.subjects?.map((s: Subject) => i18n.language === 'vi' ? s.nameVi : s.nameEn).join(', ') || t('findTutors.tutorCard.notAvailable')}</>}
              />
            </div>
          </div>

          <hr className="my-3 border-t border-gray-200" />

          <div className="mb-auto">
            <p className="text-sm text-gray-600">
              {showFullBio ? (tutor.introduction || '') : truncatedBio}
              {tutor.introduction && tutor.introduction.length > 150 && (
                <button
                  onClick={toggleBio}
                  className="text-[#295C51] hover:text-[#27574c] font-medium ml-1"
                >
                  {showFullBio ? t('findTutors.tutorCard.showLess') : t('findTutors.tutorCard.learnMore')}
                </button>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl={tutor.videoUrl}
        tutorName={tutor.fullName}
      />
    </>
  );
};

export default TutorCard;