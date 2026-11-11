import React from 'react';
import { Sparkles, History, Users, Download, PlusCircle, Share2, Layers } from 'lucide-react';
import { BrandProfile } from '../types';

interface HeaderProps {
  activeBrand: BrandProfile;
  onOpenBrandModal: () => void;
  onOpenHistoryModal: () => void;
  onOpenExportModal: () => void;
  onNewCampaign: () => void;
  hasCampaign: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeBrand,
  onOpenBrandModal,
  onOpenHistoryModal,
  onOpenExportModal,
  onNewCampaign,
  hasCampaign
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Logo & Identity */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 ring-1 ring-white/30">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">
                OmniSocial
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200/60">
                <Sparkles className="h-3 w-3 text-indigo-500" />
                Multi-Platform AI
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Simultaneous Content &amp; Visual Generator for LinkedIn, X &amp; Instagram
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
          {/* Active Brand Voice Selector */}
          <button
            onClick={onOpenBrandModal}
            className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors border border-slate-200/80"
            title="Switch Brand Voice Profile"
          >
            <Users className="h-3.5 w-3.5 text-indigo-600" />
            <span className="hidden md:inline text-slate-500 font-normal">Profile:</span>
            <span className="truncate max-w-[120px]">{activeBrand.name}</span>
          </button>

          {/* History Drawer Trigger */}
          <button
            onClick={onOpenHistoryModal}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors border border-slate-200/80"
          >
            <History className="h-3.5 w-3.5 text-slate-500" />
            <span>Saved Campaigns</span>
          </button>

          {/* Export Campaign Button */}
          {hasCampaign && (
            <button
              onClick={onOpenExportModal}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-emerald-600" />
              <span>Export Posts</span>
            </button>
          )}

          {/* New Campaign Button */}
          <button
            onClick={onNewCampaign}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>New Content</span>
          </button>
        </div>
      </div>
    </header>
  );
};
