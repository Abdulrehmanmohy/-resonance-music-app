import React, { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';

export default function LibraryScreen({ onSelectArtist }) {
  const { playTrack, togglePlayPause, currentTrack, isPlaying, likedTracks, toggleLike, isLiked, formatTime } = usePlayer();
  const [filter, setFilter] = useState('playlists'); // 'playlists' | 'liked'
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [likedSongObjects, setLikedSongObjects] = useState([]);

  // Fetch playlists
  useEffect(() => {
    fetch('/api/playlists')
      .then(res => res.json())
      .then(data => setPlaylists(data))
      .catch(console.error);
  }, []);

  // Fetch liked songs details
  useEffect(() => {
    fetch('/api/trending?region=all')
      .then(res => res.json())
      .then(data => {
        const all = [
          ...(data.categories?.urdu || []),
          ...(data.categories?.indian || []),
          ...(data.categories?.english || []),
        ];
        const matched = all.filter(t => likedTracks.includes(t.id));
        setLikedSongObjects(matched);
      })
      .catch(console.error);
  }, [likedTracks]);

  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    fetch('/api/playlists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle, description: newDesc }),
    })
      .then(res => res.json())
      .then(created => {
        setPlaylists(prev => [...prev, created]);
        setShowCreateModal(false);
        setNewTitle('');
        setNewDesc('');
      })
      .catch(console.error);
  };

  return (
    <main className="relative z-10 pt-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-7 pb-32">
      {/* Header and Stats */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Your Library
          </h1>
          <p className="text-sm text-[#cfc2d6]/70 mt-1">
            {playlists.length} playlists • {likedTracks.length} liked songs • Audiophile Fidelity
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#b76dff] to-[#4cd7f6] text-[#0e0e0e] text-sm font-extrabold shadow-lg shadow-[#b76dff]/25 hover:scale-105 active:scale-95 transition-all self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Create Playlist</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => { setFilter('playlists'); setSelectedPlaylist(null); }}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
            filter === 'playlists' && !selectedPlaylist
              ? 'bg-[#ddb7ff] text-[#400071]'
              : 'bg-[#201f1f] text-[#cfc2d6] hover:text-white'
          }`}
        >
          All Playlists
        </button>
        <button
          onClick={() => { setFilter('liked'); setSelectedPlaylist(null); }}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
            filter === 'liked'
              ? 'bg-[#ddb7ff] text-[#400071]'
              : 'bg-[#201f1f] text-[#cfc2d6] hover:text-white'
          }`}
        >
          Liked Songs ({likedTracks.length})
        </button>
      </div>

      {/* If viewing a selected playlist */}
      {selectedPlaylist ? (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedPlaylist(null)}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-[#201f1f] text-white hover:text-[#ddb7ff] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <span className="text-sm text-[#cfc2d6]">Back to Playlists</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 p-6 rounded-3xl bg-[#201f1f]/80 border border-white/10">
            <div className="w-40 h-40 rounded-2xl overflow-hidden bg-[#2a2a2a] flex-shrink-0 border border-white/10 shadow-2xl">
              <img
                src={selectedPlaylist.cover}
                alt={selectedPlaylist.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#4cd7f6]">PLAYLIST</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{selectedPlaylist.title}</h2>
              <p className="text-xs text-[#cfc2d6]">{selectedPlaylist.description}</p>
              <p className="text-xs text-[#ddb7ff]">{selectedPlaylist.tracks?.length || 0} Songs</p>

              {selectedPlaylist.tracks?.length > 0 && (
                <button
                  onClick={() => playTrack(selectedPlaylist.tracks[0], selectedPlaylist.tracks)}
                  className="mt-3 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#a855f7] to-[#4cd7f6] text-[#0e0e0e] font-extrabold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                  <span>PLAY ALL</span>
                </button>
              )}
            </div>
          </div>

          {/* Playlist Tracks List */}
          <div className="space-y-2">
            {selectedPlaylist.tracks?.map((track, idx) => (
              <PlaylistTrackRow
                key={track.id || idx}
                track={track}
                index={idx}
                playlistQueue={selectedPlaylist.tracks}
                onSelectArtist={onSelectArtist}
              />
            ))}
          </div>
        </section>
      ) : filter === 'liked' ? (
        /* Liked Songs View */
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 p-6 rounded-3xl bg-gradient-to-br from-[#4a154b] to-[#1c1b1b] border border-[#ddb7ff]/20">
            <div className="w-36 h-36 rounded-2xl bg-gradient-to-tr from-[#b76dff] to-[#4cd7f6] flex items-center justify-center flex-shrink-0 shadow-2xl">
              <span className="material-symbols-outlined text-6xl text-white fill-current">favorite</span>
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#4cd7f6]">AUTO-COLLECTION</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Liked Songs</h2>
              <p className="text-xs text-[#cfc2d6]">Your favorites stored locally and synced in lossless quality</p>
              <p className="text-xs text-[#ddb7ff]">{likedSongObjects.length} Tracks Ready</p>

              {likedSongObjects.length > 0 && (
                <button
                  onClick={() => playTrack(likedSongObjects[0], likedSongObjects)}
                  className="mt-3 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#a855f7] to-[#4cd7f6] text-[#0e0e0e] font-extrabold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                  <span>PLAY ALL</span>
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {likedSongObjects.length === 0 ? (
              <div className="text-center py-12 text-[#cfc2d6]">
                <p>No liked songs yet! Click the heart icon on any track to add it here.</p>
              </div>
            ) : (
              likedSongObjects.map((track, idx) => (
                <PlaylistTrackRow
                  key={track.id || idx}
                  track={track}
                  index={idx}
                  playlistQueue={likedSongObjects}
                  onSelectArtist={onSelectArtist}
                />
              ))
            )}
          </div>
        </section>
      ) : (
        /* Playlists Grid */
        <section className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {/* Liked Songs Special Card */}
            <div
              onClick={() => setFilter('liked')}
              className="group relative flex flex-col p-4 rounded-2xl bg-gradient-to-br from-[#4a154b] to-[#201f1f] hover:from-[#5c1c5e] border border-[#ddb7ff]/30 cursor-pointer transition-all duration-300 shadow-xl hover:scale-[1.02]"
            >
              <div className="relative aspect-square w-full rounded-xl bg-gradient-to-tr from-[#b76dff] via-[#4cd7f6] to-[#b76dff] flex items-center justify-center mb-3 shadow-lg">
                <span className="material-symbols-outlined text-4xl text-white fill-current">favorite</span>
              </div>
              <span className="text-base font-extrabold text-white truncate">Liked Songs</span>
              <span className="text-xs text-[#cfc2d6]/70 mt-1">{likedTracks.length} tracks</span>
            </div>

            {/* Custom & Curated Playlists */}
            {playlists.map((pl) => (
              <div
                key={pl.id}
                onClick={() => setSelectedPlaylist(pl)}
                className="group relative flex flex-col p-4 rounded-2xl bg-[#1c1b1b]/80 hover:bg-[#201f1f] border border-white/5 hover:border-[#ddb7ff]/30 cursor-pointer transition-all duration-300 shadow-xl hover:scale-[1.02]"
              >
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#2a2a2a] mb-3">
                  <img
                    src={pl.cover}
                    alt={pl.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>
                <span className="text-base font-extrabold text-white truncate group-hover:text-[#ddb7ff] transition-colors">
                  {pl.title}
                </span>
                <span className="text-xs text-[#cfc2d6]/70 truncate mt-1">
                  {pl.trackCount || pl.tracks?.length || 0} songs • {pl.description}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#1c1b1b] border border-white/10 shadow-2xl space-y-4">
            <h3 className="text-xl font-extrabold text-white">Create New Playlist</h3>
            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#cfc2d6] uppercase">Playlist Name</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Late Night Vibes"
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-[#201f1f] border border-white/10 text-white placeholder-white/40 text-sm outline-none focus:border-[#ddb7ff]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#cfc2d6] uppercase">Description</label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="e.g. My favorite chill and focus songs"
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-[#201f1f] border border-white/10 text-white placeholder-white/40 text-sm outline-none focus:border-[#ddb7ff]"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-[#cfc2d6] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#b76dff] to-[#4cd7f6] text-[#0e0e0e] text-xs font-extrabold shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function PlaylistTrackRow({ track, index, playlistQueue, onSelectArtist }) {
  const { currentTrack, isPlaying, playTrack, togglePlayPause, toggleLike, isLiked, formatTime } = usePlayer();
  const isCurrent = currentTrack?.id === track.id;

  return (
    <div
      onClick={() => playTrack(track, playlistQueue)}
      className={`group flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all duration-200 border ${
        isCurrent
          ? 'bg-[#2a2a2a] border-[#ddb7ff]/40 shadow-[0_0_15px_rgba(221,183,255,0.15)]'
          : 'bg-[#1c1b1b]/80 hover:bg-[#201f1f] border-white/5'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 pr-4">
        <span className="w-6 text-center text-xs font-mono text-[#cfc2d6]/50 flex-shrink-0">
          {index + 1}
        </span>
        <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#2a2a2a] flex-shrink-0 border border-white/10">
          <img src={track.artwork} alt={track.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className={`text-sm font-bold truncate ${isCurrent ? 'text-[#ddb7ff]' : 'text-white'}`}>
            {track.title}
          </span>
          <span className="text-xs text-[#cfc2d6]/70 truncate">{track.artist}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <span className="text-xs font-mono text-[#cfc2d6]/60 hidden sm:inline">
          {formatTime((track.durationMs || 180000) / 1000)}
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
              playTrack(track, playlistQueue);
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
}
