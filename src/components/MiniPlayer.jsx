import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Play, Pause, SkipForward, Heart } from 'lucide-react';

export default function MiniPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    playNext,
    toggleLike,
    isLiked,
    setIsNowPlayingOpen,
  } = usePlayer();

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-[56px] md:bottom-4 left-0 w-full z-40 px-3 sm:px-6 pointer-events-none">
      <div className="max-w-md md:max-w-3xl mx-auto pointer-events-auto">
        <div 
          onClick={() => setIsNowPlayingOpen(true)}
          className="relative group flex items-center justify-between p-2 sm:p-2.5 rounded-2xl bg-[#1c1b1b]/90 hover:bg-[#201f1f] border border-white/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] cursor-pointer transition-all duration-200 active:scale-[0.99]"
        >
          {/* Top Edge Progress Line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-white/10 rounded-t-2xl overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#ddb7ff] to-[#4cd7f6] transition-all duration-150"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Left: Thumbnail & Song Info */}
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 bg-[#2a2a2a] border border-white/10">
              <img 
                src={currentTrack.artwork} 
                alt={currentTrack.title}
                className="w-full h-full object-cover" 
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-0.5">
                  <span className="w-0.5 bg-[#4cd7f6] rounded-full equalizer-bar-1"></span>
                  <span className="w-0.5 bg-[#ddb7ff] rounded-full equalizer-bar-2"></span>
                  <span className="w-0.5 bg-[#4cd7f6] rounded-full equalizer-bar-3"></span>
                </div>
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-white truncate group-hover:text-[#ddb7ff] transition-colors">
                {currentTrack.title}
              </span>
              <span className="text-xs text-[#cfc2d6]/70 truncate flex items-center gap-1.5">
                <span>{currentTrack.artist}</span>
                <span className="w-1 h-1 rounded-full bg-[#cfc2d6]/40"></span>
                <span className="text-[10px] text-[#4cd7f6] uppercase tracking-wider font-semibold">Lossless</span>
              </span>
            </div>
          </div>

          {/* Right: Actions */}
          <div 
            className="flex items-center gap-1 sm:gap-2 flex-shrink-0" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Like Button */}
            <button
              onClick={() => toggleLike(currentTrack)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#cfc2d6] hover:text-[#ddb7ff] active:scale-90 transition-transform"
              aria-label="Like"
            >
              <Heart
                size={18}
                className={`${isLiked(currentTrack.id) ? 'fill-[#ddb7ff] text-[#ddb7ff]' : 'text-[#cfc2d6]'}`}
              />
            </button>

            {/* Play / Pause CTA Pill */}
            <button
              onClick={togglePlayPause}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#b76dff] to-[#4cd7f6] text-[#0e0e0e] shadow-[0_0_16px_rgba(183,109,255,0.45)] hover:scale-105 active:scale-95 transition-all"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause size={18} className="fill-[#0e0e0e]" />
              ) : (
                <Play size={18} className="fill-[#0e0e0e] translate-x-0.5" />
              )}
            </button>

            {/* Next Track */}
            <button
              onClick={playNext}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#cfc2d6] hover:text-white active:scale-90 transition-transform"
              aria-label="Next track"
            >
              <SkipForward size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
