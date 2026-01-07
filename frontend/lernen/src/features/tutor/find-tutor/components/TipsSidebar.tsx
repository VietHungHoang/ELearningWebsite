import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPlay } from 'react-icons/fa';
import { FiCheck } from 'react-icons/fi';

const TipsSidebar: React.FC = () => {
    const { t } = useTranslation();
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    
    const tips = [
        t('findTutors.tipsSidebar.tips.filterRequirements'),
        t('findTutors.tipsSidebar.tips.checkQualifications'),
        t('findTutors.tipsSidebar.tips.readReviews'),
        t('findTutors.tipsSidebar.tips.evaluateCommunication'),
        t('findTutors.tipsSidebar.tips.checkAvailability'),
    ];

    useEffect(() => {
        // Đảm bảo video hiển thị frame đầu tiên
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
        }
    }, []);

    const handlePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleVideoPlay = () => {
        setIsPlaying(true);
    };

    const handleVideoPause = () => {
        setIsPlaying(false);
    };

    const handleVideoLoadedData = () => {
        // Hiển thị frame đầu tiên khi video đã load
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
        }
    };

    return (
        <div className="bg-[#f9f3eb] border border-[rgba(219,132,1,0.1)] rounded-2xl shadow-sm p-6 sticky top-8">
            <div className="relative rounded-lg overflow-hidden aspect-video group">
                <video
                    ref={videoRef}
                    src="https://amento-bucket-poc-2.s3.amazonaws.com/optionbuilder/uploads/banner-video.mp4"
                    className="w-full h-full object-cover cursor-pointer"
                    onPlay={handleVideoPlay}
                    onPause={handleVideoPause}
                    onLoadedData={handleVideoLoadedData}
                    onLoadedMetadata={handleVideoLoadedData}
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    controls={isPlaying}
                    onClick={handlePlayPause}
                />
                {!isPlaying && (
                    <div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <button
                            aria-label="Play video"
                            className="w-14 h-14 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/50 transition-transform duration-300 group-hover:scale-110 pointer-events-auto"
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePlayPause();
                            }}
                        >
                            <FaPlay />
                        </button>
                    </div>
                )}
            </div>

            <h3 className="text-lg font-bold text-gray-800 mt-6">{t('findTutors.tipsSidebar.title')}</h3>
            <p className="text-sm text-gray-600 mt-2">
                {t('findTutors.tipsSidebar.description')}
            </p>

            <ul className="mt-4 space-y-3">
                {tips.map((tip, index) => (
                    <li key={index} className="flex items-start text-sm">
                        <div className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-green-500">
                           <FiCheck className="w-full h-full" />
                        </div>
                        <span className="text-gray-700">{tip}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TipsSidebar;