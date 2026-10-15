import React from 'react';
import { Home, Search, Library } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'home', label: 'Home', Icon: Home },
    { id: 'search', label: 'Search', Icon: Search },
    { id: 'library', label: 'Library', Icon: Library },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 md:hidden backdrop-blur-2xl bg-[#1c1b1b]/90 border-t border-[#4d4354]/30 px-6 py-2">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.Icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all duration-200 active:scale-95 ${
                isActive ? 'text-[#ddb7ff]' : 'text-[#cfc2d6]/70 hover:text-[#cfc2d6]'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  size={22}
                  className={`${
                    isActive ? 'stroke-[2.5] drop-shadow-[0_0_8px_rgba(221,183,255,0.6)]' : 'stroke-[1.75]'
                  }`}
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#4cd7f6] shadow-[0_0_6px_#4cd7f6]" />
                )}
              </div>
              <span className={`text-[11px] font-semibold mt-1 tracking-tight ${isActive ? 'text-[#ddb7ff]' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
