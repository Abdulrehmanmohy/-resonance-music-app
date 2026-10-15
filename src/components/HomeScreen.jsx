import React, { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Play, Pause, Heart } from 'lucide-react';

export default function HomeScreen({ onSelectArtist }) {
  const { currentTrack, isPlaying, playTrack, togglePlayPause, isLiked, toggleLike } = usePlayer();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [trendingData, setTrendingData] = useState({
    urdu: [],
    indian: [],
    english: [],
    featured: [],
  });
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', label: 'All Hits' },
    { id: 'urdu', label: 'Urdu & Coke Studio' },
    { id: 'indian', label: 'Bollywood & Punjabi' },
    { id: 'english', label: 'Global Hits (English)' },
  ];

  useEffect(() => {
    fetch('/api/trending?region=all')
      .then(res => res.json())
      .then(data => {
        if (data.categories) {
          setTrendingData(data.categories);
        }
      })
      .catch(err => console.error('Failed to load trending music:', err))
      .finally(() => setLoading(false));
  }, []);

  const displayedTracks = () => {
    if (selectedCategory === 'urdu') return trendingData.urdu;
    if (selectedCategory === 'indian') return trendingData.indian;
    if (selectedCategory === 'english') return trendingData.english;
    return [
      ...(trendingData.featured || []),
      ...(trendingData.urdu || []).slice(0, 2),
      ...(trendingData.indian || []).slice(0, 2),
      ...(trendingData.english || []).slice(0, 2),
    ];
  };

  const heroTrack = trendingData.featured?.[0] || trendingData.urdu?.[0] || {
    title: 'Kahani Suno 2.0',
    artist: 'Kaifi Khalil',
    album: 'Sonic Luxe Highlights',
    artwork: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000&auto=format&fit=crop&q=80',
    genre: 'Urdu Pop / Global Viral',
  };

  return (
    <main className="relative z-10 pt-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 pb-32">
      {/* Category Filter Chips */}
      <section className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 active:scale-95 border ${
                isActive
                  ? 'bg-gradient-to-r from-[#ddb7ff] to-[#4cd7f6] text-[#0e0e0e] border-transparent shadow-[0_0_12px_rgba(221,183,255,0.4)]'
                  : 'bg-[#201f1f] text-[#cfc2d6] border-[#4d4354]/40 hover:border-[#ddb7ff]/50'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </section>

      {/* Hero Featured Release Card */}
      <section className="relative w-full rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-[#201f1f] to-[#131313] border border-white/10 shadow-2xl">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm scale-105"
          style={{ backgroundImage: `url(${heroTrack.artwork})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/60 to-transparent" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#4cd7f6] bg-[#4cd7f6]/10 px-3 py-1 rounded-full border border-[#4cd7f6]/30">
                FEATURED SPOTLIGHT
              </span>
              <span className="text-xs text-[#ddb7ff] font-semibold">Lossless Audio</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              {heroTrack.title}
            </h1>

            <p className="text-sm sm:text-base text-[#cfc2d6] line-clamp-2">
              Stream the world's most viral track with high-fidelity acoustics. Performed by{' '}
              <button
                onClick={() => onSelectArtist(heroTrack.artist)}
                className="text-[#ddb7ff] hover:underline font-bold"
              >
                {heroTrack.artist}
              </button>.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <button
              onClick={() => {
                if (currentTrack?.id === heroTrack.id) {
                  togglePlayPause();
                } else {
                  playTrack(heroTrack, displayedTracks());
                }
              }}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#a855f7] to-[#4cd7f6] text-[#0e0e0e] font-extrabold text-sm shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:scale-105 active:scale-95 transition-all"
            >
              {currentTrack?.id === heroTrack.id && isPlaying ? (
                <Pause size={20} className="fill-[#0e0e0e]" />
              ) : (
                <Play size={20} className="fill-[#0e0e0e] translate-x-0.5" />
              )}
              <span>{currentTrack?.id === heroTrack.id && isPlaying ? 'PAUSE' : 'PLAY NOW'}</span>
            </button>

            <button
              onClick={() => toggleLike(heroTrack)}
              className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/15 border border-white/15 text-white active:scale-90 transition-transform"
              aria-label="Add hero track to favorites"
            >
              <Heart
                size={22}
                className={`${isLiked(heroTrack.id) ? 'fill-[#ddb7ff] text-[#ddb7ff]' : 'text-white'}`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Regional Categories Showcase */}
      {selectedCategory === 'all' && (
        <>
          {/* 1. Pakistani & Urdu Pop / Coke Studio */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>🇵🇰 Urdu Vibes & Coke Studio</span>
                </h2>
                <p className="text-xs text-[#cfc2d6]">Soulful ghazals, Pakistani indie & contemporary hip-hop</p>
              </div>
              <button 
                onClick={() => setSelectedCategory('urdu')}
                className="text-xs font-bold text-[#ddb7ff] hover:text-[#4cd7f6] transition-colors"
              >
                See All
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse p-3 rounded-2xl bg-[#1c1b1b]/80 border border-white/5 space-y-3">
                    <div className="aspect-square w-full rounded-xl bg-white/5" />
                    <div className="h-4 bg-white/10 rounded w-3/4" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {trendingData.urdu.map((track) => (
                  <TrackCard
                    key={track.id}
                    track={track}
                    queueList={trendingData.urdu}
                    onSelectArtist={onSelectArtist}
                  />
                ))}
              </div>
            )}
          </section>

          {/* 2. Indian & Bollywood Hits */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>🇮🇳 Bollywood & Punjabi Heat</span>
                </h2>
                <p className="text-xs text-[#cfc2d6]">Chartbusters from Arijit Singh, AP Dhillon, Sidhu Moosewala & AR Rahman</p>
              </div>
              <button 
                onClick={() => setSelectedCategory('indian')}
                className="text-xs font-bold text-[#ddb7ff] hover:text-[#4cd7f6] transition-colors"
              >
                See All
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse p-3 rounded-2xl bg-[#1c1b1b]/80 border border-white/5 space-y-3">
                    <div className="aspect-square w-full rounded-xl bg-white/5" />
                    <div className="h-4 bg-white/10 rounded w-3/4" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {trendingData.indian.map((track) => (
                  <TrackCard
                    key={track.id}
                    track={track}
                    queueList={trendingData.indian}
                    onSelectArtist={onSelectArtist}
                  />
                ))}
              </div>
            )}
          </section>

          {/* 3. Global Billboard & English Hits */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>🌍 Global Billboard Top Tracks</span>
                </h2>
                <p className="text-xs text-[#cfc2d6]">The Weeknd, Taylor Swift, Billie Eilish & international anthems</p>
              </div>
              <button 
                onClick={() => setSelectedCategory('english')}
                className="text-xs font-bold text-[#ddb7ff] hover:text-[#4cd7f6] transition-colors"
              >
                See All
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse p-3 rounded-2xl bg-[#1c1b1b]/80 border border-white/5 space-y-3">
                    <div className="aspect-square w-full rounded-xl bg-white/5" />
                    <div className="h-4 bg-white/10 rounded w-3/4" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {trendingData.english.map((track) => (
                  <TrackCard
                    key={track.id}
                    track={track}
                    queueList={trendingData.english}
                    onSelectArtist={onSelectArtist}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {/* Filtered View if single category selected */}
      {selectedCategory !== 'all' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {categories.find(c => c.id === selectedCategory)?.label}
            </h2>
            <span className="text-xs text-[#4cd7f6] font-semibold">{displayedTracks().length} Tracks Ready</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {displayedTracks().map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                queueList={displayedTracks()}
                onSelectArtist={onSelectArtist}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function TrackCard({ track, queueList, onSelectArtist }) {
  const { currentTrack, isPlaying, playTrack, togglePlayPause, toggleLike, isLiked } = usePlayer();
  const isCurrent = currentTrack?.id === track.id;

  return (
    <div className="group relative flex flex-col p-3 rounded-2xl bg-[#1c1b1b]/80 hover:bg-[#201f1f] border border-white/5 hover:border-[#ddb7ff]/30 transition-all duration-300">
      {/* Artwork with hover play button */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#2a2a2a] mb-3">
        <img
          src={track.artwork}
          alt={track.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Floating Play Overlay Pill */}
        <button
          onClick={() => {
            if (isCurrent) {
              togglePlayPause();
            } else {
              playTrack(track, queueList);
            }
          }}
          className={`absolute bottom-2 right-2 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#a855f7] to-[#4cd7f6] text-[#0e0e0e] shadow-lg transition-all duration-200 ${
            isCurrent && isPlaying
              ? 'opacity-100 scale-100'
              : 'opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 scale-95 group-hover:scale-100'
          }`}
          aria-label="Play song"
        >
          {isCurrent && isPlaying ? (
            <Pause size={18} className="fill-[#0e0e0e]" />
          ) : (
            <Play size={18} className="fill-[#0e0e0e] translate-x-0.5" />
          )}
        </button>

        {/* Like trigger button on top right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(track);
          }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-[#ddb7ff] opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Like song"
        >
          <Heart
            size={14}
            className={`${isLiked(track.id) ? 'fill-[#ddb7ff] text-[#ddb7ff]' : 'text-white'}`}
          />
        </button>
      </div>

      {/* Song Info */}
      <div className="flex flex-col min-w-0">
        <span 
          onClick={() => playTrack(track, queueList)}
          className={`text-sm font-bold truncate cursor-pointer transition-colors ${
            isCurrent ? 'text-[#ddb7ff]' : 'text-white hover:text-[#ddb7ff]'
          }`}
        >
          {track.title}
        </span>
        <button
          onClick={() => onSelectArtist?.(track.artist)}
          className="text-xs text-[#cfc2d6]/70 truncate text-left hover:text-white transition-colors mt-0.5"
        >
          {track.artist}
        </button>
      </div>
    </div>
  );
}
