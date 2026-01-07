import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to generate a thumbnail from a video URL
 * Uses the same approach as online-video-thumbnail-generator project
 * 
 * @param videoUrl - URL of the video
 * @param preferredTime - Preferred time in seconds to capture the frame (default: 2)
 * @returns thumbnail data URL or null if not ready
 */
const useVideoThumbnail = (videoUrl: string | undefined, preferredTime = 2): string | null => {
    const [thumbnail, setThumbnail] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!videoUrl) return;

        let isCancelled = false;

        // Create video and canvas elements
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        videoRef.current = video;
        canvasRef.current = canvas;

        // Timestamps to try - skip first seconds which often have black intro
        const timestampsToTry = [preferredTime, 3, 5, 1, 0.5];
        let currentTimestampIndex = 0;

        // Configure video - similar to the online-video-thumbnail-generator
        video.crossOrigin = 'anonymous';
        video.muted = true;
        video.preload = 'metadata';
        video.playsInline = true;

        /**
         * Check if the captured frame is mostly black
         */
        const isFrameBlack = (ctx: CanvasRenderingContext2D, width: number, height: number): boolean => {
            try {
                const sampleSize = Math.min(50, width, height);
                const startX = Math.floor((width - sampleSize) / 2);
                const startY = Math.floor((height - sampleSize) / 2);

                const imageData = ctx.getImageData(startX, startY, sampleSize, sampleSize);
                const data = imageData.data;

                let totalBrightness = 0;
                const pixelCount = data.length / 4;

                for (let i = 0; i < data.length; i += 4) {
                    const brightness = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
                    totalBrightness += brightness;
                }

                const avgBrightness = totalBrightness / pixelCount;
                return avgBrightness < 15;
            } catch (e) {
                // CORS error - can't read pixels, just capture anyway
                console.warn('Cannot check frame brightness (CORS?):', e);
                return false;
            }
        };

        const captureFrame = (): boolean => {
            if (isCancelled) return false;

            try {
                const w = video.videoWidth || 640;
                const h = video.videoHeight || 360;

                canvas.width = w;
                canvas.height = h;

                const ctx = canvas.getContext('2d');
                if (ctx) {
                    // Fill with black first (like the reference project)
                    ctx.fillRect(0, 0, w, h);
                    // Draw video frame
                    ctx.drawImage(video, 0, 0, w, h);

                    // Check if frame is black
                    if (isFrameBlack(ctx, w, h)) {
                        return false;
                    }

                    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
                    setThumbnail(dataUrl);
                    return true;
                }
            } catch (error) {
                console.warn('Failed to capture frame:', error);
            }
            return false;
        };

        const cleanup = () => {
            video.pause();
            video.removeAttribute('src');
            video.load();
            video.remove();
        };

        const tryNextTimestamp = () => {
            if (isCancelled) {
                cleanup();
                return;
            }

            currentTimestampIndex++;
            if (currentTimestampIndex < timestampsToTry.length) {
                const nextTime = timestampsToTry[currentTimestampIndex];
                video.currentTime = Math.min(nextTime, video.duration || nextTime);
            } else {
                // All timestamps tried, use last captured frame
                try {
                    const w = video.videoWidth || 640;
                    const h = video.videoHeight || 360;
                    canvas.width = w;
                    canvas.height = h;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.fillRect(0, 0, w, h);
                        ctx.drawImage(video, 0, 0, w, h);
                        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
                        setThumbnail(dataUrl);
                    }
                } catch (e) {
                    console.warn('Final capture failed:', e);
                }
                cleanup();
            }
        };

        const handleLoadedMetadata = () => {
            if (isCancelled) return;
            // Play briefly then pause (like reference project)
            video.play().then(() => {
                video.pause();
                const time = timestampsToTry[currentTimestampIndex];
                video.currentTime = Math.min(time, video.duration || time);
            }).catch(() => {
                // Autoplay blocked, just seek
                const time = timestampsToTry[currentTimestampIndex];
                video.currentTime = Math.min(time, video.duration || time);
            });
        };

        const handleSeeked = () => {
            if (isCancelled) {
                cleanup();
                return;
            }

            // Small delay to ensure frame is rendered (like reference project's snapd)
            setTimeout(() => {
                const success = captureFrame();
                if (success) {
                    cleanup();
                } else {
                    tryNextTimestamp();
                }
            }, 100);
        };

        const handleError = (e: Event) => {
            console.warn('Failed to load video for thumbnail:', e);
            cleanup();
        };

        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('seeked', handleSeeked);
        video.addEventListener('error', handleError);

        // Set source and load
        video.src = videoUrl;
        video.load();

        return () => {
            isCancelled = true;
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('seeked', handleSeeked);
            video.removeEventListener('error', handleError);
            cleanup();
        };
    }, [videoUrl, preferredTime]);

    return thumbnail;
};

export default useVideoThumbnail;
