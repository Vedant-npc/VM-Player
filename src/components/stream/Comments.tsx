import React, { useState } from 'react';
import type { CommentItem } from '../../types/media';
import { INITIAL_COMMENTS } from '../../data/mockVideos';
import { useToast } from '../../context/ToastContext';
import { LikeIcon } from '../common/Icons';

interface CommentsProps {
  videoId: string;
}

export const Comments: React.FC<CommentsProps> = ({ videoId }) => {
  const { showSuccess, showError } = useToast();

  const [commentList, setCommentList] = useState<CommentItem[]>(() => {
    return (
      INITIAL_COMMENTS[videoId] || [
        {
          id: `init-${videoId}`,
          author: 'Alex Mercer',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
          content: 'Clean video decoding in VM Player. The 10s backward seek (J key) is instantaneous without buffer stall.',
          timestamp: '1 day ago',
          likes: 24,
          isLiked: false,
        },
      ]
    );
  });

  const [newCommentText, setNewCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCommentText.trim();
    if (!trimmed) {
      showError('Comment text cannot be empty');
      return;
    }

    const newComment: CommentItem = {
      id: `comment-${Date.now()}`,
      author: authorName.trim() || 'Broadcast Member',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=faces',
      content: trimmed,
      timestamp: 'Just now',
      likes: 0,
      isLiked: false,
    };

    setCommentList((prev) => [newComment, ...prev]);
    setNewCommentText('');
    showSuccess('Your comment has been posted to this broadcast');
  };

  const handleLike = (id: string) => {
    setCommentList((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextLiked = !c.isLiked;
          return {
            ...c,
            isLiked: nextLiked,
            likes: nextLiked ? c.likes + 1 : Math.max(0, c.likes - 1),
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="w-full mt-8 pt-6 border-t border-[#232A3B]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-white tracking-tight">
          Broadcast Discussion ({commentList.length})
        </h3>
        <span className="text-xs text-slate-400 font-mono">Real-time Feed</span>
      </div>

      {/* New Comment Submission Form */}
      <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-3">
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full bg-[#1D2332] border border-[#232A3B] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            BM
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Your handle or callsign (e.g. CinemaMaster)..."
              className="w-full h-8 px-3 rounded bg-[#161B26] border border-[#232A3B] focus:border-[#E50914] focus:outline-none text-xs text-white placeholder-slate-500"
            />
            <textarea
              rows={2}
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Share your thoughts on this stream or player playback..."
              className="w-full p-3 rounded bg-[#161B26] border border-[#232A3B] focus:border-[#E50914] focus:outline-none text-xs text-white placeholder-slate-500 resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          {newCommentText && (
            <button
              type="button"
              onClick={() => setNewCommentText('')}
              className="px-3 py-1.5 rounded text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-1.5 rounded bg-[#E50914] hover:bg-[#F41E2A] text-xs font-bold text-white transition-colors"
          >
            Post Comment
          </button>
        </div>
      </form>

      {/* Existing Comments List */}
      <div className="flex flex-col gap-4">
        {commentList.map((item) => (
          <div key={item.id} className="flex items-start gap-3 text-xs">
            <img
              src={item.avatar}
              alt={item.author}
              className="w-8 h-8 rounded-full object-cover border border-[#232A3B] flex-shrink-0"
            />
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">{item.author}</span>
                <span className="text-[11px] text-slate-400 font-mono">{item.timestamp}</span>
              </div>
              <p className="mt-1 text-slate-200 leading-relaxed">{item.content}</p>
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => handleLike(item.id)}
                  className={`flex items-center gap-1.5 text-[11px] font-semibold transition-colors ${
                    item.isLiked ? 'text-[#E50914]' : 'text-slate-400 hover:text-white'
                  }`}
                  aria-label="Like comment"
                >
                  <LikeIcon size={12} filled={item.isLiked} />
                  <span>{item.likes}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
