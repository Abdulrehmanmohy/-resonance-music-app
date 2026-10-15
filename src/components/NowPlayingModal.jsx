import React, { useRef, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import {
  ChevronDown,
  Mic2,
  Heart,
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Volume1,
} from 'lucide-react';

export default function NowPlayingModal({ onOpenArtist }) {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    playNext,
    playPrev,
    seekTo,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    repeatMode,
    toggleRepeat,
    isShuffle,
    toggleShuffle,
    isLiked,
    toggleLike,
    isNowPlayingOpen,
    setIsNowPlayingOpen,
    showLyrics,
    setShowLyrics,
    lyricsList,
    formatTime,
  } = usePlayer();

  const lyricsContainerRef = useRef(null);

  // Auto-scroll lyrics to keep active line centered
  useEffect(() => {
    if (!showLyrics || !lyricsContainerRef.current) return;
    const activeLineEl = lyricsContainerRef.current.querySelector('.lyric-active');
    if (activeLineEl) {
      activeLineEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentTime, showLyrics]);

  if (!isNowPlayingOpen || !currentTrack) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleScrubberClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    seekTo(ratio * duration);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#131313] backdrop-blur-3xl animate-in fade-in duration-200">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#b76dff]/25 blur-[160px]" />
        <div className="absolute top-1/2 -left-32 w-80 h-80 rounded-full bg-[#4cd7f6]/15 blur-[150px]" />
        <div className="absolute bottom-10 -left-20 w-88 h-88 rounded-full bg-[#ddb7ff]/20 blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-md md:max-w-xl mx-auto min-h-screen flex flex-col justify-between px-5 pt-4 pb-8">
        {/* Top Header Bar */}
        <header className="flex items-center justify-between w-full h-12 mb-4 backdrop-blur-xl bg-[#1c1b1b]/50 rounded-full px-4 border border-white/10 shadow-sm">
          <button
            onClick={() => setIsNowPlayingOpen(false)}
            className="flex items-center justify-center w-9 h-9 rounded-full text-white hover:text-[#ddb7ff] active:scale-90 transition-all"
            aria-label="Collapse view"
          >
            <ChevronDown size={24} />
          </button>

          <div className="flex flex-col items-center text-center px-2 max-w-[220px] overflow-hidden">
            <span className="text-[10px] tracking-widest text-[#4cd7f6] uppercase font-bold truncate">
              PLAYING FROM {currentTrack.genre || 'GLOBAL CATALOG'}
            </span>
            <span className="text-xs font-bold text-white truncate">
              {currentTrack.album}
            </span>
          </div>

          <button
            onClick={() => setShowLyrics((prev) => !prev)}
            className={`flex items-center justify-center w-9 h-9 rounded-full transition-all active:scale-90 ${
              showLyrics ? 'bg-[#ddb7ff] text-[#400071] font-bold shadow-[0_0_12px_#ddb7ff]' : 'text-[#cfc2d6] hover:text-white'
            }`}
            title="Toggle Live Lyrics"
          >
            <Mic2 size={18} />
          </button>
        </header>

        {/* Center: Artwork Stage OR Synchronized Lyrics */}
        <div className="flex-1 flex flex-col items-center justify-center my-auto py-2">
          {!showLyrics ? (
            /* Album Cover Display */
            <div className="relative group w-72 h-72 sm:w-80 sm:h-80 mx-auto transition-transform duration-300">
              {/* Dynamic ambient art bloom */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-[#b76dff]/40 via-[#4cd7f6]/30 to-[#ddb7ff]/40 blur-2xl opacity-80 group-hover:opacity-100 transition duration-500" />
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#201f1f]">
                <img
                  src={currentTrack.artwork}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover select-none"
                />
              </div>
            </div>
          ) : (
            /* Synchronized Live Lyrics View */
            <div
              ref={lyricsContainerRef}
              className="w-full h-80 sm:h-96 overflow-y-auto px-4 py-8 space-y-6 text-center scrollbar-none"
            >
              <div className="text-xs uppercase tracking-widest text-[#4cd7f6] font-bold mb-4">
                SYNCHRONIZED LIVE LYRICS
              </div>
              {lyricsList && lyricsList.length > 0 ? (
                lyricsList.map((line, idx) => {
                  const isCurrentLine =
                    currentTime >= line.time &&
                    (idx === lyricsList.length - 1 || currentTime < lyricsList[idx + 1].time);
                  return (
                    <p
                      key={idx}
                      onClick={() => seekTo(line.time)}
                      className={`cursor-pointer transition-all duration-300 text-lg sm:text-xl font-bold leading-relaxed ${
                        isCurrentLine
                          ? 'lyric-active text-[#ddb7ff] scale-105 drop-shadow-[0_0_16px_rgba(221,183,255,0.7)]'
                          : 'text-white/40 hover:text-white/80 scale-95'
                      }`}
                    >
                      {line.text}
                    </p>
                  );
                })
              ) : (
                <div className="text-center text-[#cfc2d6]/60 pt-20">
                  <p>Instrumental track or audio frequency stream.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Track Title, Artist, & Like */}
        <div className="w-full flex items-center justify-between mt-6 px-1">
          <div className="flex flex-col min-w-0 pr-3">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white truncate drop-shadow-sm">
              {currentTrack.title}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <button
                onClick={() => {
                  setIsNowPlayingOpen(false);
                  onOpenArtist?.(currentTrack.artist);
                }}
                className="text-sm font-semibold text-[#cfc2d6] hover:text-[#ddb7ff] transition-colors truncate"
              >
                {currentTrack.artist}
              </button>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-[#4cd7f6] font-bold border border-[#4cd7f6]/30">
                HI-RES
              </span>
            </div>
          </div>

          <button
            onClick={() => toggleLike(currentTrack)}
            className="w-11 h-11 rounded-full flex items-center justify-center text-white hover:text-[#ddb7ff] active:scale-90 transition-transform"
            aria-label="Add to Favorites"
          >
            <Heart
              size={24}
              className={`${isLiked(currentTrack.id) ? 'fill-[#ddb7ff] text-[#ddb7ff]' : 'text-[#cfc2d6]'}`}
            />
          </button>
        </div>

        {/* Audio Scrubber Track */}
        <div className="w-full mt-6 space-y-1.5">
          <div 
            onClick={handleScrubberClick}
            className="relative w-full h-3 flex items-center cursor-pointer group"
          >
            {/* Rail Background */}
            <div className="w-full h-1.5 rounded-full bg-white/15 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#b76dff] via-[#ddb7ff] to-[#4cd7f6] rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {/* Scrubber Knob */}
            <div
              className="absolute w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_12px_#4cd7f6] border-2 border-[#4cd7f6] opacity-90 group-hover:opacity-100 group-hover:scale-125 transition-transform"
              style={{ left: `calc(${progressPercent}% - 7px)` }}
            />
          </div>

          <div className="flex justify-between items-center text-xs font-mono text-[#cfc2d6]/70 px-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Master Playback Controls */}
        <div className="w-full flex items-center justify-between mt-6 px-3">
          {/* Shuffle Toggle */}
          <button
            onClick={toggleShuffle}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 ${
              isShuffle ? 'text-[#4cd7f6] drop-shadow-[0_0_8px_#4cd7f6]' : 'text-[#cfc2d6]/60 hover:text-white'
            }`}
            title={`Shuffle: ${isShuffle ? 'On' : 'Off'}`}
          >
            <Shuffle size={20} />
          </button>

          {/* Previous Track */}
          <button
            onClick={playPrev}
            className="w-12 h-12 rounded-full flex items-center justify-center text-white hover:text-[#ddb7ff] active:scale-90 transition-transform"
            aria-label="Previous"
          >
            <SkipBack size={26} />
          </button>

          {/* Master Play / Pause Pill */}
          <button
            onClick={togglePlayPause}
            className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#a855f7] to-[#4cd7f6] text-[#0e0e0e] shadow-[0_0_24px_rgba(168,85,247,0.6)] hover:scale-105 active:scale-95 transition-all"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause size={28} className="fill-[#0e0e0e]" />
            ) : (
              <Play size={28} className="fill-[#0e0e0e] translate-x-0.5" />
            )}
          </button>

          {/* Next Track */}
          <button
            onClick={playNext}
            className="w-12 h-12 rounded-full flex items-center justify-center text-white hover:text-[#ddb7ff] active:scale-90 transition-transform"
            aria-label="Next"
          >
            <SkipForward size={26} />
          </button>

          {/* Repeat Mode Toggle */}
          <button
            onClick={toggleRepeat}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 ${
              repeatMode !== 'off' ? 'text-[#ddb7ff] drop-shadow-[0_0_8px_#ddb7ff]' : 'text-[#cfc2d6]/60 hover:text-white'
            }`}
            title={`Repeat: ${repeatMode}`}
          >
            {repeatMode === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
          </button>
        </div>

        {/* Bottom Utility: Volume & Lossless Spec */}
        <div className="w-full flex items-center justify-between mt-6 pt-4 border-t border-white/10 px-2">
          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="text-[#cfc2d6] hover:text-white active:scale-90 transition-transform"
            >
              {isMuted || volume === 0 ? (
                <VolumeX size={18} />
              ) : volume > 0.5 ? (
                <Volume2 size={18} />
              ) : (
                <Volume1 size={18} />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 sm:w-28 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#ddb7ff]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#4cd7f6] bg-[#4cd7f6]/10 px-2 py-0.5 rounded-full border border-[#4cd7f6]/20">
              256KBPS AAC
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
