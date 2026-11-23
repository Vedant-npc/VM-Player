import React from 'react';
import { SpeedGaugeIcon } from '../common/Icons';

interface SpeedHUDProps {
  isBoosting: boolean;
  rate: number;
}

export const SpeedHUD: React.FC<SpeedHUDProps> = ({ isBoosting, rate }) => {
  if (!isBoosting) return null;

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0E121A]/95 border border-[#E50914] text-white shadow-solid animate-pop">
      <SpeedGaugeIcon size={18} className="text-[#E50914] animate-pulse" />
      <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-white">
        {rate}X Speed Active
      </span>
      <span className="text-[10px] uppercase font-mono text-[#E50914] bg-[#E50914]/15 px-1.5 py-0.5 rounded">
        Holding
      </span>
    </div>
  );
};
