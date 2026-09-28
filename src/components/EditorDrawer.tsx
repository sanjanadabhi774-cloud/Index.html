import React, { useState } from 'react';
import {
  X,
  Palette,
  Music,
  Users,
  Calendar,
  Sparkles,
  Plus,
  Trash2,
  Image,
  Upload,
  RotateCcw,
  Check,
  FileText
} from 'lucide-react';
import { Ceremony, WeddingData, WeddingTheme } from '../types/wedding';
import { WEDDING_THEMES, AUDIO_PRESETS, DEFAULT_WEDDING_DATA } from '../constants/defaultData';

interface EditorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  weddingData: WeddingData;
  onUpdateWeddingData: (data: WeddingData) => void;
}

export const EditorDrawer: React.FC<EditorDrawerProps> = ({
  isOpen,
  onClose,
  weddingData,
  onUpdateWeddingData
}) => {
  const [activeTab, setActiveTab] = useState<'names' | 'theme' | 'ceremonies' | 'music' | 'texts'>('names');

  if (!isOpen) return null;

  const handleTextChange = (field: keyof WeddingData, value: unknown) => {
    onUpdateWeddingData({
      ...weddingData,
      [field]: value
    });
  };

  const handleCeremonyChange = (id: string, field: keyof Ceremony, value: string) => {
    const updated = weddingData.ceremonies.map(c => {
      if (c.id === id) {
        return { ...c, [field]: value };
      }
      return c;
    });
    onUpdateWeddingData({
      ...weddingData,
      ceremonies: updated
    });
  };

  const handleAddCeremony = () => {
    const newId = `ceremony_${Date.now()}`;
    const newCeremony: Ceremony = {
      id: newId,
      name: 'Qawwali & Sufi Night',
      arabicSubtitle: 'أمسية صوفية مباركة',
      date: weddingData.mainWeddingDate,
      time: '08:00 PM onwards',
      venueName: weddingData.mainVenueName,
      venueAddress: weddingData.mainVenueAddress,
      mapsUrl: 'https://maps.google.com',
      dressCode: 'Royal Velvet & Traditional Kurtas',
      description: 'An evening of spiritual reflection, melodious Sufi kalams, and warm family bonding before the wedding.',
      iconType: 'sangeet'
    };

    onUpdateWeddingData({
      ...weddingData,
      ceremonies: [...weddingData.ceremonies, newCeremony]
    });
  };

  const handleDeleteCeremony = (id: string) => {
    if (weddingData.ceremonies.length <= 1) {
      return; // Keep at least one
    }
    const updated = weddingData.ceremonies.filter(c => c.id !== id);
    onUpdateWeddingData({
      ...weddingData,
      ceremonies: updated
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          handleTextChange('couplePhotoUrl', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUpdateWeddingData({
        ...weddingData,
        isCustomMusic: true,
        customMusicUrl: url,
        musicTrackTitle: file.name.replace(/\.[^/.]+$/, "")
      });
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm("Reset all invitation details back to initial royal templates?")) {
      onUpdateWeddingData(DEFAULT_WEDDING_DATA);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-stone-950 border-l border-amber-400/50 shadow-2xl flex flex-col text-white select-none">
      {/* Drawer Header */}
      <div className="flex items-center justify-between p-4 border-b border-amber-400/30 bg-stone-900 shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="font-cinzel text-base font-bold text-amber-200">
            Customize Invitation Studio
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetToDefault}
            type="button"
            className="p-1.5 text-xs text-amber-300/70 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
            title="Reset to default sample data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            type="button"
            className="p-1.5 text-amber-300 hover:text-white rounded-lg hover:bg-stone-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-stone-800 bg-stone-950 px-2 py-1.5 gap-1 shrink-0 overflow-x-auto">
        {[
          { id: 'names', label: 'Names & Date', icon: Users },
          { id: 'ceremonies', label: 'Functions', icon: Calendar },
          { id: 'theme', label: 'Theme Colors', icon: Palette },
          { id: 'music', label: 'Music & Photo', icon: Music },
          { id: 'texts', label: 'Texts & Verse', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              type="button"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TAB 1: NAMES & MAIN DATE */}
        {activeTab === 'names' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/20 text-xs text-amber-200">
              Personalize bride, groom, and parents&apos; names. The changes instantly update the card, envelope wax seal, and WhatsApp invitations!
            </div>

            {/* Groom Details */}
            <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Groom Details
              </span>
              <div className="grid grid-cols-4 gap-2">
                <input
                  type="text"
                  placeholder="Prefix (Engr./Dr.)"
                  value={weddingData.groomPrefix || ''}
                  onChange={(e) => handleTextChange('groomPrefix', e.target.value)}
                  className="col-span-1 px-2.5 py-2 rounded-lg bg-stone-950 border border-stone-700 text-xs text-amber-100"
                />
                <input
                  type="text"
                  placeholder="Groom Name"
                  value={weddingData.groomName}
                  onChange={(e) => handleTextChange('groomName', e.target.value)}
                  className="col-span-3 px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-xs font-medium text-amber-100"
                />
              </div>
              <div>
                <label className="text-[11px] text-stone-400 block mb-1">Groom&apos;s Parents:</label>
                <input
                  type="text"
                  value={weddingData.groomParents}
                  onChange={(e) => handleTextChange('groomParents', e.target.value)}
                  placeholder="Mr. & Mrs. Groom's Parents"
                  className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-xs text-amber-100"
                />
              </div>
            </div>

            {/* Bride Details */}
            <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Bride Details
              </span>
              <div className="grid grid-cols-4 gap-2">
                <input
                  type="text"
                  placeholder="Prefix (Dr.)"
                  value={weddingData.bridePrefix || ''}
                  onChange={(e) => handleTextChange('bridePrefix', e.target.value)}
                  className="col-span-1 px-2.5 py-2 rounded-lg bg-stone-950 border border-stone-700 text-xs text-amber-100"
                />
                <input
                  type="text"
                  placeholder="Bride Name"
                  value={weddingData.brideName}
                  onChange={(e) => handleTextChange('brideName', e.target.value)}
                  className="col-span-3 px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-xs font-medium text-amber-100"
                />
              </div>
              <div>
                <label className="text-[11px] text-stone-400 block mb-1">Bride&apos;s Parents:</label>
                <input
                  type="text"
                  value={weddingData.brideParents}
                  onChange={(e) => handleTextChange('brideParents', e.target.value)}
                  placeholder="Mr. & Mrs. Bride's Parents"
                  className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-xs text-amber-100"
                />
              </div>
            </div>

            {/* Main Wedding Ceremony Date & Venue */}
            <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Main Ceremony &amp; Countdown Target
              </span>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-stone-400 block mb-1">Date (YYYY-MM-DD):</label>
                  <input
                    type="date"
                    value={weddingData.mainWeddingDate}
                    onChange={(e) => handleTextChange('mainWeddingDate', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-xs text-amber-100"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-stone-400 block mb-1">Time (e.g. 06:30 PM):</label>
                  <input
                    type="text"
                    value={weddingData.mainWeddingTime}
                    onChange={(e) => handleTextChange('mainWeddingTime', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-xs text-amber-100"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-stone-400 block mb-1">Hijri Islamic Date:</label>
                <input
                  type="text"
                  value={weddingData.hijriDate}
                  onChange={(e) => handleTextChange('hijriDate', e.target.value)}
                  placeholder="e.g. 18th Jumada al-Thani 1448 AH"
                  className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-xs text-amber-100"
                />
              </div>

              <div>
                <label className="text-[11px] text-stone-400 block mb-1">Ceremony Title:</label>
                <input
                  type="text"
                  value={weddingData.mainCeremonyTitle}
                  onChange={(e) => handleTextChange('mainCeremonyTitle', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-xs text-amber-100"
                />
              </div>

              <div>
                <label className="text-[11px] text-stone-400 block mb-1">Venue Name:</label>
                <input
                  type="text"
                  value={weddingData.mainVenueName}
                  onChange={(e) => handleTextChange('mainVenueName', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-xs text-amber-100"
                />
              </div>

              <div>
                <label className="text-[11px] text-stone-400 block mb-1">Venue Address:</label>
                <input
                  type="text"
                  value={weddingData.mainVenueAddress}
                  onChange={(e) => handleTextChange('mainVenueAddress', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-xs text-amber-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CEREMONIES / FUNCTIONS (Haldi, Mehendi, Nikah, Walima) */}
        {activeTab === 'ceremonies' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Wedding Functions ({weddingData.ceremonies.length})
              </span>
              <button
                onClick={handleAddCeremony}
                type="button"
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-amber-400 text-amber-950 rounded-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Ceremony</span>
              </button>
            </div>

            {weddingData.ceremonies.map((ceremony, idx) => (
              <div
                key={ceremony.id}
                className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 space-y-2.5 relative group"
              >
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <span className="text-xs font-bold text-amber-300">
                    Function {idx + 1}: {ceremony.name}
                  </span>
                  {weddingData.ceremonies.length > 1 && (
                    <button
                      onClick={() => handleDeleteCeremony(ceremony.id)}
                      type="button"
                      className="text-rose-400 hover:text-rose-200 p-1 cursor-pointer"
                      title="Remove ceremony"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-stone-400 block mb-0.5">Name:</label>
                    <input
                      type="text"
                      value={ceremony.name}
                      onChange={(e) => handleCeremonyChange(ceremony.id, 'name', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-stone-950 border border-stone-700 text-xs text-amber-100"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-stone-400 block mb-0.5">Arabic Subtitle:</label>
                    <input
                      type="text"
                      value={ceremony.arabicSubtitle || ''}
                      onChange={(e) => handleCeremonyChange(ceremony.id, 'arabicSubtitle', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-stone-950 border border-stone-700 text-xs text-amber-100 font-amiri"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-stone-400 block mb-0.5">Date:</label>
                    <input
                      type="date"
                      value={ceremony.date}
                      onChange={(e) => handleCeremonyChange(ceremony.id, 'date', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-stone-950 border border-stone-700 text-xs text-amber-100"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-stone-400 block mb-0.5">Timing:</label>
                    <input
                      type="text"
                      value={ceremony.time}
                      onChange={(e) => handleCeremonyChange(ceremony.id, 'time', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-stone-950 border border-stone-700 text-xs text-amber-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-stone-400 block mb-0.5">Venue Name:</label>
                  <input
                    type="text"
                    value={ceremony.venueName}
                    onChange={(e) => handleCeremonyChange(ceremony.id, 'venueName', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded bg-stone-950 border border-stone-700 text-xs text-amber-100"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-stone-400 block mb-0.5">Dress Code:</label>
                  <input
                    type="text"
                    value={ceremony.dressCode || ''}
                    placeholder="e.g. Yellow & Floral, Emerald Green, Royal Traditional"
                    onChange={(e) => handleCeremonyChange(ceremony.id, 'dressCode', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded bg-stone-950 border border-stone-700 text-xs text-amber-100"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-stone-400 block mb-0.5">Description:</label>
                  <textarea
                    rows={2}
                    value={ceremony.description}
                    onChange={(e) => handleCeremonyChange(ceremony.id, 'description', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded bg-stone-950 border border-stone-700 text-xs text-amber-100 leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: THEME COLOR CHOICES */}
        {activeTab === 'theme' && (
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
              Royal Islamic Color Palettes
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {WEDDING_THEMES.map((th) => {
                const isSelected = weddingData.themeId === th.id;
                return (
                  <button
                    key={th.id}
                    onClick={() => handleTextChange('themeId', th.id)}
                    type="button"
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-400 bg-amber-400/15 shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                        : 'border-stone-800 bg-stone-900 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-cinzel text-xs font-bold text-amber-200">
                        {th.name}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                    </div>

                    {/* Color Swatch Bars */}
                    <div className="flex items-center gap-1.5 h-6 rounded overflow-hidden">
                      <div className="h-full flex-1" style={{ backgroundColor: th.primary }} />
                      <div className="h-full flex-1" style={{ backgroundColor: th.envelopeColor }} />
                      <div className="h-full flex-1" style={{ backgroundColor: th.accentGold }} />
                      <div className="h-full flex-1" style={{ backgroundColor: th.waxSealColor }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: MINE MUSIC & MINE PHOTO */}
        {activeTab === 'music' && (
          <div className="space-y-4">
            {/* Custom Photo Upload */}
            <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Image className="w-3.5 h-3.5" />
                <span>Mine Photo (Couple Portrait)</span>
              </span>

              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-amber-400/40 bg-black shrink-0">
                  <img
                    src={weddingData.couplePhotoUrl}
                    alt="Couple"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-400 text-amber-950 font-bold text-xs hover:brightness-110 cursor-pointer shadow">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Upload your favorite portrait. It features a gentle breathing zoom animation on the card!
                  </p>
                </div>
              </div>
            </div>

            {/* Custom Music Upload */}
            <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5" />
                <span>Mine Music &amp; Audio Tracks</span>
              </span>

              <div className="p-2.5 rounded-lg bg-stone-950 border border-stone-800 text-xs text-amber-200">
                <strong>Current Playing:</strong> {weddingData.musicTrackTitle}
              </div>

              <div>
                <label className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 font-bold text-xs hover:brightness-110 cursor-pointer shadow">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Mine Audio File (MP3/WAV)</span>
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={handleMusicUpload}
                  />
                </label>
              </div>

              {/* Presets */}
              <div className="pt-2 border-t border-stone-800">
                <span className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold block mb-1.5">
                  Or select curated halal wedding melodies:
                </span>
                <div className="space-y-1.5">
                  {AUDIO_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onUpdateWeddingData({
                          ...weddingData,
                          isCustomMusic: false,
                          selectedAudioPreset: p.id,
                          musicTrackTitle: p.name
                        });
                      }}
                      type="button"
                      className={`w-full p-2 rounded text-left text-xs flex items-center justify-between cursor-pointer ${
                        !weddingData.isCustomMusic && weddingData.selectedAudioPreset === p.id
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                          : 'bg-stone-950 text-stone-300 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{p.name}</span>
                      {!weddingData.isCustomMusic && weddingData.selectedAudioPreset === p.id && (
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ALL TEXTS & BLESSINGS */}
        {activeTab === 'texts' && (
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
              Texts, Quranic Verse &amp; Host Invitations
            </span>

            <div>
              <label className="text-[11px] text-stone-400 block mb-1">
                Quranic Verse / Islamic Blessing:
              </label>
              <textarea
                rows={3}
                value={weddingData.quranicVerse}
                onChange={(e) => handleTextChange('quranicVerse', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-xs text-amber-100 leading-relaxed"
              />
            </div>

            <div>
              <label className="text-[11px] text-stone-400 block mb-1">
                Surah / Hadith Reference:
              </label>
              <input
                type="text"
                value={weddingData.quranicReference}
                onChange={(e) => handleTextChange('quranicReference', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-xs text-amber-100"
              />
            </div>

            <div>
              <label className="text-[11px] text-stone-400 block mb-1">
                Warm Host Welcoming Message:
              </label>
              <textarea
                rows={3}
                value={weddingData.invitationMessage}
                onChange={(e) => handleTextChange('invitationMessage', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-xs text-amber-100 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-stone-400 block mb-1">
                  RSVP Host Contact Person:
                </label>
                <input
                  type="text"
                  value={weddingData.rsvpContactPerson}
                  onChange={(e) => handleTextChange('rsvpContactPerson', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-xs text-amber-100"
                />
              </div>

              <div>
                <label className="text-[11px] text-stone-400 block mb-1">
                  RSVP WhatsApp Phone:
                </label>
                <input
                  type="text"
                  value={weddingData.rsvpPhone}
                  onChange={(e) => handleTextChange('rsvpPhone', e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-xs text-amber-100"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Drawer Footer */}
      <div className="p-3 border-t border-stone-800 bg-stone-900 shrink-0 flex items-center justify-between">
        <span className="text-[11px] text-stone-400">
          All edits saved automatically to browser storage.
        </span>
        <button
          onClick={onClose}
          type="button"
          className="px-4 py-2 rounded-lg bg-amber-400 text-amber-950 font-bold text-xs hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        >
          Done Editing
        </button>
      </div>
    </div>
  );
};
