import React from 'react';
import { VolumeHighIcon, VolumeMidIcon, VolumeLowIcon, VolumeMuteIcon } from '../common/Icons';

interface VolumeHUDProps {
  volume: number; // 0 to 1
  isMuted: boolean;
  visible: boolean;
}

export const VolumeHUD: React.FC<VolumeHUDProps> = ({ volume, isMuted, visible }) => {
  if (!visible) return null;

  const percent = isMuted ? 0 : Math.round(volume * 100);

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeMuteIcon size={24} className="text-[#E50914]" />;
    if (volume < 0.33) return <VolumeLowIcon size={24} className="text-white" />;
    if (volume < 0.67) return <VolumeMidIcon size={24} className="text-white" />;
    return <VolumeHighIcon size={24} className="text-white" />;
  };

  return (
    <div className="absolute top-6 right-6 z-30 pointer-events-none flex items-center gap-3 px-4 py-2.5 rounded bg-[#0E121A]/95 border border-[#232A3B] text-white shadow-solid animate-pop">
      {getVolumeIcon()}
      <div className="flex flex-col gap-1 w-28">
        <div className="flex justify-between items-center text-xs font-semibold">
          <span className="text-slate-300">Volume</span>
          <span className="text-white font-mono">{percent}%</span>
        </div>
        <div className="w-full h-1.5 bg-[#1D2332] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#E50914] transition-all duration-75"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
