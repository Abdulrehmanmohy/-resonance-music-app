import React, { useState } from 'react';
import { PlayerProvider } from './context/PlayerContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import MiniPlayer from './components/MiniPlayer';
import NowPlayingModal from './components/NowPlayingModal';
import HomeScreen from './components/HomeScreen';
import SearchScreen from './components/SearchScreen';
import LibraryScreen from './components/LibraryScreen';
import ArtistScreen from './components/ArtistScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedArtistName, setSelectedArtistName] = useState(null);

  const handleSelectArtist = (artistName) => {
    setSelectedArtistName(artistName);
    setActiveTab('artist');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromArtist = () => {
    setSelectedArtistName(null);
    setActiveTab('home');
  };

  return (
    <PlayerProvider>
      <div className="relative min-h-screen bg-[#131313] text-[#e5e2e1] antialiased overflow-x-hidden selection:bg-[#ddb7ff] selection:text-[#490080]">
        {/* Ambient Light Orbs / Radial Backdrop Glows (Stitch Design Specification) */}
        <div className="fixed top-0 left-1/4 -translate-x-1/2 w-[380px] h-[380px] bg-[#b76dff]/15 rounded-full blur-[130px] pointer-events-none z-0" />
        <div className="fixed top-1/3 right-0 w-[300px] h-[300px] bg-[#03b5d3]/12 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="fixed bottom-10 left-10 w-[320px] h-[320px] bg-[#ddb7ff]/10 rounded-full blur-[140px] pointer-events-none z-0" />

        {/* Top Docked Header */}
        <Header 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            if (tab !== 'artist') setSelectedArtistName(null);
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenSearch={() => {
            setActiveTab('search');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Screen Routing */}
        <div className="relative z-10 min-h-[calc(100vh-140px)]">
          {activeTab === 'home' && (
            <HomeScreen
              onSelectArtist={handleSelectArtist}
            />
          )}

          {activeTab === 'search' && (
            <SearchScreen
              onSelectArtist={handleSelectArtist}
            />
          )}

          {activeTab === 'library' && (
            <LibraryScreen
              onSelectArtist={handleSelectArtist}
            />
          )}

          {activeTab === 'artist' && selectedArtistName && (
            <ArtistScreen
              artistName={selectedArtistName}
              onBack={handleBackFromArtist}
            />
          )}
        </div>

        {/* Persistent Sticky Mini Player */}
        <MiniPlayer />

        {/* Bottom Dock Navigation (Mobile) */}
        <BottomNav
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (tab !== 'artist') setSelectedArtistName(null);
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Fullscreen Immersive Now Playing & Lyrics Modal */}
        <NowPlayingModal
          onOpenArtist={handleSelectArtist}
        />
      </div>
    </PlayerProvider>
  );
}
