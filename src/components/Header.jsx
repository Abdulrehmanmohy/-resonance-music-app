import React from 'react';

export default function Header({ activeTab, setActiveTab, onOpenSearch }) {
  return (
    <header className="fixed top-0 left-0 w-full z-40 flex items-center justify-between px-4 sm:px-6 py-3 backdrop-blur-xl bg-[#201f1f]/80 border-b border-[#4d4354]/30 shadow-lg">
      <div className="flex items-center gap-3">
        {/* Leading Avatar with Neon Glow Ring */}
        <div 
          onClick={() => setActiveTab('library')}
          className="relative w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-[#ddb7ff] via-[#4cd7f6] to-[#b76dff] shadow-[0_0_12px_rgba(221,183,255,0.4)] cursor-pointer active:scale-95 transition-transform"
        >
          <img 
            alt="User Profile Avatar" 
            className="w-full h-full object-cover rounded-full" 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" 
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#4cd7f6] border border-[#0e0e0e]"></span>
        </div>

        {/* Brand Headline */}
        <div className="flex flex-col cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-extrabold text-[#ddb7ff] tracking-tight">Resonance</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#4cd7f6]/15 text-[#4cd7f6] border border-[#4cd7f6]/30">LOSSLESS</span>
          </div>
          <span className="text-[11px] text-[#cfc2d6]/70 hidden sm:inline">Audiophile Music Streaming</span>
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <nav className="hidden md:flex items-center gap-6">
        <button 
          onClick={() => setActiveTab('home')}
          className={`text-sm font-semibold transition-colors ${activeTab === 'home' ? 'text-[#ddb7ff]' : 'text-[#cfc2d6] hover:text-white'}`}
        >
          Home
        </button>
        <button 
          onClick={() => setActiveTab('search')}
          className={`text-sm font-semibold transition-colors ${activeTab === 'search' ? 'text-[#ddb7ff]' : 'text-[#cfc2d6] hover:text-white'}`}
        >
          Search & Explore
        </button>
        <button 
          onClick={() => setActiveTab('library')}
          className={`text-sm font-semibold transition-colors ${activeTab === 'library' ? 'text-[#ddb7ff]' : 'text-[#cfc2d6] hover:text-white'}`}
        >
          Your Library
        </button>
      </nav>

      {/* Right Utility Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button 
          onClick={() => { setActiveTab('search'); onOpenSearch?.(); }}
          aria-label="Search" 
          className="w-9 h-9 rounded-full flex items-center justify-center text-[#cfc2d6] hover:text-[#ddb7ff] hover:bg-white/5 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">search</span>
        </button>
        <button 
          aria-label="Equalizer" 
          className="w-9 h-9 rounded-full flex items-center justify-center text-[#cfc2d6] hover:text-[#4cd7f6] hover:bg-white/5 active:scale-95 transition-all"
          title="Sonic Fidelity Active"
        >
          <span className="material-symbols-outlined text-[20px]">equalizer</span>
        </button>
        <button 
          aria-label="Settings" 
          className="w-9 h-9 rounded-full flex items-center justify-center text-[#cfc2d6] hover:text-[#ddb7ff] hover:bg-white/5 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">tune</span>
        </button>
      </div>
    </header>
  );
}
