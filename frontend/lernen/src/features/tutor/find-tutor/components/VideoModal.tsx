import React, { useRef, useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoUrl: string;
    tutorName: string;
    smallVideoRef?: React.RefObject<HTMLVideoElement | null>;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoUrl, tutorName, smallVideoRef }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Trigger animation after mount
            requestAnimationFrame(() => {
                setIsAnimating(true);
            });
            if (videoRef.current) {
                // Sync currentTime from small video if available
                if (smallVideoRef?.current) {
                    const currentTime = smallVideoRef.current.currentTime || 0;
                    videoRef.current.currentTime = currentTime;
                }
                // Play video in modal
                videoRef.current.play().catch((error) => {
                    console.warn('Error playing video:', error);
                });
            }
        } else {
            setIsAnimating(false);
            // When closing modal, sync currentTime back to small video
            if (videoRef.current && smallVideoRef?.current) {
                const modalCurrentTime = videoRef.current.currentTime;
                smallVideoRef.current.currentTime = modalCurrentTime;
                // If modal video was paused, pause small video too
                if (videoRef.current.paused) {
                    smallVideoRef.current.pause();
                }
            }
        }
    }, [isOpen, smallVideoRef]);

    const handlePause = () => {
        // Only sync currentTime, don't sync play/pause state
        // Video in modal should be independent
        if (videoRef.current && smallVideoRef?.current) {
            smallVideoRef.current.currentTime = videoRef.current.currentTime;
        }
    };

    const handlePlay = () => {
        // Only sync currentTime, don't sync play/pause state
        // Video in modal should be independent
        if (videoRef.current && smallVideoRef?.current) {
            smallVideoRef.current.currentTime = videoRef.current.currentTime;
        }
    };

    const handleTimeUpdate = () => {
        // Sync currentTime to small video while playing
        if (videoRef.current && smallVideoRef?.current && !videoRef.current.paused) {
            smallVideoRef.current.currentTime = videoRef.current.currentTime;
        }
    };

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
            onClick={onClose}
        >
            <div
                className={`relative w-full max-w-4xl mx-4 transition-all duration-300 ${isAnimating ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with tutor name and close button */}
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white text-lg font-semibold">{tutorName}</h3>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-300 transition-colors p-1"
                        aria-label="Close modal"
                    >
                        <IoClose size={28} />
                    </button>
                </div>

                {/* Video */}
                <div className="rounded-2xl overflow-hidden bg-black shadow-2xl">
                    <video
                        ref={videoRef}
                        controls
                        autoPlay
                        className="w-full aspect-video"
                        onPause={handlePause}
                        onPlay={handlePlay}
                        onTimeUpdate={handleTimeUpdate}
                    >
                        <source src={videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        </div>
    );
};

export default VideoModal;
