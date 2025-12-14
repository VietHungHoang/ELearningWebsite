import React, { useState, useRef } from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaPinterest, FaYoutube } from "react-icons/fa";
import { VscVerified } from "react-icons/vsc";
import { FlagIcon } from "../../find-tutor/components/TutorCard";
import { PiStar, PiStudentLight, PiCalendar, PiBookOpenTextLight } from "react-icons/pi";
import { FiCalendar, FiMessageSquare } from "react-icons/fi";
import { FaHeart, FaPlay } from "react-icons/fa";
import { RiSpeakLine } from "react-icons/ri";
import { AiOutlineGlobal } from "react-icons/ai";
import type { TutorDetail } from "../../../../types/api";
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

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Tutor Details */}
            <div className="lg:col-span-2">
                <div className="flex flex-col sm:flex-row justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <img
                                src={tutor.avatarUrl}
                                alt={tutor.fullName}
                                className="w-18 h-18 rounded-2xl object-cover"
                            />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[#F8F7F4]"></div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-3xl font-medium text-gray-800">{tutor.fullName}</h1>
                                {tutor.isVerified && (
                                    <VscVerified
                                        style={{ color: "rgb(51, 204, 94)", fontSize: "18px" }}
                                        title="Verified tutor"
                                    />
                                )}
                                <FlagIcon countryCode={tutor.countryCode} className="ml-1" />
                            </div>
                            <p className="text-base text-[#585858]">{tutor.headline}</p>
                        </div>
                    </div>
                    <div className="text-left sm:text-right mt-4 sm:mt-0 flex-shrink-0">
                        <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center justify-end gap-2">
                                <span className="text-base text-gray-400 line-through font-normal">$50.00</span>
                                <p className="text-xs text-gray-500">Session fee</p>
                            </div>
                            <p className="text-3xl font-bold text-gray-800">
                                ${(tutor.currentSessionFee || 0).toFixed(2)}
                                <span className="text-base font-normal text-gray-500">/50 minutes</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="my-1 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Left stats column */}
                        <div className="space-y-4">
                            <StatItem
                                icon={<PiStar style={{ color: "rgb(88, 88, 88)", fontSize: "17px" }} />}
                                text={
                                    <>
                                        <span className="font-medium" style={{ color: "rgb(88, 88, 88)" }}>
                                            {tutor.averageRating.toFixed(1)}/5.0
                                        </span>{" "}
                                        ({tutor.reviewCount} review{tutor.reviewCount !== 1 ? "s" : ""})
                                    </>
                                }
                            />
                            <StatItem
                                icon={<PiCalendar style={{ color: "rgb(88, 88, 88)", fontSize: "17px" }} />}
                                text={
                                    <>
                                        <span className="font-medium" style={{ color: "rgb(88, 88, 88)" }}>
                                            {tutor.bookedSessionsCount}
                                        </span>{" "}
                                        Booked sessions
                                    </>
                                }
                            />
                            <StatItem
                                icon={<PiStudentLight style={{ color: "rgb(88, 88, 88)", fontSize: "17px" }} />}
                                text={
                                    <>
                                        <span className="font-medium" style={{ color: "rgb(88, 88, 88)" }}>
                                            {tutor.studentCount}
                                        </span>{" "}
                                        Students
                                    </>
                                }
                            />
                            {/* <StatItem icon={<ClockIcon />} text={<><span className="font-bold">{tutor.responseTime}</span> Response time</>} /> */}
                            <StatItem
                                icon={<AiOutlineGlobal style={{ color: "rgb(88, 88, 88)", fontSize: "17px" }} />}
                                text={<>Social profiles</>}
                                content={
                                    <div className="flex items-center gap-3 flex-wrap">
                                        {tutor.socialLinks &&
                                            tutor.socialLinks.map((social) => (
                                                <a
                                                    key={social.platform}
                                                    href={social.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-11 h-11 flex items-center justify-center rounded-lg transition-colors"
                                                    style={{ backgroundColor: "#f8f2e8", color: "#295c51" }}
                                                    onMouseEnter={(e) =>
                                                        (e.currentTarget.style.backgroundColor = "#f6eddc")
                                                    }
                                                    onMouseLeave={(e) =>
                                                        (e.currentTarget.style.backgroundColor = "#f8f2e8")
                                                    }
                                                >
                                                    <span style={{ transform: "scale(1.4)" }}>
                                                        {socialIcons[social.platform.toLowerCase()]}
                                                    </span>
                                                </a>
                                            ))}
                                    </div>
                                }
                            />
                        </div>
                        {/* Right stats column */}
                        <div className="space-y-4">
                            <StatItem
                                icon={<PiBookOpenTextLight style={{ color: "rgb(88, 88, 88)", fontSize: "17px" }} />}
                                text={<>I can teach</>}
                                content={
                                    <div>
                                        <span className="font-medium" style={{ color: "rgb(88, 88, 88)" }}>
                                            {tutor.subjects && tutor.subjects.map((subject) => subject.name).join(", ")}
                                        </span>
                                    </div>
                                }
                            />
                            <StatItem
                                icon={<RiSpeakLine />}
                                text={<>I can speak</>}
                                content={
                                    <div>
                                        {tutor.languages &&
                                            tutor.languages.map((lang, index: number) => (
                                                <React.Fragment key={lang.code}>
                                                    <span className="font-medium" style={{ color: "rgb(88, 88, 88)" }}>
                                                        {lang.code}
                                                    </span>
                                                    {lang.isNative && (
                                                        <span className="ml-1 px-2 py-0.5 bg-gray-100 text-xs font-medium rounded-md">
                                                            Native
                                                        </span>
                                                    )}
                                                    {index < tutor.languages.length - 1 && (
                                                        <span className="mx-1">,</span>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                    </div>
                                }
                            />
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

                <div className="mt-2 flex items-center gap-3">
                    <button className="flex items-center justify-center gap-2 border border-[#0b6459] bg-[#0b6459] text-white font-semibold py-2.5 px-7 rounded-xl hover:bg-[#084c43] transition-colors">
                        Book a session <FiCalendar />
                    </button>
                    <button className="flex items-center justify-center gap-2 border border-[#e9bb71] bg-transparent text-[#585858] font-semibold py-2.5 px-7 rounded-xl hover:bg-[#084c43] hover:text-white hover:border-[#084c43] transition-colors">
                        Send message <FiMessageSquare />
                    </button>
                    <button className="p-3.5 text-gray-500 rounded-lg hover:border hover:border-gray-300 hover:bg-gray-50 hover:text-red-500 transition-colors">
                        <FaHeart />
                    </button>
                </div>
            </div>
            {/* Right Column: Video Player */}
            <div className="w-full lg:col-span-1 pl-2">
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden group shadow-lg p-2 bg-white">
                    <video
                        ref={videoRef}
                        poster={tutor.avatarUrl}
                        controls={isPlaying}
                        onEnded={() => setIsPlaying(false)}
                        className="w-full h-full object-cover border-2 border-gray-200 rounded-2xl"
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
const StatItem: React.FC<{ icon: React.ReactNode; text: React.ReactNode; content?: React.ReactNode }> = ({
    icon,
    text,
    content,
}) => (
    <div className="flex items-start text-sm text-gray-600">
        <div className="w-5 h-5 mr-1 flex-shrink-0 flex items-center justify-center">{icon}</div>
        <div className="flex-grow">
            <span>{text}</span>
            {content && <div className="mt-1">{content}</div>}
        </div>
    </div>
);

export default TutorProfileHeader;
