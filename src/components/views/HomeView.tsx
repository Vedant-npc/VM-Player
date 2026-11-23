import React from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { VideoCard } from '../stream/VideoCard';
import { PlayIcon } from '../common/Icons';

export const HomeView: React.FC = () => {
  const {
    allVideos,
    searchQuery,
    selectedCategory,
    setSelectedCategory,
    selectVideo,
  } = usePlayer();

  const categories = [
    'All',
    'Cinema',
    'Animation',
    'Sci-Fi',
    'Nature',
    'Motorsport',
    'Architecture',
    'Custom',
  ];

  // Filter videos based on category and search query
  const filteredVideos = allVideos.filter((video) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      video.category.toLowerCase() === selectedCategory.toLowerCase() ||
      video.tags.some((t) => t.toLowerCase() === selectedCategory.toLowerCase());

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      video.title.toLowerCase().includes(query) ||
      video.channel.name.toLowerCase().includes(query) ||
      video.tags.some((t) => t.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  const featuredVideo = allVideos[0];

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto overflow-x-hidden">
      {/* Category Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none select-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                isSelected
                  ? 'bg-white text-black font-bold'
                  : 'bg-[#161B26] text-slate-300 hover:text-white hover:bg-[#1D2332] border border-[#232A3B]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Featured Broadcast Hero (Only on "All" without search filter) */}
      {!searchQuery && selectedCategory === 'All' && featuredVideo && (
        <div className="w-full rounded-lg bg-[#161B26] border border-[#232A3B] overflow-hidden p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-3 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#E50914] text-[10px] font-mono font-bold tracking-widest text-white uppercase">
                Featured Broadcast
              </span>
              <span className="text-xs text-slate-400 font-mono">1080p60 Master</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {featuredVideo.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
              {featuredVideo.description}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => selectVideo(featuredVideo)}
                className="flex items-center gap-2 px-5 py-2.5 rounded bg-[#E50914] hover:bg-[#F41E2A] text-white text-xs sm:text-sm font-bold shadow-solid transition-colors"
              >
                <PlayIcon size={16} />
                <span>Watch in VM Player</span>
              </button>
              <span className="text-xs text-slate-400 font-mono">
                Duration: {featuredVideo.formattedDuration}
              </span>
            </div>
          </div>

          <div
            onClick={() => selectVideo(featuredVideo)}
            className="w-full md:w-80 aspect-video rounded-md overflow-hidden border border-[#232A3B] cursor-pointer group relative flex-shrink-0"
          >
            <img
              src={featuredVideo.thumbnail}
              alt={featuredVideo.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#0E121A]/85 border border-[#323B52] flex items-center justify-center text-[#E50914] shadow-solid">
                <PlayIcon size={20} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feed Section Title */}
      <div className="flex items-center justify-between border-b border-[#232A3B] pb-3">
        <h2 className="text-lg font-bold text-white tracking-tight">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Studio Stream Feed'}
        </h2>
        <span className="text-xs text-slate-400 font-mono">
          {filteredVideos.length} {filteredVideos.length === 1 ? 'stream' : 'streams'} available
        </span>
      </div>

      {/* Video Feed Cards Grid */}
      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center rounded-lg bg-[#161B26] border border-[#232A3B] p-8">
          <p className="text-sm font-semibold text-white">No streams match your query</p>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your category filter or search keywords.
          </p>
        </div>
      )}
    </div>
  );
};
