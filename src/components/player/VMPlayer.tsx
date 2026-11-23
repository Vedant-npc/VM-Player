import React, { useRef, useState, useEffect, useCallback } from 'react';
import type { VideoItem, VideoQuality, PlayerStats } from '../../types/media';
import { Controls } from './Controls';
import { VolumeHUD } from './VolumeHUD';
import { SpeedHUD } from './SpeedHUD';
import { SeekHUD } from './SeekHUD';
import { SettingsMenu } from './SettingsMenu';
import { StatsForNerds } from './StatsForNerds';
import { PlayIcon, PauseIcon } from '../common/Icons';
import { useToast } from '../../context/ToastContext';

interface VMPlayerProps {
  video: VideoItem;
  currentQuality: VideoQuality;
  isTheaterMode: boolean;
  onToggleTheater: () => void;
  onOpenShortcuts: () => void;
  onTimeUpdateProgress?: (seconds: number) => void;
}

export const VMPlayer: React.FC<VMPlayerProps> = ({
  video,
  currentQuality,
  isTheaterMode,
  onToggleTheater,
  onOpenShortcuts,
  onTimeUpdateProgress,
}) => {
  const { showError, showSuccess } = useToast();

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Playback States
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(video.duration || 0);
  const [bufferedEnd, setBufferedEnd] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [basePlaybackRate, setBasePlaybackRate] = useState<number>(1.0);
  const [isBoostingSpeed, setIsBoostingSpeed] = useState<boolean>(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);

  // HUD & Gesture States
  const [volumeHUDVisible, setVolumeHUDVisible] = useState<boolean>(false);
  const [seekHUDDirection, setSeekHUDDirection] = useState<'backward' | 'forward' | null>(null);
  const [centerPlayIcon, setCenterPlayIcon] = useState<'play' | 'pause' | null>(null);
  const [areControlsVisible, setAreControlsVisible] = useState<boolean>(true);

  // Stats for Nerds Telemetry
  const [stats, setStats] = useState<PlayerStats>({
    resolution: '1920x1080@60fps',
    viewport: '1280x720',
    bufferedEnd: 0,
    bufferHealth: '0.0s',
    droppedFrames: 0,
    currentBitrate: '8.4 Mbps',
    playbackRate: 1.0,
    volumePercent: 100,
    codec: 'av01.0.08M.08 / aac',
  });

  // Timers Refs
  const controlsTimeoutRef = useRef<number | null>(null);
  const volumeHUDTimeoutRef = useRef<number | null>(null);
  const seekHUDTimeoutRef = useRef<number | null>(null);
  const centerIconTimeoutRef = useRef<number | null>(null);
  const holdSpeedTimeoutRef = useRef<number | null>(null);
  const clickCountRef = useRef<number>(0);
  const singleClickTimerRef = useRef<number | null>(null);

  // Active Source Resolver
  const activeSource = useCallback(() => {
    if (!video.sources || video.sources.length === 0) {
      return {
        quality: '1080p' as VideoQuality,
        label: '1080p',
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        fps: 60,
        bitrate: '8.4 Mbps',
      };
    }
    const matched = video.sources.find((s) => s.quality === currentQuality);
    return matched || video.sources[0];
  }, [video.sources, currentQuality]);

  const sourceObj = activeSource();

  // Reset or Switch Source smoothly
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const previousTime = v.currentTime;
    const wasPlaying = !v.paused;

    v.src = sourceObj.src;
    v.load();

    if (previousTime > 0) {
      v.currentTime = previousTime;
    }

    if (wasPlaying) {
      v.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [sourceObj.src]);

  // Flash Center Play/Pause Indicator
  const triggerCenterIcon = (type: 'play' | 'pause') => {
    setCenterPlayIcon(type);
    if (centerIconTimeoutRef.current) clearTimeout(centerIconTimeoutRef.current);
    centerIconTimeoutRef.current = window.setTimeout(() => {
      setCenterPlayIcon(null);
    }, 450);
  };

  // Play / Pause Toggle
  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;

    if (v.paused) {
      v.play()
        .then(() => {
          setIsPlaying(true);
          triggerCenterIcon('play');
        })
        .catch((err) => {
          console.warn('Playback interrupted', err);
          showError('Playback could not be started');
        });
    } else {
      v.pause();
      setIsPlaying(false);
      triggerCenterIcon('pause');
    }
  }, [showError]);

  // Seek Actions
  const handleSeek = useCallback(
    (targetSeconds: number) => {
      const v = videoRef.current;
      if (!v) return;
      const clamped = Math.max(0, Math.min(targetSeconds, v.duration || duration));
      v.currentTime = clamped;
      setCurrentTime(clamped);
      if (onTimeUpdateProgress) onTimeUpdateProgress(clamped);
    },
    [duration, onTimeUpdateProgress]
  );

  const seekBackward10 = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const nextTime = Math.max(0, v.currentTime - 10);
    handleSeek(nextTime);

    setSeekHUDDirection('backward');
    if (seekHUDTimeoutRef.current) clearTimeout(seekHUDTimeoutRef.current);
    seekHUDTimeoutRef.current = window.setTimeout(() => setSeekHUDDirection(null), 600);
  }, [handleSeek]);

  const seekForward10 = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const nextTime = Math.min(v.duration || duration, v.currentTime + 10);
    handleSeek(nextTime);

    setSeekHUDDirection('forward');
    if (seekHUDTimeoutRef.current) clearTimeout(seekHUDTimeoutRef.current);
    seekHUDTimeoutRef.current = window.setTimeout(() => setSeekHUDDirection(null), 600);
  }, [duration, handleSeek]);

  // Volume Low/High Animation & Changes
  const handleVolumeChange = useCallback((newVol: number) => {
    const v = videoRef.current;
    if (!v) return;
    const clamped = Math.max(0, Math.min(1, newVol));
    v.volume = clamped;
    setVolume(clamped);

    if (clamped === 0) {
      v.muted = true;
      setIsMuted(true);
    } else if (v.muted) {
      v.muted = false;
      setIsMuted(false);
    }

    setVolumeHUDVisible(true);
    if (volumeHUDTimeoutRef.current) clearTimeout(volumeHUDTimeoutRef.current);
    volumeHUDTimeoutRef.current = window.setTimeout(() => setVolumeHUDVisible(false), 1200);
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const nextMuted = !v.muted;
    v.muted = nextMuted;
    setIsMuted(nextMuted);

    setVolumeHUDVisible(true);
    if (volumeHUDTimeoutRef.current) clearTimeout(volumeHUDTimeoutRef.current);
    volumeHUDTimeoutRef.current = window.setTimeout(() => setVolumeHUDVisible(false), 1200);
  }, []);

  // Speed Boost Hold Engine (Hold for 2X Speed)
  const startSpeedBoost = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    setIsBoostingSpeed(true);
    v.playbackRate = 2.0;
  }, []);

  const endSpeedBoost = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    setIsBoostingSpeed(false);
    v.playbackRate = basePlaybackRate;
  }, [basePlaybackRate]);

  // Pointer & Gesture Handlers for Video Viewport
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only primary left clicks
    if (e.button !== 0) return;

    // Start hold timer for 2X speed boost
    holdSpeedTimeoutRef.current = window.setTimeout(() => {
      startSpeedBoost();
    }, 280);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (holdSpeedTimeoutRef.current) {
      clearTimeout(holdSpeedTimeoutRef.current);
      holdSpeedTimeoutRef.current = null;
    }

    if (isBoostingSpeed) {
      endSpeedBoost();
      return;
    }

    // Handle single vs double click / tap for 10s seek
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const isLeftThird = clickX < rect.width * 0.35;
    const isRightThird = clickX > rect.width * 0.65;

    clickCountRef.current += 1;

    if (clickCountRef.current === 1) {
      singleClickTimerRef.current = window.setTimeout(() => {
        clickCountRef.current = 0;
        togglePlay();
      }, 240);
    } else if (clickCountRef.current >= 2) {
      if (singleClickTimerRef.current) clearTimeout(singleClickTimerRef.current);
      clickCountRef.current = 0;

      if (isLeftThird) {
        seekBackward10();
      } else if (isRightThird) {
        seekForward10();
      } else {
        togglePlay();
      }
    }
  };

  const handlePointerCancel = () => {
    if (holdSpeedTimeoutRef.current) clearTimeout(holdSpeedTimeoutRef.current);
    if (isBoostingSpeed) endSpeedBoost();
  };

  // Fullscreen Management
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) => {
          showError('Fullscreen not available in this mode');
          console.warn(err);
        });
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  }, [showError]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Picture in Picture
  const togglePip = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (v.requestPictureInPicture) {
        await v.requestPictureInPicture();
      }
    } catch (e) {
      console.warn('PiP error', e);
      showError('Picture-in-Picture not supported on this browser/stream');
    }
  }, [showError]);

  // Controls Visibility & Inactivity Auto-hide
  const handleMouseMoveControls = () => {
    setAreControlsVisible(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);

    if (isPlaying) {
      controlsTimeoutRef.current = window.setTimeout(() => {
        if (!isSettingsOpen) {
          setAreControlsVisible(false);
        }
      }, 2500);
    }
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if focus is in an input, textarea, or contentEditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      switch (e.key) {
        case ' ':
        case 'k':
        case 'K':
          e.preventDefault();
          togglePlay();
          break;
        case 'j':
        case 'J':
          e.preventDefault();
          seekBackward10();
          break;
        case 'l':
        case 'L':
          e.preventDefault();
          seekForward10();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seekBackward10();
          break;
        case 'ArrowRight':
          e.preventDefault();
          seekForward10();
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleVolumeChange(volume + 0.05);
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleVolumeChange(volume - 0.05);
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          toggleMute();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 't':
        case 'T':
          e.preventDefault();
          onToggleTheater();
          break;
        case 'c':
        case 'C':
          e.preventDefault();
          setSubtitlesEnabled((prev) => !prev);
          break;
        case 'i':
        case 'I':
          e.preventDefault();
          togglePip();
          break;
        case '?':
          e.preventDefault();
          onOpenShortcuts();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    togglePlay,
    seekBackward10,
    seekForward10,
    handleVolumeChange,
    volume,
    toggleMute,
    toggleFullscreen,
    onToggleTheater,
    togglePip,
    onOpenShortcuts,
  ]);

  // Video Element Native Event Handlers
  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    setCurrentTime(v.currentTime);
    if (onTimeUpdateProgress) onTimeUpdateProgress(v.currentTime);

    // Compute Buffered Range
    if (v.buffered.length > 0) {
      for (let i = 0; i < v.buffered.length; i++) {
        if (v.buffered.start(i) <= v.currentTime && v.buffered.end(i) >= v.currentTime) {
          const end = v.buffered.end(i);
          setBufferedEnd(end);
          break;
        }
      }
    }

    // Update Telemetry Stats
    if (isStatsOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const bufferSec = Math.max(0, bufferedEnd - v.currentTime);
      // Optional dropped frames check
      const dropped = (v as unknown as { getVideoPlaybackQuality?: () => { droppedVideoFrames?: number } }).getVideoPlaybackQuality?.()?.droppedVideoFrames || 0;

      setStats({
        resolution: `${sourceObj.label} (${sourceObj.quality})`,
        viewport: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
        bufferedEnd,
        bufferHealth: `${bufferSec.toFixed(1)}s`,
        droppedFrames: dropped,
        currentBitrate: sourceObj.bitrate,
        playbackRate: v.playbackRate,
        volumePercent: isMuted ? 0 : Math.round(v.volume * 100),
        codec: 'av01.0.08M.08 / aac-lc (Hardware Decoded)',
      });
    }
  };

  const handleLoadedMetadata = () => {
    const v = videoRef.current;
    if (!v) return;
    setDuration(v.duration || video.duration);
  };

  const handleWaiting = () => setIsBuffering(true);
  const handlePlaying = () => {
    setIsBuffering(false);
    setIsPlaying(true);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMoveControls}
      onMouseLeave={() => {
        if (isPlaying && !isSettingsOpen) setAreControlsVisible(false);
      }}
      className={`relative w-full overflow-hidden bg-black select-none ${
        isFullscreen
          ? 'fixed inset-0 z-50 h-screen w-screen'
          : isTheaterMode
          ? 'aspect-[21/9] max-h-[82vh] rounded-none'
          : 'aspect-video rounded-lg border border-[#232A3B]'
      }`}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={sourceObj.src}
        playsInline
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onWaiting={handleWaiting}
        onPlaying={handlePlaying}
        onEnded={() => setIsPlaying(false)}
        className="w-full h-full object-contain cursor-pointer"
        aria-label={video.title}
      >
        {/* Closed Captions Subtitle Track */}
        {video.subtitles && video.subtitles.length > 0 && subtitlesEnabled && (
          <track
            kind="subtitles"
            src={video.subtitles[0].src}
            srcLang={video.subtitles[0].srclang}
            label={video.subtitles[0].label}
            default
          />
        )}
      </video>

      {/* Invisible Gesture Surface for Double Tap Seek & Hold-to-Boost */}
      <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        className="absolute inset-0 z-10 cursor-pointer"
        aria-hidden="true"
      />

      {/* Buffering Loading Spinner */}
      {isBuffering && (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center bg-black/30">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-[#E50914] rounded-full animate-spin" />
        </div>
      )}

      {/* Center Transient Play/Pause Indicator Flash */}
      {centerPlayIcon && (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center animate-ripple">
          <div className="w-20 h-20 rounded-full bg-[#0E121A]/85 border border-[#323B52] flex items-center justify-center text-white shadow-solid">
            {centerPlayIcon === 'play' ? <PlayIcon size={32} /> : <PauseIcon size={32} />}
          </div>
        </div>
      )}

      {/* HUD Overlays */}
      <VolumeHUD volume={volume} isMuted={isMuted} visible={volumeHUDVisible} />
      <SpeedHUD isBoosting={isBoostingSpeed} rate={2.0} />
      <SeekHUD direction={seekHUDDirection} />

      {/* Technical Diagnostics Overlay (Stats for Nerds) */}
      {isStatsOpen && (
        <StatsForNerds stats={stats} onClose={() => setIsStatsOpen(false)} />
      )}

      {/* Settings Dropdown Dialog */}
      {isSettingsOpen && (
        <SettingsMenu
          currentQuality={currentQuality}
          availableQualities={video.sources.map((s) => s.quality)}
          playbackRate={basePlaybackRate}
          subtitlesEnabled={subtitlesEnabled}
          statsEnabled={isStatsOpen}
          onSelectQuality={(q) => {
            // Callback to switch quality
            showSuccess(`Resolution updated to ${q.toUpperCase()}`);
          }}
          onSelectPlaybackRate={(rate) => {
            const v = videoRef.current;
            if (v) v.playbackRate = rate;
            setBasePlaybackRate(rate);
            showSuccess(`Playback speed set to ${rate}x`);
          }}
          onToggleSubtitles={() => {
            setSubtitlesEnabled((prev) => !prev);
            showSuccess(`Subtitles ${!subtitlesEnabled ? 'enabled' : 'disabled'}`);
          }}
          onToggleStats={() => setIsStatsOpen((prev) => !prev)}
          onOpenShortcuts={onOpenShortcuts}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Bottom Controls Bar */}
      <div
        className={`transition-opacity duration-200 ${
          areControlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <Controls
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          bufferedEnd={bufferedEnd}
          volume={volume}
          isMuted={isMuted}
          playbackRate={basePlaybackRate}
          currentQuality={currentQuality}
          subtitlesEnabled={subtitlesEnabled}
          isTheaterMode={isTheaterMode}
          isFullscreen={isFullscreen}
          isSettingsOpen={isSettingsOpen}
          onTogglePlay={togglePlay}
          onSeek={handleSeek}
          onSeekBackward10={seekBackward10}
          onSeekForward10={seekForward10}
          onVolumeChange={handleVolumeChange}
          onToggleMute={toggleMute}
          onToggleSubtitles={() => setSubtitlesEnabled((prev) => !prev)}
          onToggleSettings={() => setIsSettingsOpen((prev) => !prev)}
          onTogglePip={togglePip}
          onToggleTheater={onToggleTheater}
          onToggleFullscreen={toggleFullscreen}
        />
      </div>
    </div>
  );
};
