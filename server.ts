import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '20mb' }));

// Helper to instantiate GoogleGenAI client
function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing. Please configure it in the Secrets panel.');
  }
  return new GoogleGenAI({ apiKey });
}

// 1. Simultaneous Multi-Platform Content Generation Endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { idea, tone, brandVoice, targetAudience, modelChoice } = req.body;
    if (!idea || typeof idea !== 'string' || !idea.trim()) {
      return res.status(400).json({ error: 'Core idea or prompt is required.' });
    }

    const ai = getAiClient();
    const model = modelChoice === 'pro' ? 'gemini-3.1-pro-preview' : 'gemini-3.5-flash';

    const systemPrompt = `You are an elite cross-platform social media manager and growth marketer.
Given a core idea, generate 3 distinctly tailored, platform-native posts for LinkedIn, Twitter/X, and Instagram simultaneously.

Core Idea: "${idea.trim()}"
Tone: "${tone || 'Professional & Engaging'}"
Brand Voice / Style Context: "${brandVoice || 'Clear, authentic, value-focused'}"
Target Audience: "${targetAudience || 'General Professionals & Community'}"

Specific Requirements per Platform:
1. LINKEDIN:
   - Long-form thought-leadership style.
   - Compelling hook line to trigger 'see more'.
   - Clean spacing, insightful paragraphs/bullet points, actionable takeaway.
   - Clear call to action (CTA).
   - 3-5 relevant hashtags.
   - Detailed image prompt designed for a professional graphic, infographic, or editorial photograph.

2. TWITTER / X:
   - Short, punchy, high-impact style.
   - Include single tweet OR multi-tweet thread if the concept warrants structured points.
   - Strict character count awareness (under 280 chars per tweet).
   - High energy hook and closing engagement question.
   - 2-4 hashtags.
   - Detailed image prompt designed for a high-contrast visual, bold quote graphic, or minimalist diagram.

3. INSTAGRAM:
   - Visual-first caption structure with a strong hook.
   - Emoji-rich, formatted with line breaks for readability.
   - 10-15 targeted hashtags suitable for first comment or bottom of caption.
   - Visual concept description & detailed image prompt for a vibrant, high-aesthetic photo or artwork.`;

    const response = await ai.models.generateContent({
      model,
      contents: systemPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            linkedin: {
              type: Type.OBJECT,
              properties: {
                content: { type: Type.STRING },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                cta: { type: Type.STRING },
                imagePrompt: { type: Type.STRING },
                suggestedAspectRatio: { type: Type.STRING },
              },
              required: ['content', 'hashtags', 'imagePrompt']
            },
            twitter: {
              type: Type.OBJECT,
              properties: {
                content: { type: Type.STRING },
                isThread: { type: Type.BOOLEAN },
                threadTweets: { type: Type.ARRAY, items: { type: Type.STRING } },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                imagePrompt: { type: Type.STRING },
                suggestedAspectRatio: { type: Type.STRING },
              },
              required: ['content', 'hashtags', 'imagePrompt']
            },
            instagram: {
              type: Type.OBJECT,
              properties: {
                content: { type: Type.STRING },
                firstCommentHashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                imagePrompt: { type: Type.STRING },
                visualConcept: { type: Type.STRING },
                suggestedAspectRatio: { type: Type.STRING },
              },
              required: ['content', 'firstCommentHashtags', 'imagePrompt']
            }
          },
          required: ['linkedin', 'twitter', 'instagram']
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error generating content:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate content.' });
  }
});

// 2. Image Generation Endpoint using Imagen / Gemini Image models
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, aspectRatio = '1:1', size = '1K', model = 'gemini-3-pro-image-preview', style = 'Modern' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Image prompt is required.' });
    }

    const ai = getAiClient();

    const sizeInstructions: Record<string, string> = {
      '1K': 'standard 1024px clear definition',
      '2K': '2K high definition, crisp detail, flawless focus',
      '4K': 'studio quality 4K resolution, hyper-detailed render, cinematic lighting, masterpiece'
    };

    const enhancedPrompt = `${prompt}. Visual style: ${style}. Quality: ${sizeInstructions[size] || sizeInstructions['1K']}. Professional social media asset, clean, no unwanted logos or distorted text.`;

    const candidateModels = [
      model,
      'gemini-3-pro-image-preview',
      'gemini-3.1-flash-image-preview',
      'imagen-3.0-generate-002'
    ].filter((v, i, a) => a.indexOf(v) === i);

    let lastError = null;
    for (const m of candidateModels) {
      try {
        const imageRes = await ai.models.generateImages({
          model: m,
          prompt: enhancedPrompt,
          config: {
            numberOfImages: 1,
            aspectRatio: aspectRatio as any,
            outputMimeType: 'image/jpeg'
          }
        });

        if (imageRes.generatedImages && imageRes.generatedImages.length > 0) {
          const imgBytes = imageRes.generatedImages[0].image?.imageBytes;
          if (imgBytes) {
            const dataUrl = `data:image/jpeg;base64,${imgBytes}`;
            return res.json({ success: true, imageUrl: dataUrl, modelUsed: m });
          }
        }
      } catch (err: any) {
        console.warn(`Model ${m} failed for image generation, trying fallback model...`, err?.message);
        lastError = err;
      }
    }

    throw lastError || new Error('Could not generate image with available Gemini models.');
  } catch (error: any) {
    console.error('Error generating image:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate image.' });
  }
});

// 3. Single Post Refinement Endpoint
app.post('/api/refine', async (req, res) => {
  try {
    const { platform, currentContent, instruction } = req.body;
    if (!currentContent || !instruction) {
      return res.status(400).json({ error: 'Current content and instruction are required.' });
    }

    const ai = getAiClient();
    const prompt = `You are a social media copy editor specializing in ${platform}.
Current Content:
"""
${currentContent}
"""

Instruction / Edit Request:
"${instruction}"

Output ONLY the revised, updated post content ready to publish on ${platform}. Maintain line breaks and formatting. Do not wrap in conversational filler or quotes.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt
    });

    return res.json({ success: true, refinedContent: response.text?.trim() });
  } catch (error: any) {
    console.error('Error refining content:', error);
    return res.status(500).json({ error: error?.message || 'Failed to refine content.' });
  }
});

// 4. Topic Ideas Generator Endpoint
app.post('/api/suggest-ideas', async (req, res) => {
  try {
    const { niche } = req.body;
    const ai = getAiClient();
    const prompt = `Suggest 5 highly engaging, viral topic ideas for social media content in the "${niche || 'Tech & Entrepreneurship'}" domain.
Return JSON array of 5 concise topic prompts.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const ideas = JSON.parse(response.text || '[]');
    return res.json({ success: true, ideas });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to suggest ideas.' });
  }
});

// Initialize Vite server or static serving
const PORT = 3000;

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    });

    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;

      // Don't intercept API routes
      if (url.startsWith('/api')) {
        return next();
      }

      try {
        let template = await vite.transformIndexHtml(
          url,
          `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>OmniSocial Content Generator</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
        );
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
