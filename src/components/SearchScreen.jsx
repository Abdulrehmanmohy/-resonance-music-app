import React, { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';

export default function SearchScreen({ onSelectArtist }) {
  const { currentTrack, isPlaying, playTrack, togglePlayPause, toggleLike, isLiked, formatTime } = usePlayer();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const exploreGenres = [
    { name: 'Urdu Indie & Pop', query: 'Kaifi Khalil Atif Aslam', gradient: 'from-[#a855f7] to-[#ec4899]', icon: 'mic' },
    { name: 'Bollywood Hits', query: 'Arijit Singh Pritam', gradient: 'from-[#f59e0b] to-[#ef4444]', icon: 'music_note' },
    { name: 'Coke Studio', query: 'Coke Studio Pakistan', gradient: 'from-[#dc2626] to-[#7c2d12]', icon: 'graphic_eq' },
    { name: 'Punjabi Fire', query: 'AP Dhillon Sidhu Moosewala', gradient: 'from-[#06b6d4] to-[#3b82f6]', icon: 'local_fire_department' },
    { name: 'Global English Top', query: 'The Weeknd Taylor Swift', gradient: 'from-[#8b5cf6] to-[#06b6d4]', icon: 'public' },
    { name: 'Sufi & Qawwali', query: 'Nusrat Fateh Ali Khan', gradient: 'from-[#10b981] to-[#047857]', icon: 'spa' },
    { name: 'Lo-Fi Chill & Night', query: 'Lo-Fi Beats Study', gradient: 'from-[#6366f1] to-[#a855f7]', icon: 'nightlight' },
    { name: 'Synthwave & EDM', query: 'Kavinsky Synthwave Daft Punk', gradient: 'from-[#f43f5e] to-[#8b5cf6]', icon: 'headphones' },
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

  const handleChipClick = (query, genreName) => {
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
          <span className="material-symbols-outlined text-[#cfc2d6] text-[24px] mr-3">
            search
          </span>
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
              className="text-[#cfc2d6] hover:text-white p-1 rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
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

      {/* Search Results List */}
      {searchTerm.trim() !== '' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-white">
              {searchResults.length > 0 ? `Found ${searchResults.length} Tracks` : 'No matches found'}
            </h2>
            <span className="text-xs text-[#4cd7f6] font-semibold">Ready to Stream</span>
          </div>

          <div className="space-y-2">
            {searchResults.map((track, index) => {
              const isCurrent = currentTrack?.id === track.id;
              return (
                <div
                  key={track.id || index}
                  onClick={() => playTrack(track, searchResults)}
                  className={`group flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all duration-200 border ${
                    isCurrent
                      ? 'bg-[#2a2a2a] border-[#ddb7ff]/40 shadow-[0_0_15px_rgba(221,183,255,0.15)]'
                      : 'bg-[#1c1b1b]/80 hover:bg-[#201f1f] border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-4">
                    {/* Index or Equalizer */}
                    <div className="w-6 text-center text-xs font-mono text-[#cfc2d6]/50 flex-shrink-0">
                      {isCurrent && isPlaying ? (
                        <div className="flex items-end justify-center gap-0.5 h-3">
                          <span className="w-0.5 bg-[#4cd7f6] rounded-full equalizer-bar-1"></span>
                          <span className="w-0.5 bg-[#ddb7ff] rounded-full equalizer-bar-2"></span>
                          <span className="w-0.5 bg-[#4cd7f6] rounded-full equalizer-bar-3"></span>
                        </div>
                      ) : (
                        index + 1
                      )}
                    </div>

                    {/* Artwork */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#2a2a2a] flex-shrink-0 border border-white/10">
                      <img
                        src={track.artwork}
                        alt={track.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Song Details */}
                    <div className="flex flex-col min-w-0">
                      <span className={`text-sm font-bold truncate ${isCurrent ? 'text-[#ddb7ff]' : 'text-white'}`}>
                        {track.title}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-[#cfc2d6]/70 truncate mt-0.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectArtist?.(track.artist);
                          }}
                          className="hover:text-white transition-colors truncate"
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
                      <span className={`material-symbols-outlined text-[20px] ${isLiked(track.id) ? 'text-[#ddb7ff] fill-current font-bold' : ''}`}>
                        {isLiked(track.id) ? 'favorite' : 'favorite_border'}
                      </span>
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
                      <span className="material-symbols-outlined text-[20px] font-bold">
                        {isCurrent && isPlaying ? 'pause' : 'play_arrow'}
                      </span>
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
          {exploreGenres.map((genre) => (
            <div
              key={genre.name}
              onClick={() => handleChipClick(genre.query, genre.name)}
              className={`group relative h-28 sm:h-32 rounded-2xl p-4 overflow-hidden bg-gradient-to-br ${genre.gradient} cursor-pointer shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200 border border-white/15`}
            >
              <div className="relative z-10 flex flex-col justify-between h-full">
                <span className="text-sm sm:text-base font-extrabold text-white drop-shadow-md">
                  {genre.name}
                </span>
                <span className="text-[11px] font-semibold text-white/80 flex items-center gap-1">
                  <span>Explore</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </span>
              </div>

              {/* Decorative corner icon */}
              <span className="absolute -bottom-2 -right-2 material-symbols-outlined text-6xl text-white/20 select-none pointer-events-none group-hover:scale-110 transition-transform">
                {genre.icon}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
