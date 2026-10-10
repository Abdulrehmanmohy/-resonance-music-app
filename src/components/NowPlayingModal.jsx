import React, { useRef, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';

export default function NowPlayingModal({ onOpenArtist }) {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    repeatMode,
    isShuffle,
    isNowPlayingOpen,
    showLyrics,
    lyricsList,
    togglePlayPause,
    playNext,
    playPrev,
    seekTo,
    setVolume,
    toggleMute,
    toggleLike,
    isLiked,
    toggleRepeat,
    toggleShuffle,
    setIsNowPlayingOpen,
    setShowLyrics,
    formatTime,
  } = usePlayer();

  const lyricsContainerRef = useRef(null);

  // Auto-scroll lyrics to active line
  useEffect(() => {
    if (!showLyrics || !lyricsContainerRef.current) return;
    const activeEl = lyricsContainerRef.current.querySelector('.active-lyric');
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentTime, showLyrics]);

  if (!isNowPlayingOpen || !currentTrack) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleScrubberClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newPercent = Math.max(0, Math.min(1, clickX / rect.width));
    seekTo(newPercent * duration);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#131313] animate-in fade-in slide-in-from-bottom duration-300">
      {/* Ambient Radial Mesh Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#b76dff]/20 blur-[130px]" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-[#4cd7f6]/15 blur-[120px]" />
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
            <span className="material-symbols-outlined text-[26px]">keyboard_arrow_down</span>
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
            onClick={() => setShowLyrics(prev => !prev)}
            className={`flex items-center justify-center w-9 h-9 rounded-full transition-all active:scale-90 ${
              showLyrics ? 'bg-[#ddb7ff] text-[#400071] font-bold shadow-[0_0_12px_#ddb7ff]' : 'text-[#cfc2d6] hover:text-white'
            }`}
            title="Toggle Live Lyrics"
          >
            <span className="material-symbols-outlined text-[22px]">lyrics</span>
          </button>
        </header>

        {/* Center: Artwork Stage OR Synchronized Lyrics */}
        <div className="flex-1 flex flex-col items-center justify-center my-auto py-2">
          {!showLyrics ? (
            /* Album Cover Display */
            <div className="relative group w-72 h-72 sm:w-80 sm:h-80 mx-auto transition-transform duration-300">
              {/* Dynamic ambient art bloom */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-[#b76dff]/40 via-[#4cd7f6]/30 to-[#ddb7ff]/40 blur-2xl opacity-80 group-hover:opacity-100 transition duration-500" />
              
              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/15 bg-[#0e0e0e] shadow-2xl">
                <img
                  src={currentTrack.artwork}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover select-none pointer-events-none"
                />

                {/* Live Equalizer Overlay Pill */}
                <div className="absolute bottom-3 right-3 flex items-end gap-1 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20">
                  <div className={`w-1 bg-[#4cd7f6] rounded-full ${isPlaying ? 'equalizer-bar-1' : 'h-1'}`} />
                  <div className={`w-1 bg-[#ddb7ff] rounded-full ${isPlaying ? 'equalizer-bar-2' : 'h-2'}`} />
                  <div className={`w-1 bg-[#4cd7f6] rounded-full ${isPlaying ? 'equalizer-bar-3' : 'h-3'}`} />
                  <div className={`w-1 bg-[#b76dff] rounded-full ${isPlaying ? 'equalizer-bar-4' : 'h-1.5'}`} />
                </div>
              </div>
            </div>
          ) : (
            /* Live Synchronized Karaoke Lyrics View */
            <div 
              ref={lyricsContainerRef}
              className="w-full h-80 sm:h-96 rounded-2xl bg-[#1c1b1b]/70 backdrop-blur-2xl border border-white/10 p-6 overflow-y-auto space-y-6 text-center select-none"
            >
              <div className="text-xs font-bold uppercase tracking-wider text-[#4cd7f6] pb-2">
                • Synchronized Live Lyrics •
              </div>
              {lyricsList.map((line, idx) => {
                const nextTime = lyricsList[idx + 1]?.time || 9999;
                const isActive = currentTime >= line.time && currentTime < nextTime;
                return (
                  <p
                    key={idx}
                    onClick={() => seekTo(line.time)}
                    className={`transition-all duration-300 cursor-pointer font-bold ${
                      isActive
                        ? 'active-lyric text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#ddb7ff] to-[#4cd7f6] scale-105 drop-shadow-[0_0_12px_rgba(221,183,255,0.8)]'
                        : 'text-base sm:text-lg text-white/40 hover:text-white/70'
                    }`}
                  >
                    {line.text}
                  </p>
                );
              })}
            </div>
          )}
        </div>

        {/* Title, Artist, & Like Section */}
        <div className="w-full flex items-center justify-between mt-6 px-1">
          <div className="flex flex-col min-w-0 pr-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight truncate">
              {currentTrack.title}
            </h2>
            <div className="flex items-center gap-2 mt-1">
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
            <span className={`material-symbols-outlined text-[28px] ${isLiked(currentTrack.id) ? 'text-[#ddb7ff] font-bold fill-current' : 'text-[#cfc2d6]'}`}>
              {isLiked(currentTrack.id) ? 'favorite' : 'favorite_border'}
            </span>
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
            <span className="material-symbols-outlined text-[24px]">shuffle</span>
          </button>

          {/* Previous Track */}
          <button
            onClick={playPrev}
            className="w-12 h-12 rounded-full flex items-center justify-center text-white hover:text-[#ddb7ff] active:scale-90 transition-transform"
            aria-label="Previous"
          >
            <span className="material-symbols-outlined text-[32px]">skip_previous</span>
          </button>

          {/* Master Play / Pause Pill */}
          <button
            onClick={togglePlayPause}
            className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#a855f7] to-[#4cd7f6] text-[#0e0e0e] shadow-[0_0_24px_rgba(168,85,247,0.6)] hover:scale-105 active:scale-95 transition-all"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            <span className="material-symbols-outlined text-[36px] font-extrabold">
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>

          {/* Next Track */}
          <button
            onClick={playNext}
            className="w-12 h-12 rounded-full flex items-center justify-center text-white hover:text-[#ddb7ff] active:scale-90 transition-transform"
            aria-label="Next"
          >
            <span className="material-symbols-outlined text-[32px]">skip_next</span>
          </button>

          {/* Repeat Mode Toggle */}
          <button
            onClick={toggleRepeat}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 ${
              repeatMode !== 'off' ? 'text-[#ddb7ff] drop-shadow-[0_0_8px_#ddb7ff]' : 'text-[#cfc2d6]/60 hover:text-white'
            }`}
            title={`Repeat: ${repeatMode}`}
          >
            <span className="material-symbols-outlined text-[24px]">
              {repeatMode === 'one' ? 'repeat_one' : 'repeat'}
            </span>
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
              <span className="material-symbols-outlined text-[20px]">
                {isMuted || volume === 0 ? 'volume_off' : volume > 0.5 ? 'volume_up' : 'volume_down'}
              </span>
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
