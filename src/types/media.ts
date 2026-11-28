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

// PWA and File Handling Types
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export interface FileSystemFileHandle {
  getFile(): Promise<File>;
}

export interface LaunchParams {
  readonly targetURL?: string;
  readonly files: FileSystemFileHandle[];
}

export interface LaunchQueue {
  setConsumer(consumer: (launchParams: LaunchParams) => void | Promise<void>): void;
}

declare global {
  interface Window {
    launchQueue?: LaunchQueue;
    beforeInstallPromptEvent?: BeforeInstallPromptEvent | null;
  }
}

