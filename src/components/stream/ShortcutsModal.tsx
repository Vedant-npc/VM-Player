import React from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { CloseIcon, KeyboardIcon } from '../common/Icons';

export const ShortcutsModal: React.FC = () => {
  const { isShortcutsOpen, toggleShortcutsModal } = usePlayer();

  if (!isShortcutsOpen) return null;

  const shortcuts = [
    { key: 'Space or K', action: 'Toggle Play / Pause', desc: 'Instant state toggle with central indicator' },
    { key: 'J or Left Arrow', action: 'Seek Backward 10s', desc: 'Decrements timeline position by 10 seconds' },
    { key: 'L or Right Arrow', action: 'Seek Forward 10s', desc: 'Increments timeline position by 10 seconds' },
    { key: 'Long Press Screen', action: 'Hold for 2X Speed', desc: 'Accelerates playback to 2.0x while held' },
    { key: 'Up / Down Arrow', action: 'Volume Control (±5%)', desc: 'Triggers on-screen animated volume HUD' },
    { key: 'M', action: 'Toggle Mute', desc: 'Mutes or restores previous volume' },
    { key: 'F', action: 'Toggle Fullscreen', desc: 'Expands player to full display viewport' },
    { key: 'T', action: 'Theater Mode', desc: 'Expands player width above descriptions' },
    { key: 'C', action: 'Closed Captions / CC', desc: 'Toggles active subtitle stream' },
    { key: 'I', action: 'Picture-in-Picture', desc: 'Detaches player into floating mini-window' },
    { key: '?', action: 'Toggle Shortcuts', desc: 'Opens this keyboard shortcuts reference' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      onClick={() => toggleShortcutsModal(false)}
    >
      <div
        className="w-full max-w-lg rounded-lg bg-[#0E121A] border border-[#232A3B] text-white p-6 shadow-elevated relative max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#232A3B] mb-4">
          <div className="flex items-center gap-2.5">
            <KeyboardIcon size={20} className="text-[#E50914]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Playback Keyboard Shortcuts
            </h3>
          </div>
          <button
            onClick={() => toggleShortcutsModal(false)}
            className="p-1 rounded text-slate-400 hover:text-white"
            aria-label="Close shortcuts modal"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        <div className="flex flex-col divide-y divide-[#1D2332]">
          {shortcuts.map((sc) => (
            <div key={sc.key} className="py-2.5 flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-100">{sc.action}</span>
                <span className="text-[11px] text-slate-400">{sc.desc}</span>
              </div>
              <kbd className="px-2.5 py-1 rounded bg-[#161B26] border border-[#232A3B] text-xs font-mono font-bold text-slate-200 whitespace-nowrap shadow-solid">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-[#232A3B] flex justify-between items-center text-xs text-slate-400">
          <span>Shortcuts are active whenever player is focused.</span>
          <button
            onClick={() => toggleShortcutsModal(false)}
            className="px-4 py-1.5 rounded bg-[#1D2332] hover:bg-[#232A3B] font-semibold text-white transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
