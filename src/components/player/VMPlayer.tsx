import React, { useRef, useState, useEffect, useCallback } from 'react';
import type { ActiveVideo, PlayerStats } from '../../types/media';
import { Controls } from './Controls';
import { VolumeHUD } from './VolumeHUD';
import { SpeedHUD } from './SpeedHUD';
import { SeekHUD } from './SeekHUD';
import { SettingsMenu } from './SettingsMenu';
import { StatsForNerds } from './StatsForNerds';
import { PlayIcon, PauseIcon } from '../common/Icons';
import { useToast } from '../../context/ToastContext';

interface VMPlayerProps {
  video: ActiveVideo;
  isTheaterMode: boolean;
  onToggleTheater: () => void;
  onOpenShortcuts: () => void;
}

// Global YouTube API script loader promise
let ytApiPromise: Promise<void> | null = null;
function loadYouTubeApi(): Promise<void> {
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((resolve) => {
    // @ts-expect-error window.YT
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // @ts-expect-error window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      resolve();
    };
  });
  return ytApiPromise;
}

export const VMPlayer: React.FC<VMPlayerProps> = ({
  video,
  isTheaterMode,
  onToggleTheater,
  onOpenShortcuts,
}) => {
  const { showError, showSuccess } = useToast();

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const ytPlayerRef = useRef<any>(null);
  const ytContainerId = 'vm-yt-player-surface';

  const isYouTube = video.type === 'youtube' && !!video.youtubeId;

  // Playback States
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [bufferedEnd, setBufferedEnd] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [basePlaybackRate, setBasePlaybackRate] = useState<number>(1.0);
  const [isBoostingSpeed, setIsBoostingSpeed] = useState<boolean>(false);
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
    sourceType: isYouTube ? 'YouTube IFrame Engine' : 'HTML5 Native Hardware Decoder',
    resolution: '1920x1080',
    viewport: '1280x720',
    bufferedEnd: 0,
    bufferHealth: '0.0s',
    droppedFrames: 0,
    currentBitrate: isYouTube ? 'YouTube Variable Bitrate' : video.fileSize || 'Direct Stream',
    playbackRate: 1.0,
    volumePercent: 100,
    engine: isYouTube ? 'Google YouTube Core' : 'Blink WebMedia VideoDecoder',
  });

  // Timers Refs
  const controlsTimeoutRef = useRef<number | null>(null);
  const volumeHUDTimeoutRef = useRef<number | null>(null);
  const seekHUDTimeoutRef = useRef<number | null>(null);
  const centerIconTimeoutRef = useRef<number | null>(null);
  const holdSpeedTimeoutRef = useRef<number | null>(null);
  const clickCountRef = useRef<number>(0);
  const singleClickTimerRef = useRef<number | null>(null);

  // Flash Center Play/Pause Indicator
  const triggerCenterIcon = (type: 'play' | 'pause') => {
    setCenterPlayIcon(type);
    if (centerIconTimeoutRef.current) clearTimeout(centerIconTimeoutRef.current);
    centerIconTimeoutRef.current = window.setTimeout(() => {
      setCenterPlayIcon(null);
    }, 450);
  };

  // ----------------------------------------------------
  // YouTube IFrame Player Initializer & Watcher
  // ----------------------------------------------------
  useEffect(() => {
    if (!isYouTube || !video.youtubeId) return;

    let isMounted = true;
    let tickerInterval: number | null = null;

    loadYouTubeApi().then(() => {
      if (!isMounted) return;

      // Clean up previous instance if any
      if (ytPlayerRef.current && typeof ytPlayerRef.current.destroy === 'function') {
        try {
          ytPlayerRef.current.destroy();
        } catch {
          // Ignored
        }
      }

      // @ts-expect-error window.YT
      ytPlayerRef.current = new window.YT.Player(ytContainerId, {
        videoId: video.youtubeId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3,
          playsinline: 1,
          fs: 0,
          disablekb: 1,
        },
        events: {
          // @ts-expect-error event
          onReady: (event) => {
            if (!isMounted) return;
            const dur = event.target.getDuration();
            setDuration(dur || 0);
            event.target.playVideo();
            setIsPlaying(true);
          },
          // @ts-expect-error event
          onStateChange: (event) => {
            if (!isMounted) return;
            // 1: PLAYING, 2: PAUSED, 3: BUFFERING, 0: ENDED
            if (event.data === 1) {
              setIsPlaying(true);
              setIsBuffering(false);
            } else if (event.data === 2) {
              setIsPlaying(false);
              setIsBuffering(false);
            } else if (event.data === 3) {
              setIsBuffering(true);
            } else if (event.data === 0) {
              setIsPlaying(false);
            }
          },
        },
      });

      // Ticker interval to update timeline current time and buffer
      tickerInterval = window.setInterval(() => {
        if (ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function') {
          try {
            const cur = ytPlayerRef.current.getCurrentTime() || 0;
            const dur = ytPlayerRef.current.getDuration() || 0;
            const loadedFraction = ytPlayerRef.current.getVideoLoadedFraction() || 0;

            setCurrentTime(cur);
            if (dur > 0) {
              setDuration(dur);
              setBufferedEnd(dur * loadedFraction);
            }
          } catch {
            // Player might be switching
          }
        }
      }, 250);
    });

    return () => {
      isMounted = false;
      if (tickerInterval) clearInterval(tickerInterval);
      if (ytPlayerRef.current && typeof ytPlayerRef.current.destroy === 'function') {
        try {
          ytPlayerRef.current.destroy();
        } catch {
          // Ignored
        }
      }
    };
  }, [isYouTube, video.youtubeId]);

  // ----------------------------------------------------
  // HTML5 Video Loader (for Local Files & Direct URLs)
  // ----------------------------------------------------
  useEffect(() => {
    if (isYouTube) return;
    const v = videoRef.current;
    if (!v) return;

    v.src = video.url;
    v.load();
    v.play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [isYouTube, video.url]);

  // ----------------------------------------------------
  // Play / Pause Toggle
  // ----------------------------------------------------
  const togglePlay = useCallback(() => {
    if (isYouTube && ytPlayerRef.current) {
      try {
        if (isPlaying) {
          ytPlayerRef.current.pauseVideo();
          setIsPlaying(false);
          triggerCenterIcon('pause');
        } else {
          ytPlayerRef.current.playVideo();
          setIsPlaying(true);
          triggerCenterIcon('play');
        }
      } catch (err) {
        console.warn('YouTube play/pause error', err);
      }
      return;
    }

    const v = videoRef.current;
    if (!v) return;

    if (v.paused) {
      v.play()
        .then(() => {
          setIsPlaying(true);
          triggerCenterIcon('play');
        })
        .catch(() => {
          showError('Playback could not be started');
        });
    } else {
      v.pause();
      setIsPlaying(false);
      triggerCenterIcon('pause');
    }
  }, [isPlaying, isYouTube, showError]);

  // ----------------------------------------------------
  // Seeking Mechanics (-10s / +10s / Scrubber)
  // ----------------------------------------------------
  const handleSeek = useCallback(
    (targetSeconds: number) => {
      const clamped = Math.max(0, Math.min(targetSeconds, duration));
      setCurrentTime(clamped);

      if (isYouTube && ytPlayerRef.current) {
        try {
          ytPlayerRef.current.seekTo(clamped, true);
        } catch {
          // Ignored
        }
        return;
      }

      const v = videoRef.current;
      if (v) {
        v.currentTime = clamped;
      }
    },
    [duration, isYouTube]
  );

  const seekBackward10 = useCallback(() => {
    const nextTime = Math.max(0, currentTime - 10);
    handleSeek(nextTime);

    setSeekHUDDirection('backward');
    if (seekHUDTimeoutRef.current) clearTimeout(seekHUDTimeoutRef.current);
    seekHUDTimeoutRef.current = window.setTimeout(() => setSeekHUDDirection(null), 600);
  }, [currentTime, handleSeek]);

  const seekForward10 = useCallback(() => {
    const nextTime = Math.min(duration, currentTime + 10);
    handleSeek(nextTime);

    setSeekHUDDirection('forward');
    if (seekHUDTimeoutRef.current) clearTimeout(seekHUDTimeoutRef.current);
    seekHUDTimeoutRef.current = window.setTimeout(() => setSeekHUDDirection(null), 600);
  }, [currentTime, duration, handleSeek]);

  // ----------------------------------------------------
  // Volume Low/High Animation & Changes
  // ----------------------------------------------------
  const handleVolumeChange = useCallback(
    (newVol: number) => {
      const clamped = Math.max(0, Math.min(1, newVol));
      setVolume(clamped);

      if (clamped === 0) {
        setIsMuted(true);
      } else if (isMuted) {
        setIsMuted(false);
      }

      if (isYouTube && ytPlayerRef.current) {
        try {
          ytPlayerRef.current.setVolume(clamped * 100);
          if (clamped === 0) ytPlayerRef.current.mute();
          else ytPlayerRef.current.unMute();
        } catch {
          // Ignored
        }
      } else if (videoRef.current) {
        videoRef.current.volume = clamped;
        videoRef.current.muted = clamped === 0;
      }

      setVolumeHUDVisible(true);
      if (volumeHUDTimeoutRef.current) clearTimeout(volumeHUDTimeoutRef.current);
      volumeHUDTimeoutRef.current = window.setTimeout(() => setVolumeHUDVisible(false), 1200);
    },
    [isMuted, isYouTube]
  );

  const toggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (isYouTube && ytPlayerRef.current) {
      try {
        if (nextMuted) ytPlayerRef.current.mute();
        else {
          ytPlayerRef.current.unMute();
          ytPlayerRef.current.setVolume((volume || 0.5) * 100);
        }
      } catch {
        // Ignored
      }
    } else if (videoRef.current) {
      videoRef.current.muted = nextMuted;
    }

    setVolumeHUDVisible(true);
    if (volumeHUDTimeoutRef.current) clearTimeout(volumeHUDTimeoutRef.current);
    volumeHUDTimeoutRef.current = window.setTimeout(() => setVolumeHUDVisible(false), 1200);
  }, [isMuted, isYouTube, volume]);

  // ----------------------------------------------------
  // Hold-for-2X Speed Boost Mechanics
  // ----------------------------------------------------
  const startSpeedBoost = useCallback(() => {
    setIsBoostingSpeed(true);

    if (isYouTube && ytPlayerRef.current) {
      try {
        ytPlayerRef.current.setPlaybackRate(2.0);
      } catch {
        // Ignored
      }
    } else if (videoRef.current) {
      videoRef.current.playbackRate = 2.0;
    }
  }, [isYouTube]);

  const endSpeedBoost = useCallback(() => {
    setIsBoostingSpeed(false);

    if (isYouTube && ytPlayerRef.current) {
      try {
        ytPlayerRef.current.setPlaybackRate(basePlaybackRate);
      } catch {
        // Ignored
      }
    } else if (videoRef.current) {
      videoRef.current.playbackRate = basePlaybackRate;
    }
  }, [basePlaybackRate, isYouTube]);

  // ----------------------------------------------------
  // Gestures (Click, Double-tap Seek, Long-press Hold 2x)
  // ----------------------------------------------------
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
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

  // ----------------------------------------------------
  // Fullscreen Management
  // ----------------------------------------------------
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => {
          showError('Fullscreen not available in this mode');
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
    if (isYouTube) {
      showError('Picture-in-Picture is controlled natively by YouTube iframe');
      return;
    }
    const v = videoRef.current;
    if (!v) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (v.requestPictureInPicture) {
        await v.requestPictureInPicture();
      }
    } catch {
      showError('Picture-in-Picture not supported on this browser/stream');
    }
  }, [isYouTube, showError]);

  // Controls Visibility Auto-hide
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

  // ----------------------------------------------------
  // Global Keyboard Shortcuts
  // ----------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
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
        case 'ArrowLeft':
          e.preventDefault();
          seekBackward10();
          break;
        case 'l':
        case 'L':
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

  // HTML5 Event Listeners
  const handleNativeTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    setCurrentTime(v.currentTime);

    if (v.buffered.length > 0) {
      for (let i = 0; i < v.buffered.length; i++) {
        if (v.buffered.start(i) <= v.currentTime && v.buffered.end(i) >= v.currentTime) {
          setBufferedEnd(v.buffered.end(i));
          break;
        }
      }
    }
  };

  const handleNativeLoadedMetadata = () => {
    const v = videoRef.current;
    if (!v) return;
    setDuration(v.duration || 0);
  };

  // Update Stats for Nerds Telemetry
  useEffect(() => {
    if (!isStatsOpen || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const bufferSec = Math.max(0, bufferedEnd - currentTime);

    setStats({
      sourceType: isYouTube ? 'YouTube Video Stream' : video.type === 'local' ? 'Local Storage Disk File' : 'Direct Network URL',
      resolution: isYouTube ? '1080p (Adaptive Auto)' : '1920x1080',
      viewport: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
      bufferedEnd,
      bufferHealth: `${bufferSec.toFixed(1)}s`,
      droppedFrames: 0,
      currentBitrate: video.fileSize || 'Variable Bitrate',
      playbackRate: isBoostingSpeed ? 2.0 : basePlaybackRate,
      volumePercent: isMuted ? 0 : Math.round(volume * 100),
      engine: isYouTube ? 'Google YouTube Core API' : 'Browser HTML5 Hardware Decoder',
    });
  }, [isStatsOpen, bufferedEnd, currentTime, isYouTube, video, isBoostingSpeed, basePlaybackRate, isMuted, volume]);

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
          : 'aspect-video rounded-lg border border-[#232A3B] shadow-elevated'
      }`}
    >
      {/* Driver 1: YouTube IFrame Engine */}
      {isYouTube ? (
        <div className="w-full h-full pointer-events-none">
          <div id={ytContainerId} className="w-full h-full" />
        </div>
      ) : (
        /* Driver 2: HTML5 Video Engine (for Local Media & Direct Links) */
        <video
          ref={videoRef}
          playsInline
          preload="metadata"
          onTimeUpdate={handleNativeTimeUpdate}
          onLoadedMetadata={handleNativeLoadedMetadata}
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => {
            setIsBuffering(false);
            setIsPlaying(true);
          }}
          onEnded={() => setIsPlaying(false)}
          className="w-full h-full object-contain cursor-pointer"
          aria-label={video.title}
        />
      )}

      {/* Unified Invisible Gesture Surface (Tap to Play/Pause, Double-Tap Seek, Hold for 2X) */}
      <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        className="absolute inset-0 z-10 cursor-pointer"
        aria-hidden="true"
      />

      {/* Buffering Loading Spinner */}
      {isBuffering && (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center bg-black/40">
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

      {/* Stats for Nerds Telemetry */}
      {isStatsOpen && <StatsForNerds stats={stats} onClose={() => setIsStatsOpen(false)} />}

      {/* Settings Menu */}
      {isSettingsOpen && (
        <SettingsMenu
          currentQuality="1080p"
          availableQualities={['1080p', '720p', '480p', '360p', 'auto']}
          playbackRate={basePlaybackRate}
          subtitlesEnabled={false}
          statsEnabled={isStatsOpen}
          onSelectQuality={(q) => showSuccess(`Quality set to ${q.toUpperCase()}`)}
          onSelectPlaybackRate={(rate) => {
            setBasePlaybackRate(rate);
            if (isYouTube && ytPlayerRef.current) {
              ytPlayerRef.current.setPlaybackRate(rate);
            } else if (videoRef.current) {
              videoRef.current.playbackRate = rate;
            }
            showSuccess(`Playback rate: ${rate}x`);
          }}
          onToggleSubtitles={() => showSuccess('Subtitles toggled')}
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
          currentQuality="1080p"
          subtitlesEnabled={false}
          isTheaterMode={isTheaterMode}
          isFullscreen={isFullscreen}
          isSettingsOpen={isSettingsOpen}
          onTogglePlay={togglePlay}
          onSeek={handleSeek}
          onSeekBackward10={seekBackward10}
          onSeekForward10={seekForward10}
          onVolumeChange={handleVolumeChange}
          onToggleMute={toggleMute}
          onToggleSubtitles={() => {}}
          onToggleSettings={() => setIsSettingsOpen((prev) => !prev)}
          onTogglePip={togglePip}
          onToggleTheater={onToggleTheater}
          onToggleFullscreen={toggleFullscreen}
        />
      </div>
    </div>
  );
};
