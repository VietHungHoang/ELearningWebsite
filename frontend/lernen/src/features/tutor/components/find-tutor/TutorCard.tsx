import React, { useState, useRef } from 'react';
import { FaPlay, FaHeart } from 'react-icons/fa';
import { FiCalendar, FiMessageSquare } from 'react-icons/fi';
import { VscVerified } from 'react-icons/vsc';
import { PiStar, PiStudentLight, PiCalendar } from 'react-icons/pi';
import { HiOutlineLanguage } from 'react-icons/hi2';
import type { Tutor } from '../../../../types/api';
import { getCountryFlag } from '../../../../lib/countryUtils';
import { flagComponents } from '../../../../lib/flagMapping';

// Flag Icon Component
const FlagIcon: React.FC<{ countryCode: string; className?: string }> = ({ countryCode, className = "" }) => {
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
  onBookTrial: (tutor: Tutor) => void;
}

const TutorCard: React.FC<TutorCardProps> = ({ tutor, onBookTrial }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayClick = () => {  
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleBio = () => {
    setShowFullBio(!showFullBio);
  };

  const truncatedBio = tutor.bio.length > 250 ? tutor.bio.substring(0, 250) + '...' : tutor.bio;

  const StatItem = ({ icon, text }: { icon: React.ReactNode, text: React.ReactNode }) => (
    <div className="flex items-center text-sm text-gray-600">
      <div className="w-5 h-5 mr-1.5 flex-shrink-0 flex items-center justify-center">{icon}</div>
      <span>{text}</span>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow duration-200">
      {/* Left side: Video and actions */}
      <div className="flex-shrink-0 w-full md:w-[280px] flex flex-col">
        <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3 group">
          <video
            ref={videoRef}
            poster={tutor.videoThumbnailUrl}
            controls={isPlaying}
            onEnded={() => setIsPlaying(false)}
            className="w-full h-full object-cover zoom-image"
          >
            <source src={tutor.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
           {!isPlaying && (
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
          )}
        </div>
        <div className="space-y-2 flex-grow">
          <button 
          onClick={() => onBookTrial(tutor)}
          className="w-full flex items-center justify-center bg-[#295C51] hover:bg-[#27574c] text-white font-bold py-2.25 px-4 rounded-lg">
            <span className="mr-2 text-sm font-medium">Book a session</span>
            <FiCalendar  />
          </button>
          <div className="flex items-center gap-2">
            <button className="w-full flex items-center justify-center bg-gray-100 text-[#585858] font-bold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
              <span className="mr-2  text-sm font-medium">Send message</span>
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
            <img src={tutor.avatarUrl} alt={tutor.name} className="w-13 h-13 rounded-lg object-cover" />
            <div>
              <div className="flex items-center gap-1">
                <h3 className="text-lg font-semibold text-gray-800">{tutor.name}</h3>
                {tutor.isVerified && <VscVerified style={{ color: 'rgb(51, 204, 94)', fontSize: '18px' }} title="Verified tutor" />}
                <FlagIcon countryCode={tutor.nationalityCode} className="ml-1" />
              </div>
              <p className="text-sm text-gray-500 mt-1">{tutor.specialization}</p>
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-4">
            <div className="flex items-center justify-end gap-2">
              <span className="text-base text-gray-400 line-through font-normal">$50.00</span>
              <p className="text-xs text-gray-500">Session fee</p>
            </div>
            <p className="text-2xl font-bold text-gray-800">${tutor.currentSessionFee.toFixed(2)}<span className="text-sm font-normal text-gray-500">/{tutor.sessionDurationMinutes} minutes</span></p>
          </div>
        </div>

        <div className="space-y-1.5 mb-2">
          <StatItem
            icon={<PiStar style={{ color: 'rgb(88, 88, 88)', fontSize: '17px' }} />}
            text={<><span className="font-medium" style={{ color: 'rgb(88, 88, 88)' }}>{tutor.averageRating.toFixed(1)}/5.0</span> ({tutor.reviewCount} review{tutor.reviewCount !== 1 ? 's' : ''})</>}
          />
          <StatItem
            icon={<PiCalendar style={{ color: 'rgb(88, 88, 88)', fontSize: '17px' }} />}
            text={<><span className="font-medium" style={{ color: 'rgb(88, 88, 88)' }}>{tutor.bookedSessionsCount}</span> Booked sessions</>}
          />
          <StatItem
            icon={<PiStudentLight style={{ color: 'rgb(88, 88, 88)', fontSize: '17px' }} />}
            text={<><span className="font-medium" style={{ color: 'rgb(88, 88, 88)' }}>{tutor.studentCount}</span> Students</>}
          />
          <StatItem
            icon={<HiOutlineLanguage style={{ color: 'rgb(88, 88, 88)', fontSize: '17px' }} />}
            text={<><span className="font-medium" style={{ color: 'rgb(88, 88, 88)' }}>Languages:</span> {tutor.languages.join(', ')}</>}
          />
        </div>

        <div className="mb-auto">
          <p className="text-sm text-gray-600">
            {showFullBio ? tutor.bio : truncatedBio}
            {tutor.bio.length > 150 && (
              <button 
                onClick={toggleBio}
                className="text-[#295C51] hover:text-[#27574c] font-medium ml-1"
              >
                {showFullBio ? 'Show less' : 'Learn more'}
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TutorCard;