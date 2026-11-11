import { ToneType, VisualStyle, AspectRatioType, BrandProfile } from '../types';

export const TONE_OPTIONS: { label: ToneType; description: string; badge: string; iconName: string }[] = [
  {
    label: 'Professional & Insightful',
    description: 'Polished, authoritative, data-driven and trustworthy for corporate audiences',
    badge: 'B2B & Industry',
    iconName: 'Briefcase'
  },
  {
    label: 'Witty & Humorous',
    description: 'Playful, clever, meme-aware, and highly engaging with relatable humor',
    badge: 'Viral & Fun',
    iconName: 'Smile'
  },
  {
    label: 'Urgent & Time-sensitive',
    description: 'Creates FOMO, direct call to action, breaking news or limited availability',
    badge: 'High Conversion',
    iconName: 'Zap'
  },
  {
    label: 'Instructional & Educational',
    description: 'Step-by-step frameworks, how-to guides, bullet points, and actionable tips',
    badge: 'Value & Growth',
    iconName: 'BookOpen'
  },
  {
    label: 'Storytelling & Personal',
    description: 'Authentic narrative, emotional hook, lesson learned, and relatable reflection',
    badge: 'Personal Brand',
    iconName: 'Sparkles'
  },
  {
    label: 'Energetic & Bold',
    description: 'High momentum, passionate language, strong opinion, and inspiring tone',
    badge: 'Motivation',
    iconName: 'Flame'
  },
  {
    label: 'Casual & Friendly',
    description: 'Conversational, warm, approachable, like chatting with a knowledgeable peer',
    badge: 'Community',
    iconName: 'MessageCircle'
  },
  {
    label: 'Thought Leadership',
    description: 'Counter-intuitive insights, future predictions, and strategic analysis',
    badge: 'Authority',
    iconName: 'Award'
  }
];

export const VISUAL_STYLES: { label: VisualStyle; description: string }[] = [
  { label: 'Modern Minimalist', description: 'Clean typography, ample whitespace, sleek vector graphics' },
  { label: 'Photorealistic Studio', description: 'Hyper-realistic lighting, studio photo finish, crisp detail' },
  { label: '3D Digital Render', description: 'Smooth 3D objects, tactile textures, studio shadows' },
  { label: 'Editorial Illustration', description: 'Hand-drawn aesthetic, artistic colors, magazine cover feel' },
  { label: 'Corporate Flat', description: 'Clean geometry, vibrant accent colors, infographic presentation' },
  { label: 'Cyberpunk Tech', description: 'Neon glowing highlights, dark tech aesthetic, futuristic elements' },
  { label: 'Warm Editorial Film', description: 'Analog film grain, warm muted tones, cinematic photography' },
  { label: 'Vibrant Pop Art', description: 'High contrast, bold saturated colors, eye-popping visual energy' }
];

export const ASPECT_RATIOS: { value: AspectRatioType; label: string; ratioDisplay: string; idealFor: string }[] = [
  { value: '16:9', label: 'Landscape (16:9)', ratioDisplay: '16:9', idealFor: 'Twitter/X feed, LinkedIn desktop banner' },
  { value: '1:1', label: 'Square (1:1)', ratioDisplay: '1:1', idealFor: 'Instagram grid, LinkedIn mobile post' },
  { value: '4:3', label: 'Classic Landscape (4:3)', ratioDisplay: '4:3', idealFor: 'LinkedIn feed, blog embeds' },
  { value: '3:4', label: 'Portrait (3:4)', ratioDisplay: '3:4', idealFor: 'Instagram feed portrait, Facebook' },
  { value: '9:16', label: 'Full Vertical (9:16)', ratioDisplay: '9:16', idealFor: 'Instagram Stories/Reels, Mobile full screen' },
  { value: '3:2', label: 'Photo Standard (3:2)', ratioDisplay: '3:2', idealFor: 'Twitter cards, DSLR photography' },
  { value: '2:3', label: 'Tall Portrait (2:3)', ratioDisplay: '2:3', idealFor: 'Pinterest, Vertical feeds' },
  { value: '21:9', label: 'Ultrawide Cinematic (21:9)', ratioDisplay: '21:9', idealFor: 'Hero visual banners' }
];

export const STARTER_IDEAS = [
  'Launching a new AI productivity tool that saves 10 hours a week for remote workers',
  '3 counter-intuitive lessons learned from growing a bootstrapped business to $1M ARR',
  'Why work-from-home policy is shifting in 2026 and what leaders need to do now',
  'Step-by-step guide on mastering prompt engineering for complex workflow automation',
  'Announcing our quarterly product milestone with major user-requested feature updates'
];

export const DEFAULT_BRAND_PROFILES: BrandProfile[] = [
  {
    id: 'tech-founder',
    name: 'Tech Founder & Builder',
    brandVoice: 'Transparent, ambitious, engineering-focused, data-backed and forward-thinking',
    targetAudience: 'Software engineers, startup founders, investors and tech enthusiasts',
    handle: '@alex_techbuild',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    website: 'https://buildspace.io'
  },
  {
    id: 'marketing-guru',
    name: 'Growth Marketer',
    brandVoice: 'Punchy, actionable, ROI-driven, high energy and case-study grounded',
    targetAudience: 'Digital marketers, agency owners, CMOs and growth hackers',
    handle: '@growth_sarah',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    website: 'https://growthhacks.co'
  },
  {
    id: 'wellness-coach',
    name: 'Mindset & Peak Performance',
    brandVoice: 'Empathetic, structured, inspiring, science-informed and motivational',
    targetAudience: 'High performers, professionals seeking work-life balance and fitness enthusiasts',
    handle: '@coach_marcus',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    website: 'https://peakmind.com'
  }
];
