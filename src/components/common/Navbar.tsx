import React from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { useToast } from '../../context/ToastContext';
import { KeyboardIcon, CloseIcon, InstallIcon } from './Icons';
import type { BeforeInstallPromptEvent } from '../../types/media';

interface NavbarProps {
  installPrompt?: BeforeInstallPromptEvent | null;
  onInstallAccepted?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ installPrompt, onInstallAccepted }) => {
  const {
    currentVideo,
    clearCurrentVideo,
    toggleShortcutsModal,
  } = usePlayer();
  const { showSuccess, showInfo } = useToast();

  const handleInstallClick = async () => {
    if (installPrompt) {
      try {
        await installPrompt.prompt();
        const choice = await installPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          showSuccess('VM Player installed! Launch it anytime from your desktop or app launcher.');
          onInstallAccepted?.();
        }
      } catch (err) {
        console.warn('Install prompt error:', err);
      }
    } else {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone;

      if (isStandalone) {
        showInfo('VM Player is already installed as a standalone app on your device.');
      } else {
        showInfo('To install: click the Install icon in your browser address bar (Chrome/Edge) or use browser menu.');
      }
    }
  };

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

      {/* Right Action Cluster: Eject / Install App / Shortcuts */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {currentVideo && (
          <button
            onClick={clearCurrentVideo}
            className="flex items-center gap-1.5 h-9 px-3 rounded bg-[#161B26] border border-[#232A3B] hover:border-[#E50914] text-slate-300 hover:text-white text-xs font-semibold transition-colors focus:outline-none"
            title="Eject / Load Another Video"
          >
            <CloseIcon size={14} />
            <span className="hidden sm:inline">Load Another</span>
          </button>
        )}

        {/* PWA Install Button */}
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 h-9 px-3 rounded bg-[#161B26] border border-[#232A3B] hover:border-slate-500 text-slate-300 hover:text-white text-xs font-semibold transition-colors focus:outline-none"
          title="Install VM Player on your device"
          aria-label="Install VM Player App"
        >
          <InstallIcon size={14} />
          <span className="hidden sm:inline">Install App</span>
        </button>

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

