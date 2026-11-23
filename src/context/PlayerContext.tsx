import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showSuccess, showError, showInfo } = useToast();

  const [currentVideo, setCurrentVideo] = useState<ActiveVideo | null>(null);
  const [recentVideos, setRecentVideos] = useState<RecentItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_RECENTS);
      return stored ? JSON.parse(stored) : [];
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
      console.warn('Storage error', e);
    }
  }, [recentVideos]);

  // Dynamic Document Title
  useEffect(() => {
    if (currentVideo) {
      document.title = `VM Player - Playing: ${currentVideo.title}`;
    } else {
      document.title = 'VM Player - High Performance Video & Media Player';
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
      const ytid = extractYouTubeId(url);
      if (!ytid) {
        showError('Invalid YouTube URL. Please provide a valid YouTube watch or share link.');
        return false;
      }

      let videoTitle = `YouTube Video (${ytid})`;
      try {
        const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${ytid}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.title) {
            videoTitle = data.title;
          }
        }
      } catch {
        // Fallback to default title
      }

      const active: ActiveVideo = {
        id: `yt-${ytid}-${Date.now()}`,
        type: 'youtube',
        title: videoTitle,
        url: url.trim(),
        youtubeId: ytid,
        thumbnail: `https://i.ytimg.com/vi/${ytid}/hqdefault.jpg`,
        addedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setCurrentVideo(active);
      addRecent({
        id: active.id,
        title: videoTitle,
        url: url.trim(),
        type: 'youtube',
        youtubeId: ytid,
        timestamp: 'Recently played',
      });

      showSuccess(`Loaded YouTube video: "${videoTitle}"`);
      return true;
    },
    [addRecent, showError, showSuccess]
  );

  const loadLocalFile = useCallback(
    (file: File): boolean => {
      if (!file) return false;
      if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|webm|mkv|mov|avi|m4v)$/i)) {
        showError('Selected file is not recognized as a supported video container (.mp4, .webm, .mkv, .mov)');
        return false;
      }

      const objectUrl = URL.createObjectURL(file);
      const cleanName = file.name.replace(/\.[^/.]+$/, '');
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
      showSuccess(`Loaded local video: "${file.name}" (${sizeMb} MB)`);
      return true;
    },
    [showError, showSuccess]
  );

  const loadDirectUrl = useCallback(
    (url: string, customTitle?: string): boolean => {
      const trimmed = url.trim();
      if (!trimmed) {
        showError('Please enter a valid video URL');
        return false;
      }

      // Check if it's actually YouTube first
      if (extractYouTubeId(trimmed)) {
        loadYouTubeVideo(trimmed);
        return true;
      }

      try {
        new URL(trimmed);
      } catch {
        showError('Invalid URL protocol. Please include http:// or https://');
        return false;
      }

      const cleanName = customTitle?.trim() || trimmed.split('/').pop()?.split('?')[0] || 'Network Video Stream';

      const active: ActiveVideo = {
        id: `direct-${Date.now()}`,
        type: 'direct',
        title: cleanName,
        url: trimmed,
        addedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setCurrentVideo(active);
      addRecent({
        id: active.id,
        title: cleanName,
        url: trimmed,
        type: 'direct',
        timestamp: 'Recently played',
      });

      showSuccess(`Loaded stream: "${cleanName}"`);
      return true;
    },
    [addRecent, loadYouTubeVideo, showError, showSuccess]
  );

  const clearCurrentVideo = useCallback(() => {
    setCurrentVideo(null);
    showInfo('Player cleared. Ready for your next video.');
  }, [showInfo]);

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
