# OmniSocial Content Generator ⚡

> **Simultaneous, cross-platform social media creation workspace powered by Google Gemini and Imagen.** Turn a single core idea into high-converting, platform-native content and custom studio-grade visuals for **LinkedIn**, **Twitter / X**, and **Instagram** in seconds.

---

## 🌟 Overview

Content creation across multiple social networks often leads to either generic, copy-pasted posts or fragmented, time-consuming workflows. **OmniSocial Content Generator** solves this by generating **three distinctly tailored, platform-optimized posts simultaneously**, complete with platform-appropriate text architecture, character counts, call-to-actions, hashtag strategies, and customized visual creative direction with aspect ratio matching.

```
                         ┌────────────────────────────────────────┐
                         │       Single Core Idea / Prompt        │
                         │   + Brand Voice + Tone + Audience      │
                         └───────────────────┬────────────────────┘
                                             │
                                  [ Gemini AI Engine ]
                                             │
            ┌────────────────────────────────┼────────────────────────────────┐
            ▼                                ▼                                ▼
  ┌───────────────────┐            ┌───────────────────┐            ┌───────────────────┐
  │     LinkedIn      │            │    Twitter / X    │            │     Instagram     │
  │ • Thought leader  │            │ • Punchy hook     │            │ • Visual caption  │
  │ • Long-form hook  │            │ • 280-char aware  │            │ • Formatted lines │
  │ • Insight bullets │            │ • Single / Thread │            │ • Emoji hierarchy │
  │ • Actionable CTA  │            │ • Engagement Q    │            │ • 1st comment tags│
  │ • B2B hashtags    │            │ • Trend hashtags  │            │ • Visual concept  │
  │ • 1:1 or 4:3 art  │            │ • 16:9 visual     │            │ • 1:1 or 9:16 art │
  └───────────────────┘            └───────────────────┘            └───────────────────┘
```

---

## ✨ Key Features

### 1. Simultaneous Tri-Platform Content Generation
- **LinkedIn**: Thought-leadership formatted with hook lines to trigger "see more", insight spacing, bullet points, structured takeaways, clear CTA, and targeted industry hashtags.
- **Twitter / X**: High-velocity punchy copy under the 280-character limit, single tweet or multi-tweet thread detection, character progress indicators, and closing engagement questions.
- **Instagram**: Visual-first captions with emoji hierarchy, scannable line breaks, visual concept breakdown, and a clean list of 10–15 first-comment hashtags.

### 2. Generative Visual Studio & Aspect Ratio Affordance
- **Full Aspect Ratio Freedom**: Custom aspect ratio generation tailored per platform or user preference:
  - `1:1` (Square – Instagram Grid & LinkedIn feed)
  - `16:9` (Landscape – Twitter / X timeline & LinkedIn banner)
  - `9:16` (Vertical – Instagram Stories & Reels)
  - `4:3` (Classic Landscape – Presentations & blog embeds)
  - `3:4` (Portrait – Mobile feeds)
  - `3:2` (DSLR Standard – Twitter cards)
  - `2:3` (Tall Portrait – Vertical platforms)
  - `21:9` (Cinematic Ultrawide – Hero graphics)
- **Multi-Resolution Selector**:
  - `1K` (Standard 1024px)
  - `2K` (Crisp High Definition)
  - `4K` (Studio Master Quality)
- **8 Curated Visual Styles**: Modern Minimalist, Photorealistic Studio, 3D Digital Render, Editorial Illustration, Corporate Flat, Cyberpunk Tech, Warm Editorial Film, and Vibrant Pop Art.
- **Model Engine Choice**: Switch between `gemini-3-pro-image-preview` for maximum fidelity and `gemini-3.1-flash-image-preview` for rapid turnaround, with automatic fallback handling (`imagen-3.0-generate-002`).

### 3. Realistic Live Feed Mockups
- Interactive **Feed Mockup View** renders your generated content and visual assets in authentic interface representations:
  - **LinkedIn Post Card**: Author details, connection degree, follow button, post timestamp, engagement stats (reactions, comments, reposts).
  - **Twitter / X Timeline Card**: Verified badge, handle, tweet timestamp, reply/repost/like/bookmark metrics.
  - **Instagram Mobile Feed**: Account header, verified badge, high-res visual, action buttons (like, comment, share, save), likes counter, and caption with hashtag block.

### 4. Interactive In-Place AI Refinement
- **Quick Preset Actions**:
  - ⚡ *Make Punchier*
  - 🎣 *Hookier Intro*
  - ✂️ *Shorten / Condense*
  - ✨ *Add Relevant Emojis*
  - 🌐 *Translate to Spanish*
- **Custom Conversational Prompting**: Enter any specific revision instructions (e.g., *"Shift the tone to be more technical"* or *"Add a question at the end about AI agents"*).
- **Regenerate Single Visual**: Refine or adjust the image prompt directly from the platform card and render a new image without losing your text drafts.

### 5. Brand Persona & Voice Management
- Maintain multiple brand voices with custom personas:
  - **Brand Voice & Style Context** (e.g., "Ambitious, data-backed, engineering-focused").
  - **Target Audience** (e.g., "Software engineers, tech founders, seed investors").
  - **Social Handles & Profile Avatars**.
- Pre-loaded with default profiles: *Tech Founder & Builder*, *Growth Marketer*, and *Mindset & Peak Performance*.
- Full custom profile creator with browser `localStorage` persistence.

### 6. Campaign History & Multi-Format Export
- **Local Campaign History**: Revisit previous campaigns, load saved posts, and inspect previous variations.
- **Export Formats**:
  - **Markdown (`.md`)**: Ready-to-use document containing all three platform posts, hashtags, CTAs, and image generation prompts.
  - **JSON (`.json`)**: Raw structured campaign object for scheduling tools, CMS pipelines, or automation scripts.
  - **One-Click Clipboard Copy**: Copy individual platform posts or the entire campaign package instantly.

### 7. AI Topic & Idea Discovery
- Stuck on what to post? Use the built-in **Idea Suggester** to get 5 fresh, high-traction topic ideas based on your chosen niche.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology |
|---|---|
| **Frontend Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tooling & Dev Server** | [Vite 6](https://vite.dev/) with SPA middleware |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Icons & Animation** | [Lucide React](https://lucide.dev/), [Motion](https://motion.dev/) |
| **Backend Server** | [Express](https://expressjs.com/) with server-side API proxy |
| **AI SDK** | [`@google/genai`](https://www.npmjs.com/package/@google/genai) (Official TypeScript SDK) |
| **Text Generation Models** | `gemini-3.5-flash` (speed & efficiency), `gemini-3.1-pro-preview` (deep reasoning) |
| **Image Generation Models** | `gemini-3-pro-image-preview`, `gemini-3.1-flash-image-preview`, `imagen-3.0-generate-002` |

---

## 📁 Project Structure

```
├── .env.example                 # Environment variable templates
├── package.json                 # Project dependencies & scripts
├── server.ts                    # Express backend proxy + Vite dev server integration
├── metadata.json                # Project capabilities & permissions
├── src/
│   ├── main.tsx                 # React DOM mount entry
│   ├── App.tsx                  # Main workspace application controller & state
│   ├── types.ts                 # TypeScript type definitions (Posts, Campaigns, Brands)
│   ├── components/
│   │   ├── Header.tsx           # Top navigation bar with active brand badge & actions
│   │   ├── IdeaInput.tsx        # Campaign prompt, tone picker, aspect ratio controls
│   │   ├── PlatformCard.tsx     # Platform editor card (copy, refine, visual generator)
│   │   ├── PlatformMockup.tsx   # Realistic LinkedIn, Twitter, and Instagram mockups
│   │   ├── BrandPersonaModal.tsx# Brand profile switcher and custom persona builder
│   │   ├── CampaignHistoryModal.tsx # Saved campaign drawer & loader
│   │   └── ExportModal.tsx      # Markdown / JSON exporter with copy & download
│   ├── data/
│   │   └── presets.ts           # Tone options, visual styles, aspect ratios, starter ideas
│   └── utils/
│       └── imageHelpers.ts      # SVG placeholder fallbacks, clipboard & download utilities
```

---

## 🔌 API Endpoints Reference

The backend runs an Express proxy mounted alongside Vite:

### `POST /api/generate`
Generates simultaneous LinkedIn, Twitter / X, and Instagram drafts from a core concept.
- **Request Body**:
  ```json
  {
    "idea": "Why asynchronous communication beats meetings for remote teams",
    "tone": "Thought Leadership",
    "brandVoice": "Analytical, empathetic, data-backed",
    "targetAudience": "Engineering managers and remote team leads",
    "modelChoice": "flash"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "linkedin": {
        "content": "Most meetings could have been a well-written document...",
        "hashtags": ["#RemoteWork", "#Leadership", "#Productivity"],
        "cta": "What is your team's rule for scheduling a meeting?",
        "imagePrompt": "Minimalist modern graphic comparing calendar overload with clear documents...",
        "suggestedAspectRatio": "1:1"
      },
      "twitter": {
        "content": "The best remote companies don't have fewer meetings. They have almost none...",
        "isThread": false,
        "hashtags": ["#buildinpublic", "#remotework"],
        "imagePrompt": "High-contrast quote graphic on a clean dark background...",
        "suggestedAspectRatio": "16:9"
      },
      "instagram": {
        "content": "3 signs your team has a meeting addiction 🛑...",
        "firstCommentHashtags": ["#remoteworktips", "#productivityhacks", "#techculture"],
        "imagePrompt": "A vibrant 3D isometric render of an uncluttered desk setup...",
        "visualConcept": "Clean, bright workspace aesthetic focusing on deep focus.",
        "suggestedAspectRatio": "1:1"
      }
    }
  }
  ```

---

### `POST /api/generate-image`
Generates a custom visual asset using Google GenAI image preview models or Imagen fallback.
- **Request Body**:
  ```json
  {
    "prompt": "Futuristic clean office workspace overlooking a digital skyline",
    "aspectRatio": "16:9",
    "size": "2K",
    "model": "gemini-3-pro-image-preview",
    "style": "Modern Minimalist"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "imageUrl": "data:image/jpeg;base64,...",
    "modelUsed": "gemini-3-pro-image-preview"
  }
  ```

---

### `POST /api/refine`
Performs surgical rewrite or tone adjustment on single platform post copy.
- **Request Body**:
  ```json
  {
    "platform": "linkedin",
    "currentContent": "Current draft text...",
    "instruction": "Make the first sentence more punchy and provocative"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "refinedContent": "Revised post text..."
  }
  ```

---

### `POST /api/suggest-ideas`
Generates 5 viral topic ideas for a given niche.
- **Request Body**:
  ```json
  {
    "niche": "SaaS Marketing"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "ideas": [
      "Why pricing pages fail: 3 teardowns of high-converting B2B tiers",
      "The unbundling of traditional customer support by agentic AI",
      "..."
    ]
  }
  ```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)
- A **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

### Installation

1. **Clone or navigate to the repository:**
   ```bash
   git clone <repo-url>
   cd omnisocial-content-generator
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env` and supply your Gemini API key:
   ```bash
   cp .env.example .env
   ```
   Add your key inside `.env`:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The application will start on `http://localhost:3000`.

5. **Build for Production:**
   ```bash
   npm run build
   npm start
   ```

---

## 🎯 Platform Best Practices Reference

| Dimension | LinkedIn | Twitter / X | Instagram |
|---|---|---|---|
| **Primary Goal** | Industry authority, reach, B2B leads | Viral spread, real-time conversation | Visual engagement, brand affinity |
| **Hook Placement** | First 2 lines before `"see more"` | First 70 characters | First 125 characters |
| **Character Limit** | Up to 3,000 (Sweet spot: 800–1,500) | 280 characters per tweet | Up to 2,200 (Sweet spot: 400–800) |
| **Optimal Aspect Ratio** | `1:1` or `4:3` | `16:9` or `3:2` | `1:1` (Grid) or `9:16` (Story/Reel) |
| **Hashtags Strategy** | 3–5 professional, broad + niche | 1–3 trending or specific tags | 10–15 tags placed in first comment |
| **Call to Action** | Comment prompt, resource link, repost | Retweet question, bookmark prompt | Save this post, bio link, share |

---

## 📜 Available Scripts

- `npm run dev`: Runs `server.ts` with Vite development middleware and Express on port 3000.
- `npm run build`: Bundles the Vite frontend and builds the standalone Express backend bundle.
- `npm run start`: Runs the built production server.
- `npm run lint`: Validates TypeScript types across the codebase (`tsc --noEmit`).
- `npm run clean`: Cleans build output directories.

---

## 📄 License

This project is open-source under the MIT License. Feel free to customize and extend it for your social media workflows!
