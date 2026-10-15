import React, { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Search, X, Heart, Play, Pause, ArrowRight, Music, Mic, Flame, Globe, Radio, Sparkles, Headphones } from 'lucide-react';

export default function SearchScreen({ onSelectArtist }) {
  const { currentTrack, isPlaying, playTrack, togglePlayPause, toggleLike, isLiked, formatTime } = usePlayer();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const exploreGenres = [
    { name: 'Urdu Indie & Pop', query: 'Kaifi Khalil Atif Aslam', gradient: 'from-[#a855f7] to-[#ec4899]', Icon: Mic },
    { name: 'Bollywood Hits', query: 'Arijit Singh Pritam', gradient: 'from-[#f59e0b] to-[#ef4444]', Icon: Music },
    { name: 'Coke Studio', query: 'Coke Studio Pakistan', gradient: 'from-[#dc2626] to-[#7c2d12]', Icon: Radio },
    { name: 'Punjabi Fire', query: 'AP Dhillon Sidhu Moosewala', gradient: 'from-[#06b6d4] to-[#3b82f6]', Icon: Flame },
    { name: 'Global English Top', query: 'The Weeknd Taylor Swift', gradient: 'from-[#8b5cf6] to-[#06b6d4]', Icon: Globe },
    { name: 'Sufi & Qawwali', query: 'Nusrat Fateh Ali Khan', gradient: 'from-[#10b981] to-[#047857]', Icon: Sparkles },
    { name: 'Lo-Fi Chill & Night', query: 'Lo-Fi Beats Study', gradient: 'from-[#6366f1] to-[#a855f7]', Icon: Headphones },
    { name: 'Synthwave & EDM', query: 'Kavinsky Synthwave Daft Punk', gradient: 'from-[#f43f5e] to-[#8b5cf6]', Icon: Headphones },
  ];

  // Perform search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      setIsSearching(true);
      fetch(`/api/search?q=${encodeURIComponent(searchTerm)}&limit=30`)
        .then(res => res.json())
        .then(data => {
          if (data.results) {
            setSearchResults(data.results);
          }
        })
        .catch(err => console.error('Search error:', err))
        .finally(() => setIsSearching(false));
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleChipClick = (query) => {
    setSearchTerm(query);
  };

  return (
    <main className="relative z-10 pt-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-7 pb-32">
      {/* Search Header */}
      <div className="pt-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Search & Explore Hub
        </h1>
        <p className="text-sm text-[#cfc2d6]/70 mt-1">
          Stream any song in the world — Urdu, Indian, English, Punjabi, and international hits.
        </p>
      </div>

      {/* Search Input Bar */}
      <section className="relative">
        <div className="relative flex items-center w-full rounded-full bg-[#201f1f] border border-[#4d4354]/40 focus-within:border-[#ddb7ff] focus-within:ring-2 focus-within:ring-[#ddb7ff]/20 backdrop-blur-xl transition-all duration-200 shadow-xl px-4 py-3">
          <Search size={22} className="text-[#cfc2d6] mr-3 flex-shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search songs, artists, Coke Studio, Bollywood, English hits..."
            className="w-full bg-transparent text-white placeholder-[#cfc2d6]/50 text-sm sm:text-base outline-none font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-[#cfc2d6] hover:text-white p-1 rounded-full transition-colors flex-shrink-0"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </section>

      {/* Searching Spinner */}
      {isSearching && (
        <div className="flex items-center justify-center py-8 gap-3 text-[#ddb7ff]">
          <span className="w-5 h-5 border-2 border-[#ddb7ff] border-t-transparent rounded-full animate-spin"></span>
          <span className="text-sm font-semibold">Searching the sonic universe...</span>
        </div>
      )}

      {/* Live Search Results */}
      {searchResults.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Search Results ({searchResults.length})
            </h2>
            <span className="text-xs text-[#4cd7f6] font-bold">256KBPS AUDIO STREAM</span>
          </div>

          <div className="space-y-1.5">
            {searchResults.map((track, idx) => {
              const isCurrent = currentTrack?.id === track.id;
              return (
                <div
                  key={track.id || idx}
                  onClick={() => playTrack(track, searchResults)}
                  className={`group flex items-center justify-between p-3 rounded-2xl transition-all duration-200 cursor-pointer ${
                    isCurrent
                      ? 'bg-[#353534]/70 border border-[#ddb7ff]/40 shadow-lg'
                      : 'hover:bg-[#201f1f]/80 border border-transparent hover:border-white/5'
                  }`}
                >
                  {/* Left Artwork & Titles */}
                  <div className="flex items-center gap-3.5 min-w-0 pr-4">
                    <span className="text-xs font-bold text-[#cfc2d6]/60 w-5 text-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-[#2a2a2a] shadow-md border border-white/10">
                      <img
                        src={track.artwork}
                        alt={track.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isCurrent && isPlaying && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-0.5">
                          <span className="w-0.5 bg-[#4cd7f6] rounded-full equalizer-bar-1"></span>
                          <span className="w-0.5 bg-[#ddb7ff] rounded-full equalizer-bar-2"></span>
                          <span className="w-0.5 bg-[#4cd7f6] rounded-full equalizer-bar-3"></span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span
                        className={`text-sm font-bold truncate transition-colors ${
                          isCurrent ? 'text-[#ddb7ff]' : 'text-white group-hover:text-[#ddb7ff]'
                        }`}
                      >
                        {track.title}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-[#cfc2d6]/70 truncate">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectArtist?.(track.artist);
                          }}
                          className="hover:text-[#ddb7ff] transition-colors truncate"
                        >
                          {track.artist}
                        </button>
                        <span>•</span>
                        <span className="truncate">{track.album}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <span className="text-xs font-mono text-[#cfc2d6]/60 hidden sm:inline">
                      {formatTime(track.durationMs / 1000)}
                    </span>

                    <button
                      onClick={() => toggleLike(track)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#cfc2d6] hover:text-[#ddb7ff] active:scale-90 transition-transform"
                    >
                      <Heart
                        size={18}
                        className={`${isLiked(track.id) ? 'fill-[#ddb7ff] text-[#ddb7ff]' : 'text-[#cfc2d6]'}`}
                      />
                    </button>

                    <button
                      onClick={() => {
                        if (isCurrent) {
                          togglePlayPause();
                        } else {
                          playTrack(track, searchResults);
                        }
                      }}
                      className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-[#ddb7ff] hover:text-[#400071] text-white active:scale-90 transition-all"
                    >
                      {isCurrent && isPlaying ? (
                        <Pause size={18} className="fill-current" />
                      ) : (
                        <Play size={18} className="fill-current translate-x-0.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Explore Genres & Soundscapes Cards */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold text-white tracking-tight">
          Explore Genres & World Sounds
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {exploreGenres.map((genre) => {
            const GenreIcon = genre.Icon;
            return (
              <div
                key={genre.name}
                onClick={() => handleChipClick(genre.query)}
                className={`group relative h-28 sm:h-32 rounded-2xl p-4 overflow-hidden bg-gradient-to-br ${genre.gradient} cursor-pointer shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200 border border-white/15`}
              >
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <span className="text-sm sm:text-base font-extrabold text-white drop-shadow-md">
                    {genre.name}
                  </span>
                  <span className="text-[11px] font-semibold text-white/80 flex items-center gap-1">
                    <span>Explore</span>
                    <ArrowRight size={14} />
                  </span>
                </div>

                {/* Decorative corner icon */}
                <GenreIcon
                  size={64}
                  className="absolute -bottom-2 -right-2 text-white/20 select-none pointer-events-none group-hover:scale-110 transition-transform"
                />
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
