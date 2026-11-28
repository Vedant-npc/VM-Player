import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { ActiveVideo, RecentItem } from '../types/media';
import { useToast } from './ToastContext';
import { extractYouTubeId } from '../utils/youtube';

interface PlayerContextType {
  currentVideo: ActiveVideo | null;
  recentVideos: RecentItem[];
  isShortcutsOpen: boolean;
  isDraggingGlobal: boolean;

  // Actions
  loadYouTubeVideo: (url: string) => Promise<boolean>;
  loadLocalFile: (file: File) => boolean;
  loadDirectUrl: (url: string, customTitle?: string) => boolean;
  clearCurrentVideo: () => void;
  clearRecentVideos: () => void;
  removeRecentItem: (id: string) => void;
  toggleShortcutsModal: (open?: boolean) => void;
  setIsDraggingGlobal: (dragging: boolean) => void;
}

const STORAGE_KEY_RECENTS = 'vm_player_recents_v2';
const MAX_URL_LENGTH = 2048;
const MAX_TITLE_LENGTH = 150;

/** Sanitize input strings to mitigate XSS, control-character injection and DOM anomalies */
const sanitizeText = (input: string, maxLen: number = MAX_TITLE_LENGTH): string => {
  if (!input) return '';
  return input
    .replace(/[<>]/g, '') // Strip angle brackets
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F\x7F]/g, '') // Strip ASCII control characters
    .trim()
    .slice(0, maxLen);
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showSuccess, showError, showInfo } = useToast();

  const [currentVideo, setCurrentVideo] = useState<ActiveVideo | null>(null);
  const activeBlobUrlRef = useRef<string | null>(null);

  const cleanupActiveBlob = useCallback(() => {
    if (activeBlobUrlRef.current) {
      try {
        URL.revokeObjectURL(activeBlobUrlRef.current);
      } catch (e) {
        console.warn('Failed to revoke previous blob URL:', e);
      }
      activeBlobUrlRef.current = null;
    }
  }, []);

  // Cleanup blob URL on unmount or tab close
  useEffect(() => {
    return () => {
      cleanupActiveBlob();
    };
  }, [cleanupActiveBlob]);

  // Safe localStorage loader with validation against corrupted or injected entries
  const [recentVideos, setRecentVideos] = useState<RecentItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_RECENTS);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((item): item is RecentItem => 
          item &&
          typeof item === 'object' &&
          typeof item.id === 'string' &&
          typeof item.title === 'string' &&
          typeof item.url === 'string' &&
          ['youtube', 'local', 'direct'].includes(item.type)
        )
        .slice(0, 20)
        .map((item) => ({
          ...item,
          title: sanitizeText(item.title),
          url: sanitizeText(item.url, MAX_URL_LENGTH),
        }));
    } catch {
      return [];
    }
  });

  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [isDraggingGlobal, setIsDraggingGlobal] = useState<boolean>(false);

  // Sync recents to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RECENTS, JSON.stringify(recentVideos));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [recentVideos]);

  // Dynamic Document Title
  useEffect(() => {
    if (currentVideo) {
      document.title = `VM Player - Playing: ${currentVideo.title}`;
    } else {
      document.title = 'VM Player - Studio Grade Video Streaming & Media Player';
    }
  }, [currentVideo]);

  const addRecent = useCallback((item: RecentItem) => {
    setRecentVideos((prev) => {
      const filtered = prev.filter((r) => r.url !== item.url);
      return [item, ...filtered].slice(0, 20); // Keep last 20
    });
  }, []);

  const loadYouTubeVideo = useCallback(
    async (url: string): Promise<boolean> => {
      const trimmed = url.trim();
      if (trimmed.length > MAX_URL_LENGTH) {
        showError('Provided URL exceeds maximum allowed length.');
        return false;
      }

      const ytid = extractYouTubeId(trimmed);
      if (!ytid) {
        showError('Invalid YouTube URL. Please provide a valid YouTube watch or share link.');
        return false;
      }

      // Cleanup any active blob URL to prevent memory leaks
      cleanupActiveBlob();

      let videoTitle = `YouTube Video (${ytid})`;
      try {
        const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${ytid}`);
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.title === 'string') {
            videoTitle = sanitizeText(data.title);
          }
        }
      } catch {
        // Fallback to default sanitized title
      }

      const active: ActiveVideo = {
        id: `yt-${ytid}-${Date.now()}`,
        type: 'youtube',
        title: videoTitle,
        url: trimmed,
        youtubeId: ytid,
        thumbnail: `https://i.ytimg.com/vi/${ytid}/hqdefault.jpg`,
        addedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setCurrentVideo(active);
      addRecent({
        id: active.id,
        title: videoTitle,
        url: trimmed,
        type: 'youtube',
        youtubeId: ytid,
        timestamp: 'Recently played',
      });

      showSuccess(`Loaded YouTube video: "${videoTitle}"`);
      return true;
    },
    [addRecent, cleanupActiveBlob, showError, showSuccess]
  );

  const loadLocalFile = useCallback(
    (file: File): boolean => {
      if (!file) return false;
      if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|webm|mkv|mov|avi|m4v|ogv)$/i)) {
        showError('Selected file is not recognized as a supported video container (.mp4, .webm, .mkv, .mov, .avi)');
        return false;
      }

      // Cleanup prior blob memory allocation
      cleanupActiveBlob();

      const objectUrl = URL.createObjectURL(file);
      activeBlobUrlRef.current = objectUrl;

      const rawName = file.name.replace(/\.[^/.]+$/, '');
      const cleanName = sanitizeText(rawName) || 'Local Video';
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);

      const active: ActiveVideo = {
        id: `local-${Date.now()}`,
        type: 'local',
        title: cleanName,
        url: objectUrl,
        fileSize: `${sizeMb} MB`,
        addedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setCurrentVideo(active);
      showSuccess(`Loaded local video: "${cleanName}" (${sizeMb} MB)`);
      return true;
    },
    [cleanupActiveBlob, showError, showSuccess]
  );

  const loadDirectUrl = useCallback(
    (url: string, customTitle?: string): boolean => {
      const trimmed = url.trim();
      if (!trimmed) {
        showError('Please enter a valid video URL');
        return false;
      }

      if (trimmed.length > MAX_URL_LENGTH) {
        showError('URL exceeds maximum permitted character length.');
        return false;
      }

      // Check if it's actually YouTube first
      if (extractYouTubeId(trimmed)) {
        loadYouTubeVideo(trimmed);
        return true;
      }

      // Strict URL protocol validation: Only allow http and https
      let parsedUrl: URL;
      try {
        parsedUrl = new URL(trimmed);
      } catch {
        showError('Invalid URL format. Please include http:// or https://');
        return false;
      }

      const protocol = parsedUrl.protocol.toLowerCase();
      if (protocol !== 'http:' && protocol !== 'https:') {
        showError('Unsupported or insecure protocol. Only HTTP and HTTPS video streams are permitted.');
        return false;
      }

      // Free previous blob URL memory if replacing local video
      cleanupActiveBlob();

      const filenameFromUrl = parsedUrl.pathname.split('/').pop()?.split('?')[0];
      const rawName = customTitle?.trim() || filenameFromUrl || 'Network Video Stream';
      const cleanName = sanitizeText(rawName);

      const active: ActiveVideo = {
        id: `direct-${Date.now()}`,
        type: 'direct',
        title: cleanName,
        url: parsedUrl.href,
        addedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setCurrentVideo(active);
      addRecent({
        id: active.id,
        title: cleanName,
        url: parsedUrl.href,
        type: 'direct',
        timestamp: 'Recently played',
      });

      showSuccess(`Loaded stream: "${cleanName}"`);
      return true;
    },
    [addRecent, cleanupActiveBlob, loadYouTubeVideo, showError, showSuccess]
  );

  const clearCurrentVideo = useCallback(() => {
    cleanupActiveBlob();
    setCurrentVideo(null);
    showInfo('Player cleared. Ready for your next video.');
  }, [cleanupActiveBlob, showInfo]);

  const clearRecentVideos = useCallback(() => {
    setRecentVideos([]);
    try {
      localStorage.removeItem(STORAGE_KEY_RECENTS);
    } catch {
      // Ignored
    }
    showSuccess('Recent playback list cleared');
  }, [showSuccess]);

  const removeRecentItem = useCallback(
    (id: string) => {
      setRecentVideos((prev) => prev.filter((r) => r.id !== id));
      showInfo('Removed item from recents');
    },
    [showInfo]
  );

  const toggleShortcutsModal = useCallback((open?: boolean) => {
    setIsShortcutsOpen((prev) => (open !== undefined ? open : !prev));
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentVideo,
        recentVideos,
        isShortcutsOpen,
        isDraggingGlobal,
        loadYouTubeVideo,
        loadLocalFile,
        loadDirectUrl,
        clearCurrentVideo,
        clearRecentVideos,
        removeRecentItem,
        toggleShortcutsModal,
        setIsDraggingGlobal,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

