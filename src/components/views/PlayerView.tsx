import React, { useState, useRef } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { useToast } from '../../context/ToastContext';
import { VMPlayer } from '../player/VMPlayer';
import {
  UploadIcon,
  PlayIcon,
  KeyboardIcon,
  ShareIcon,
  CloseIcon,
  TrashIcon,
} from '../common/Icons';

export const PlayerView: React.FC = () => {
  const {
    currentVideo,
    recentVideos,
    loadYouTubeVideo,
    loadDirectUrl,
    loadLocalFile,
    clearCurrentVideo,
    clearRecentVideos,
    removeRecentItem,
    toggleShortcutsModal,
  } = usePlayer();

  const { showSuccess, showError } = useToast();
  const [pasteUrl, setPasteUrl] = useState('');
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePasteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = pasteUrl.trim();
    if (!trimmed) {
      showError('Please paste a YouTube video URL or direct video link');
      return;
    }

    setIsLoadingUrl(true);
    try {
      if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
        await loadYouTubeVideo(trimmed);
      } else {
        loadDirectUrl(trimmed);
      }
      setPasteUrl('');
    } finally {
      setIsLoadingUrl(false);
    }
  };

  const handleShare = () => {
    if (!currentVideo) return;
    navigator.clipboard.writeText(currentVideo.url);
    showSuccess(`Video link copied to clipboard: "${currentVideo.title}"`);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      loadLocalFile(e.target.files[0]);
      e.target.value = '';
    }
  };

  // ----------------------------------------------------
  // Active Video State
  // ----------------------------------------------------
  if (currentVideo) {
    const isYouTube = currentVideo.type === 'youtube';

    return (
      <div className="w-full flex flex-col max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 overflow-x-hidden">
        {/* Hidden File Picker */}
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*,.mkv,.mp4,.webm,.mov,.avi"
          onChange={handleFileInput}
          className="hidden"
        />

        {/* Video Player Container */}
        <div className={`w-full ${isTheaterMode ? 'mb-6' : ''}`}>
          <VMPlayer
            video={currentVideo}
            isTheaterMode={isTheaterMode}
            onToggleTheater={() => setIsTheaterMode((prev) => !prev)}
            onOpenShortcuts={() => toggleShortcutsModal(true)}
          />
        </div>

        {/* Video Metadata & Controls Bar */}
        <div className="mt-5 p-5 rounded-lg bg-[#0E121A] border border-[#232A3B] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase ${
                  isYouTube ? 'bg-[#E50914] text-white' : 'bg-[#10B981] text-black'
                }`}
              >
                {isYouTube ? 'YouTube Video' : 'Local Disk File'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {currentVideo.fileSize || 'Stream Feed'} • Added {currentVideo.addedAt}
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
              {currentVideo.title}
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 h-9 px-3.5 rounded bg-[#161B26] border border-[#232A3B] hover:border-[#E50914] text-xs font-semibold text-slate-200 hover:text-white transition-colors"
            >
              <UploadIcon size={14} className="text-[#E50914]" />
              <span>Open Another File</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 h-9 px-3.5 rounded bg-[#161B26] border border-[#232A3B] hover:border-[#323B52] text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              title="Copy Video Link"
            >
              <ShareIcon size={14} />
              <span>Copy Link</span>
            </button>

            <button
              onClick={() => toggleShortcutsModal(true)}
              className="flex items-center gap-1.5 h-9 px-3 rounded bg-[#161B26] border border-[#232A3B] hover:border-[#323B52] text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              title="Keyboard Shortcuts"
            >
              <KeyboardIcon size={14} />
              <span>Keys</span>
            </button>

            <button
              onClick={clearCurrentVideo}
              className="flex items-center gap-1.5 h-9 px-3.5 rounded bg-[#1D2332] hover:bg-[#232A3B] text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <CloseIcon size={14} />
              <span>Eject</span>
            </button>
          </div>
        </div>

        {/* Quick Switcher: Recent Videos */}
        {recentVideos.length > 1 && (
          <div className="mt-8 pt-6 border-t border-[#232A3B]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Switch to Recent Video
              </h3>
              <button
                onClick={clearRecentVideos}
                className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
              >
                Clear History
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {recentVideos.slice(0, 6).map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.type === 'youtube') loadYouTubeVideo(item.url);
                    else loadDirectUrl(item.url, item.title);
                  }}
                  className="p-3 rounded bg-[#0E121A] border border-[#232A3B] hover:border-[#E50914] text-left transition-colors flex items-center justify-between gap-3 group"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-white group-hover:text-slate-200 truncate">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase">
                      {item.type}
                    </span>
                  </div>
                  <PlayIcon size={14} className="text-slate-500 group-hover:text-[#E50914] flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // Empty / Launcher State (No Video Loaded Yet)
  // ----------------------------------------------------
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-4xl mx-auto overflow-x-hidden select-none">
      {/* Hidden File Picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*,.mkv,.mp4,.webm,.mov,.avi"
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Main Header */}
      <div className="text-center mb-8 flex flex-col items-center">
        <div className="w-14 h-14 rounded-xl bg-[#161B26] border border-[#232A3B] flex items-center justify-center text-[#E50914] mb-3 shadow-solid">
          <span className="font-extrabold text-xl tracking-tighter">VM</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          VM Player
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md">
          Precision video player with 5s seeking, on-screen volume HUD, hold for 2X speed, and local hardware decoding.
        </p>
      </div>

      {/* Dual Intake Card: Paste YouTube Link OR Drag & Drop Local File */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Method 1: YouTube or Video Link */}
        <div className="p-6 rounded-xl bg-[#0E121A] border border-[#232A3B] flex flex-col justify-between shadow-solid">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E50914]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Play YouTube or Web Video
              </h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Paste any YouTube video link, shorts, or direct MP4/WebM URL to play it on VM Player with all custom controls.
            </p>

            <form onSubmit={handlePasteSubmit} className="mt-2 flex flex-col gap-3">
              <input
                type="text"
                value={pasteUrl}
                onChange={(e) => setPasteUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full h-10 px-3 rounded bg-[#161B26] border border-[#232A3B] focus:border-[#E50914] focus:outline-none text-xs text-white placeholder-slate-500 font-mono transition-colors"
              />
              <button
                type="submit"
                disabled={isLoadingUrl}
                className="w-full h-10 rounded bg-[#E50914] hover:bg-[#F41E2A] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-solid disabled:opacity-50"
              >
                <PlayIcon size={14} />
                <span>{isLoadingUrl ? 'Loading Stream...' : 'Play in VM Player'}</span>
              </button>
            </form>
          </div>

          <div className="mt-4 pt-3 border-t border-[#232A3B] text-[11px] text-slate-500 flex items-center justify-between">
            <span>Supports youtu.be, shorts & web streams</span>
            <button
              onClick={() => {
                setPasteUrl('https://www.youtube.com/watch?v=aqz-KE-bpKQ');
              }}
              className="text-[#E50914] hover:underline"
            >
              Fill Example
            </button>
          </div>
        </div>

        {/* Method 2: Drag & Drop Local Video File */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="p-6 rounded-xl bg-[#0E121A] border-2 border-dashed border-[#232A3B] hover:border-[#E50914] cursor-pointer flex flex-col justify-between text-center transition-colors shadow-solid group"
        >
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="w-12 h-12 rounded-full bg-[#161B26] border border-[#232A3B] group-hover:border-[#E50914] flex items-center justify-center text-[#E50914] transition-colors shadow-solid">
              <UploadIcon size={22} />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-sm font-bold text-white group-hover:text-slate-100 transition-colors">
                Play Local Video File
              </h2>
              <p className="text-xs text-slate-400">
                Drag and drop any video from File Explorer, or click to browse
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#232A3B] flex items-center justify-between text-[11px] text-slate-500">
            <span>Client-side decoding</span>
            <span className="font-mono text-[#10B981]">MP4, MKV, WebM, MOV</span>
          </div>
        </div>
      </div>

      {/* Recent Videos History */}
      {recentVideos.length > 0 && (
        <div className="w-full mt-10 pt-6 border-t border-[#232A3B]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Previously Played ({recentVideos.length})
            </h3>
            <button
              onClick={clearRecentVideos}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#E50914] transition-colors"
            >
              <TrashIcon size={12} />
              <span>Clear History</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {recentVideos.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.type === 'youtube') loadYouTubeVideo(item.url);
                  else loadDirectUrl(item.url, item.title);
                }}
                className="p-3 rounded-lg bg-[#0E121A] border border-[#232A3B] hover:border-[#323B52] cursor-pointer flex items-center justify-between gap-3 group transition-colors"
              >
                <div className="flex flex-col min-w-0">
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-[#E50914] transition-colors">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase">
                    {item.type}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRecentItem(item.id);
                    }}
                    className="p-1 rounded text-slate-500 hover:text-white"
                    title="Remove from history"
                  >
                    <CloseIcon size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
