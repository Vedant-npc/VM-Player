import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { useToast } from '../../context/ToastContext';
import {
  SearchIcon,
  UploadIcon,
  BellIcon,
  KeyboardIcon,
  MenuIcon,
  CloseIcon,
  CheckIcon,
} from './Icons';

export const Navbar: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    setRoute,
    toggleSidebar,
    toggleStreamModal,
    toggleShortcutsModal,
  } = usePlayer();
  const { showSuccess, showInfo } = useToast();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifications = [
    { id: 1, title: 'New 4K Stream Available', time: '10m ago', unread: true },
    { id: 2, title: 'Blender Cinema Studios uploaded a new project', time: '1h ago', unread: true },
    { id: 3, title: 'Your local file playback engine is ready', time: '1d ago', unread: false },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      showInfo('Type a video title, creator, or topic to filter the feed');
      return;
    }
    setRoute('home');
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-[#0E121A] border-b border-[#232A3B] px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu Toggle & Clickable Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => toggleSidebar()}
          className="p-2 rounded text-slate-300 hover:text-white hover:bg-[#1D2332] transition-colors focus:outline-none"
          aria-label="Toggle navigation drawer"
        >
          <MenuIcon size={20} />
        </button>

        {/* Clickable Logo */}
        <button
          onClick={() => {
            setSearchQuery('');
            setRoute('home');
          }}
          className="flex items-center gap-2.5 text-left focus:outline-none group"
          aria-label="VM Player Home"
        >
          <div className="w-8 h-8 rounded-md bg-[#161B26] border border-[#232A3B] flex items-center justify-center text-white shadow-solid group-hover:border-[#E50914] transition-colors">
            <span className="font-extrabold text-xs tracking-tighter text-[#E50914]">VM</span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-white leading-tight">
              VM <span className="text-[#E50914]">PLAYER</span>
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 leading-none">
              Studio Broadcast
            </span>
          </div>
        </button>
      </div>

      {/* Center: Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="hidden md:flex items-center flex-1 max-w-lg mx-4"
        role="search"
      >
        <div className="relative w-full flex items-center">
          <div className="absolute left-3 text-slate-400 pointer-events-none">
            <SearchIcon size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search titles, creators, tags (e.g. Sintel, VFX, 4K)..."
            className="w-full h-10 pl-9 pr-8 rounded-l bg-[#161B26] border border-[#232A3B] focus:border-[#E50914] focus:outline-none text-sm text-white placeholder-slate-400 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-slate-400 hover:text-white"
              aria-label="Clear search input"
            >
              <CloseIcon size={14} />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="h-10 px-4 rounded-r bg-[#1D2332] border border-l-0 border-[#232A3B] hover:bg-[#232A3B] text-slate-200 text-sm font-semibold transition-colors focus:outline-none"
        >
          Search
        </button>
      </form>

      {/* Right Action Cluster */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Custom Stream & Local File Ingestion Button */}
        <button
          onClick={() => toggleStreamModal(true)}
          className="flex items-center gap-2 h-9 px-3 rounded bg-[#1D2332] border border-[#232A3B] hover:border-[#E50914] hover:bg-[#232A3B] text-slate-100 text-xs sm:text-sm font-semibold transition-colors focus:outline-none"
          title="Ingest Custom Stream or Local File"
        >
          <UploadIcon size={16} className="text-[#E50914]" />
          <span className="hidden sm:inline">Ingest Stream</span>
        </button>

        {/* Keyboard Shortcuts Trigger */}
        <button
          onClick={() => toggleShortcutsModal(true)}
          className="p-2 rounded text-slate-300 hover:text-white hover:bg-[#1D2332] transition-colors focus:outline-none"
          aria-label="Keyboard Shortcuts (?)"
          title="Keyboard Shortcuts (?)"
        >
          <KeyboardIcon size={18} />
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen((prev) => !prev)}
            className="p-2 rounded text-slate-300 hover:text-white hover:bg-[#1D2332] transition-colors focus:outline-none relative"
            aria-label="Notifications"
          >
            <BellIcon size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E50914]" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-md bg-[#161B26] border border-[#2C3549] text-white shadow-elevated p-3 z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#232A3B]">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Broadcast Alerts
                </span>
                <button
                  onClick={() => {
                    setNotificationsOpen(false);
                    showSuccess('All notifications marked as read');
                  }}
                  className="text-[11px] text-[#E50914] hover:underline"
                >
                  Mark read
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2 rounded bg-[#0E121A] border border-[#232A3B] text-xs flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between font-medium text-slate-200">
                      <span>{n.title}</span>
                      {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Studio Avatar Profile */}
        <div className="relative ml-1">
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="w-8 h-8 rounded-full border border-[#232A3B] bg-[#161B26] flex items-center justify-center text-xs font-bold text-white hover:border-[#E50914] transition-colors focus:outline-none"
            aria-label="User profile settings"
          >
            VP
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-md bg-[#161B26] border border-[#2C3549] text-white shadow-elevated p-2 z-50 text-xs">
              <div className="p-2 border-b border-[#232A3B] mb-1">
                <p className="font-bold text-white">Broadcast Master</p>
                <p className="text-[11px] text-slate-400">admin@vmplayer.io</p>
              </div>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  setRoute('library');
                }}
                className="w-full text-left px-2 py-1.5 rounded hover:bg-[#1D2332] text-slate-200"
              >
                Media Library
              </button>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  toggleStreamModal(true);
                }}
                className="w-full text-left px-2 py-1.5 rounded hover:bg-[#1D2332] text-slate-200"
              >
                Ingest Stream
              </button>
              <div className="my-1 border-t border-[#232A3B]" />
              <button
                onClick={() => {
                  setProfileOpen(false);
                  showSuccess('Player hardware acceleration active');
                }}
                className="w-full text-left px-2 py-1.5 rounded hover:bg-[#1D2332] text-slate-400 flex items-center justify-between"
              >
                <span>Hardware Acceleration</span>
                <CheckIcon size={12} className="text-[#10B981]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
