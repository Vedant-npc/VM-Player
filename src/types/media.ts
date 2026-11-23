export type VideoSourceType = 'youtube' | 'local' | 'direct';
export type VideoQuality = '1080p' | '720p' | '480p' | '360p' | 'auto' | string;

export interface ActiveVideo {
  id: string;
  type: VideoSourceType;
  title: string;
  url: string;
  youtubeId?: string;
  fileSize?: string;
  duration?: number;
  formattedDuration?: string;
  thumbnail?: string;
  addedAt: string;
}

export interface RecentItem {
  id: string;
  title: string;
  url: string;
  type: VideoSourceType;
  youtubeId?: string;
  timestamp: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}

export interface PlayerStats {
  sourceType: string;
  resolution: string;
  viewport: string;
  bufferedEnd: number;
  bufferHealth: string;
  droppedFrames: number;
  currentBitrate: string;
  playbackRate: number;
  volumePercent: number;
  codec?: string;
  engine?: string;
}
