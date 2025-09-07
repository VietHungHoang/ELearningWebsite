import React, { useState, useRef } from 'react';

interface Tutor {
  id: number;
  name: string;
  title: string;
  rating: number;
  reviewCount: number;
  bookedSessions: number;
  sessions: number;
  languages: string[];
  price: number;
  videoThumbnail: string;
  videoSource: string;
  description: string;
}

interface TutorCardProps {
  tutor: Tutor;
}

const TutorCard: React.FC<TutorCardProps> = ({ tutor }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 flex space-x-4">
      <div className="w-1/3">
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full h-48 object-cover rounded-lg"
            poster={tutor.videoThumbnail}
            muted
            loop
            playsInline
            onClick={togglePlayPause}
            onEnded={handleVideoEnded}
          >
            <source src={tutor.videoSource} type="video/mp4" />
          </video>
          {!isPlaying && (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 cursor-pointer"
              onClick={togglePlayPause}
            >
              <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all">
                <svg className="w-6 h-6 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">0:00 / 0:26</div>
        </div>
        
        {/* Action Buttons Below Video */}
        <div className="mt-4 space-y-2">
          <button className="w-full bg-[#134E4A] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#0F3A36] transition-colors flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Book a session
          </button>
          <div className="flex space-x-2">
            <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Send message
            </button>
            <button className="w-10 h-10 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="w-2/3">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{tutor.name} <span className="text-green-500">✓</span></h3>
            <p className="text-sm text-gray-600 mb-2">{tutor.title}</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">${tutor.price}/session</div>
          </div>
        </div>
        <div className="flex items-center space-x-4 mb-3 text-sm text-gray-500">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>★ {tutor.rating}/5 ({tutor.reviewCount} review{tutor.reviewCount !== 1 ? 's' : ''})</span>
          </div>
        </div>
        <div className="flex items-center space-x-6 mb-4 text-sm text-gray-500">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <span>{tutor.bookedSessions} booked sessions</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>{tutor.sessions} Sessions</span>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-500"><span className="font-medium">Languages I know:</span> {tutor.languages.join(', ')}</p>
        </div>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">{tutor.description.substring(0, 100)}...</p>
      </div>
    </div>
  );
};

export default TutorCard;