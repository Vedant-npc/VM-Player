import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { VideoItem, VideoQuality, ViewRoute } from '../types/media';
import { INITIAL_VIDEOS } from '../data/mockVideos';
import { useToast } from './ToastContext';

interface PlayerContextType {
  allVideos: VideoItem[];
  currentVideo: VideoItem;
  currentQuality: VideoQuality;
  activeRoute: ViewRoute;
  searchQuery: string;
  selectedCategory: string;
  watchHistory: VideoItem[];
  savedVideos: VideoItem[];
  likedVideoIds: string[];
  subscribedChannels: string[];
  isShortcutsOpen: boolean;
  isStreamModalOpen: boolean;
  sidebarOpen: boolean;
  
  // Actions
  selectVideo: (video: VideoItem) => void;
  setQuality: (quality: VideoQuality) => void;
  setRoute: (route: ViewRoute) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (cat: string) => void;
  toggleLikeVideo: (video: VideoItem) => void;
  toggleSaveVideo: (video: VideoItem) => void;
  toggleSubscribeChannel: (channelName: string) => void;
  addToHistory: (video: VideoItem, progressSeconds?: number) => void;
  clearHistory: () => void;
  addCustomVideo: (video: VideoItem) => void;
  toggleShortcutsModal: (open?: boolean) => void;
  toggleStreamModal: (open?: boolean) => void;
  toggleSidebar: (open?: boolean) => void;
}

const STORAGE_KEYS = {
  HISTORY: 'vm_player_history_v1',
  SAVED: 'vm_player_saved_v1',
  LIKED: 'vm_player_liked_v1',
  CHANNELS: 'vm_player_channels_v1',
  CUSTOM_VIDEOS: 'vm_player_custom_videos_v1',
  QUALITY: 'vm_player_quality_v1',
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showSuccess, showInfo } = useToast();

  const [allVideos, setAllVideos] = useState<VideoItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_VIDEOS);
      if (stored) {
        const custom = JSON.parse(stored) as VideoItem[];
        return [...custom, ...INITIAL_VIDEOS];
      }
    } catch {
      // Fallback
    }
    return INITIAL_VIDEOS;
  });

  const [currentVideo, setCurrentVideo] = useState<VideoItem>(allVideos[0]);
  const [currentQuality, setCurrentQuality] = useState<VideoQuality>(() => {
    return (localStorage.getItem(STORAGE_KEYS.QUALITY) as VideoQuality) || '1080p';
  });

  const [activeRoute, setActiveRouteState] = useState<ViewRoute>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const [watchHistory, setWatchHistory] = useState<VideoItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [savedVideos, setSavedVideos] = useState<VideoItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SAVED);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [likedVideoIds, setLikedVideoIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LIKED);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [subscribedChannels, setSubscribedChannels] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CHANNELS);
      return stored ? JSON.parse(stored) : ['Blender Cinema Studios'];
    } catch {
      return ['Blender Cinema Studios'];
    }
  });

  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [isStreamModalOpen, setIsStreamModalOpen] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(watchHistory));
    } catch (e) {
      console.warn('Storage quota exceeded for history', e);
    }
  }, [watchHistory]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(savedVideos));
    } catch (e) {
      console.warn('Storage quota exceeded for saved videos', e);
    }
  }, [savedVideos]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LIKED, JSON.stringify(likedVideoIds));
    } catch (e) {
      console.warn('Storage quota exceeded for likes', e);
    }
  }, [likedVideoIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHANNELS, JSON.stringify(subscribedChannels));
    } catch (e) {
      console.warn('Storage quota exceeded for channels', e);
    }
  }, [subscribedChannels]);

  // Route & Document Title Management (Strict rule: Fix page titles)
  const setRoute = useCallback((route: ViewRoute) => {
    setActiveRouteState(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    switch (route) {
      case 'home':
        document.title = 'VM Player - High Performance Studio Streaming';
        break;
      case 'watch':
        document.title = `VM Player - Watch: ${currentVideo.title}`;
        break;
      case 'trending':
        document.title = 'VM Player - Trending Video Broadcasts';
        break;
      case 'library':
        document.title = 'VM Player - Your Library & Watch Later';
        break;
      case 'history':
        document.title = 'VM Player - Playback History';
        break;
      case 'saved':
        document.title = 'VM Player - Saved Playlists & Watch Later';
        break;
      case 'stream-custom':
        document.title = 'VM Player - Ingest Custom Video & Local Media';
        break;
      case 'not-found':
        document.title = 'VM Player - 404 Broadcast Not Found';
        break;
      default:
        document.title = 'VM Player';
    }
  }, [currentVideo.title]);

  // Select video and navigate to watch page
  const selectVideo = useCallback((video: VideoItem) => {
    setCurrentVideo(video);
    setRoute('watch');
    document.title = `VM Player - Watch: ${video.title}`;
  }, [setRoute]);

  const setQuality = useCallback((quality: VideoQuality) => {
    setCurrentQuality(quality);
    localStorage.setItem(STORAGE_KEYS.QUALITY, quality);
    showSuccess(`Stream resolution switched to ${quality.toUpperCase()}`);
  }, [showSuccess]);

  const toggleLikeVideo = useCallback((video: VideoItem) => {
    setLikedVideoIds((prev) => {
      const exists = prev.includes(video.id);
      if (exists) {
        showInfo(`Removed "${video.title}" from liked videos`);
        return prev.filter((id) => id !== video.id);
      } else {
        showSuccess(`Added "${video.title}" to liked videos`);
        return [...prev, video.id];
      }
    });
  }, [showInfo, showSuccess]);

  const toggleSaveVideo = useCallback((video: VideoItem) => {
    setSavedVideos((prev) => {
      const exists = prev.some((v) => v.id === video.id);
      if (exists) {
        showInfo(`Removed from Watch Later`);
        return prev.filter((v) => v.id !== video.id);
      } else {
        showSuccess(`Saved to Watch Later`);
        return [video, ...prev];
      }
    });
  }, [showInfo, showSuccess]);

  const toggleSubscribeChannel = useCallback((channelName: string) => {
    setSubscribedChannels((prev) => {
      const exists = prev.includes(channelName);
      if (exists) {
        showInfo(`Unsubscribed from ${channelName}`);
        return prev.filter((c) => c !== channelName);
      } else {
        showSuccess(`Subscribed to ${channelName}`);
        return [...prev, channelName];
      }
    });
  }, [showInfo, showSuccess]);

  const addToHistory = useCallback((video: VideoItem, progressSeconds?: number) => {
    setWatchHistory((prev) => {
      const filtered = prev.filter((v) => v.id !== video.id);
      const updated: VideoItem = {
        ...video,
        progress: progressSeconds !== undefined ? progressSeconds : video.progress,
      };
      return [updated, ...filtered].slice(0, 50); // keep last 50
    });
  }, []);

  const clearHistory = useCallback(() => {
    setWatchHistory([]);
    showSuccess('Watch history cleared successfully');
  }, [showSuccess]);

  const addCustomVideo = useCallback((video: VideoItem) => {
    setAllVideos((prev) => [video, ...prev]);
    setCurrentVideo(video);
    setRoute('watch');
    showSuccess(`Loaded stream: ${video.title}`);

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_VIDEOS);
      const customList = stored ? JSON.parse(stored) : [];
      localStorage.setItem(STORAGE_KEYS.CUSTOM_VIDEOS, JSON.stringify([video, ...customList]));
    } catch (e) {
      console.warn('Could not persist custom video to storage', e);
    }
  }, [setRoute, showSuccess]);

  const toggleShortcutsModal = useCallback((open?: boolean) => {
    setIsShortcutsOpen((prev) => (open !== undefined ? open : !prev));
  }, []);

  const toggleStreamModal = useCallback((open?: boolean) => {
    setIsStreamModalOpen((prev) => (open !== undefined ? open : !prev));
  }, []);

  const toggleSidebar = useCallback((open?: boolean) => {
    setSidebarOpen((prev) => (open !== undefined ? open : !prev));
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        allVideos,
        currentVideo,
        currentQuality,
        activeRoute,
        searchQuery,
        selectedCategory,
        watchHistory,
        savedVideos,
        likedVideoIds,
        subscribedChannels,
        isShortcutsOpen,
        isStreamModalOpen,
        sidebarOpen,
        selectVideo,
        setQuality,
        setRoute,
        setSearchQuery,
        setSelectedCategory,
        toggleLikeVideo,
        toggleSaveVideo,
        toggleSubscribeChannel,
        addToHistory,
        clearHistory,
        addCustomVideo,
        toggleShortcutsModal,
        toggleStreamModal,
        toggleSidebar,
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
