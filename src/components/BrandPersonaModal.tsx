import React, { useState } from 'react';
import { X, Users, Plus, Check, Trash2, Sparkles } from 'lucide-react';
import { BrandProfile } from '../types';
import { DEFAULT_BRAND_PROFILES } from '../data/presets';

interface BrandPersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeBrand: BrandProfile;
  onSelectBrand: (brand: BrandProfile) => void;
}

export const BrandPersonaModal: React.FC<BrandPersonaModalProps> = ({
  isOpen,
  onClose,
  activeBrand,
  onSelectBrand
}) => {
  const [profiles, setProfiles] = useState<BrandProfile[]>(() => {
    const saved = localStorage.getItem('omnisocial_brand_profiles');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return DEFAULT_BRAND_PROFILES;
  });

  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newVoice, setNewVoice] = useState('');
  const [newAudience, setNewAudience] = useState('');
  const [newHandle, setNewHandle] = useState('@');

  if (!isOpen) return null;

  const handleSaveNewProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newVoice.trim()) return;

    const newProfile: BrandProfile = {
      id: `custom-${Date.now()}`,
      name: newName.trim(),
      brandVoice: newVoice.trim(),
      targetAudience: newAudience.trim() || 'General Audience',
      handle: newHandle.trim() || '@brand_official',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    };

    const updated = [...profiles, newProfile];
    setProfiles(updated);
    localStorage.setItem('omnisocial_brand_profiles', JSON.stringify(updated));
    onSelectBrand(newProfile);

    // Reset form
    setNewName('');
    setNewVoice('');
    setNewAudience('');
    setNewHandle('@');
    setIsCreating(false);
  };

  const handleDeleteProfile = (id: string) => {
    const filtered = profiles.filter(p => p.id !== id);
    setProfiles(filtered);
    localStorage.setItem('omnisocial_brand_profiles', JSON.stringify(filtered));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Brand Persona &amp; Voice Profiles</h2>
          </div>

          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Select Active Brand Profile</span>
            <button
              onClick={() => setIsCreating(!isCreating)}
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{isCreating ? 'Cancel' : 'Add New Profile'}</span>
            </button>
          </div>

          {/* Creation Form */}
          {isCreating && (
            <form onSubmit={handleSaveNewProfile} className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-200/80 space-y-3 animate-fadeIn">
              <h3 className="text-xs font-bold text-indigo-900 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                <span>Create Brand Persona</span>
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-700">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Acme AI Solutions"
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700">Handle</label>
                  <input
                    type="text"
                    value={newHandle}
                    onChange={(e) => setNewHandle(e.target.value)}
                    placeholder="@acme_ai"
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-700">Brand Voice / Tone Context</label>
                <input
                  type="text"
                  required
                  value={newVoice}
                  onChange={(e) => setNewVoice(e.target.value)}
                  placeholder="e.g. Witty, data-driven, engineering-first..."
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-700">Target Audience Focus</label>
                <input
                  type="text"
                  value={newAudience}
                  onChange={(e) => setNewAudience(e.target.value)}
                  placeholder="e.g. Founders, marketers, developers..."
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs"
              >
                Save Brand Profile
              </button>
            </form>
          )}

          {/* Profiles Grid */}
          <div className="space-y-2.5">
            {profiles.map((p) => {
              const isSelected = activeBrand.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectBrand(p);
                    onClose();
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-indigo-50/90 border-indigo-500 shadow-2xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt={p.name}
                      className="h-10 w-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{p.name}</span>
                        <span className="text-[10px] text-slate-500">{p.handle}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-1">{p.brandVoice}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isSelected && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    )}

                    {!DEFAULT_BRAND_PROFILES.some(dp => dp.id === p.id) && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProfile(p.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
