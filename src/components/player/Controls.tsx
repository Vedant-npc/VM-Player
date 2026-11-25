import React from 'react';
import {
  PlayIcon,
  PauseIcon,
  SeekBackward5Icon,
  SeekForward5Icon,
  VolumeHighIcon,
  VolumeMidIcon,
  VolumeLowIcon,
  VolumeMuteIcon,
  SubtitlesIcon,
  SettingsIcon,
  PipIcon,
  TheaterModeIcon,
  FullscreenIcon,
  ExitFullscreenIcon,
} from '../common/Icons';
import { Timeline } from './Timeline';
import type { VideoQuality } from '../../types/media';

interface ControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  bufferedEnd: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  currentQuality: VideoQuality;
  subtitlesEnabled: boolean;
  isTheaterMode: boolean;
  isFullscreen: boolean;
  isSettingsOpen: boolean;
  onTogglePlay: () => void;
  onSeek: (seconds: number) => void;
  onSeekBackward5: () => void;
  onSeekForward5: () => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onToggleSubtitles: () => void;
  onToggleSettings: () => void;
  onTogglePip: () => void;
  onToggleTheater: () => void;
  onToggleFullscreen: () => void;
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

export const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  bufferedEnd,
  volume,
  isMuted,
  currentQuality,
  subtitlesEnabled,
  isTheaterMode,
  isFullscreen,
  isSettingsOpen,
  onTogglePlay,
  onSeek,
  onSeekBackward5,
  onSeekForward5,
  onVolumeChange,
  onToggleMute,
  onToggleSubtitles,
  onToggleSettings,
  onTogglePip,
  onToggleTheater,
  onToggleFullscreen,
}) => {
  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeMuteIcon size={20} />;
    if (volume < 0.33) return <VolumeLowIcon size={20} />;
    if (volume < 0.67) return <VolumeMidIcon size={20} />;
    return <VolumeHighIcon size={20} />;
  };

  const currentVolValue = isMuted ? 0 : volume;

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-30 pt-8 pb-3 px-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Scrubber Timeline */}
      <Timeline
        currentTime={currentTime}
        duration={duration}
        bufferedEnd={bufferedEnd}
        onSeek={onSeek}
      />

      {/* Control Actions Row */}
      <div className="flex items-center justify-between gap-2 mt-1 text-white select-none">
        {/* Left Action Cluster: Play/Pause, -5s, +5s, Volume, Time */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Play/Pause */}
          <button
            onClick={onTogglePlay}
            className="p-2 rounded hover:bg-[#1D2332] text-white transition-colors focus:outline-none"
            aria-label={isPlaying ? 'Pause video (Space or K)' : 'Play video (Space or K)'}
            title={isPlaying ? 'Pause (k)' : 'Play (k)'}
          >
            {isPlaying ? <PauseIcon size={22} /> : <PlayIcon size={22} />}
          </button>

          {/* Seek Backward 5 Seconds */}
          <button
            onClick={onSeekBackward5}
            className="p-2 rounded hover:bg-[#1D2332] text-white transition-colors focus:outline-none flex items-center justify-center"
            aria-label="Seek backward 5 seconds (J or Left Arrow)"
            title="Seek -5s (j)"
          >
            <SeekBackward5Icon size={20} />
          </button>

          {/* Seek Forward 5 Seconds */}
          <button
            onClick={onSeekForward5}
            className="p-2 rounded hover:bg-[#1D2332] text-white transition-colors focus:outline-none flex items-center justify-center"
            aria-label="Seek forward 5 seconds (L or Right Arrow)"
            title="Seek +5s (l)"
          >
            <SeekForward5Icon size={20} />
          </button>

          {/* Volume Low/High Animation Group */}
          <div className="flex items-center group/vol">
            <button
              onClick={onToggleMute}
              className="p-2 rounded hover:bg-[#1D2332] text-white transition-colors focus:outline-none"
              aria-label={isMuted ? 'Unmute (M)' : 'Mute (M)'}
              title={isMuted ? 'Unmute (m)' : 'Mute (m)'}
            >
              {getVolumeIcon()}
            </button>
            <div className="w-0 group-hover/vol:w-20 transition-all duration-200 overflow-hidden flex items-center pl-1 pr-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={currentVolValue}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="player-slider w-20 h-1 rounded-full bg-[#323B52]"
                aria-label="Volume slider"
              />
            </div>
          </div>

          {/* Time Display */}
          <div className="text-xs font-mono text-slate-300 ml-1">
            <span className="text-white font-medium">{formatTime(currentTime)}</span>
            <span className="text-slate-500 mx-1">/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right Action Cluster: Quality Badge, Subtitles, Settings, Pip, Theater, Fullscreen */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Quality Indicator Badge */}
          <div
            className="hidden sm:flex items-center px-2 py-0.5 rounded bg-[#161B26] border border-[#232A3B] text-[11px] font-mono font-semibold text-slate-300 uppercase"
            title="Stream Resolution"
          >
            {currentQuality}
          </div>

          {/* Closed Captions */}
          <button
            onClick={onToggleSubtitles}
            className={`p-2 rounded transition-colors focus:outline-none ${
              subtitlesEnabled
                ? 'text-[#E50914] bg-[#1D2332]'
                : 'text-slate-300 hover:text-white hover:bg-[#1D2332]'
            }`}
            aria-label="Toggle Subtitles (C)"
            title="Subtitles / CC (c)"
          >
            <SubtitlesIcon size={20} />
          </button>

          {/* Settings */}
          <button
            onClick={onToggleSettings}
            className={`p-2 rounded transition-colors focus:outline-none ${
              isSettingsOpen
                ? 'text-white bg-[#1D2332] rotate-45'
                : 'text-slate-300 hover:text-white hover:bg-[#1D2332]'
            }`}
            aria-label="Settings"
            title="Settings"
          >
            <SettingsIcon size={20} />
          </button>

          {/* Picture in Picture */}
          <button
            onClick={onTogglePip}
            className="hidden sm:inline-flex p-2 rounded text-slate-300 hover:text-white hover:bg-[#1D2332] transition-colors focus:outline-none"
            aria-label="Picture in Picture (I)"
            title="Picture in Picture (i)"
          >
            <PipIcon size={20} />
          </button>

          {/* Theater Mode */}
          <button
            onClick={onToggleTheater}
            className={`hidden md:inline-flex p-2 rounded transition-colors focus:outline-none ${
              isTheaterMode
                ? 'text-[#E50914] bg-[#1D2332]'
                : 'text-slate-300 hover:text-white hover:bg-[#1D2332]'
            }`}
            aria-label="Theater Mode (T)"
            title="Theater mode (t)"
          >
            <TheaterModeIcon size={20} />
          </button>

          {/* Fullscreen */}
          <button
            onClick={onToggleFullscreen}
            className="p-2 rounded text-slate-300 hover:text-white hover:bg-[#1D2332] transition-colors focus:outline-none"
            aria-label={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
            title={isFullscreen ? 'Exit Fullscreen (f)' : 'Fullscreen (f)'}
          >
            {isFullscreen ? <ExitFullscreenIcon size={20} /> : <FullscreenIcon size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};
