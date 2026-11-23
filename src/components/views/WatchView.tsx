import React, { useState, useEffect } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { useToast } from '../../context/ToastContext';
import { VMPlayer } from '../player/VMPlayer';
import { Comments } from '../stream/Comments';
import {
  LikeIcon,
  BookmarkIcon,
  ShareIcon,
  CheckIcon,
  KeyboardIcon,
} from '../common/Icons';

export const WatchView: React.FC = () => {
  const {
    currentVideo,
    currentQuality,
    allVideos,
    likedVideoIds,
    savedVideos,
    subscribedChannels,
    toggleLikeVideo,
    toggleSaveVideo,
    toggleSubscribeChannel,
    addToHistory,
    toggleShortcutsModal,
    selectVideo,
  } = usePlayer();

  const { showSuccess } = useToast();

  const [isTheaterMode, setIsTheaterMode] = useState<boolean>(false);
  const [descExpanded, setDescExpanded] = useState<boolean>(false);

  const isLiked = likedVideoIds.includes(currentVideo.id);
  const isSaved = savedVideos.some((v) => v.id === currentVideo.id);
  const isSubscribed = subscribedChannels.includes(currentVideo.channel.name);

  // Auto record to watch history
  useEffect(() => {
    addToHistory(currentVideo);
  }, [currentVideo, addToHistory]);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    showSuccess(`Stream link copied to clipboard: "${currentVideo.title}"`);
  };

  const recommendedQueue = allVideos.filter((v) => v.id !== currentVideo.id);

  return (
    <div className="w-full flex flex-col max-w-[1720px] mx-auto p-3 sm:p-6 lg:p-8 overflow-x-hidden">
      {/* Theater Mode Layout Wrapper */}
      <div className={`w-full ${isTheaterMode ? 'mb-6' : ''}`}>
        <VMPlayer
          video={currentVideo}
          currentQuality={currentQuality}
          isTheaterMode={isTheaterMode}
          onToggleTheater={() => setIsTheaterMode((prev) => !prev)}
          onOpenShortcuts={() => toggleShortcutsModal(true)}
          onTimeUpdateProgress={(secs) => addToHistory(currentVideo, secs)}
        />
      </div>

      {/* Main Content Split: Video Details & Comments (Left) vs Recommended Queue (Right) */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
        {/* Left Column: Metadata & Interaction */}
        <div className="lg:col-span-8 flex flex-col">
          {/* Video Title */}
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
            {currentVideo.title}
          </h1>

          {/* Channel Info & Action Cluster Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 mt-1 border-b border-[#232A3B]">
            {/* Channel Info & Subscribe */}
            <div className="flex items-center gap-3">
              <img
                src={currentVideo.channel.avatar}
                alt={currentVideo.channel.name}
                className="w-10 h-10 rounded-full object-cover border border-[#232A3B]"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white">
                    {currentVideo.channel.name}
                  </span>
                  {currentVideo.channel.verified && (
                    <span className="w-3.5 h-3.5 rounded-full bg-[#1D2332] text-[#10B981] flex items-center justify-center">
                      <CheckIcon size={10} />
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {currentVideo.channel.subscribers}
                </span>
              </div>

              <button
                onClick={() => toggleSubscribeChannel(currentVideo.channel.name)}
                className={`ml-2 px-4 py-2 rounded text-xs font-bold transition-colors ${
                  isSubscribed
                    ? 'bg-[#1D2332] text-slate-300 hover:bg-[#232A3B]'
                    : 'bg-[#E50914] text-white hover:bg-[#F41E2A]'
                }`}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            </div>

            {/* Action Buttons: Like, Save, Share, Shortcuts */}
            <div className="flex items-center gap-2">
              {/* Like Button */}
              <button
                onClick={() => toggleLikeVideo(currentVideo)}
                className={`flex items-center gap-2 h-9 px-3.5 rounded bg-[#161B26] border border-[#232A3B] hover:border-[#323B52] text-xs font-semibold transition-colors ${
                  isLiked ? 'text-[#E50914] border-[#E50914]' : 'text-slate-300 hover:text-white'
                }`}
                aria-label="Like video"
              >
                <LikeIcon size={16} filled={isLiked} />
                <span>{currentVideo.likes + (isLiked ? 1 : 0)}</span>
              </button>

              {/* Watch Later / Save */}
              <button
                onClick={() => toggleSaveVideo(currentVideo)}
                className={`flex items-center gap-2 h-9 px-3.5 rounded bg-[#161B26] border border-[#232A3B] hover:border-[#323B52] text-xs font-semibold transition-colors ${
                  isSaved ? 'text-[#E50914] border-[#E50914]' : 'text-slate-300 hover:text-white'
                }`}
                aria-label="Save to Watch Later"
              >
                <BookmarkIcon size={16} filled={isSaved} />
                <span className="hidden sm:inline">Save</span>
              </button>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="flex items-center gap-2 h-9 px-3.5 rounded bg-[#161B26] border border-[#232A3B] hover:border-[#323B52] text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                aria-label="Share video link"
              >
                <ShareIcon size={16} />
                <span className="hidden sm:inline">Share</span>
              </button>

              {/* Keyboard Shortcuts Trigger */}
              <button
                onClick={() => toggleShortcutsModal(true)}
                className="flex items-center gap-1.5 h-9 px-3 rounded bg-[#161B26] border border-[#232A3B] text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                title="Keyboard Shortcuts"
              >
                <KeyboardIcon size={16} />
                <span className="hidden md:inline">Keys</span>
              </button>
            </div>
          </div>

          {/* Description Box */}
          <div className="mt-4 rounded-md bg-[#161B26] border border-[#232A3B] p-4 text-xs select-text">
            <div className="flex items-center justify-between font-mono text-slate-300 pb-2 border-b border-[#232A3B]/60 mb-2">
              <span className="font-bold text-white">{currentVideo.formattedViews}</span>
              <span>Uploaded {currentVideo.uploadedAt}</span>
            </div>

            <p
              className={`text-slate-200 leading-relaxed ${
                descExpanded ? '' : 'line-clamp-2'
              }`}
            >
              {currentVideo.description}
            </p>

            {/* Technical Metadata Specs Table */}
            {descExpanded && (
              <div className="mt-4 pt-3 border-t border-[#232A3B] space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Broadcast Stream Parameters
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                  <div className="p-2 rounded bg-[#0E121A] border border-[#232A3B]">
                    <span className="text-slate-500 block">Format</span>
                    <span className="text-white">MP4 / AVC1</span>
                  </div>
                  <div className="p-2 rounded bg-[#0E121A] border border-[#232A3B]">
                    <span className="text-slate-500 block">Audio Master</span>
                    <span className="text-white">AAC-LC 320k</span>
                  </div>
                  <div className="p-2 rounded bg-[#0E121A] border border-[#232A3B]">
                    <span className="text-slate-500 block">Framerate</span>
                    <span className="text-white">60.000 FPS</span>
                  </div>
                  <div className="p-2 rounded bg-[#0E121A] border border-[#232A3B]">
                    <span className="text-slate-500 block">Color Space</span>
                    <span className="text-white">BT.709 Standard</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {currentVideo.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded bg-[#1D2332] text-slate-300 text-[10px] font-medium"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setDescExpanded((prev) => !prev)}
              className="mt-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              {descExpanded ? 'Show Less ▲' : 'Show More ▼'}
            </button>
          </div>

          {/* Comments Discussion Section */}
          <Comments videoId={currentVideo.id} />
        </div>

        {/* Right Column: Recommended Streams Queue */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#232A3B]">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Next in Stream Queue
            </h3>
            <span className="text-xs font-mono text-slate-400">Autoplay On</span>
          </div>

          <div className="flex flex-col gap-3">
            {recommendedQueue.map((video) => (
              <div
                key={video.id}
                onClick={() => selectVideo(video)}
                className="group flex gap-3 p-2 rounded-md bg-[#161B26] border border-[#232A3B] hover:border-[#323B52] transition-colors cursor-pointer select-none"
              >
                <div className="relative w-36 aspect-video rounded overflow-hidden bg-[#0E121A] flex-shrink-0">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/85 text-[10px] font-mono font-semibold text-white">
                    {video.formattedDuration}
                  </span>
                </div>
                <div className="flex flex-col min-w-0 flex-1 justify-center">
                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight group-hover:text-slate-200">
                    {video.title}
                  </h4>
                  <span className="text-[11px] text-slate-400 mt-1 truncate">
                    {video.channel.name}
                  </span>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {video.formattedViews} • {video.uploadedAt}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
