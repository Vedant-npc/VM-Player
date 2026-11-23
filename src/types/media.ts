export type VideoQuality = '1080p' | '720p' | '480p' | '360p' | 'auto';

export interface VideoSource {
  quality: VideoQuality;
  src: string;
  label: string;
  fps: number;
  bitrate: string;
}

export interface SubtitleTrack {
  id: string;
  label: string;
  srclang: string;
  src: string;
  default?: boolean;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  sources: VideoSource[];
  thumbnail: string;
  duration: number; // in seconds
  formattedDuration: string;
  views: number;
  formattedViews: string;
  uploadedAt: string;
  channel: {
    name: string;
    avatar: string;
    subscribers: string;
    verified: boolean;
  };
  category: string;
  tags: string[];
  subtitles?: SubtitleTrack[];
  likes: number;
  isLiked?: boolean;
  isSaved?: boolean;
  progress?: number; // last watched timestamp in seconds
}

export interface CommentItem {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}

export interface PlayerStats {
  resolution: string;
  viewport: string;
  bufferedEnd: number;
  bufferHealth: string;
  droppedFrames: number;
  currentBitrate: string;
  playbackRate: number;
  volumePercent: number;
  codec: string;
}

export type ViewRoute = 'home' | 'watch' | 'trending' | 'library' | 'history' | 'saved' | 'stream-custom' | 'not-found';
