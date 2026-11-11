import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  SlidersHorizontal, 
  Image as ImageIcon, 
  Zap, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  HelpCircle,
  Briefcase,
  Smile,
  BookOpen,
  Flame,
  MessageCircle,
  Award,
  Layers,
  Ratio,
  Maximize2
} from 'lucide-react';
import { 
  ToneType, 
  ImageSize, 
  ImageModel, 
  VisualStyle, 
  AspectRatioType, 
  GenerationRequest, 
  BrandProfile 
} from '../types';
import { TONE_OPTIONS, VISUAL_STYLES, ASPECT_RATIOS, STARTER_IDEAS } from '../data/presets';

interface IdeaInputProps {
  onGenerate: (req: GenerationRequest) => void;
  isGenerating: boolean;
  activeBrand: BrandProfile;
}

export const IdeaInput: React.FC<IdeaInputProps> = ({
  onGenerate,
  isGenerating,
  activeBrand
}) => {
  const [idea, setIdea] = useState<string>('');
  const [selectedTone, setSelectedTone] = useState<ToneType>('Professional & Insightful');
  const [brandVoice, setBrandVoice] = useState<string>(activeBrand.brandVoice);
  const [targetAudience, setTargetAudience] = useState<string>(activeBrand.targetAudience);
  const [textModel, setTextModel] = useState<'flash' | 'pro'>('flash');

  // Image Settings
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  const [imageModel, setImageModel] = useState<ImageModel>('gemini-3-pro-image-preview');
  const [imageStyle, setImageStyle] = useState<VisualStyle>('Modern Minimalist');
  const [aspectRatios, setAspectRatios] = useState<{
    linkedin: AspectRatioType;
    twitter: AspectRatioType;
    instagram: AspectRatioType;
  }>({
    linkedin: '16:9',
    twitter: '16:9',
    instagram: '1:1'
  });

  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [isSuggestingIdeas, setIsSuggestingIdeas] = useState<boolean>(false);
  const [suggestedIdeas, setSuggestedIdeas] = useState<string[]>([]);

  // Update brand voice when activeBrand changes
  React.useEffect(() => {
    setBrandVoice(activeBrand.brandVoice);
    setTargetAudience(activeBrand.targetAudience);
  }, [activeBrand]);

  const handleFetchIdeas = async () => {
    setIsSuggestingIdeas(true);
    try {
      const res = await fetch('/api/suggest-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche: activeBrand.name })
      });
      const data = await res.json();
      if (data.ideas && Array.isArray(data.ideas)) {
        setSuggestedIdeas(data.ideas);
      }
    } catch (err) {
      console.error('Failed to get topic ideas:', err);
    } finally {
      setIsSuggestingIdeas(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim() || isGenerating) return;

    onGenerate({
      idea: idea.trim(),
      tone: selectedTone,
      brandVoice,
      targetAudience,
      textModel,
      imageSize,
      imageModel,
      imageStyle,
      platformAspectRatios: aspectRatios
    });
  };

  const renderToneIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase': return <Briefcase className="h-4 w-4" />;
      case 'Smile': return <Smile className="h-4 w-4" />;
      case 'Zap': return <Zap className="h-4 w-4" />;
      case 'BookOpen': return <BookOpen className="h-4 w-4" />;
      case 'Sparkles': return <Sparkles className="h-4 w-4" />;
      case 'Flame': return <Flame className="h-4 w-4" />;
      case 'MessageCircle': return <MessageCircle className="h-4 w-4" />;
      case 'Award': return <Award className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-7 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Idea Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="core-idea-input" className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold">1</span>
              <span>What is your core idea or message?</span>
            </label>

            <button
              type="button"
              onClick={handleFetchIdeas}
              disabled={isSuggestingIdeas}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 px-2.5 py-1 rounded-lg transition-colors border border-indigo-200/60"
            >
              <Wand2 className={`h-3.5 w-3.5 ${isSuggestingIdeas ? 'animate-spin' : ''}`} />
              <span>{isSuggestingIdeas ? 'Generating Ideas...' : 'AI Topic Suggestions'}</span>
            </button>
          </div>

          <div className="relative">
            <textarea
              id="core-idea-input"
              rows={3}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g. Launching an AI productivity assistant that automatically categorizes meetings and drafts action items for remote teams..."
              className="w-full rounded-xl border border-slate-300 p-3.5 text-slate-900 text-sm placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-hidden transition-all shadow-2xs resize-y"
              required
            />
          </div>

          {/* Suggested Ideas / Topic Starters */}
          {suggestedIdeas.length > 0 ? (
            <div className="space-y-2 pt-1 animate-fadeIn">
              <span className="text-xs font-semibold text-indigo-900">AI Suggested Topics:</span>
              <div className="flex flex-wrap gap-2">
                {suggestedIdeas.map((suggested, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setIdea(suggested)}
                    className="text-xs text-slate-700 bg-indigo-50/70 hover:bg-indigo-100/80 border border-indigo-200/60 px-3 py-1.5 rounded-lg text-left transition-colors max-w-full truncate"
                  >
                    💡 {suggested}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-medium text-slate-500">Quick Starters:</span>
              {STARTER_IDEAS.slice(0, 3).map((starter, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIdea(starter)}
                  className="text-xs font-medium text-slate-600 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200/80 px-2.5 py-1 rounded-md transition-all text-left max-w-xs truncate"
                >
                  {starter}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tone Selector Section */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-900 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold">2</span>
              <span>Desired Tone &amp; Communication Style</span>
            </span>
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              Selected: {selectedTone}
            </span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {TONE_OPTIONS.map((t) => {
              const isSelected = selectedTone === t.label;
              return (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => setSelectedTone(t.label)}
                  className={`flex flex-col text-left p-3 rounded-xl border transition-all text-xs relative ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/20'
                      : 'bg-slate-50/70 hover:bg-slate-100/80 text-slate-800 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`p-1 rounded-md ${isSelected ? 'bg-white/20 text-white' : 'bg-white text-slate-700 shadow-2xs'}`}>
                      {renderToneIcon(t.iconName)}
                    </span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-600'
                    }`}>
                      {t.badge}
                    </span>
                  </div>
                  <span className="font-bold text-xs mt-1 leading-tight">{t.label}</span>
                  <p className={`text-[11px] mt-1 line-clamp-2 leading-snug ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                    {t.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Platform Image Configurations (Core Prompt Requirement: Aspect Ratios, 1K/2K/4K Size, Image Models) */}
        <div className="bg-slate-50/80 rounded-xl border border-slate-200/80 p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                <ImageIcon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Visual Asset &amp; Image Settings</h3>
                <p className="text-xs text-slate-500">Configure image models, resolution, and platform aspect ratios</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Image Quality / Resolution (1K, 2K, 4K) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Maximize2 className="h-3.5 w-3.5 text-indigo-600" />
                <span>Image Resolution Quality</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-white rounded-lg border border-slate-200">
                {(['1K', '2K', '4K'] as ImageSize[]).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setImageSize(sz)}
                    className={`py-1.5 text-xs font-bold rounded-md transition-colors ${
                      imageSize === sz
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500">
                {imageSize === '1K' && 'Standard 1024px social media graphic.'}
                {imageSize === '2K' && 'High definition 2048px crisp details.'}
                {imageSize === '4K' && 'Studio ultra quality 4K cinematic asset.'}
              </p>
            </div>

            {/* Image Model Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-indigo-600" />
                <span>Image Generation Model</span>
              </label>
              <select
                value={imageModel}
                onChange={(e) => setImageModel(e.target.value as ImageModel)}
                className="w-full text-xs font-medium bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-indigo-200 focus:outline-hidden"
              >
                <option value="gemini-3-pro-image-preview">gemini-3-pro-image-preview (Studio Quality)</option>
                <option value="gemini-3.1-flash-image-preview">gemini-3.1-flash-image-preview (Fast Speed)</option>
              </select>
              <p className="text-[11px] text-slate-500">
                {imageModel === 'gemini-3-pro-image-preview' ? 'Highest fidelity photorealism & layout design.' : 'Faster image rendering for rapid drafting.'}
              </p>
            </div>

            {/* Visual Style Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                <span>Aesthetic Style</span>
              </label>
              <select
                value={imageStyle}
                onChange={(e) => setImageStyle(e.target.value as VisualStyle)}
                className="w-full text-xs font-medium bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-indigo-200 focus:outline-hidden"
              >
                {VISUAL_STYLES.map((st) => (
                  <option key={st.label} value={st.label}>
                    {st.label}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 truncate">
                {VISUAL_STYLES.find(s => s.label === imageStyle)?.description}
              </p>
            </div>
          </div>

          {/* Aspect Ratios Selector Per Platform */}
          <div className="pt-2 border-t border-slate-200/80 space-y-3">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Ratio className="h-3.5 w-3.5 text-indigo-600" />
              <span>Tailored Platform Aspect Ratios</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* LinkedIn Aspect Ratio */}
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-800">LinkedIn</span>
                  <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                    Default 16:9
                  </span>
                </div>
                <select
                  value={aspectRatios.linkedin}
                  onChange={(e) => setAspectRatios(prev => ({ ...prev, linkedin: e.target.value as AspectRatioType }))}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded p-1.5 font-semibold text-slate-800"
                >
                  {ASPECT_RATIOS.map((ar) => (
                    <option key={ar.value} value={ar.value}>
                      {ar.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Twitter Aspect Ratio */}
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">X / Twitter</span>
                  <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                    Default 16:9
                  </span>
                </div>
                <select
                  value={aspectRatios.twitter}
                  onChange={(e) => setAspectRatios(prev => ({ ...prev, twitter: e.target.value as AspectRatioType }))}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded p-1.5 font-semibold text-slate-800"
                >
                  {ASPECT_RATIOS.map((ar) => (
                    <option key={ar.value} value={ar.value}>
                      {ar.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Instagram Aspect Ratio */}
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-pink-700">Instagram</span>
                  <span className="text-[10px] font-semibold text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded">
                    Default 1:1
                  </span>
                </div>
                <select
                  value={aspectRatios.instagram}
                  onChange={(e) => setAspectRatios(prev => ({ ...prev, instagram: e.target.value as AspectRatioType }))}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded p-1.5 font-semibold text-slate-800"
                >
                  {ASPECT_RATIOS.map((ar) => (
                    <option key={ar.value} value={ar.value}>
                      {ar.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Accordion Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-600" />
            <span>{showAdvanced ? 'Hide Brand Context & Model Options' : 'Brand Voice Context & Text Model Options'}</span>
            {showAdvanced ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          {showAdvanced && (
            <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Brand Voice / Persona Style</label>
                  <input
                    type="text"
                    value={brandVoice}
                    onChange={(e) => setBrandVoice(e.target.value)}
                    placeholder="e.g. Authoritative, technical, founder-led..."
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Target Audience Focus</label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g. B2B decision makers, software architects..."
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800 bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Text Generation Engine</label>
                <div className="flex gap-3">
                  <label className={`flex-1 flex items-center justify-between p-2.5 rounded-lg border cursor-pointer text-xs ${
                    textModel === 'flash' ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold' : 'bg-white border-slate-200 text-slate-700'
                  }`}>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="textModel"
                        value="flash"
                        checked={textModel === 'flash'}
                        onChange={() => setTextModel('flash')}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>gemini-3.5-flash (Fast)</span>
                    </div>
                    <span className="text-[10px] text-indigo-600 bg-white px-1.5 py-0.5 rounded border">Recommended</span>
                  </label>

                  <label className={`flex-1 flex items-center justify-between p-2.5 rounded-lg border cursor-pointer text-xs ${
                    textModel === 'pro' ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold' : 'bg-white border-slate-200 text-slate-700'
                  }`}>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="textModel"
                        value="pro"
                        checked={textModel === 'pro'}
                        onChange={() => setTextModel('pro')}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>gemini-3.1-pro-preview (Deep Thought)</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Action Button */}
        <div>
          <button
            type="submit"
            disabled={isGenerating || !idea.trim()}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white shadow-md flex items-center justify-center gap-2.5 transition-all ${
              isGenerating || !idea.trim()
                ? 'bg-slate-300 cursor-not-allowed opacity-70 shadow-none'
                : 'bg-gradient-to-r from-indigo-600 via-indigo-600 to-sky-500 hover:from-indigo-700 hover:to-sky-600 shadow-indigo-500/20 active:scale-[0.99]'
            }`}
          >
            {isGenerating ? (
              <>
                <Sparkles className="h-5 w-5 animate-spin" />
                <span>Simultaneously Generating LinkedIn, X &amp; Instagram Posts + Visuals...</span>
              </>
            ) : (
              <>
                <Layers className="h-5 w-5" />
                <span>Simultaneously Generate Posts &amp; Platform Images</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
