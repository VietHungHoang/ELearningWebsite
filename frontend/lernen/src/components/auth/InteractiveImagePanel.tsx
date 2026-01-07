import React, { useState, useRef, useEffect } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { FaPlay } from 'react-icons/fa';
import { VN } from 'country-flag-icons/react/3x2';
import { useTranslation } from 'react-i18next';

export const InteractiveImagePanel: React.FC = () => {
    const { t } = useTranslation();
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
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
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
        }
    };
    
    return (
        <div className="relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group">
                <video
                    ref={videoRef}
                    src="https://amento-bucket-poc-2.s3.amazonaws.com/optionbuilder/uploads/banner-video.mp4"
                    className="w-full h-full object-cover"
                    onPlay={handleVideoPlay}
                    onPause={handleVideoPause}
                    onLoadedData={handleVideoLoadedData}
                    onLoadedMetadata={handleVideoLoadedData}
                    preload="auto"
                    controls={isPlaying}
                    playsInline
                    muted={false}
                />
                {!isPlaying && (
                    <div
                        className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center cursor-pointer"
                        onClick={handlePlayPause}
                    >
                        <button
                            aria-label="Play video"
                            className="w-14 h-14 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/50 transition-transform duration-300 group-hover:scale-110"
                        >
                            <FaPlay size={20} />
                        </button>
                    </div>
                )}
            </div>

            {/* Floating UI elements */}
            <div className="absolute top-10 -left-25 bg-white/50 p-3 rounded-2xl backdrop-blur-md shadow-lg flex flex-col items-start space-y-2 z-10 animate-float" style={{ animationDelay: '0.2s' }}>
                <p className="text-gray-800 font-semibold text-xs">{t('home.introPanel.registeredTutors')}</p>
                <div className="flex -space-x-3">
                    <img src="https://picsum.photos/seed/person1/32/32" alt={t('home.introPanel.tutor1')} className="w-8 h-8 rounded-full border-2 border-white" />
                    <img src="https://picsum.photos/seed/person2/32/32" alt={t('home.introPanel.tutor2')} className="w-8 h-8 rounded-full border-2 border-white" />
                    <img src="https://picsum.photos/seed/person3/32/32" alt={t('home.introPanel.tutor3')} className="w-8 h-8 rounded-full border-2 border-white" />
                    <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center border-2 border-white text-white font-bold text-sm">+</div>
                </div>
            </div>

            <div className="absolute -bottom-10 -right-10 bg-white/80 p-3 rounded-2xl backdrop-blur-md shadow-lg flex items-center space-x-3 text-gray-800 z-10 animate-float">
                <img src="https://picsum.photos/seed/vietnamese-tutor/48/48" alt={t('home.introPanel.tutorName')} className="w-12 h-12 rounded-lg object-cover" />
                <div>
                    <p className="font-bold">{t('home.introPanel.tutorName')}</p>
                    <p className="text-sm text-gray-600">{t('home.introPanel.tutorSubject')}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <VN className="w-4 h-3" />
                        {t('home.introPanel.tutorLocation')}
                    </p>
                </div>
                <div className="flex items-center text-orange-500 font-bold">
                    <AiFillStar />
                    <span className="ml-1 text-sm text-gray-800">{t('home.introPanel.tutorRating')}</span>
                </div>
            </div>
        </div>
    );
};