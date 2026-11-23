import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { useToast } from '../../context/ToastContext';
import { CloseIcon } from './Icons';

export const Footer: React.FC = () => {
  const { clearCurrentVideo, toggleShortcutsModal } = usePlayer();
  const { showSuccess } = useToast();

  const [activeModal, setActiveModal] = useState<'terms' | 'privacy' | 'api' | 'about' | null>(null);

  const copyEmail = () => {
    navigator.clipboard.writeText('support@vmplayer.io');
    showSuccess('Email address copied: support@vmplayer.io');
  };

  return (
    <footer className="w-full bg-[#0E121A] border-t border-[#232A3B] py-8 px-6 sm:px-10 mt-auto select-none">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        {/* Brand & Purpose */}
        <div className="flex flex-col gap-2 max-w-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#161B26] border border-[#232A3B] flex items-center justify-center text-xs font-bold text-[#E50914]">
              VM
            </div>
            <span className="font-extrabold text-sm text-white tracking-tight">
              VM <span className="text-[#E50914]">PLAYER</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            High performance standalone video player. Paste any YouTube video link or drag and drop
            local media for instant hardware-accelerated playback.
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="text-[11px] font-mono text-slate-300">
              Player Engine Status: Operational
            </span>
          </div>
        </div>

        {/* Working Footer Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
          {/* Quick Actions */}
          <div className="flex flex-col gap-2">
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">
              Player Actions
            </span>
            <button
              onClick={clearCurrentVideo}
              className="text-left text-slate-400 hover:text-white transition-colors"
            >
              Open Video Launcher
            </button>
            <button
              onClick={() => toggleShortcutsModal(true)}
              className="text-left text-slate-400 hover:text-white transition-colors"
            >
              Shortcuts Sheet (?)
            </button>
          </div>

          {/* Specifications & Dev */}
          <div className="flex flex-col gap-2">
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">
              Information
            </span>
            <button
              onClick={() => setActiveModal('about')}
              className="text-left text-slate-400 hover:text-white transition-colors"
            >
              About VM Player
            </button>
            <button
              onClick={() => setActiveModal('api')}
              className="text-left text-slate-400 hover:text-white transition-colors"
            >
              Engine Architecture
            </button>
            <button
              onClick={() => setActiveModal('terms')}
              className="text-left text-slate-400 hover:text-white transition-colors"
            >
              Terms of Use
            </button>
            <button
              onClick={() => setActiveModal('privacy')}
              className="text-left text-slate-400 hover:text-white transition-colors"
            >
              Privacy & Zero Telemetry
            </button>
          </div>

          {/* Contact & Support */}
          <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">
              Direct Contact
            </span>
            <a
              href="mailto:support@vmplayer.io?subject=VM%20Player%20Direct%20Inquiry"
              className="text-left text-[#E50914] font-medium hover:underline flex items-center gap-1"
            >
              support@vmplayer.io
            </a>
            <button
              onClick={copyEmail}
              className="text-left text-[11px] text-slate-400 hover:text-white transition-colors"
            >
              Copy Support Email
            </button>
            <span className="text-[11px] text-slate-500 font-mono mt-1">
              Ref: VM-ENGINE-2026-STABLE
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright Year 2026 */}
      <div className="max-w-6xl mx-auto border-t border-[#232A3B] mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-mono">
        <div>© 2026 VM Player. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <span>Engine v2.5</span>
          <span>•</span>
          <span>YouTube API + HTML5 MSE</span>
          <span>•</span>
          <span>Zero Telemetry Leaks</span>
        </div>
      </div>

      {/* Modal Dialog for Working Footer Links */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 select-text"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-lg rounded-lg bg-[#0E121A] border border-[#232A3B] text-white p-6 shadow-elevated relative max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#232A3B] mb-4">
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                {activeModal === 'about' && 'About VM Player'}
                {activeModal === 'api' && 'Engine & Decoder Architecture'}
                {activeModal === 'terms' && 'Terms of Use'}
                {activeModal === 'privacy' && 'Privacy Policy'}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <CloseIcon size={16} />
              </button>
            </div>

            {activeModal === 'about' && (
              <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
                <p>
                  VM Player is a dedicated, distraction-free video player designed for precision control
                  over web streams (including YouTube) and local disk files.
                </p>
                <p>
                  Features include sub-second 10-second seeking with animated chevrons, press-and-hold
                  2X speed boost, dynamic 4-state volume HUD, and hardware-accelerated local decoding.
                </p>
                <div className="p-3 bg-[#161B26] border border-[#232A3B] rounded">
                  <span className="text-white font-semibold block mb-1">Supported Formats</span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-400 font-mono text-[11px]">
                    <li>YouTube links: watch URLs, youtu.be, shorts, embeds</li>
                    <li>Local disk files: .mp4, .webm, .mkv, .mov, .avi</li>
                    <li>Direct web streams: HTTP/HTTPS video feeds</li>
                  </ul>
                </div>
              </div>
            )}

            {activeModal === 'api' && (
              <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
                <p>
                  VM Player bridges both the Google YouTube IFrame API and the browser HTML5 MediaSource
                  Engine through a single unified control surface.
                </p>
                <div className="p-3 bg-[#161B26] border border-[#232A3B] rounded font-mono text-[11px] text-slate-300">
                  <p className="text-[#10B981] font-bold">// Engine Capabilities</p>
                  <p>Seek Step: ±10.0 seconds with ripple HUD</p>
                  <p>Speed Ramping: 0.25x to 2.0x (Instant Hold for 2X)</p>
                  <p>Local Decoders: H.264, VP9, AV1, HEVC, AAC</p>
                  <p>Zero Upload: Local files decoded purely via Blob URL</p>
                </div>
              </div>
            )}

            {activeModal === 'terms' && (
              <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
                <p>
                  VM Player is provided for personal media playback and research. Users are responsible
                  for ensuring they possess rights to any streamed or local media loaded into the player.
                </p>
              </div>
            )}

            {activeModal === 'privacy' && (
              <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
                <p>
                  VM Player operates under a strict Zero-Telemetry policy. No local video files,
                  stream URLs, or watch durations are tracked or transmitted to external servers.
                </p>
                <p>
                  Recent video links are stored exclusively on your device in sandboxed LocalStorage.
                </p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-[#232A3B] flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 rounded bg-[#1D2332] hover:bg-[#232A3B] text-xs font-semibold text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
