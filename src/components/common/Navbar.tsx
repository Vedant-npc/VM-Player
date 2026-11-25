import React from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { KeyboardIcon, CloseIcon } from './Icons';

export const Navbar: React.FC = () => {
  const {
    currentVideo,
    clearCurrentVideo,
    toggleShortcutsModal,
  } = usePlayer();

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-[#0E121A] border-b border-[#232A3B] px-4 sm:px-8 flex items-center justify-between gap-4 select-none">
      {/* Left: Clickable Logo */}
      <button
        onClick={clearCurrentVideo}
        className="flex items-center gap-2.5 text-left focus:outline-none group flex-shrink-0"
        aria-label="VM Player Home"
        title="VM Player - Click to return to home"
      >
        <div className="w-8 h-8 rounded-md bg-[#161B26] border border-[#232A3B] flex items-center justify-center text-white shadow-solid group-hover:border-[#E50914] transition-colors">
          <span className="font-extrabold text-xs tracking-tighter text-[#E50914]">VM</span>
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-base tracking-tight text-white leading-tight">
            VM <span className="text-[#E50914]">PLAYER</span>
          </span>
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 leading-none">
            Video & Media Player
          </span>
        </div>
      </button>

      {/* Right Action Cluster: Eject / New Video & Shortcuts */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {currentVideo && (
          <button
            onClick={clearCurrentVideo}
            className="flex items-center gap-1.5 h-9 px-3 rounded bg-[#161B26] border border-[#232A3B] hover:border-[#E50914] text-slate-300 hover:text-white text-xs font-semibold transition-colors focus:outline-none"
            title="Eject / Load Another Video"
          >
            <CloseIcon size={14} />
            <span>Load Another Video</span>
          </button>
        )}

        <button
          onClick={() => toggleShortcutsModal(true)}
          className="p-2 rounded text-slate-300 hover:text-white hover:bg-[#1D2332] transition-colors focus:outline-none"
          aria-label="Keyboard Shortcuts (?)"
          title="Keyboard Shortcuts (?)"
        >
          <KeyboardIcon size={18} />
        </button>
      </div>
    </header>
  );
};
