import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { SearchIcon, HomeIcon } from '../common/Icons';

export const NotFoundView: React.FC = () => {
  const { setRoute, setSearchQuery } = usePlayer();
  const [localSearch, setLocalSearch] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      setRoute('home');
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-6 sm:p-12 text-center max-w-xl mx-auto select-none">
      {/* 404 Broadcast Error Emblem */}
      <div className="w-20 h-20 rounded-xl bg-[#161B26] border border-[#232A3B] flex items-center justify-center mb-6 shadow-solid">
        <span className="text-3xl font-extrabold font-mono text-[#E50914] tracking-tight">
          404
        </span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
        Broadcast Signal Not Found
      </h1>

      <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
        The video stream, channel directory, or broadcast endpoint you requested does not exist or has
        been relocated.
      </p>

      {/* Quick Search Recovery */}
      <form onSubmit={handleSearch} className="w-full mt-6 flex items-center">
        <div className="relative flex-1">
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search by stream name or keyword..."
            className="w-full h-10 pl-9 pr-3 rounded-l bg-[#161B26] border border-[#232A3B] focus:border-[#E50914] focus:outline-none text-xs text-white placeholder-slate-500"
          />
          <div className="absolute left-3 top-3 text-slate-500 pointer-events-none">
            <SearchIcon size={14} />
          </div>
        </div>
        <button
          type="submit"
          className="h-10 px-4 rounded-r bg-[#1D2332] border border-l-0 border-[#232A3B] hover:bg-[#232A3B] text-xs font-semibold text-white transition-colors"
        >
          Search
        </button>
      </form>

      {/* Return Home Button */}
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={() => {
            setSearchQuery('');
            setRoute('home');
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded bg-[#E50914] hover:bg-[#F41E2A] text-white text-xs font-bold transition-colors shadow-solid"
        >
          <HomeIcon size={16} />
          <span>Return to Studio Feed</span>
        </button>

        <button
          onClick={() => setRoute('trending')}
          className="px-4 py-2.5 rounded bg-[#161B26] border border-[#232A3B] hover:bg-[#1D2332] text-white text-xs font-semibold transition-colors"
        >
          Explore Trending
        </button>
      </div>

      <div className="mt-8 text-[11px] font-mono text-slate-500">
        Status Code: HTTP 404 • Signal Error: Stream Missing
      </div>
    </div>
  );
};
