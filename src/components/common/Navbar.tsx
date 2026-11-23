import React, { useState, useRef } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { useToast } from '../../context/ToastContext';
import {
  UploadIcon,
  KeyboardIcon,
  PlayIcon,
  CloseIcon,
} from './Icons';

export const Navbar: React.FC = () => {
  const {
    currentVideo,
    loadYouTubeVideo,
    loadDirectUrl,
    loadLocalFile,
    clearCurrentVideo,
    toggleShortcutsModal,
  } = usePlayer();

  const { showError } = useToast();
  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputUrl.trim();
    if (!trimmed) {
      showError('Please paste a YouTube or video URL');
      return;
    }

    setIsLoading(true);
    try {
      if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
        await loadYouTubeVideo(trimmed);
      } else {
        loadDirectUrl(trimmed);
      }
      setInputUrl('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      loadLocalFile(e.target.files[0]);
      e.target.value = '';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-[#0E121A] border-b border-[#232A3B] px-4 sm:px-6 flex items-center justify-between gap-4 select-none">
      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*,.mkv,.mp4,.webm,.mov,.avi"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Left: Clickable Logo */}
      <button
        onClick={clearCurrentVideo}
        className="flex items-center gap-2.5 text-left focus:outline-none group flex-shrink-0"
        aria-label="VM Player Home"
        title="VM Player - Click to return to launcher"
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

      {/* Center: Quick URL Ingest Input */}
      <form
        onSubmit={handleUrlSubmit}
        className="hidden sm:flex items-center flex-1 max-w-xl mx-2 md:mx-6"
        role="search"
      >
        <div className="relative w-full flex items-center">
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Paste YouTube link or video URL..."
            className="w-full h-9 pl-3.5 pr-8 rounded-l bg-[#161B26] border border-[#232A3B] focus:border-[#E50914] focus:outline-none text-xs text-white placeholder-slate-400 font-mono transition-colors"
          />
          {inputUrl && (
            <button
              type="button"
              onClick={() => setInputUrl('')}
              className="absolute right-2.5 text-slate-400 hover:text-white"
              aria-label="Clear URL input"
            >
              <CloseIcon size={12} />
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="h-9 px-4 rounded-r bg-[#E50914] hover:bg-[#F41E2A] text-white text-xs font-bold transition-colors focus:outline-none flex items-center gap-1.5 flex-shrink-0 disabled:opacity-50"
        >
          <PlayIcon size={12} />
          <span>{isLoading ? 'Loading...' : 'Play'}</span>
        </button>
      </form>

      {/* Right Action Cluster: Open Local File, Shortcuts */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 h-9 px-3 rounded bg-[#161B26] border border-[#232A3B] hover:border-[#E50914] text-slate-200 hover:text-white text-xs font-semibold transition-colors focus:outline-none"
          title="Open Local Video File"
        >
          <UploadIcon size={15} className="text-[#E50914]" />
          <span className="hidden md:inline">Open File</span>
        </button>

        {currentVideo && (
          <button
            onClick={clearCurrentVideo}
            className="hidden lg:flex items-center gap-1.5 h-9 px-3 rounded bg-[#161B26] border border-[#232A3B] hover:bg-[#1D2332] text-slate-300 hover:text-white text-xs font-semibold transition-colors"
            title="Eject / Clear Current Video"
          >
            <CloseIcon size={14} />
            <span>New Video</span>
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
