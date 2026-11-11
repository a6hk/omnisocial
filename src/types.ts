export type PlatformType = 'linkedin' | 'twitter' | 'instagram';

export type AspectRatioType = '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9';

export type ImageSize = '1K' | '2K' | '4K';

export type ImageModel = 'gemini-3-pro-image-preview' | 'gemini-3.1-flash-image-preview';

export type VisualStyle = 
  | 'Modern Minimalist' 
  | 'Photorealistic Studio' 
  | '3D Digital Render' 
  | 'Editorial Illustration' 
  | 'Corporate Flat' 
  | 'Cyberpunk Tech' 
  | 'Warm Editorial Film' 
  | 'Vibrant Pop Art';

export type ToneType = 
  | 'Professional & Insightful' 
  | 'Witty & Humorous' 
  | 'Urgent & Time-sensitive' 
  | 'Instructional & Educational' 
  | 'Storytelling & Personal' 
  | 'Energetic & Bold' 
  | 'Casual & Friendly' 
  | 'Thought Leadership';

export interface PlatformPost {
  platform: PlatformType;
  content: string;
  hashtags: string[];
  cta?: string;
  isThread?: boolean;
  threadTweets?: string[];
  firstCommentHashtags?: string[];
  visualConcept?: string;
  imagePrompt: string;
  imageUrl?: string;
  imageAspectRatio: AspectRatioType;
  imageSize: ImageSize;
  imageModel: ImageModel;
  imageStyle: VisualStyle;
  isGeneratingImage?: boolean;
  isGeneratingText?: boolean;
  imageError?: string;
}

export interface GenerationRequest {
  idea: string;
  tone: ToneType;
  brandVoice: string;
  targetAudience: string;
  textModel: 'flash' | 'pro';
  imageSize: ImageSize;
  imageModel: ImageModel;
  imageStyle: VisualStyle;
  platformAspectRatios: {
    linkedin: AspectRatioType;
    twitter: AspectRatioType;
    instagram: AspectRatioType;
  };
}

export interface Campaign {
  id: string;
  createdAt: string;
  title: string;
  idea: string;
  tone: ToneType;
  brandVoice: string;
  posts: {
    linkedin: PlatformPost;
    twitter: PlatformPost;
    instagram: PlatformPost;
  };
}

export interface BrandProfile {
  id: string;
  name: string;
  brandVoice: string;
  targetAudience: string;
  handle: string;
  avatarUrl?: string;
  website?: string;
}
