import React, { useRef, useState, useCallback } from 'react';

interface TimelineProps {
  currentTime: number;
  duration: number;
  bufferedEnd: number;
  onSeek: (targetTime: number) => void;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export const Timeline: React.FC<TimelineProps> = ({
  currentTime,
  duration,
  bufferedEnd,
  onSeek,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const calculateTargetTime = useCallback(
    (clientX: number): number => {
      if (!containerRef.current || duration <= 0) return 0;
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = clickX / rect.width;
      return percentage * duration;
    },
    [duration]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || duration <= 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setHoverPosition(pos);
    setHoverTime((pos / rect.width) * duration);
  };

  const handleMouseLeave = () => {
    if (!isDragging) {
      setHoverTime(null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const target = calculateTargetTime(e.clientX);
    onSeek(target);

    const onPointerMove = (moveEvent: PointerEvent) => {
      const nextTarget = calculateTargetTime(moveEvent.clientX);
      onSeek(nextTarget);
    };

    const onPointerUp = () => {
      setIsDragging(false);
      setHoverTime(null);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const playPercent = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;
  const bufferPercent = duration > 0 ? Math.min(100, Math.max(0, (bufferedEnd / duration) * 100)) : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      className="relative w-full h-4 group flex items-center cursor-pointer select-none py-1"
      role="slider"
      aria-label="Video scrubber"
      aria-valuemin={0}
      aria-valuemax={duration}
      aria-valuenow={currentTime}
    >
      {/* Hover preview tooltip */}
      {hoverTime !== null && (
        <div
          className="absolute -top-7 -translate-x-1/2 z-30 pointer-events-none px-2 py-0.5 rounded bg-[#090C10] border border-[#323B52] text-[11px] font-mono text-white shadow-solid"
          style={{ left: `${hoverPosition}px` }}
        >
          {formatTime(hoverTime)}
        </div>
      )}

      {/* Track Base */}
      <div className="relative w-full h-1 group-hover:h-2 transition-all duration-150 rounded-full bg-[#232A3B] overflow-hidden">
        {/* Buffered Progress */}
        <div
          className="absolute top-0 left-0 h-full bg-[#475569] transition-all duration-200"
          style={{ width: `${bufferPercent}%` }}
        />
        {/* Playback Progress */}
        <div
          className="absolute top-0 left-0 h-full bg-[#E50914] transition-all duration-75"
          style={{ width: `${playPercent}%` }}
        />
      </div>

      {/* Scrubber Thumb Knob */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white border border-[#090C10] shadow-solid opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-150 pointer-events-none"
        style={{ left: `${playPercent}%` }}
      />
    </div>
  );
};
