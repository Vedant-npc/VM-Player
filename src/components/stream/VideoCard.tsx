import React from 'react';
import type { VideoItem } from '../../types/media';
import { usePlayer } from '../../context/PlayerContext';
import { useToast } from '../../context/ToastContext';
import { BookmarkIcon, ShareIcon, CheckIcon } from '../common/Icons';

interface VideoCardProps {
  video: VideoItem;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const { selectVideo, savedVideos, toggleSaveVideo } = usePlayer();
  const { showSuccess } = useToast();

  const isSaved = savedVideos.some((v) => v.id === video.id);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}?v=${video.id}`;
    navigator.clipboard.writeText(shareUrl);
    showSuccess(`Link copied: "${video.title}"`);
  };

  const handleToggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveVideo(video);
  };

  return (
    <div
      onClick={() => selectVideo(video)}
      className="group flex flex-col rounded-md bg-[#161B26] border border-[#232A3B] hover:border-[#323B52] transition-colors duration-150 overflow-hidden cursor-pointer select-none"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full bg-[#0E121A] overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
        />

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/85 text-[11px] font-mono font-semibold text-white tracking-wide">
          {video.formattedDuration}
        </div>

        {/* Hover Quick Action Buttons */}
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={handleToggleSave}
            className={`p-1.5 rounded bg-[#0E121A]/90 hover:bg-[#1D2332] text-white shadow-solid transition-colors ${
              isSaved ? 'text-[#E50914]' : 'text-slate-300'
            }`}
            title={isSaved ? 'Remove from Watch Later' : 'Watch Later'}
            aria-label="Save video"
          >
            <BookmarkIcon size={14} filled={isSaved} />
          </button>
          <button
            onClick={handleShare}
            className="p-1.5 rounded bg-[#0E121A]/90 hover:bg-[#1D2332] text-slate-300 hover:text-white shadow-solid transition-colors"
            title="Copy Share Link"
            aria-label="Share video"
          >
            <ShareIcon size={14} />
          </button>
        </div>
      </div>

      {/* Video Metadata Body */}
      <div className="p-3.5 flex items-start gap-3">
        {/* Channel Avatar */}
        <img
          src={video.channel.avatar}
          alt={video.channel.name}
          className="w-9 h-9 rounded-full object-cover border border-[#232A3B] flex-shrink-0"
        />

        <div className="flex flex-col min-w-0 flex-1">
          <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-slate-200 transition-colors">
            {video.title}
          </h3>

          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-400">
            <span className="truncate hover:text-white transition-colors">
              {video.channel.name}
            </span>
            {video.channel.verified && (
              <span className="w-3.5 h-3.5 rounded-full bg-[#1D2332] text-[#10B981] flex items-center justify-center flex-shrink-0">
                <CheckIcon size={10} />
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-mono">
            <span>{video.formattedViews}</span>
            <span>•</span>
            <span>{video.uploadedAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
