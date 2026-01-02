import { useState, useEffect } from 'react';

/**
 * Custom hook to generate a thumbnail from a video URL
 * Uses Canvas API to capture a frame from the video
 * 
 * @param videoUrl - URL of the video
 * @param seekTime - Time in seconds to capture the frame (default: 1)
 * @returns thumbnail data URL or null if not ready
 */
const useVideoThumbnail = (videoUrl: string | undefined, seekTime = 1): string | null => {
    const [thumbnail, setThumbnail] = useState<string | null>(null);

    useEffect(() => {
        if (!videoUrl) return;

        let isCancelled = false;
        const video = document.createElement('video');

        video.crossOrigin = 'anonymous';
        video.src = videoUrl;
        video.muted = true;
        video.preload = 'metadata';

        const handleLoadedData = () => {
            video.currentTime = Math.min(seekTime, video.duration || seekTime);
        };

        const handleSeeked = () => {
            if (isCancelled) return;

            try {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    setThumbnail(dataUrl);
                }
            } catch (error) {
                console.warn('Failed to generate thumbnail:', error);
            } finally {
                // Cleanup
                video.remove();
            }
        };

        const handleError = () => {
            console.warn('Failed to load video for thumbnail:', videoUrl);
            video.remove();
        };

        video.addEventListener('loadeddata', handleLoadedData);
        video.addEventListener('seeked', handleSeeked);
        video.addEventListener('error', handleError);

        video.load();

        return () => {
            isCancelled = true;
            video.removeEventListener('loadeddata', handleLoadedData);
            video.removeEventListener('seeked', handleSeeked);
            video.removeEventListener('error', handleError);
            video.remove();
        };
    }, [videoUrl, seekTime]);

    return thumbnail;
};

export default useVideoThumbnail;
