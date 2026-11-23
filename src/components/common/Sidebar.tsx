import React from 'react';
import { usePlayer } from '../../context/PlayerContext';
import {
  HomeIcon,
  TrendingIcon,
  LibraryIcon,
  HistoryIcon,
  BookmarkIcon,
  UploadIcon,
  CloseIcon,
  KeyboardIcon,
} from './Icons';

export const Sidebar: React.FC = () => {
  const {
    activeRoute,
    setRoute,
    sidebarOpen,
    toggleSidebar,
    subscribedChannels,
    toggleStreamModal,
    toggleShortcutsModal,
  } = usePlayer();

  const navItems = [
    { id: 'home' as const, label: 'Home Feed', icon: HomeIcon },
    { id: 'trending' as const, label: 'Trending', icon: TrendingIcon },
    { id: 'library' as const, label: 'Media Library', icon: LibraryIcon },
    { id: 'history' as const, label: 'Watch History', icon: HistoryIcon },
    { id: 'saved' as const, label: 'Watch Later', icon: BookmarkIcon },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => toggleSidebar(false)}
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-60 bg-[#0E121A] border-r border-[#232A3B] flex flex-col justify-between p-3 transition-transform duration-200 select-none overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col gap-4">
          {/* Mobile Drawer Header */}
          <div className="flex items-center justify-between pb-2 border-b border-[#232A3B] lg:hidden">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Navigation
            </span>
            <button
              onClick={() => toggleSidebar(false)}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <CloseIcon size={16} />
            </button>
          </div>

          {/* Primary Navigation */}
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = activeRoute === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setRoute(item.id);
                    toggleSidebar(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-xs sm:text-sm font-semibold transition-colors text-left ${
                    isActive
                      ? 'bg-[#1D2332] text-white border-l-2 border-[#E50914]'
                      : 'text-slate-300 hover:text-white hover:bg-[#161B26]'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-[#E50914]' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Stream Ingest Action */}
          <div className="pt-2 border-t border-[#232A3B]">
            <button
              onClick={() => {
                toggleStreamModal(true);
                toggleSidebar(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md bg-[#161B26] border border-[#232A3B] hover:border-[#E50914] text-xs font-semibold text-slate-200 transition-colors"
            >
              <UploadIcon size={16} className="text-[#E50914]" />
              <span>Ingest Media / File</span>
            </button>
          </div>

          {/* Subscribed Channels List */}
          <div className="pt-2 border-t border-[#232A3B]">
            <h4 className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Subscriptions
            </h4>
            <div className="flex flex-col gap-1">
              {subscribedChannels.map((channel) => (
                <button
                  key={channel}
                  onClick={() => {
                    setRoute('home');
                    toggleSidebar(false);
                  }}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded hover:bg-[#161B26] text-xs font-medium text-slate-300 hover:text-white transition-colors text-left truncate"
                >
                  <span className="w-5 h-5 rounded-full bg-[#1D2332] border border-[#232A3B] flex items-center justify-center text-[10px] text-[#E50914] font-bold">
                    {channel[0]}
                  </span>
                  <span className="truncate">{channel}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Footer info */}
        <div className="pt-4 border-t border-[#232A3B] text-[11px] text-slate-400 flex flex-col gap-2">
          <button
            onClick={() => toggleShortcutsModal(true)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <KeyboardIcon size={14} />
            <span>Shortcuts (Press ?)</span>
          </button>
          <div className="text-slate-400 leading-tight">
            <span>Contact: </span>
            <a
              href="mailto:support@vmplayer.io?subject=VM%20Player%20Inquiry"
              className="text-[#E50914] hover:underline"
            >
              support@vmplayer.io
            </a>
          </div>
          <div className="text-slate-500 font-mono text-[10px]">
            © 2026 VM Player.
          </div>
        </div>
      </aside>
    </>
  );
};
