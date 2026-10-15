import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

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

  const defaultLikedSongs = [
    initialTrack,
    {
      id: 'indian_1',
      title: 'Kesariya',
      artist: 'Arijit Singh & Pritam',
      album: 'Brahmastra',
      artwork: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      durationMs: 268000,
      streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/90/e5/22/90e522d0-7a05-1a3b-2877-c918c544e311/mzaf_4614213303668102148.plus.aac.p.m4a',
      genre: 'Bollywood',
      releaseDate: '2022',
    },
    {
      id: 'eng_1',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      artwork: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      durationMs: 200000,
      streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/cd/b9/eb/cdb9eb57-0a42-7efc-d10a-3a223f03b5f9/mzaf_12411624896068305719.plus.aac.p.m4a',
      genre: 'Synthwave / Pop',
      releaseDate: '2020',
    },
  ];

  const [currentTrack, setCurrentTrack] = useState(initialTrack);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
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

  // Liked songs collection persisted in localStorage
  const [likedSongs, setLikedSongs] = useState(() => {
    try {
      const saved = localStorage.getItem('resonance_liked_songs');
      return saved ? JSON.parse(saved) : defaultLikedSongs;
    } catch {
      return defaultLikedSongs;
    }
  });

  // Save liked songs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('resonance_liked_songs', JSON.stringify(likedSongs));
    } catch (e) {
      console.error('Error saving liked songs:', e);
    }
  }, [likedSongs]);

  const likedTracks = likedSongs.map((t) => t.id);

  // Refs for stable callback access in audio listeners
  const playNextRef = useRef(null);
  const repeatModeRef = useRef(repeatMode);
  repeatModeRef.current = repeatMode;

  const playTrack = useCallback((track, newQueue = null) => {
    if (!track) return;
    setCurrentTrack(track);
    setCurrentTime(0);

    if (newQueue && newQueue.length > 0) {
      setQueue(newQueue);
      const idx = newQueue.findIndex((t) => t.id === track.id);
      setQueueIndex(idx >= 0 ? idx : 0);
    } else {
      setQueue((prevQueue) => {
        if (!prevQueue.some((t) => t.id === track.id)) {
          setQueueIndex(prevQueue.length);
          return [...prevQueue, track];
        } else {
          const idx = prevQueue.findIndex((t) => t.id === track.id);
          setQueueIndex(idx);
          return prevQueue;
        }
      });
    }

    if (audioRef.current) {
      audioRef.current.src = track.streamUrl || '';
      audioRef.current.load();
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Playback autoplay notice:', err);
          setIsPlaying(false);
        });
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (!audio.src && currentTrack?.streamUrl) {
        audio.src = currentTrack.streamUrl;
      }
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn('Play error:', err));
    }
  }, [isPlaying, currentTrack]);

  const playNext = useCallback(() => {
    if (queue.length === 0) return;
    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = queueIndex + 1;
      if (nextIndex >= queue.length) {
        if (repeatModeRef.current === 'all') {
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
  }, [queue, queueIndex, isShuffle, playTrack]);

  // Keep playNextRef up to date
  useEffect(() => {
    playNextRef.current = playNext;
  }, [playNext]);

  const playPrev = useCallback(() => {
    if (currentTime > 3 && audioRef.current) {
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
  }, [currentTime, queue, queueIndex, playTrack]);

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
      if (repeatModeRef.current === 'one') {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else if (playNextRef.current) {
        playNextRef.current();
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
  }, [currentTrack]);

  // Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Fetch or generate lyrics when current track changes
  useEffect(() => {
    if (!currentTrack) return;
    fetch(
      `/api/lyrics?title=${encodeURIComponent(currentTrack.title)}&artist=${encodeURIComponent(
        currentTrack.artist
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.lyrics) {
          setLyricsList(data.lyrics);
        }
      })
      .catch(() => {
        setLyricsList([
          { time: 0, text: `♪ ${currentTrack.title} by ${currentTrack.artist} ♪` },
          { time: 5, text: 'High fidelity sonic frequency activated' },
          { time: 10, text: 'Deep bass pulses resonating in rhythm' },
          { time: 15, text: 'Every beat echoing across the soundscape' },
          { time: 20, text: 'Feel the harmony in high definition' },
        ]);
      });
  }, [currentTrack]);

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
    setIsMuted((prev) => !prev);
  };

  const toggleLike = (track) => {
    const targetTrack = track || currentTrack;
    if (!targetTrack || !targetTrack.id) return;

    setLikedSongs((prev) => {
      const exists = prev.some((t) => t.id === targetTrack.id);
      if (exists) {
        return prev.filter((t) => t.id !== targetTrack.id);
      } else {
        return [targetTrack, ...prev];
      }
    });
  };

  const isLiked = (trackId) => {
    const id = trackId || currentTrack?.id;
    return id ? likedSongs.some((t) => t.id === id) : false;
  };

  const toggleRepeat = () => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const toggleShuffle = () => {
    setIsShuffle((prev) => !prev);
  };

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
        likedSongs,
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
