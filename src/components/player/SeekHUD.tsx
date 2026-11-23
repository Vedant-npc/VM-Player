import React from 'react';
import { SeekBackward10Icon, SeekForward10Icon } from '../common/Icons';

interface SeekHUDProps {
  direction: 'backward' | 'forward' | null;
}

export const SeekHUD: React.FC<SeekHUDProps> = ({ direction }) => {
  if (!direction) return null;

  const isBackward = direction === 'backward';

  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 z-20 pointer-events-none flex items-center justify-center ${
        isBackward ? 'left-12' : 'right-12'
      }`}
    >
      <div className="flex flex-col items-center justify-center w-24 h-24 rounded-full bg-[#0E121A]/85 border border-[#323B52] text-white shadow-solid animate-ripple">
        {isBackward ? (
          <>
            <SeekBackward10Icon size={34} className="text-[#E50914]" />
            <span className="text-xs font-bold font-mono tracking-wider text-slate-100 mt-1">-10s</span>
          </>
        ) : (
          <>
            <SeekForward10Icon size={34} className="text-[#E50914]" />
            <span className="text-xs font-bold font-mono tracking-wider text-slate-100 mt-1">+10s</span>
          </>
        )}
      </div>
    </div>
  );
};
