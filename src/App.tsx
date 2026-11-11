import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { IdeaInput } from './components/IdeaInput';
import { PlatformCard } from './components/PlatformCard';
import { PlatformMockup } from './components/PlatformMockup';
import { CampaignHistoryModal } from './components/CampaignHistoryModal';
import { BrandPersonaModal } from './components/BrandPersonaModal';
import { ExportModal } from './components/ExportModal';
import { 
  Campaign, 
  BrandProfile, 
  GenerationRequest, 
  PlatformPost, 
  PlatformType, 
  AspectRatioType, 
  ImageSize, 
  ImageModel, 
  VisualStyle 
} from './types';
import { DEFAULT_BRAND_PROFILES } from './data/presets';
import { generateSvgFallbackImage } from './utils/imageHelpers';
import { Sparkles, Layers, Grid, Eye, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // Brand Profile State
  const [activeBrand, setActiveBrand] = useState<BrandProfile>(() => {
    const saved = localStorage.getItem('omnisocial_active_brand');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return DEFAULT_BRAND_PROFILES[0];
  });

  // Saved Campaigns State
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem('omnisocial_campaign_history');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [];
  });

  // Current Active Campaign
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);

  // Loading & Progress States
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStage, setGenerationStage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Refine Status per Platform
  const [isRefiningMap, setIsRefiningMap] = useState<Record<string, boolean>>({});

  // Active View Tab: 'grid' | 'linkedin' | 'twitter' | 'instagram' | 'mockup'
  const [activeTab, setActiveTab] = useState<'grid' | 'linkedin' | 'twitter' | 'instagram' | 'mockup'>('grid');

  // Modals
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Save campaigns to localStorage
  useEffect(() => {
    localStorage.setItem('omnisocial_campaign_history', JSON.stringify(campaigns));
  }, [campaigns]);

  // Save active brand to localStorage
  useEffect(() => {
    localStorage.setItem('omnisocial_active_brand', JSON.stringify(activeBrand));
  }, [activeBrand]);

  // 1. Core Simultaneous Generation Handler
  const handleGenerateContent = async (req: GenerationRequest) => {
    setIsGenerating(true);
    setErrorMessage(null);
    setGenerationStage('Drafting tailored posts for LinkedIn, X & Instagram...');

    try {
      // Step A: Call /api/generate for simultaneous post drafting
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: req.idea,
          tone: req.tone,
          brandVoice: req.brandVoice,
          targetAudience: req.targetAudience,
          modelChoice: req.textModel
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate social media content.');
      }

      const generatedData = data.data;

      // Construct initial campaign object with SVG placeholders
      const campaignId = `campaign-${Date.now()}`;
      const newCampaign: Campaign = {
        id: campaignId,
        createdAt: new Date().toISOString(),
        title: req.idea.length > 50 ? req.idea.substring(0, 50) + '...' : req.idea,
        idea: req.idea,
        tone: req.tone,
        brandVoice: req.brandVoice,
        posts: {
          linkedin: {
            platform: 'linkedin',
            content: generatedData.linkedin?.content || '',
            hashtags: generatedData.linkedin?.hashtags || [],
            cta: generatedData.linkedin?.cta,
            imagePrompt: generatedData.linkedin?.imagePrompt || req.idea,
            imageUrl: generateSvgFallbackImage(req.idea, 'linkedin', req.platformAspectRatios.linkedin),
            imageAspectRatio: req.platformAspectRatios.linkedin,
            imageSize: req.imageSize,
            imageModel: req.imageModel,
            imageStyle: req.imageStyle,
            isGeneratingImage: true
          },
          twitter: {
            platform: 'twitter',
            content: generatedData.twitter?.content || '',
            isThread: generatedData.twitter?.isThread,
            threadTweets: generatedData.twitter?.threadTweets,
            hashtags: generatedData.twitter?.hashtags || [],
            imagePrompt: generatedData.twitter?.imagePrompt || req.idea,
            imageUrl: generateSvgFallbackImage(req.idea, 'twitter', req.platformAspectRatios.twitter),
            imageAspectRatio: req.platformAspectRatios.twitter,
            imageSize: req.imageSize,
            imageModel: req.imageModel,
            imageStyle: req.imageStyle,
            isGeneratingImage: true
          },
          instagram: {
            platform: 'instagram',
            content: generatedData.instagram?.content || '',
            hashtags: generatedData.instagram?.firstCommentHashtags || [],
            firstCommentHashtags: generatedData.instagram?.firstCommentHashtags || [],
            imagePrompt: generatedData.instagram?.imagePrompt || req.idea,
            visualConcept: generatedData.instagram?.visualConcept,
            imageUrl: generateSvgFallbackImage(req.idea, 'instagram', req.platformAspectRatios.instagram),
            imageAspectRatio: req.platformAspectRatios.instagram,
            imageSize: req.imageSize,
            imageModel: req.imageModel,
            imageStyle: req.imageStyle,
            isGeneratingImage: true
          }
        }
      };

      setCurrentCampaign(newCampaign);
      setIsGenerating(false);

      // Step B: Trigger concurrent image generation for all 3 platforms
      generatePlatformImagesConcurrently(newCampaign, req);

    } catch (err: any) {
      console.error('Error during generation:', err);
      setErrorMessage(err?.message || 'Failed to generate posts. Please try again.');
      setIsGenerating(false);
    }
  };

  // Helper to generate platform images concurrently
  const generatePlatformImagesConcurrently = async (campaign: Campaign, req: GenerationRequest) => {
    const platforms: PlatformType[] = ['linkedin', 'twitter', 'instagram'];

    platforms.forEach(async (platform) => {
      const post = campaign.posts[platform];
      try {
        const imgRes = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: post.imagePrompt,
            aspectRatio: post.imageAspectRatio,
            size: post.imageSize,
            model: post.imageModel,
            style: post.imageStyle
          })
        });

        const imgData = await imgRes.json();
        if (imgRes.ok && imgData.success && imgData.imageUrl) {
          setCurrentCampaign(prev => {
            if (!prev) return prev;
            const updated = {
              ...prev,
              posts: {
                ...prev.posts,
                [platform]: {
                  ...prev.posts[platform],
                  imageUrl: imgData.imageUrl,
                  isGeneratingImage: false
                }
              }
            };

            // Save completed campaign to history
            saveOrUpdateCampaignHistory(updated);
            return updated;
          });
        } else {
          // Keep SVG fallback on error
          setCurrentCampaign(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              posts: {
                ...prev.posts,
                [platform]: {
                  ...prev.posts[platform],
                  isGeneratingImage: false
                }
              }
            };
          });
        }
      } catch (err) {
        console.error(`Image generation failed for ${platform}:`, err);
        setCurrentCampaign(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            posts: {
              ...prev.posts,
              [platform]: {
                ...prev.posts[platform],
                isGeneratingImage: false
              }
            }
          };
        });
      }
    });
  };

  // Save or update campaign in history list
  const saveOrUpdateCampaignHistory = (camp: Campaign) => {
    setCampaigns(prev => {
      const idx = prev.findIndex(c => c.id === camp.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = camp;
        return copy;
      }
      return [camp, ...prev];
    });
  };

  // 2. Single Platform Image Regeneration
  const handleRegenerateImage = async (
    platform: PlatformType,
    prompt: string,
    ar: AspectRatioType,
    size: ImageSize,
    model: ImageModel,
    style: VisualStyle
  ) => {
    if (!currentCampaign) return;

    // Set loading indicator for image
    setCurrentCampaign(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        posts: {
          ...prev.posts,
          [platform]: {
            ...prev.posts[platform],
            imagePrompt: prompt,
            imageAspectRatio: ar,
            imageSize: size,
            imageModel: model,
            imageStyle: style,
            isGeneratingImage: true
          }
        }
      };
    });

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspectRatio: ar, size, model, style })
      });

      const data = await res.json();
      if (res.ok && data.success && data.imageUrl) {
        setCurrentCampaign(prev => {
          if (!prev) return prev;
          const updated = {
            ...prev,
            posts: {
              ...prev.posts,
              [platform]: {
                ...prev.posts[platform],
                imageUrl: data.imageUrl,
                isGeneratingImage: false
              }
            }
          };
          saveOrUpdateCampaignHistory(updated);
          return updated;
        });
      } else {
        throw new Error(data.error || 'Failed to generate image.');
      }
    } catch (err: any) {
      console.error(`Regenerate image failed for ${platform}:`, err);
      setCurrentCampaign(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          posts: {
            ...prev.posts,
            [platform]: {
              ...prev.posts[platform],
              isGeneratingImage: false
            }
          }
        };
      });
    }
  };

  // 3. Single Post Text Refine
  const handleRefineText = async (platform: PlatformType, instruction: string) => {
    if (!currentCampaign) return;

    setIsRefiningMap(prev => ({ ...prev, [platform]: true }));

    try {
      const currentPost = currentCampaign.posts[platform];
      const res = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          currentContent: currentPost.content,
          instruction
        })
      });

      const data = await res.json();
      if (res.ok && data.success && data.refinedContent) {
        setCurrentCampaign(prev => {
          if (!prev) return prev;
          const updated = {
            ...prev,
            posts: {
              ...prev.posts,
              [platform]: {
                ...prev.posts[platform],
                content: data.refinedContent
              }
            }
          };
          saveOrUpdateCampaignHistory(updated);
          return updated;
        });
      }
    } catch (err) {
      console.error(`Refine text failed for ${platform}:`, err);
    } finally {
      setIsRefiningMap(prev => ({ ...prev, [platform]: false }));
    }
  };

  // Update post manually
  const handleUpdatePost = (updatedPost: PlatformPost) => {
    if (!currentCampaign) return;
    setCurrentCampaign(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        posts: {
          ...prev.posts,
          [updatedPost.platform]: updatedPost
        }
      };
      saveOrUpdateCampaignHistory(updated);
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col">
      {/* Header */}
      <Header
        activeBrand={activeBrand}
        onOpenBrandModal={() => setIsBrandModalOpen(true)}
        onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onNewCampaign={() => setCurrentCampaign(null)}
        hasCampaign={!!currentCampaign}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-8">
        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center justify-between text-xs sm:text-sm font-medium animate-fadeIn">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage(null)} className="text-red-500 font-bold hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Form Area for Idea Input */}
        <IdeaInput
          onGenerate={handleGenerateContent}
          isGenerating={isGenerating}
          activeBrand={activeBrand}
        />

        {/* Results Area */}
        {currentCampaign && (
          <div className="space-y-6 animate-fadeIn">
            {/* View Switcher Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('grid')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'grid'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Grid className="h-3.5 w-3.5" />
                  <span>3-Platform Grid</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('linkedin')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'linkedin'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>LinkedIn ({currentCampaign.posts.linkedin.imageAspectRatio})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('twitter')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'twitter'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>X / Twitter ({currentCampaign.posts.twitter.imageAspectRatio})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('instagram')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'instagram'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>Instagram ({currentCampaign.posts.instagram.imageAspectRatio})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('mockup')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'mockup'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Feed Mockup Preview</span>
                </button>
              </div>

              <div className="text-xs text-slate-500 font-medium flex items-center gap-1 shrink-0">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Simultaneously Generated &amp; Saved</span>
              </div>
            </div>

            {/* Tab Content Display */}
            {activeTab === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PlatformCard
                  post={currentCampaign.posts.linkedin}
                  onUpdatePost={handleUpdatePost}
                  onRegenerateImage={handleRegenerateImage}
                  onRefineText={handleRefineText}
                  isRefiningText={isRefiningMap['linkedin']}
                />
                <PlatformCard
                  post={currentCampaign.posts.twitter}
                  onUpdatePost={handleUpdatePost}
                  onRegenerateImage={handleRegenerateImage}
                  onRefineText={handleRefineText}
                  isRefiningText={isRefiningMap['twitter']}
                />
                <PlatformCard
                  post={currentCampaign.posts.instagram}
                  onUpdatePost={handleUpdatePost}
                  onRegenerateImage={handleRegenerateImage}
                  onRefineText={handleRefineText}
                  isRefiningText={isRefiningMap['instagram']}
                />
              </div>
            )}

            {activeTab === 'linkedin' && (
              <div className="max-w-2xl mx-auto">
                <PlatformCard
                  post={currentCampaign.posts.linkedin}
                  onUpdatePost={handleUpdatePost}
                  onRegenerateImage={handleRegenerateImage}
                  onRefineText={handleRefineText}
                  isRefiningText={isRefiningMap['linkedin']}
                />
              </div>
            )}

            {activeTab === 'twitter' && (
              <div className="max-w-2xl mx-auto">
                <PlatformCard
                  post={currentCampaign.posts.twitter}
                  onUpdatePost={handleUpdatePost}
                  onRegenerateImage={handleRegenerateImage}
                  onRefineText={handleRefineText}
                  isRefiningText={isRefiningMap['twitter']}
                />
              </div>
            )}

            {activeTab === 'instagram' && (
              <div className="max-w-2xl mx-auto">
                <PlatformCard
                  post={currentCampaign.posts.instagram}
                  onUpdatePost={handleUpdatePost}
                  onRegenerateImage={handleRegenerateImage}
                  onRefineText={handleRefineText}
                  isRefiningText={isRefiningMap['instagram']}
                />
              </div>
            )}

            {activeTab === 'mockup' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-blue-700 block text-center">LinkedIn Feed View</span>
                  <PlatformMockup post={currentCampaign.posts.linkedin} brand={activeBrand} />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-900 block text-center">X / Twitter Feed View</span>
                  <PlatformMockup post={currentCampaign.posts.twitter} brand={activeBrand} />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-pink-700 block text-center">Instagram Feed View</span>
                  <PlatformMockup post={currentCampaign.posts.instagram} brand={activeBrand} />
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
        <p className="font-medium">
          OmniSocial Content Generator • Powered by Gemini AI
        </p>
      </footer>

      {/* Modals */}
      <CampaignHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        campaigns={campaigns}
        onSelectCampaign={(c) => {
          setCurrentCampaign(c);
          setIsHistoryModalOpen(false);
        }}
        onDeleteCampaign={(id) => {
          setCampaigns(prev => prev.filter(c => c.id !== id));
        }}
      />

      <BrandPersonaModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        activeBrand={activeBrand}
        onSelectBrand={(b) => setActiveBrand(b)}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        campaign={currentCampaign}
      />
    </div>
  );
}
