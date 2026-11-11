import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  Edit3, 
  Wand2, 
  Image as ImageIcon, 
  Maximize2, 
  Hash, 
  MessageSquare, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  Ratio,
  AlertCircle
} from 'lucide-react';
import { PlatformPost, PlatformType, AspectRatioType, ImageSize, ImageModel, VisualStyle } from '../types';
import { copyToClipboard, downloadImage, getAspectRatioNumeric } from '../utils/imageHelpers';
import { ASPECT_RATIOS, VISUAL_STYLES } from '../data/presets';

interface PlatformCardProps {
  post: PlatformPost;
  onUpdatePost: (updated: PlatformPost) => void;
  onRegenerateImage: (platform: PlatformType, prompt: string, ar: AspectRatioType, size: ImageSize, model: ImageModel, style: VisualStyle) => void;
  onRefineText: (platform: PlatformType, instruction: string) => void;
  isRefiningText?: boolean;
}

export const PlatformCard: React.FC<PlatformCardProps> = ({
  post,
  onUpdatePost,
  onRegenerateImage,
  onRefineText,
  isRefiningText
}) => {
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [copiedHashtags, setCopiedHashtags] = useState<boolean>(false);
  const [isEditingText, setIsEditingText] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>(post.content);
  const [refineInstruction, setRefineInstruction] = useState<string>('');
  const [showImageOptions, setShowImageOptions] = useState<boolean>(false);

  // Custom image prompt state
  const [customImagePrompt, setCustomImagePrompt] = useState<string>(post.imagePrompt);
  const [selectedAr, setSelectedAr] = useState<AspectRatioType>(post.imageAspectRatio || '16:9');
  const [selectedSize, setSelectedSize] = useState<ImageSize>(post.imageSize || '1K');
  const [selectedModel, setSelectedModel] = useState<ImageModel>(post.imageModel || 'gemini-3-pro-image-preview');
  const [selectedStyle, setSelectedStyle] = useState<VisualStyle>(post.imageStyle || 'Modern Minimalist');

  const platformMeta = {
    linkedin: {
      name: 'LinkedIn',
      badge: 'Long-Form & Thought Leadership',
      color: 'bg-blue-600',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50/70',
      borderColor: 'border-blue-200'
    },
    twitter: {
      name: 'X / Twitter',
      badge: 'Short & Punchy',
      color: 'bg-slate-900',
      textColor: 'text-slate-900',
      bgColor: 'bg-slate-100/70',
      borderColor: 'border-slate-300'
    },
    instagram: {
      name: 'Instagram',
      badge: 'Visual & Hashtag Focused',
      color: 'bg-gradient-to-r from-purple-600 to-pink-600',
      textColor: 'text-pink-700',
      bgColor: 'bg-pink-50/70',
      borderColor: 'border-pink-200'
    }
  }[post.platform];

  const handleCopyContent = async () => {
    let fullTextToCopy = post.content;

    // Append hashtags if present
    if (post.hashtags && post.hashtags.length > 0) {
      fullTextToCopy += '\n\n' + post.hashtags.join(' ');
    } else if (post.firstCommentHashtags && post.firstCommentHashtags.length > 0) {
      fullTextToCopy += '\n\n' + post.firstCommentHashtags.join(' ');
    }

    const ok = await copyToClipboard(fullTextToCopy);
    if (ok) {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  const handleCopyHashtagsOnly = async () => {
    const tags = post.hashtags?.length ? post.hashtags : post.firstCommentHashtags || [];
    if (!tags.length) return;
    const ok = await copyToClipboard(tags.join(' '));
    if (ok) {
      setCopiedHashtags(true);
      setTimeout(() => setCopiedHashtags(false), 2000);
    }
  };

  const handleSaveEdit = () => {
    onUpdatePost({
      ...post,
      content: editText
    });
    setIsEditingText(false);
  };

  const handleRegenImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegenerateImage(post.platform, customImagePrompt, selectedAr, selectedSize, selectedModel, selectedStyle);
  };

  const handleQuickRefine = (instruction: string) => {
    onRefineText(post.platform, instruction);
  };

  const charCount = post.content.length;
  const isTwitterOverLimit = post.platform === 'twitter' && !post.isThread && charCount > 280;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col h-full transition-all">
      {/* Header Banner */}
      <div className={`p-4 border-b ${platformMeta.borderColor} flex items-center justify-between ${platformMeta.bgColor}`}>
        <div className="flex items-center gap-2.5">
          <span className={`h-3 w-3 rounded-full ${platformMeta.color}`} />
          <h3 className="font-bold text-slate-900 text-sm tracking-tight">{platformMeta.name}</h3>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/80 text-slate-700 border border-slate-200 shadow-2xs">
            {platformMeta.badge}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          {post.platform === 'twitter' && post.isThread && (
            <span className="text-[10px] bg-slate-900 text-white font-bold px-2 py-0.5 rounded">
              Thread ({post.threadTweets?.length || 1} Tweets)
            </span>
          )}
          <span className={`text-xs font-semibold ${isTwitterOverLimit ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
            {charCount} chars
          </span>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-5 space-y-5 flex-1 flex flex-col">
        {/* Warning if Twitter post exceeds 280 chars */}
        {isTwitterOverLimit && (
          <div className="flex items-center gap-2 text-xs font-medium bg-red-50 text-red-700 border border-red-200 p-2.5 rounded-xl">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Exceeds 280-char single tweet limit. Click &quot;Make Shorter&quot; below or convert to Thread.</span>
          </div>
        )}

        {/* Post Text Section */}
        <div className="space-y-3 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Draft Content</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setEditText(post.content);
                  setIsEditingText(!isEditingText);
                }}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-2 py-1 rounded transition-colors"
              >
                <Edit3 className="h-3 w-3" />
                <span>{isEditingText ? 'Cancel' : 'Edit'}</span>
              </button>
            </div>
          </div>

          {isEditingText ? (
            <div className="space-y-2">
              <textarea
                rows={6}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full text-xs font-sans p-3 border border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:outline-hidden bg-slate-50 text-slate-900 leading-relaxed"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingText(false)}
                  className="px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-3 py-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs"
                >
                  Save Text
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed space-y-3">
              {/* If Twitter Thread, format each tweet cleanly */}
              {post.platform === 'twitter' && post.isThread && post.threadTweets && post.threadTweets.length > 0 ? (
                <div className="space-y-3">
                  {post.threadTweets.map((tweet, index) => (
                    <div key={index} className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                        <span>Tweet {index + 1}/{post.threadTweets?.length}</span>
                        <span>{tweet.length} / 280</span>
                      </div>
                      <p className="text-slate-900 font-sans leading-relaxed">{tweet}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-sans text-slate-900">{post.content}</p>
              )}

              {/* Call to action badge if present */}
              {post.cta && (
                <div className="pt-2 border-t border-slate-200 text-xs font-bold text-indigo-700 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                  <span>CTA: {post.cta}</span>
                </div>
              )}
            </div>
          )}

          {/* Hashtags block */}
          {((post.hashtags && post.hashtags.length > 0) || (post.firstCommentHashtags && post.firstCommentHashtags.length > 0)) && (
            <div className="flex items-center justify-between bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100 text-xs">
              <div className="flex flex-wrap gap-1 max-w-[80%]">
                {(post.hashtags || post.firstCommentHashtags || []).map((tag, i) => (
                  <span key={i} className="text-indigo-700 font-semibold text-[11px]">
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={handleCopyHashtagsOnly}
                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 underline shrink-0"
              >
                {copiedHashtags ? 'Copied!' : 'Copy Tags'}
              </button>
            </div>
          )}
        </div>

        {/* AI Quick Refine / Rewrite Bar */}
        <div className="space-y-2 pt-2 border-t border-slate-200/80">
          <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
            <Wand2 className="h-3 w-3 text-indigo-600" />
            <span>AI Quick Text Refiner:</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              'Make Punchier',
              'Shorter Hook',
              'More Emojis',
              'Professional Tone',
              'Translate to Spanish'
            ].map((preset) => (
              <button
                key={preset}
                type="button"
                disabled={isRefiningText}
                onClick={() => handleQuickRefine(preset)}
                className="text-[10px] font-semibold text-slate-700 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200/80 px-2.5 py-1 rounded-md transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <input
              type="text"
              value={refineInstruction}
              onChange={(e) => setRefineInstruction(e.target.value)}
              placeholder="e.g. Add statistics, highlight ROI..."
              className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 placeholder-slate-400"
            />
            <button
              type="button"
              disabled={isRefiningText || !refineInstruction.trim()}
              onClick={() => {
                handleQuickRefine(refineInstruction);
                setRefineInstruction('');
              }}
              className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-lg transition-colors disabled:opacity-50"
            >
              {isRefiningText ? 'Refining...' : 'Apply'}
            </button>
          </div>
        </div>

        {/* Platform Image Section with Aspect Ratio Container */}
        <div className="space-y-3 pt-3 border-t border-slate-200/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ImageIcon className="h-4 w-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-900">Visual Asset</span>
              <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200/60">
                {post.imageAspectRatio} • {post.imageSize}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowImageOptions(!showImageOptions)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
            >
              <RefreshCw className={`h-3 w-3 ${post.isGeneratingImage ? 'animate-spin' : ''}`} />
              <span>{showImageOptions ? 'Hide Image Settings' : 'Regenerate / Adjust'}</span>
            </button>
          </div>

          {/* Render Generated Image or Loading Skeleton */}
          <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group">
            {post.isGeneratingImage ? (
              <div className="w-full py-16 flex flex-col items-center justify-center space-y-3 bg-slate-900/5 backdrop-blur-xs">
                <Sparkles className="h-8 w-8 text-indigo-600 animate-spin" />
                <span className="text-xs font-semibold text-slate-700">Generating {post.imageAspectRatio} Image...</span>
              </div>
            ) : post.imageUrl ? (
              <div className="relative w-full flex items-center justify-center bg-slate-950">
                <img
                  src={post.imageUrl}
                  alt={post.imagePrompt || `${post.platform} Visual`}
                  className="w-full h-auto object-contain max-h-[380px] rounded-lg shadow-inner"
                />

                {/* Overlay Download Button */}
                <div className="absolute bottom-2.5 right-2.5 flex items-center gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => downloadImage(post.imageUrl!, `${post.platform}_social_visual.jpg`)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 bg-white/95 hover:bg-white px-3 py-1.5 rounded-lg shadow-md border border-slate-200"
                  >
                    <Download className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Download {post.imageAspectRatio} Asset</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">
                No visual generated yet.
              </div>
            )}
          </div>

          {/* Regenerate Image Settings Accordion */}
          {showImageOptions && (
            <form onSubmit={handleRegenImageSubmit} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3 animate-fadeIn">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Custom Visual Prompt:</label>
                <textarea
                  rows={2}
                  value={customImagePrompt}
                  onChange={(e) => setCustomImagePrompt(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-600">Aspect Ratio:</label>
                  <select
                    value={selectedAr}
                    onChange={(e) => setSelectedAr(e.target.value as AspectRatioType)}
                    className="w-full text-xs bg-white border border-slate-200 rounded p-1 text-slate-800 font-semibold"
                  >
                    {ASPECT_RATIOS.map((ar) => (
                      <option key={ar.value} value={ar.value}>{ar.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600">Resolution Size:</label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value as ImageSize)}
                    className="w-full text-xs bg-white border border-slate-200 rounded p-1 text-slate-800 font-semibold"
                  >
                    <option value="1K">1K (Standard)</option>
                    <option value="2K">2K (HD Detail)</option>
                    <option value="4K">4K (Studio Ultra)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-600">Model:</label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value as ImageModel)}
                    className="w-full text-xs bg-white border border-slate-200 rounded p-1 text-slate-800 font-semibold"
                  >
                    <option value="gemini-3-pro-image-preview">gemini-3-pro-image-preview</option>
                    <option value="gemini-3.1-flash-image-preview">gemini-3.1-flash-image-preview</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600">Style:</label>
                  <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value as VisualStyle)}
                    className="w-full text-xs bg-white border border-slate-200 rounded p-1 text-slate-800 font-semibold"
                  >
                    {VISUAL_STYLES.map((st) => (
                      <option key={st.label} value={st.label}>{st.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={post.isGeneratingImage}
                className="w-full py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs flex items-center justify-center gap-1.5"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${post.isGeneratingImage ? 'animate-spin' : ''}`} />
                <span>Re-generate Visual Asset</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleCopyContent}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            {copiedText ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-slate-300" />
                <span>Copy Post Text &amp; Tags</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
