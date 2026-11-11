import React, { useState } from 'react';
import { X, Copy, Check, Download, FileText, Code } from 'lucide-react';
import { Campaign } from '../types';
import { copyToClipboard } from '../utils/imageHelpers';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  campaign
}) => {
  const [copied, setCopied] = useState(false);
  const [format, setFormat] = useState<'markdown' | 'json'>('markdown');

  if (!isOpen || !campaign) return null;

  const generateMarkdown = (): string => {
    return `# Campaign: ${campaign.title || campaign.idea}
Date: ${new Date(campaign.createdAt).toLocaleString()}
Tone: ${campaign.tone}
Brand Voice: ${campaign.brandVoice}

---

## 1. LINKEDIN POST
${campaign.posts.linkedin.content}

**Hashtags:** ${campaign.posts.linkedin.hashtags.join(' ')}
**Call to Action:** ${campaign.posts.linkedin.cta || 'N/A'}
**Image Prompt:** ${campaign.posts.linkedin.imagePrompt}
**Aspect Ratio:** ${campaign.posts.linkedin.imageAspectRatio}

---

## 2. X / TWITTER POST
${campaign.posts.twitter.content}

**Hashtags:** ${campaign.posts.twitter.hashtags.join(' ')}
**Image Prompt:** ${campaign.posts.twitter.imagePrompt}
**Aspect Ratio:** ${campaign.posts.twitter.imageAspectRatio}

---

## 3. INSTAGRAM POST
${campaign.posts.instagram.content}

**First Comment Hashtags:** ${(campaign.posts.instagram.firstCommentHashtags || []).join(' ')}
**Image Prompt:** ${campaign.posts.instagram.imagePrompt}
**Aspect Ratio:** ${campaign.posts.instagram.imageAspectRatio}
`;
  };

  const exportText = format === 'markdown' ? generateMarkdown() : JSON.stringify(campaign, null, 2);

  const handleCopy = async () => {
    const ok = await copyToClipboard(exportText);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([exportText], { type: format === 'markdown' ? 'text/markdown' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omnisocial_campaign_${campaign.id}.${format === 'markdown' ? 'md' : 'json'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Export All Social Posts</h2>
          </div>

          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Format Selector */}
        <div className="p-4 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setFormat('markdown')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                format === 'markdown' ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Markdown (.md)</span>
            </button>

            <button
              onClick={() => setFormat('json')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                format === 'json' ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              <Code className="h-3.5 w-3.5" />
              <span>JSON (.json)</span>
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 flex items-center gap-1.5 shadow-2xs"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-indigo-600" />}
              <span>{copied ? 'Copied!' : 'Copy All'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-2xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Text View */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto">
          <textarea
            readOnly
            rows={14}
            value={exportText}
            className="w-full text-xs font-mono p-3.5 bg-slate-900 text-slate-100 rounded-xl focus:outline-hidden leading-relaxed resize-none"
          />
        </div>
      </div>
    </div>
  );
};
