import React, { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { ArrowLeft, Play, Pause, Heart } from 'lucide-react';

export default function ArtistScreen({ artistName, onBack }) {
  const { playTrack, togglePlayPause, currentTrack, isPlaying, isLiked, toggleLike, formatTime } = usePlayer();
  const [artistData, setArtistData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/artist/${encodeURIComponent(artistName)}`)
      .then(res => res.json())
      .then(data => {
        if (!ignore) setArtistData(data);
      })
      .catch(console.error)
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [artistName]);

  if (loading) {
    return (
      <main className="relative z-10 pt-24 px-4 sm:px-6 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-[#ddb7ff]">
          <span className="w-6 h-6 border-2 border-[#ddb7ff] border-t-transparent rounded-full animate-spin"></span>
          <span className="text-base font-bold">Loading Artist Profile...</span>
        </div>
      </main>
    );
  }

  if (!artistData) {
    return (
      <main className="relative z-10 pt-24 px-4 sm:px-6 max-w-7xl mx-auto text-center space-y-4">
        <p className="text-white">Artist not found.</p>
        <button onClick={onBack} className="text-[#ddb7ff] underline">Go Back</button>
      </main>
    );
  }

  return (
    <main className="relative z-10 pt-16 max-w-7xl mx-auto space-y-8 pb-32">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-2">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#201f1f] text-white hover:text-[#ddb7ff] border border-white/10 active:scale-95 transition-all text-xs font-bold"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <span className="text-xs uppercase tracking-widest text-[#4cd7f6] font-bold">ARTIST PROFILE</span>
      </div>

      {/* Immersive Cinematic Hero Banner */}
      <section className="relative w-full h-[360px] sm:h-[420px] rounded-3xl overflow-hidden mx-auto border border-white/10 shadow-2xl">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: `url(${artistData.headerImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/50 to-black/30" />

        {/* Hero Details */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#4cd7f6]/20 text-[#4cd7f6] text-[11px] font-extrabold uppercase border border-[#4cd7f6]/30">
                VERIFIED ARTIST
              </span>
              <span className="text-xs text-[#ddb7ff] font-semibold">{artistData.rank}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-lg">
              {artistData.name}
            </h1>

            <p className="text-xs sm:text-sm text-[#cfc2d6]">
              {artistData.monthlyListeners} monthly listeners worldwide
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {artistData.topTracks?.length > 0 && (
              <button
                onClick={() => playTrack(artistData.topTracks[0], artistData.topTracks)}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#a855f7] to-[#4cd7f6] text-[#0e0e0e] font-extrabold text-xs shadow-xl shadow-[#a855f7]/30 hover:scale-105 active:scale-95 transition-all"
              >
                <Play size={16} className="fill-[#0e0e0e] translate-x-0.5" />
                <span>PLAY ALL</span>
              </button>
            )}

            <button
              onClick={() => setIsFollowing(prev => !prev)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${
                isFollowing
                  ? 'bg-transparent text-white border-white/30'
                  : 'bg-[#ddb7ff] text-[#400071] border-transparent font-extrabold hover:scale-105'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        </div>
      </section>

      {/* Top 10 Popular Releases */}
      <section className="px-4 sm:px-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Popular Releases</h2>
          <span className="text-xs text-[#cfc2d6]">Top 10 Streams</span>
        </div>

        <div className="space-y-1.5">
          {artistData.topTracks?.map((track, idx) => {
            const isCurrent = currentTrack?.id === track.id;
            return (
              <div
                key={track.id || idx}
                onClick={() => playTrack(track, artistData.topTracks)}
                className={`group flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#353534]/70 border border-[#ddb7ff]/40 shadow-md'
                    : 'hover:bg-[#201f1f]/80 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0 pr-4">
                  <span className="text-xs font-bold text-[#cfc2d6]/60 w-5 text-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 bg-[#2a2a2a] border border-white/10">
                    <img
                      src={track.artwork}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                    {isCurrent && isPlaying && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-0.5">
                        <span className="w-0.5 bg-[#4cd7f6] rounded-full equalizer-bar-1"></span>
                        <span className="w-0.5 bg-[#ddb7ff] rounded-full equalizer-bar-2"></span>
                        <span className="w-0.5 bg-[#4cd7f6] rounded-full equalizer-bar-3"></span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className={`text-sm font-bold truncate ${isCurrent ? 'text-[#ddb7ff]' : 'text-white'}`}>
                      {track.title}
                    </span>
                    <span className="text-xs text-[#cfc2d6]/70 truncate">{track.album}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  <span className="text-xs font-mono text-[#cfc2d6]/60 hidden sm:inline">
                    {formatTime((track.durationMs || 180000) / 1000)}
                  </span>
                  <button
                    onClick={() => toggleLike(track)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#cfc2d6] hover:text-[#ddb7ff] active:scale-90 transition-transform"
                    aria-label="Like track"
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
                        playTrack(track, artistData.topTracks);
                      }
                    }}
                    className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-[#ddb7ff] hover:text-[#400071] text-white active:scale-90 transition-all"
                    aria-label="Play or pause"
                  >
                    {isCurrent && isPlaying ? (
                      <Pause size={16} className="fill-current" />
                    ) : (
                      <Play size={16} className="fill-current translate-x-0.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Discography Albums */}
      {artistData.albums?.length > 0 && (
        <section className="px-4 sm:px-6 space-y-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Discography & Albums</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {artistData.albums.map((album) => (
              <div
                key={album.id}
                className="group flex flex-col p-3 rounded-2xl bg-[#201f1f] hover:bg-[#2a2a2a] border border-white/5 hover:border-[#ddb7ff]/30 cursor-pointer transition-all duration-300"
              >
                <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-2 bg-[#131313] border border-white/10">
                  <img
                    src={album.artwork || artistData.headerImage}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-[#ddb7ff] transition-colors">
                  {album.title}
                </span>
                <span className="text-[11px] text-[#cfc2d6]/70 mt-0.5">{album.year} • Album</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Artist Bio */}
      {artistData.bio && (
        <section className="px-4 sm:px-6">
          <div className="p-6 rounded-3xl bg-[#201f1f]/60 border border-white/10 space-y-2">
            <h3 className="text-base font-extrabold text-white">About the Artist</h3>
            <p className="text-xs sm:text-sm text-[#cfc2d6] leading-relaxed">{artistData.bio}</p>
          </div>
        </section>
      )}
    </main>
  );
}
