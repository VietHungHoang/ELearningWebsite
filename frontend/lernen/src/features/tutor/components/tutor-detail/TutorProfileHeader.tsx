import React, { useState, useRef } from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaPinterest, FaYoutube, FaDribbble, FaBehance } from 'react-icons/fa';
import { VscVerified } from 'react-icons/vsc';
import { FlagIcon } from '../find-tutor/TutorCard';
import { PiStar, PiStudentLight, PiCalendar, PiBookOpenTextLight } from 'react-icons/pi';
import { FiCalendar, FiMessageSquare } from 'react-icons/fi';
import { FaHeart, FaPlay } from 'react-icons/fa';
import type { TutorDetail } from '../../../../types/api';
import { RiSpeakLine } from "react-icons/ri";
const TutorProfileHeader: React.FC<{ tutor: TutorDetail }> = ({ tutor }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handlePlayClick = () => {
        if (videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };
    
    const socialIcons: { [key: string]: React.ReactNode } = {
        facebook: <FaFacebook />,
        x: <FaTwitter />,
        linkedin: <FaLinkedin />,
        instagram: <FaInstagram />,
        pinterest: <FaPinterest />,
        youtube: <FaYoutube />,
        tiktok: <span className="text-xs font-bold">TT</span>, // TikTok icon not available, using text
    };

    // const achievementIcons: { [key: string]: React.ReactNode } = {
    //     dribbble: <FaDribbble />,
    //     behance: <FaBehance />,
    // };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Tutor Details */}
            <div className="lg:col-span-2">
                <div className="flex flex-col sm:flex-row justify-between items-start">
                    <div className="flex items-start gap-4">
                        <div className="relative">
                            <img src={tutor.avatarUrl} alt={tutor.name} className="w-24 h-24 rounded-2xl object-cover" />
                             <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[#F8F7F4]"></div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-3xl font-bold text-gray-800">{tutor.name}</h1>
                                {tutor.isVerified && <VscVerified style={{ color: 'rgb(51, 204, 94)', fontSize: '18px' }} title="Verified tutor" />}
                                <FlagIcon countryCode={tutor.nationalityCode} className="ml-1" />
                            </div>
                            {/* <p className="text-gray-600 mt-1">{tutor.tagline}</p> */}
                        </div>
                    </div>
                    <div className="text-left sm:text-right mt-4 sm:mt-0 flex-shrink-0">
                        <p className="text-3xl font-bold text-gray-800">${tutor.currentSessionFee.toFixed(2)}<span className="text-base font-normal text-gray-500">/session</span></p>
                        <p className="text-sm text-gray-500">Starting from</p>
                    </div>
                </div>

                <div className="my-6 py-6 border-y border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Left stats column */}
                        <div className="space-y-4">
                            <StatItem icon={<PiStar style={{ color: 'rgb(88, 88, 88)', fontSize: '17px' }} />} text={<><span className="font-bold">{tutor.averageRating.toFixed(1)} /5.0</span> ({tutor.reviewCount} review{tutor.reviewCount !== 1 ? 's' : ''})</>} />
                            <StatItem icon={<PiCalendar style={{ color: 'rgb(88, 88, 88)', fontSize: '17px' }} />} text={<><span className="font-bold">{tutor.bookedSessionsCount}</span> Booked sessions</>} />
                            <StatItem icon={<PiStudentLight style={{ color: 'rgb(88, 88, 88)', fontSize: '17px' }} />} text={<><span className="font-bold">{tutor.studentCount}</span> Students</>} />
                            {/* <StatItem icon={<ClockIcon />} text={<><span className="font-bold">{tutor.responseTime}</span> Response time</>} /> */}
                            <StatItem icon={<svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>} text={<span className="font-medium text-gray-500">Social Profiles</span>} content={
                                <div className="flex items-center gap-2 flex-wrap">
                                    {tutor.socials.map((social) => (
                                        <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                                            {socialIcons[social.platform.toLowerCase()]}
                                        </a>
                                    ))}
                                </div>
                            }/>
                        </div>
                         {/* Right stats column */}
                        <div className="space-y-4">
                            <StatItem icon={<PiBookOpenTextLight  />} text={<span className="font-medium text-gray-500">I can teach</span>} content={
                                <div>
                                    <span className="font-semibold text-gray-800">{tutor.subjects.map(subject => subject.subjectName).join(', ')}</span>
                                </div>
                            }/>
                            <StatItem icon={<RiSpeakLine />} text={<span className="font-medium text-gray-500">I can speak</span>} content={
                                <div>
                                    {tutor.languages.map((lang, index: number) => (
                                        <React.Fragment key={lang.code}>
                                            <span className="font-semibold text-gray-800">{lang.code}</span>
                                            {lang.level && <span className="ml-1 px-2 py-0.5 bg-gray-100 text-xs font-medium rounded-md">{lang.level}</span>}
                                            {index < tutor.languages.length - 1 && <span className="mx-1">,</span>}
                                        </React.Fragment>
                                    ))}
                                </div>
                            }/>
                            {/* <StatItem icon={<ShieldCheckIcon />} text={<span className="font-medium text-gray-500">Achievements</span>} content={
                                <div className="flex items-center gap-2">
                                    {tutor.achievements.map((ach: string, index: number) => (
                                        <div key={index} className="w-8 h-8 flex items-center justify-center">{achievementIcons[ach]}</div>
                                    ))}
                                </div>
                            }/> */}
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex items-center gap-3">
                    <button className="flex items-center justify-center gap-2 bg-[#0b6459] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#084c43] transition-colors">
                        Book a session <FiCalendar />
                    </button>
                    <button className="flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-800 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors">
                        Send message <FiMessageSquare />
                    </button>
                    <button className="p-3.5 border border-gray-300 bg-white text-gray-500 rounded-lg hover:bg-gray-50 hover:text-red-500 transition-colors">
                        <FaHeart />
                    </button>
                </div>

            </div>
            {/* Right Column: Video Player */}
            <div className="w-full lg:col-span-1">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden group shadow-lg">
                     <video
                        ref={videoRef}
                        poster={tutor.videoThumbnailUrl}
                        controls={isPlaying}
                        onEnded={() => setIsPlaying(false)}
                        className="w-full h-full object-cover"
                    >
                        <source src={tutor.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    {!isPlaying && (
                        <div 
                            className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center cursor-pointer" 
                            onClick={handlePlayClick}
                        >
                            <button 
                                aria-label="Play video"
                                className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/50 transition-colors group-hover:scale-110"
                            >
                                <FaPlay />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// A helper component to avoid repetition
const StatItem: React.FC<{ icon: React.ReactNode, text: React.ReactNode, content?: React.ReactNode }> = ({ icon, text, content }) => (
    <div className="flex items-start text-sm text-gray-600">
      <div className="w-5 h-5 mr-3 mt-0.5 text-gray-500 flex-shrink-0 flex items-center justify-center">{icon}</div>
      <div className="flex-grow">
          <div className="flex items-center">{text}</div>
          {content && <div className="mt-1">{content}</div>}
      </div>
    </div>
  );

export default TutorProfileHeader;