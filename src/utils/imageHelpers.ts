import { AspectRatioType, PlatformType } from '../types';

/**
 * Parses aspect ratio string to numeric width/height ratio
 */
export function getAspectRatioNumeric(ratio: AspectRatioType): number {
  const [w, h] = ratio.split(':').map(Number);
  if (!w || !h) return 1;
  return w / h;
}

/**
 * Downloads a data URL image as a JPEG/PNG file
 */
export function downloadImage(dataUrl: string, filename: string) {
  try {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error('Failed to download image:', err);
  }
}

/**
 * Generates an SVG fallback card image with custom text & platform styling
 */
export function generateSvgFallbackImage(
  title: string,
  platform: PlatformType,
  aspectRatio: AspectRatioType = '1:1'
): string {
  const numericRatio = getAspectRatioNumeric(aspectRatio);
  const width = 1200;
  const height = Math.round(width / numericRatio);

  const colors = {
    linkedin: { bg1: '#0077b5', bg2: '#0e2a47', accent: '#00a0dc', title: 'LINKEDIN POST VISUAL' },
    twitter: { bg1: '#0f1419', bg2: '#1d9bf0', accent: '#71c9f8', title: 'X / TWITTER GRAPHIC' },
    instagram: { bg1: '#833ab4', bg2: '#fd1d1d', accent: '#fcb045', title: 'INSTAGRAM VISUAL' }
  }[platform];

  const truncatedTitle = title.length > 90 ? title.substring(0, 90) + '...' : title;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${colors.bg1}" />
          <stop offset="100%" stop-color="${colors.bg2}" />
        </linearGradient>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        </pattern>
      </defs>
      
      <!-- Background -->
      <rect width="100%" height="100%" fill="url(#grad)" />
      <rect width="100%" height="100%" fill="url(#grid)" />
      
      <!-- Accent Glow Circle -->
      <circle cx="${width * 0.85}" cy="${height * 0.2}" r="${width * 0.25}" fill="${colors.accent}" opacity="0.18" />
      <circle cx="${width * 0.15}" cy="${height * 0.85}" r="${width * 0.3}" fill="#ffffff" opacity="0.05" />

      <!-- Top Badge -->
      <rect x="80" y="80" width="220" height="44" rx="22" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="1" />
      <text x="190" y="108" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="700" letter-spacing="1" text-anchor="middle">${colors.title}</text>

      <!-- Main Headline Content -->
      <foreignObject x="80" y="160" width="${width - 160}" height="${height - 280}">
        <div xmlns="http://www.w3.org/1999/xhtml" style="color: white; font-family: system-ui, -apple-system, sans-serif; height: 100%; display: flex; flex-direction: column; justify-content: center;">
          <h1 style="font-size: ${width > 1000 ? '42px' : '32px'}; font-weight: 800; line-height: 1.25; margin: 0; text-shadow: 0 4px 12px rgba(0,0,0,0.3);">
            ${truncatedTitle}
          </h1>
        </div>
      </foreignObject>

      <!-- Footer Branding -->
      <line x1="80" y1="${height - 90}" x2="${width - 80}" y2="${height - 90}" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
      <text x="80" y="${height - 50}" fill="rgba(255,255,255,0.8)" font-family="system-ui, sans-serif" font-size="18" font-weight="600">OmniSocial Generated Visual</text>
      <text x="${width - 80}" y="${height - 50}" fill="${colors.accent}" font-family="system-ui, sans-serif" font-size="16" font-weight="700" text-anchor="end">${aspectRatio}</text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

/**
 * Copy text to clipboard safely
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (err) {
    console.error('Copy failed:', err);
    return false;
  }
}
