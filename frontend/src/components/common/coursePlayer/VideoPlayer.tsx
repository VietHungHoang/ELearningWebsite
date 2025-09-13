// Main video player with custom controls. Replace with HLS/DRM player if needed.
import React, { useEffect, useRef, useState } from 'react';

type Instructor = { name: string; avatar: string };
type CurrentLesson = { id: string; title: string; duration: string; videoSrc: string; poster: string };

type Props = {
  currentLesson: CurrentLesson;
  instructor: Instructor;
  onEnded?: () => void;
};

const formatTime = (s: number) => {
  if (!isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
};

const VideoPlayer: React.FC<Props> = ({ currentLesson, instructor, onEnded }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [rate, setRate] = useState(1);

  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
  }, [currentLesson.id]);

  const handleToggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    setProgress(v.currentTime);
    setDuration(v.duration || 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const value = Number(e.target.value);
    v.currentTime = value;
    setProgress(value);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const value = Number(e.target.value);
    v.volume = value;
    setVolume(value);
  };

  const handleRate = (value: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = value;
    setRate(value);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="relative">
        <video
          ref={videoRef}
          className="w-full aspect-video"
          src={currentLesson.videoSrc}
          poster={currentLesson.poster}
          controls={false}
          preload="metadata"
          onClick={handleToggle}
          onTimeUpdate={handleTimeUpdate}
          onEnded={onEnded}
        />

        {/* Instructor overlay */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-black/60 text-white px-3 py-1.5 rounded-full">
          <img src={instructor.avatar} alt="Instructor avatar" className="w-6 h-6 rounded-full" loading="lazy" />
          <span className="text-sm">{instructor.name}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 py-3 flex flex-col gap-3">
        <input
          aria-label="Seek"
          type="range"
          min={0}
          max={duration || 0}
          value={progress}
          onChange={handleSeek}
          className="w-full accent-[#134E4A]"
        />
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggle}
              className="px-3 py-1.5 rounded-lg bg-[#134E4A] text-white focus:outline-none focus:ring-2 focus:ring-[#134E4A]"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <span className="text-sm text-gray-600">{formatTime(progress)} / {formatTime(duration)}</span>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-600" aria-label="Volume">
              <span>Vol</span>
              <input type="range" min={0} max={1} step={0.05} value={volume} onChange={handleVolume} className="accent-[#134E4A]" />
            </label>
            <div className="relative">
              <select
                aria-label="Playback speed"
                className="text-sm border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#134E4A]"
                value={rate}
                onChange={(e) => handleRate(Number(e.target.value))}
              >
                {[0.5, 1, 1.5, 2].map((r) => (
                  <option key={r} value={r}>{r}x</option>
                ))}
              </select>
            </div>
            <button
              aria-label="Fullscreen"
              className="text-sm px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#134E4A]"
              onClick={() => videoRef.current?.requestFullscreen?.()}
            >
              Fullscreen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;


