import React, { useState, useRef, useEffect } from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaPinterest, FaYoutube } from "react-icons/fa";
import { VscVerified } from "react-icons/vsc";
import { PiStar, PiStudentLight, PiCalendar, PiBookOpenTextLight } from "react-icons/pi";
import { FiCalendar, FiMessageSquare } from "react-icons/fi";
import { FaHeart, FaPlay } from "react-icons/fa";
import { RiSpeakLine } from "react-icons/ri";
import { AiOutlineGlobal } from "react-icons/ai";
import Avatar from "react-avatar";
// import type { Tutor } from "../../../../types/tutor";
import { FlagIcon } from "../../find-tutor/components/TutorCard";
import { useCurrency } from "../../../../context/CurrencyContext";
import { useChat } from "../../../../context/ChatContext";
import { convertFromVND, formatCurrency } from "../../../../utils/currencyHelper";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../../context/AuthContext";
import wishlistService from "../../../../services/wishlistService";
import Toast from "../../../../components/ui/Toast";
// import { tutorService } from "../../../../services/tutorService";
// import { classService } from "../../../../services/classService";

const TutorProfileHeader: React.FC<{
    tutor: any;
    hasTrialSession: boolean;
}> = ({ tutor, hasTrialSession }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isWishlistLoading, setIsWishlistLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const { selectedCurrency } = useCurrency();
    const { openChatWithTutor } = useChat();
    const { t, i18n } = useTranslation();
    const { state: authState } = useAuth();

    const convertedPrice = tutor ? convertFromVND(tutor.currentSessionFee || 0, selectedCurrency) : 0;
    const formattedPrice = formatCurrency(convertedPrice, selectedCurrency);

    const handlePlayClick = () => {
        if (videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    const handleBookSessionClick = () => {
        const element = document.getElementById("availability");
        if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - 80;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    };

    const handleSendMessageClick = () => {
        if (tutor) {
            openChatWithTutor(tutor.id, tutor.fullName);
        }
    };

    // Check if tutor is in wishlist
    useEffect(() => {
        const checkWishlistStatus = async () => {
            if (!tutor?.id || authState.user?.role !== 'student') return;

            try {
                const inWishlist = await wishlistService.isTutorInWishlist(tutor.id);
                setIsInWishlist(inWishlist);
            } catch (error) {
                console.error('Failed to check wishlist status:', error);
            }
        };

        checkWishlistStatus();
    }, [tutor?.id, authState.user?.role]);

    const handleWishlistToggle = async () => {
        if (!tutor?.id || authState.user?.role !== 'student') {
            setToast({ message: t('tutorDetail.wishlist.loginRequired'), type: 'error' });
            return;
        }

        setIsWishlistLoading(true);
        try {
            if (isInWishlist) {
                await wishlistService.removeTutorFromWishlist(tutor.id);
                setIsInWishlist(false);
                setToast({ message: t('tutorDetail.wishlist.removed'), type: 'success' });
            } else {
                await wishlistService.addTutorToWishlist(tutor.id);
                setIsInWishlist(true);
                setToast({ message: t('tutorDetail.wishlist.added'), type: 'success' });
            }
        } catch (error: any) {
            console.error('Failed to toggle wishlist:', error);
            setToast({ message: error.message || t('tutorDetail.wishlist.error'), type: 'error' });
        } finally {
            setIsWishlistLoading(false);
        }
    };

    const socialIcons: { [key: string]: React.ReactNode } = {
        facebook: <FaFacebook />,
        x: <FaTwitter />,
        linkedin: <FaLinkedin />,
        instagram: <FaInstagram />,
        pinterest: <FaPinterest />,
        youtube: <FaYoutube />,
        tiktok: <span className="text-xs font-bold">TT</span>,
    };

    // Skeleton when tutor data is not available
    if (!tutor) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Tutor Details */}
                <div className="lg:col-span-2">
                    <div className="animate-pulse">
                        {/* Header section */}
                        <div className="flex flex-col sm:flex-row justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-18 h-18 bg-gray-200 rounded-2xl"></div>
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-300 rounded-full"></div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="h-8 bg-gray-200 rounded w-48"></div>
                                        <div className="w-5 h-5 bg-gray-200 rounded"></div>
                                        <div className="w-6 h-4 bg-gray-200 rounded"></div>
                                    </div>
                                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                                </div>
                            </div>
                            <div className="text-left sm:text-right mt-4 sm:mt-0 flex-shrink-0">
                                <div className="flex flex-col items-end gap-1">
                                    <div className="h-3 bg-gray-200 rounded w-20 mb-1"></div>
                                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                                </div>
                            </div>
                        </div>

                        {/* Stats section */}
                        <div className="my-1 py-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                {/* Left stats column */}
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="w-5 h-5 bg-gray-200 rounded mr-3 flex-shrink-0"></div>
                                        <div className="flex-grow">
                                            <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                                            <div className="h-3 bg-gray-200 rounded w-24"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-5 h-5 bg-gray-200 rounded mr-3 flex-shrink-0"></div>
                                        <div className="flex-grow">
                                            <div className="h-4 bg-gray-200 rounded w-28"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-5 h-5 bg-gray-200 rounded mr-3 flex-shrink-0"></div>
                                        <div className="flex-grow">
                                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-5 h-5 bg-gray-200 rounded mr-3 flex-shrink-0"></div>
                                        <div className="flex-grow">
                                            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                            <div className="flex gap-2">
                                                <div className="w-11 h-11 bg-gray-200 rounded-lg"></div>
                                                <div className="w-11 h-11 bg-gray-200 rounded-lg"></div>
                                                <div className="w-11 h-11 bg-gray-200 rounded-lg"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Right stats column */}
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="w-5 h-5 bg-gray-200 rounded mr-3 flex-shrink-0"></div>
                                        <div className="flex-grow">
                                            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                                            <div className="h-4 bg-gray-200 rounded w-40"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-5 h-5 bg-gray-200 rounded mr-3 flex-shrink-0"></div>
                                        <div className="flex-grow">
                                            <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                                            <div className="flex gap-2 flex-wrap">
                                                <div className="h-5 bg-gray-200 rounded w-16"></div>
                                                <div className="h-5 bg-gray-200 rounded w-12"></div>
                                                <div className="h-5 bg-gray-200 rounded w-14"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Buttons section */}
                        <div className="mt-2 flex items-center gap-3">
                            <div className="h-11 bg-gray-200 rounded-xl w-40"></div>
                            <div className="h-11 bg-gray-200 rounded-xl w-36"></div>
                            <div className="w-11 h-11 bg-gray-200 rounded-lg"></div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Video Player */}
                <div className="w-full lg:col-span-1 pl-2">
                    <div className="animate-pulse">
                        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-lg p-2 bg-gray-100">
                            <div className="w-full h-full bg-gray-200 rounded-2xl"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                                    <div className="w-6 h-6 bg-gray-400 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Tutor Details */}
            <div className="lg:col-span-2">
                <div className="flex flex-col sm:flex-row justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            {tutor.avatarUrl ? (
                                <img
                                    src={tutor.avatarUrl}
                                    alt={tutor.fullName}
                                    className="w-18 h-18 rounded-2xl object-cover"
                                />
                            ) : (
                                <Avatar name={tutor.fullName} size="72" round="16px" className="w-18 h-18" />
                            )}
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
                                <FlagIcon countryCode={tutor.country.code} className="ml-1" />
                            </div>
                            <p className="text-base text-[#585858]">{tutor.headline}</p>
                        </div>
                    </div>
                    <div className="text-left sm:text-right mt-4 sm:mt-0 flex-shrink-0">
                        <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center justify-end gap-2">
                                <p className="text-xs text-gray-500">{t("tutorDetail.profile.sessionFee")}</p>
                            </div>
                            <p className="text-3xl font-bold text-gray-800">
                                {formattedPrice}
                                <span className="text-base font-normal text-gray-500">
                                    {t("tutorDetail.profile.perMin")}
                                </span>
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
                                    (() => {
                                        const approvedReviews = tutor.reviews?.filter((r: any) => !r.moderationStatus || r.moderationStatus === 'APPROVED') || [];
                                        const approvedCount = approvedReviews.length;
                                        const approvedRating = approvedCount > 0
                                            ? approvedReviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / approvedCount
                                            : 0;
                                        return (
                                            <>
                                                <span className="font-medium" style={{ color: "rgb(88, 88, 88)" }}>
                                                    {approvedRating.toFixed(1)}/5.0
                                                </span>{" "}
                                                ({approvedCount} review{approvedCount !== 1 ? "s" : ""})
                                            </>
                                        );
                                    })()
                                }
                            />
                            <StatItem
                                icon={<PiCalendar style={{ color: "rgb(88, 88, 88)", fontSize: "17px" }} />}
                                text={
                                    <>
                                        <span className="font-medium" style={{ color: "rgb(88, 88, 88)" }}>
                                            {tutor.bookedSessionsCount}
                                        </span>{" "}
                                        {t("tutorDetail.profile.bookedSessions")}
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
                                        {t("tutorDetail.profile.students")}
                                    </>
                                }
                            />
                            {/* <StatItem icon={<ClockIcon />} text={<><span className="font-bold">{tutor.responseTime}</span> Response time</>} /> */}
                            <StatItem
                                icon={<AiOutlineGlobal style={{ color: "rgb(88, 88, 88)", fontSize: "17px" }} />}
                                text={<>{t("tutorDetail.profile.socialProfiles")}</>}
                                content={
                                    <div className="flex items-center gap-3 flex-wrap">
                                        {tutor.socialLinks &&
                                            tutor.socialLinks.map((social: any) => (
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
                                text={<>{t("tutorDetail.profile.canTeach")}</>}
                                content={
                                    <div>
                                        <span className="font-medium" style={{ color: "rgb(88, 88, 88)" }}>
                                            {tutor.subjects &&
                                                tutor.subjects.map((subject: any) =>
                                                    i18n.language === 'vi' ? subject.nameVi : subject.nameEn
                                                ).join(", ")}
                                        </span>
                                    </div>
                                }
                            />
                            <StatItem
                                icon={<RiSpeakLine />}
                                text={<>{t("tutorDetail.profile.canSpeak")}</>}
                                content={
                                    <div>
                                        {tutor.languages &&
                                            tutor.languages.map((lang: any, index: number) => (
                                                <React.Fragment key={lang.language.code}>
                                                    <span className="font-medium" style={{ color: "rgb(88, 88, 88)" }}>
                                                        {lang.language.name}
                                                    </span>
                                                    {lang.isNative && (
                                                        <span className="ml-1 px-2 py-0.5 bg-gray-100 text-xs font-medium rounded-md">
                                                            {t("tutorDetail.profile.native")}
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
                    <button
                        onClick={handleBookSessionClick}
                        className="flex items-center justify-center gap-2 border border-[#0b6459] bg-[#0b6459] text-white font-semibold py-2.5 px-7 rounded-xl hover:bg-[#084c43] transition-colors"
                    >
                        {hasTrialSession
                            ? t("tutorDetail.profile.bookSession")
                            : t("tutorDetail.profile.bookTrialSession")}{" "}
                        <FiCalendar />
                    </button>
                    <button
                        onClick={handleSendMessageClick}
                        className="flex items-center justify-center gap-2 border border-[#e9bb71] bg-transparent text-[#585858] font-semibold py-2.5 px-7 rounded-xl hover:bg-[#084c43] hover:text-white hover:border-[#084c43] transition-colors"
                    >
                        {t("tutorDetail.profile.sendMessage")} <FiMessageSquare />
                    </button>
                    {authState.user?.role === 'student' && (
                        <button
                            onClick={handleWishlistToggle}
                            disabled={isWishlistLoading}
                            className={`p-3.5 rounded-lg hover:border transition-colors ${isInWishlist
                                ? 'text-red-500 border-red-300 bg-red-50'
                                : 'text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-red-500'
                                } ${isWishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title={isInWishlist ? t('tutorDetail.wishlist.removeFromWishlist') : t('tutorDetail.wishlist.addToWishlist')}
                        >
                            <FaHeart />
                        </button>
                    )}
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
                        {t("tutorDetail.profile.videoNotSupported")}
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
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
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