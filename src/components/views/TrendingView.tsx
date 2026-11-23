import React from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { VideoCard } from '../stream/VideoCard';
import { TrendingIcon, PlayIcon } from '../common/Icons';

export const TrendingView: React.FC = () => {
  const { allVideos, selectVideo } = usePlayer();

  // Sort by view count for trending rank
  const trendingVideos = [...allVideos].sort((a, b) => b.views - a.views);

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#232A3B]">
        <div className="w-10 h-10 rounded-md bg-[#161B26] border border-[#232A3B] flex items-center justify-center text-[#E50914]">
          <TrendingIcon size={22} />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Trending Broadcasts
          </h1>
          <p className="text-xs text-slate-400">
            Top velocity streams and high-bitrate productions worldwide
          </p>
        </div>
      </div>

      {/* Top 3 Featured List */}
      <div className="flex flex-col gap-3">
        {trendingVideos.slice(0, 3).map((video, idx) => (
          <div
            key={video.id}
            onClick={() => selectVideo(video)}
            className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-[#161B26] border border-[#232A3B] hover:border-[#323B52] transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#E50914] w-8 text-center flex-shrink-0">
                0{idx + 1}
              </span>
              <div className="relative w-36 aspect-video rounded overflow-hidden bg-[#0E121A] flex-shrink-0">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/85 text-[10px] font-mono text-white">
                  {video.formattedDuration}
                </span>
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-bold text-white group-hover:text-slate-200 line-clamp-1">
                  {video.title}
                </h3>
                <span className="text-xs text-slate-400 mt-1">{video.channel.name}</span>
                <span className="text-[11px] text-slate-500 font-mono mt-0.5">
                  {video.formattedViews} • {video.uploadedAt}
                </span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                selectVideo(video);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded bg-[#1D2332] group-hover:bg-[#E50914] text-white text-xs font-bold transition-colors self-end sm:self-auto"
            >
              <PlayIcon size={14} />
              <span>Watch</span>
            </button>
          </div>
        ))}
      </div>

      {/* Full Grid */}
      <div className="mt-4 pt-4 border-t border-[#232A3B]">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
          All High Traction Streams
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {trendingVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </div>
  );
};
