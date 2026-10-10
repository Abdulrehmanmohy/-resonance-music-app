import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);

  // Default initial track
  const initialTrack = {
    id: 'urdu_1',
    title: 'Kahani Suno 2.0',
    artist: 'Kaifi Khalil',
    album: 'Kahani Suno',
    artwork: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    durationMs: 174000,
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/78/23/75/78237534-1462-7779-165f-502bf22bed03/mzaf_15915982225370167762.plus.aac.p.m4a',
    genre: 'Urdu Pop / Indie',
    releaseDate: '2022',
  };

  const [currentTrack, setCurrentTrack] = useState(initialTrack);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30); // 30s preview or full
  const [volume, setVolumeState] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [repeatMode, setRepeatMode] = useState('all'); // 'off' | 'all' | 'one'
  const [isShuffle, setIsShuffle] = useState(false);
  const [queue, setQueue] = useState([initialTrack]);
  const [queueIndex, setQueueIndex] = useState(0);

  // UI Modals / Full Screen state
  const [isNowPlayingOpen, setIsNowPlayingOpen] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [lyricsList, setLyricsList] = useState([]);

  // Liked tracks set (persisted in localStorage)
  const [likedTracks, setLikedTracks] = useState(() => {
    try {
      const saved = localStorage.getItem('resonance_liked_tracks');
      return saved ? JSON.parse(saved) : ['urdu_1', 'indian_1', 'eng_1'];
    } catch {
      return ['urdu_1', 'indian_1', 'eng_1'];
    }
  });

  // Save liked tracks
  useEffect(() => {
    try {
      localStorage.setItem('resonance_liked_tracks', JSON.stringify(likedTracks));
    } catch (e) {
      console.error(e);
    }
  }, [likedTracks]);

  // Audio element events setup
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else {
        playNext();
      }
    };

    const handleError = (e) => {
      console.warn('Audio playback error on stream URL:', currentTrack?.streamUrl, e);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [repeatMode, queue, queueIndex, currentTrack]);

  // Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Fetch or generate lyrics when current track changes
  useEffect(() => {
    if (!currentTrack) return;
    fetch(`/api/lyrics?title=${encodeURIComponent(currentTrack.title)}&artist=${encodeURIComponent(currentTrack.artist)}`)
      .then(res => res.json())
      .then(data => {
        if (data.lyrics) {
          setLyricsList(data.lyrics);
        }
      })
      .catch(() => {
        setLyricsList([
          { time: 0, text: `♪ ${currentTrack.title} by ${currentTrack.artist} ♪` },
          { time: 5, text: "High fidelity sonic frequency activated" },
          { time: 10, text: "Deep bass pulses resonating in rhythm" },
          { time: 15, text: "Every beat echoing across the soundscape" },
          { time: 20, text: "Feel the harmony in high definition" },
        ]);
      });
  }, [currentTrack]);

  const playTrack = (track, newQueue = null) => {
    if (!track) return;
    setCurrentTrack(track);
    setCurrentTime(0);

    if (newQueue && newQueue.length > 0) {
      setQueue(newQueue);
      const idx = newQueue.findIndex(t => t.id === track.id);
      setQueueIndex(idx >= 0 ? idx : 0);
    } else {
      // If not in existing queue, append
      if (!queue.some(t => t.id === track.id)) {
        setQueue(prev => [...prev, track]);
        setQueueIndex(queue.length);
      } else {
        const idx = queue.findIndex(t => t.id === track.id);
        setQueueIndex(idx);
      }
    }

    if (audioRef.current) {
      audioRef.current.src = track.streamUrl || '';
      audioRef.current.load();
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.warn('Playback autoplay notice:', err);
          setIsPlaying(false);
        });
    }
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (!audio.src && currentTrack?.streamUrl) {
        audio.src = currentTrack.streamUrl;
      }
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.warn('Play error:', err));
    }
  };

  const playNext = () => {
    if (queue.length === 0) return;
    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = queueIndex + 1;
      if (nextIndex >= queue.length) {
        if (repeatMode === 'all') {
          nextIndex = 0;
        } else {
          setIsPlaying(false);
          return;
        }
      }
    }
    setQueueIndex(nextIndex);
    const nextTrack = queue[nextIndex];
    if (nextTrack) {
      playTrack(nextTrack);
    }
  };

  const playPrev = () => {
    if (currentTime > 3 && audioRef.current) {
      // Seek back to start if already playing for a few seconds
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    if (queue.length === 0) return;
    let prevIndex = queueIndex - 1;
    if (prevIndex < 0) {
      prevIndex = queue.length - 1;
    }
    setQueueIndex(prevIndex);
    const prevTrack = queue[prevIndex];
    if (prevTrack) {
      playTrack(prevTrack);
    }
  };

  const seekTo = (seconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  const setVolume = (val) => {
    setVolumeState(Math.max(0, Math.min(1, val)));
    if (isMuted && val > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const toggleLike = (track) => {
    const trackId = track?.id || currentTrack?.id;
    if (!trackId) return;

    setLikedTracks(prev => {
      if (prev.includes(trackId)) {
        return prev.filter(id => id !== trackId);
      } else {
        return [...prev, trackId];
      }
    });
  };

  const isLiked = (trackId) => {
    const id = trackId || currentTrack?.id;
    return id ? likedTracks.includes(id) : false;
  };

  const toggleRepeat = () => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const toggleShuffle = () => {
    setIsShuffle(prev => !prev);
  };

  // Format seconds to mm:ss
  const formatTime = (sec) => {
    if (!sec || isNaN(sec)) return '0:00';
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        repeatMode,
        isShuffle,
        queue,
        queueIndex,
        isNowPlayingOpen,
        showLyrics,
        lyricsList,
        likedTracks,
        playTrack,
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
      }}
    >
      <audio ref={audioRef} preload="auto" />
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
