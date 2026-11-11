import React from 'react';
import { X, Trash2, Calendar, ChevronRight, Layers, Download } from 'lucide-react';
import { Campaign } from '../types';

interface CampaignHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaigns: Campaign[];
  onSelectCampaign: (campaign: Campaign) => void;
  onDeleteCampaign: (id: string) => void;
}

export const CampaignHistoryModal: React.FC<CampaignHistoryModalProps> = ({
  isOpen,
  onClose,
  campaigns,
  onSelectCampaign,
  onDeleteCampaign
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Saved Social Campaigns</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
              {campaigns.length} Saved
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-3">
          {campaigns.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs space-y-2">
              <Layers className="h-10 w-10 text-slate-300 mx-auto" />
              <p className="font-semibold">No saved campaigns yet.</p>
              <p className="text-slate-400">Generate content to automatically save your campaign history.</p>
            </div>
          ) : (
            campaigns.map((c) => (
              <div
                key={c.id}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-300 shadow-2xs hover:shadow-xs transition-all flex items-start justify-between gap-4 group"
              >
                <div className="space-y-1.5 flex-1 cursor-pointer" onClick={() => onSelectCampaign(c)}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 line-clamp-1">{c.title || c.idea}</span>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {c.tone}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">{c.idea}</p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                    <span>• 3 Platform Posts Tailored</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onSelectCampaign(c)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <span>Load</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteCampaign(c.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete Campaign"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
