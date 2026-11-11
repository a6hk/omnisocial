import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Repeat, 
  Send, 
  Bookmark, 
  MoreHorizontal, 
  ThumbsUp, 
  Share2, 
  Globe, 
  CheckCircle2,
  Sparkles,
  Eye
} from 'lucide-react';
import { PlatformPost, BrandProfile } from '../types';

interface PlatformMockupProps {
  post: PlatformPost;
  brand: BrandProfile;
}

export const PlatformMockup: React.FC<PlatformMockupProps> = ({ post, brand }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(142);

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => (liked ? prev - 1 : prev + 1));
  };

  if (post.platform === 'linkedin') {
    return (
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm max-w-xl mx-auto overflow-hidden text-slate-900 font-sans">
        {/* Header */}
        <div className="p-4 flex items-start justify-between">
          <div className="flex gap-3">
            <img
              src={brand.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={brand.name}
              className="h-12 w-12 rounded-full object-cover border border-slate-200"
            />
            <div>
              <div className="flex items-center gap-1 font-bold text-sm text-slate-900">
                <span>{brand.name}</span>
                <span className="text-xs text-slate-400">• 1st</span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">{brand.brandVoice || 'Founder & Industry Leader'}</p>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                <span>2h •</span>
                <Globe className="h-3 w-3" />
              </div>
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-600">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 pb-3 text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
          <p>{post.content}</p>
          {post.hashtags && post.hashtags.length > 0 && (
            <p className="text-blue-700 font-medium mt-2">
              {post.hashtags.map(t => (t.startsWith('#') ? t : `#${t}`)).join(' ')}
            </p>
          )}
        </div>

        {/* Image */}
        {post.imageUrl && (
          <div className="w-full bg-slate-100 border-y border-slate-200 overflow-hidden">
            <img src={post.imageUrl} alt="LinkedIn Post Asset" className="w-full h-auto object-cover max-h-[450px]" />
          </div>
        )}

        {/* Stats */}
        <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <span className="h-4 w-4 rounded-full bg-blue-600 flex items-center justify-center text-white text-[9px]">
              👍
            </span>
            <span>{likeCount} reactions</span>
          </div>
          <div>28 comments • 12 reposts</div>
        </div>

        {/* Action Buttons */}
        <div className="px-2 py-1 flex items-center justify-around text-xs font-semibold text-slate-600">
          <button onClick={toggleLike} className={`flex items-center gap-1.5 px-3 py-2 rounded hover:bg-slate-100 ${liked ? 'text-blue-600' : ''}`}>
            <ThumbsUp className="h-4 w-4" />
            <span>Like</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded hover:bg-slate-100">
            <MessageCircle className="h-4 w-4" />
            <span>Comment</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded hover:bg-slate-100">
            <Repeat className="h-4 w-4" />
            <span>Repost</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded hover:bg-slate-100">
            <Send className="h-4 w-4" />
            <span>Send</span>
          </button>
        </div>
      </div>
    );
  }

  if (post.platform === 'twitter') {
    return (
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm max-w-xl mx-auto overflow-hidden text-slate-900 font-sans p-4 space-y-3">
        {/* Author Header */}
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <img
              src={brand.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={brand.name}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-sm text-slate-900">{brand.name}</span>
                <CheckCircle2 className="h-3.5 w-3.5 text-sky-500 fill-sky-500" />
                <span className="text-xs text-slate-500">{brand.handle} • 1h</span>
              </div>
            </div>
          </div>
          <button className="text-slate-400">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Post text */}
        <div className="text-xs sm:text-sm text-slate-900 whitespace-pre-wrap leading-relaxed pl-13">
          <p>{post.content}</p>
          {post.hashtags && post.hashtags.length > 0 && (
            <p className="text-sky-600 font-medium mt-1">
              {post.hashtags.map(t => (t.startsWith('#') ? t : `#${t}`)).join(' ')}
            </p>
          )}

          {/* Attached Image */}
          {post.imageUrl && (
            <div className="mt-3 rounded-2xl overflow-hidden border border-slate-200">
              <img src={post.imageUrl} alt="X Asset" className="w-full h-auto object-cover max-h-[350px]" />
            </div>
          )}

          {/* Tweet Actions */}
          <div className="flex items-center justify-between text-slate-500 text-xs mt-3 pt-2 max-w-md">
            <button className="flex items-center gap-1.5 hover:text-sky-500">
              <MessageCircle className="h-4 w-4" />
              <span>42</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-emerald-500">
              <Repeat className="h-4 w-4" />
              <span>18</span>
            </button>
            <button onClick={toggleLike} className={`flex items-center gap-1.5 hover:text-pink-500 ${liked ? 'text-pink-600' : ''}`}>
              <Heart className={`h-4 w-4 ${liked ? 'fill-pink-600' : ''}`} />
              <span>{likeCount}</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-sky-500">
              <Eye className="h-4 w-4" />
              <span>12.4K</span>
            </button>
            <button className="hover:text-slate-700">
              <Bookmark className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Instagram Phone Mockup
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md max-w-md mx-auto overflow-hidden text-slate-900 font-sans">
      {/* Instagram Post Header */}
      <div className="p-3.5 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-rose-500 to-purple-600">
            <img
              src={brand.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={brand.name}
              className="h-8 w-8 rounded-full object-cover border-2 border-white"
            />
          </div>
          <div>
            <span className="font-bold text-xs text-slate-900 block leading-tight">{brand.handle.replace('@', '')}</span>
            <span className="text-[10px] text-slate-400">Original Content</span>
          </div>
        </div>
        <MoreHorizontal className="h-4 w-4 text-slate-500" />
      </div>

      {/* Main Image */}
      {post.imageUrl ? (
        <div className="w-full bg-slate-950 flex items-center justify-center">
          <img src={post.imageUrl} alt="Instagram Post" className="w-full h-auto object-cover max-h-[480px]" />
        </div>
      ) : (
        <div className="h-64 bg-slate-100 flex items-center justify-center text-xs text-slate-400">
          No Visual
        </div>
      )}

      {/* Action Bar */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={toggleLike}>
              <Heart className={`h-5 w-5 ${liked ? 'text-rose-500 fill-rose-500' : 'text-slate-800'}`} />
            </button>
            <MessageCircle className="h-5 w-5 text-slate-800" />
            <Send className="h-5 w-5 text-slate-800" />
          </div>
          <Bookmark className="h-5 w-5 text-slate-800" />
        </div>

        {/* Likes count */}
        <p className="text-xs font-bold text-slate-900">{likeCount} likes</p>

        {/* Caption */}
        <div className="text-xs text-slate-800 space-y-1">
          <p>
            <span className="font-bold mr-1.5">{brand.handle.replace('@', '')}</span>
            {post.content}
          </p>

          {post.firstCommentHashtags && post.firstCommentHashtags.length > 0 && (
            <p className="text-blue-800 font-medium pt-1">
              {post.firstCommentHashtags.map((t: string) => (t.startsWith('#') ? t : `#${t}`)).join(' ')}
            </p>
          )}
        </div>

        <p className="text-[10px] text-slate-400 uppercase pt-1">2 hours ago</p>
      </div>
    </div>
  );
};
