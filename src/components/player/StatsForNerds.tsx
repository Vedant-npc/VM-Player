import React from 'react';
import type { PlayerStats } from '../../types/media';
import { CloseIcon } from '../common/Icons';

interface StatsForNerdsProps {
  stats: PlayerStats;
  onClose: () => void;
}

export const StatsForNerds: React.FC<StatsForNerdsProps> = ({ stats, onClose }) => {
  return (
    <div className="absolute top-4 left-4 z-40 max-w-sm w-full p-4 rounded bg-[#090C10]/95 border border-[#323B52] text-xs font-mono text-slate-200 shadow-elevated select-none">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#232A3B]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
          <span className="font-bold text-white tracking-wider">STATS FOR NERDS</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#1D2332] transition-colors"
          aria-label="Close telemetry overlay"
        >
          <CloseIcon size={14} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 text-[11px]">
        <span className="text-slate-400">Source Type:</span>
        <span className="text-white font-semibold truncate">{stats.sourceType}</span>

        <span className="text-slate-400">Resolution:</span>
        <span className="text-white font-semibold">{stats.resolution}</span>

        <span className="text-slate-400">Viewport:</span>
        <span className="text-white">{stats.viewport}</span>

        <span className="text-slate-400">Bitrate / Size:</span>
        <span className="text-white">{stats.currentBitrate}</span>

        <span className="text-slate-400">Buffer Health:</span>
        <span className="text-[#10B981] font-semibold">{stats.bufferHealth}</span>

        <span className="text-slate-400">Dropped Frames:</span>
        <span className={stats.droppedFrames > 0 ? 'text-[#F59E0B]' : 'text-slate-300'}>
          {stats.droppedFrames} / 0 total
        </span>

        <span className="text-slate-400">Playback Rate:</span>
        <span className="text-white">{stats.playbackRate}x</span>

        <span className="text-slate-400">Volume Level:</span>
        <span className="text-white">{stats.volumePercent}%</span>

        <span className="text-slate-400">Decoder Pipeline:</span>
        <span className="text-white truncate">{stats.engine || stats.codec || 'Native Hardware'}</span>
      </div>
    </div>
  );
};
