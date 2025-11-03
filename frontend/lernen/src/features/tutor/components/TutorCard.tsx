import React, { useState, useRef } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { FaPlay, FaHeart, FaBook, FaUsers, FaGlobe, FaCheckCircle, FaGraduationCap, FaChalkboardTeacher } from 'react-icons/fa';
import { FiCalendar, FiMessageSquare } from 'react-icons/fi';
import type { Tutor } from './TutorList';

interface TutorCardProps {
  tutor: Tutor;
  onBookTrial: (tutor: Tutor) => void;
}

const TutorCard: React.FC<TutorCardProps> = ({ tutor, onBookTrial }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayClick = () => {  
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const StatItem = ({ icon, text }: { icon: React.ReactNode, text: React.ReactNode }) => (
    <div className="flex items-center text-sm text-gray-600">
      <div className="w-5 h-5 mr-3 flex-shrink-0 flex items-center justify-center">{icon}</div>
      <span>{text}</span>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col md:flex-row gap-6 interactive-card">
      {/* Left side: Video and actions */}
      <div className="flex-shrink-0 w-full md:w-[300px]">
        <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3 group">
          <video
            ref={videoRef}
            poster={tutor.videoThumbnail}
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
        <div className="space-y-2">
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
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <img src={tutor.avatar} alt={tutor.name} className="w-16 h-16 rounded-lg object-cover" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-gray-800">{tutor.name}</h3>
                {tutor.verified && <FaCheckCircle className="text-green-500" />}
                {tutor.specializationIcon === 'learning' && <FaGraduationCap className="text-blue-500" />}
                {tutor.specializationIcon === 'academic' && <FaChalkboardTeacher className="text-purple-500" />}
              </div>
              <p className="text-sm text-gray-500 mt-1">{tutor.specialization}</p>
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-4">
            <p className="text-xs text-gray-500">Session fee</p>
            <p className="text-2xl font-bold text-gray-800">${tutor.sessionFee.toFixed(2)}<span className="text-sm font-normal text-gray-500">/Session</span></p>
          </div>
        </div>

        <div className="space-y-3 mt-4">
          <StatItem
            icon={<AiFillStar className="text-yellow-500" />}
            text={<><span className="font-bold text-gray-800">{tutor.rating.toFixed(1)}/5.0</span> ({tutor.reviews} review)</>}
          />
          <StatItem
            icon={<FaBook className="text-green-500" />}
            text={<><span className="font-bold text-gray-800">{tutor.bookedSessions}</span> Booked sessions</>}
          />
          <StatItem
            icon={<FaUsers className="text-blue-500" />}
            text={<><span className="font-bold text-gray-800">{tutor.currentSessions}</span> Sessions</>}
          />
          <StatItem
            icon={<FaGlobe className="text-indigo-500" />}
            text={<><span className="font-bold text-gray-800">Languages I Know</span> {tutor.languages}</>}
          />
        </div>
        
        <p className="text-sm text-gray-600 mt-4 border-t border-gray-100 pt-4">
          {tutor.bio}
        </p>
      </div>
    </div>
  );
};

export default TutorCard;