import React, { useState, useRef } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { useToast } from '../../context/ToastContext';
import type { VideoItem, VideoSource } from '../../types/media';
import { CloseIcon, UploadIcon } from '../common/Icons';

export const StreamModal: React.FC = () => {
  const { isStreamModalOpen, toggleStreamModal, addCustomVideo } = usePlayer();
  const { showSuccess, showError } = useToast();

  const [mode, setMode] = useState<'url' | 'file'>('url');
  const [streamUrl, setStreamUrl] = useState('');
  const [streamTitle, setStreamTitle] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isStreamModalOpen) return null;

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!streamUrl.trim()) {
      showError('Please provide a valid video stream URL');
      return;
    }

    try {
      new URL(streamUrl);
    } catch {
      showError('Invalid URL protocol. Please include http:// or https://');
      return;
    }

    const title = streamTitle.trim() || 'Custom Network Stream';
    const channel = creatorName.trim() || 'External Broadcast';

    const source: VideoSource = {
      quality: '1080p',
      label: 'Direct Stream',
      src: streamUrl.trim(),
      fps: 60,
      bitrate: 'Custom',
    };

    const newVideo: VideoItem = {
      id: `custom-${Date.now()}`,
      title,
      description: `Imported direct network stream from ${streamUrl.trim()}. Decoded client-side through VM Player hardware pipeline.`,
      sources: [source],
      thumbnail: `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="640" height="360">
          <rect width="640" height="360" fill="#0E121A"/>
          <text x="320" y="170" fill="#E50914" font-family="sans-serif" font-size="28" font-weight="700" text-anchor="middle">CUSTOM STREAM</text>
          <text x="320" y="210" fill="#FFFFFF" font-family="sans-serif" font-size="16" text-anchor="middle">${title}</text>
        </svg>
      `)}`,
      duration: 0,
      formattedDuration: 'LIVE / VOD',
      views: 1,
      formattedViews: '1 view',
      uploadedAt: 'Just now',
      channel: {
        name: channel,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
        subscribers: 'Local Stream',
        verified: true,
      },
      category: 'Custom',
      tags: ['Custom', 'Stream', 'Direct'],
      likes: 1,
    };

    addCustomVideo(newVideo);
    toggleStreamModal(false);
  };

  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('video/')) {
      showError('Selected file is not recognized as a supported video container');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const fileName = file.name.replace(/\.[^/.]+$/, '');

    const source: VideoSource = {
      quality: '1080p',
      label: 'Local File',
      src: objectUrl,
      fps: 60,
      bitrate: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    };

    const newVideo: VideoItem = {
      id: `local-${Date.now()}`,
      title: fileName,
      description: `Local disk media: "${file.name}" (${(file.size / (1024 * 1024)).toFixed(2)} MB). Decoded in VM Player with zero network transmission.`,
      sources: [source],
      thumbnail: `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="640" height="360">
          <rect width="640" height="360" fill="#0E121A"/>
          <text x="320" y="170" fill="#10B981" font-family="sans-serif" font-size="28" font-weight="700" text-anchor="middle">LOCAL FILE PLAYBACK</text>
          <text x="320" y="210" fill="#FFFFFF" font-family="sans-serif" font-size="16" text-anchor="middle">${fileName}</text>
        </svg>
      `)}`,
      duration: 0,
      formattedDuration: 'Local File',
      views: 1,
      formattedViews: 'Local',
      uploadedAt: 'Today',
      channel: {
        name: 'Local Storage Host',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
        subscribers: 'Hardware Accelerated',
        verified: true,
      },
      category: 'Local',
      tags: ['Local Media', 'Offline', 'Hardware Decoded'],
      likes: 1,
    };

    addCustomVideo(newVideo);
    showSuccess(`Loaded local video: ${file.name}`);
    toggleStreamModal(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      onClick={() => toggleStreamModal(false)}
    >
      <div
        className="w-full max-w-lg rounded-lg bg-[#0E121A] border border-[#232A3B] text-white p-6 shadow-elevated relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#232A3B] mb-4">
          <div className="flex items-center gap-2">
            <UploadIcon size={18} className="text-[#E50914]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Ingest Video Stream or Local Media
            </h3>
          </div>
          <button
            onClick={() => toggleStreamModal(false)}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex rounded bg-[#161B26] p-1 mb-5 border border-[#232A3B]">
          <button
            onClick={() => setMode('url')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded transition-colors ${
              mode === 'url' ? 'bg-[#1D2332] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Network URL Stream
          </button>
          <button
            onClick={() => setMode('file')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded transition-colors ${
              mode === 'file' ? 'bg-[#1D2332] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Local Video File (Zero Upload)
          </button>
        </div>

        {/* Mode: Network URL Stream */}
        {mode === 'url' && (
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Stream URL (.mp4, .webm, or direct HTTP link) *
              </label>
              <div className="relative">
                <input
                  type="url"
                  required
                  value={streamUrl}
                  onChange={(e) => setStreamUrl(e.target.value)}
                  placeholder="https://example.com/video-feed.mp4"
                  className="w-full h-10 px-3 rounded bg-[#161B26] border border-[#232A3B] focus:border-[#E50914] focus:outline-none text-xs text-white placeholder-slate-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Video Title (Optional)
                </label>
                <input
                  type="text"
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  placeholder="e.g. 4K Drone Cinematic"
                  className="w-full h-9 px-3 rounded bg-[#161B26] border border-[#232A3B] focus:border-[#E50914] focus:outline-none text-xs text-white placeholder-slate-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Creator / Channel Name
                </label>
                <input
                  type="text"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  placeholder="e.g. Apex Broadcast"
                  className="w-full h-9 px-3 rounded bg-[#161B26] border border-[#232A3B] focus:border-[#E50914] focus:outline-none text-xs text-white placeholder-slate-500"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-normal">
              Direct streams are buffered and parsed by VM Player with sub-second timeline controls,
              2X hold boost, and telemetry monitoring.
            </p>

            <div className="pt-3 border-t border-[#232A3B] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => toggleStreamModal(false)}
                className="px-4 py-2 rounded bg-[#161B26] hover:bg-[#1D2332] text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-[#E50914] hover:bg-[#F41E2A] text-xs font-bold text-white transition-colors"
              >
                Load Stream in VM Player
              </button>
            </div>
          </form>
        )}

        {/* Mode: Local Video File */}
        {mode === 'file' && (
          <div className="space-y-4">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors ${
                isDragging
                  ? 'border-[#E50914] bg-[#E50914]/10'
                  : 'border-[#232A3B] hover:border-slate-500 bg-[#161B26]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileProcess(e.target.files[0]);
                  }
                }}
              />
              <div className="w-12 h-12 rounded-full bg-[#1D2332] flex items-center justify-center text-[#E50914]">
                <UploadIcon size={24} />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-white">
                  Drag and drop any local video file here, or click to browse
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Supported formats: MP4, WebM, MKV, MOV. Decoded directly on your device.
                </p>
              </div>
            </div>

            <div className="p-3 rounded bg-[#161B26] border border-[#232A3B] text-[11px] text-slate-300">
              <span className="font-bold text-[#10B981] block mb-1">✓ Zero Upload Latency</span>
              Local files are read using the browser Blob URL subsystem. Files never leave your machine
              and load instantaneously with full hardware decoding.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
