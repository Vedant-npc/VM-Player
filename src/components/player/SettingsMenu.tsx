import React, { useState } from 'react';
import type { VideoQuality } from '../../types/media';
import { CheckIcon, CloseIcon } from '../common/Icons';

interface SettingsMenuProps {
  currentQuality: VideoQuality;
  availableQualities: VideoQuality[];
  playbackRate: number;
  subtitlesEnabled: boolean;
  statsEnabled: boolean;
  onSelectQuality: (q: VideoQuality) => void;
  onSelectPlaybackRate: (rate: number) => void;
  onToggleSubtitles: () => void;
  onToggleStats: () => void;
  onOpenShortcuts: () => void;
  onClose: () => void;
}

type MenuPage = 'main' | 'quality' | 'speed';

const PLAYBACK_RATES = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

export const SettingsMenu: React.FC<SettingsMenuProps> = ({
  currentQuality,
  availableQualities,
  playbackRate,
  subtitlesEnabled,
  statsEnabled,
  onSelectQuality,
  onSelectPlaybackRate,
  onToggleSubtitles,
  onToggleStats,
  onOpenShortcuts,
  onClose,
}) => {
  const [activePage, setActivePage] = useState<MenuPage>('main');

  return (
    <div
      className="absolute bottom-16 right-4 z-40 w-64 rounded-md bg-[#0E121A] border border-[#232A3B] text-white shadow-elevated p-2 text-xs select-none"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-1 border-b border-[#1D2332] px-2 pt-1 font-bold">
        {activePage === 'main' && <span>Playback Settings</span>}
        {activePage === 'quality' && (
          <button
            onClick={() => setActivePage('main')}
            className="text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
          >
            ← Quality
          </button>
        )}
        {activePage === 'speed' && (
          <button
            onClick={() => setActivePage('main')}
            className="text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
          >
            ← Speed
          </button>
        )}
        <button
          onClick={onClose}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#1D2332]"
        >
          <CloseIcon size={12} />
        </button>
      </div>

      {/* Main Page */}
      {activePage === 'main' && (
        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => setActivePage('quality')}
            className="flex items-center justify-between px-3 py-2 rounded hover:bg-[#1D2332] text-left transition-colors"
          >
            <span className="text-slate-300">Quality</span>
            <span className="text-white font-semibold uppercase">{currentQuality}</span>
          </button>

          <button
            onClick={() => setActivePage('speed')}
            className="flex items-center justify-between px-3 py-2 rounded hover:bg-[#1D2332] text-left transition-colors"
          >
            <span className="text-slate-300">Playback Speed</span>
            <span className="text-white font-semibold">
              {playbackRate === 1.0 ? 'Normal' : `${playbackRate}x`}
            </span>
          </button>

          <button
            onClick={onToggleSubtitles}
            className="flex items-center justify-between px-3 py-2 rounded hover:bg-[#1D2332] text-left transition-colors"
          >
            <span className="text-slate-300">Captions / Subtitles</span>
            <span
              className={`font-semibold ${
                subtitlesEnabled ? 'text-[#10B981]' : 'text-slate-500'
              }`}
            >
              {subtitlesEnabled ? 'On' : 'Off'}
            </span>
          </button>

          <button
            onClick={onToggleStats}
            className="flex items-center justify-between px-3 py-2 rounded hover:bg-[#1D2332] text-left transition-colors"
          >
            <span className="text-slate-300">Stats for Nerds</span>
            <span
              className={`font-semibold ${
                statsEnabled ? 'text-[#10B981]' : 'text-slate-500'
              }`}
            >
              {statsEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </button>

          <div className="my-1 border-t border-[#1D2332]" />

          <button
            onClick={() => {
              onClose();
              onOpenShortcuts();
            }}
            className="flex items-center justify-between px-3 py-2 rounded hover:bg-[#1D2332] text-left text-slate-300 transition-colors"
          >
            <span>Keyboard Shortcuts</span>
            <span className="text-[11px] font-mono text-slate-400 bg-[#1D2332] px-1.5 py-0.5 rounded">
              ?
            </span>
          </button>
        </div>
      )}

      {/* Quality Submenu */}
      {activePage === 'quality' && (
        <div className="flex flex-col gap-0.5">
          {availableQualities.map((q) => {
            const isSelected = currentQuality === q;
            return (
              <button
                key={q}
                onClick={() => {
                  onSelectQuality(q);
                  setActivePage('main');
                }}
                className={`flex items-center justify-between px-3 py-2 rounded transition-colors ${
                  isSelected ? 'bg-[#1D2332] text-white font-bold' : 'hover:bg-[#161B26] text-slate-300'
                }`}
              >
                <span className="uppercase">{q === 'auto' ? 'Auto (Dynamic)' : q}</span>
                {isSelected && <CheckIcon size={14} className="text-[#E50914]" />}
              </button>
            );
          })}
        </div>
      )}

      {/* Speed Submenu */}
      {activePage === 'speed' && (
        <div className="flex flex-col gap-0.5 max-h-56 overflow-y-auto">
          {PLAYBACK_RATES.map((rate) => {
            const isSelected = playbackRate === rate;
            return (
              <button
                key={rate}
                onClick={() => {
                  onSelectPlaybackRate(rate);
                  setActivePage('main');
                }}
                className={`flex items-center justify-between px-3 py-1.5 rounded transition-colors ${
                  isSelected ? 'bg-[#1D2332] text-white font-bold' : 'hover:bg-[#161B26] text-slate-300'
                }`}
              >
                <span>{rate === 1.0 ? 'Normal (1.0x)' : `${rate}x`}</span>
                {isSelected && <CheckIcon size={14} className="text-[#E50914]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
