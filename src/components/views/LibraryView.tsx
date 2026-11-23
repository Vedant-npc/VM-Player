import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { VideoCard } from '../stream/VideoCard';
import {
  LibraryIcon,
  HistoryIcon,
  BookmarkIcon,
  LikeIcon,
  TrashIcon,
} from '../common/Icons';

export const LibraryView: React.FC = () => {
  const {
    watchHistory,
    savedVideos,
    likedVideoIds,
    allVideos,
    clearHistory,
  } = usePlayer();

  const [activeTab, setActiveTab] = useState<'history' | 'saved' | 'liked'>('history');

  const likedVideos = allVideos.filter((v) => likedVideoIds.includes(v.id));

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#232A3B]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-[#161B26] border border-[#232A3B] flex items-center justify-center text-[#E50914]">
            <LibraryIcon size={22} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Media Library & Collections
            </h1>
            <p className="text-xs text-slate-400">
              Manage your local playback history, saved queue, and favorited streams
            </p>
          </div>
        </div>

        {activeTab === 'history' && watchHistory.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#161B26] border border-[#232A3B] hover:border-[#E50914] text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <TrashIcon size={14} className="text-[#E50914]" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex rounded bg-[#161B26] p-1 border border-[#232A3B] max-w-md select-none">
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded transition-colors ${
            activeTab === 'history' ? 'bg-[#1D2332] text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <HistoryIcon size={14} />
          <span>History ({watchHistory.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded transition-colors ${
            activeTab === 'saved' ? 'bg-[#1D2332] text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookmarkIcon size={14} />
          <span>Watch Later ({savedVideos.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('liked')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded transition-colors ${
            activeTab === 'liked' ? 'bg-[#1D2332] text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <LikeIcon size={14} />
          <span>Liked ({likedVideos.length})</span>
        </button>
      </div>

      {/* Tab Content: History */}
      {activeTab === 'history' && (
        <div>
          {watchHistory.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {watchHistory.map((video) => (
                <div key={video.id} className="relative group">
                  <VideoCard video={video} />
                  {video.progress && video.progress > 0 && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/85 text-[10px] font-mono text-[#10B981] font-bold pointer-events-none">
                      Resume at {Math.floor(video.progress / 60)}:
                      {Math.floor(video.progress % 60)
                        .toString()
                        .padStart(2, '0')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center rounded-lg bg-[#161B26] border border-[#232A3B] p-8">
              <HistoryIcon size={32} className="mx-auto text-slate-500 mb-2" />
              <p className="text-sm font-semibold text-white">Your watch history is clear</p>
              <p className="text-xs text-slate-400 mt-1">
                Videos you stream in VM Player will automatically appear here with your saved position.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Watch Later */}
      {activeTab === 'saved' && (
        <div>
          {savedVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center rounded-lg bg-[#161B26] border border-[#232A3B] p-8">
              <BookmarkIcon size={32} className="mx-auto text-slate-500 mb-2" />
              <p className="text-sm font-semibold text-white">No saved videos in Watch Later</p>
              <p className="text-xs text-slate-400 mt-1">
                Click the bookmark button on any stream card to add it to your queue.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Liked Videos */}
      {activeTab === 'liked' && (
        <div>
          {likedVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {likedVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center rounded-lg bg-[#161B26] border border-[#232A3B] p-8">
              <LikeIcon size={32} className="mx-auto text-slate-500 mb-2" />
              <p className="text-sm font-semibold text-white">No liked streams recorded</p>
              <p className="text-xs text-slate-400 mt-1">
                Hit the like button on video broadcasts you enjoy to build your favorites list.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
