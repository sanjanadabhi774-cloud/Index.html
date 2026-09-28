/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Share2,
  Printer,
  Edit3,
  Mail,
  Heart,
  Calendar,
  MapPin,
  Volume2,
  CheckCircle,
  MessageCircle,
  Clock,
  Eye
} from 'lucide-react';
import { WeddingData, WeddingTheme } from './types/wedding';
import { DEFAULT_WEDDING_DATA, WEDDING_THEMES } from './constants/defaultData';
import {
  BismillahCalligraphy,
  CrescentStarBadge,
  IslamicCornerOrnament,
  IslamicDivider,
  RubElHizbStar
} from './components/IslamicOrnaments';
import { EnvelopeModal } from './components/EnvelopeModal';
import { HeartScratchCard } from './components/HeartScratchCard';
import { CountdownTimer } from './components/CountdownTimer';
import { CeremoniesTimeline } from './components/CeremoniesTimeline';
import { CouplePhotoSection } from './components/CouplePhotoSection';
import { AudioFloatingPlayer } from './components/AudioFloatingPlayer';
import { EditorDrawer } from './components/EditorDrawer';
import { WhatsAppShareModal } from './components/WhatsAppShareModal';
import { PdfExportModal } from './components/PdfExportModal';
import { RsvpModal } from './components/RsvpModal';
import { weddingAudio } from './utils/audioPlayer';

const STORAGE_KEY = 'noor_e_nikah_wedding_data_v1';

export default function App() {
  const [weddingData, setWeddingData] = useState<WeddingData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_WEDDING_DATA;
  });

  const [guestName, setGuestName] = useState<string>('Our Honored Guest & Family');
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);

  // Extract guest parameter from URL if shared via WhatsApp
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const guestParam = params.get('guest');
      if (guestParam) {
        setGuestName(decodeURIComponent(guestParam));
      }
    } catch {
      // Fallback
    }
  }, []);

  // Sync to local storage
  const handleUpdateWeddingData = (updated: WeddingData) => {
    setWeddingData(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Storage quota fallback
    }
  };

  // Find active theme object
  const currentTheme: WeddingTheme =
    WEDDING_THEMES.find((t) => t.id === weddingData.themeId) || WEDDING_THEMES[0];

  // Handler when user taps envelope open
  const handleEnvelopeOpened = () => {
    setIsEnvelopeOpen(true);
    // Start background music automatically on user interaction
    weddingAudio.play(
      weddingData.isCustomMusic ? weddingData.customMusicUrl : undefined,
      weddingData.selectedAudioPreset
    );
  };

  const handleUpdateMusic = (
    title: string,
    isCustom: boolean,
    preset: string,
    customUrl?: string
  ) => {
    handleUpdateWeddingData({
      ...weddingData,
      musicTrackTitle: title,
      isCustomMusic: isCustom,
      selectedAudioPreset: preset,
      customMusicUrl: customUrl || weddingData.customMusicUrl
    });
  };

  return (
    <div
      className={`min-h-screen relative font-sans text-slate-100 selection:bg-amber-400 selection:text-amber-950 bg-gradient-to-b ${currentTheme.bgGradient}`}
    >
      {/* Background Islamic Arabesque Texture Overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-25 mix-blend-overlay bg-cover bg-center"
        style={{
          backgroundImage: `url('/src/assets/images/islamic_wedding_bg_1790615554688.jpg')`
        }}
      />

      {/* Floating Audio Player (Top Right) */}
      <AudioFloatingPlayer
        currentTrackTitle={weddingData.musicTrackTitle}
        isCustomMusic={weddingData.isCustomMusic}
        selectedPreset={weddingData.selectedAudioPreset}
        customMusicUrl={weddingData.customMusicUrl}
        onUpdateMusic={handleUpdateMusic}
      />

      {/* TOP NAVIGATION BAR CONTRACT (Zone 1: Single Brand wordmark, Zone 2: Nav links, Zone 3: Actions) */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-black/60 border-b border-amber-400/30 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Zone 1: Single text element wordmark in display face */}
          <div className="flex items-center gap-2">
            <CrescentStarBadge size={22} className="text-amber-400" />
            <span className="font-cinzel text-lg sm:text-xl font-bold tracking-wider text-amber-200">
              Noor-e-Nikah
            </span>
          </div>

          {/* Zone 2: 4 Clean Navigation Text Links with subtle hover underlines */}
          <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wider font-medium text-amber-100/80">
            <a href="#invitation" className="hover:text-amber-300 transition-colors">
              Invitation
            </a>
            <a href="#countdown" className="hover:text-amber-300 transition-colors">
              Countdown
            </a>
            <a href="#reveal-date" className="hover:text-amber-300 transition-colors">
              Reveal Date
            </a>
            <a href="#ceremonies" className="hover:text-amber-300 transition-colors">
              Functions
            </a>
            <a href="#rsvp" className="hover:text-amber-300 transition-colors">
              RSVP
            </a>
          </nav>

          {/* Zone 3: Primary Actions (WhatsApp Share, PDF Export, Edit) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsWhatsAppOpen(true)}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
              title="Share on WhatsApp with Guest Name"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp Invite</span>
            </button>

            <button
              onClick={() => setIsPdfModalOpen(true)}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 border border-amber-400/40 text-amber-200 hover:bg-stone-700 font-medium text-xs transition-all cursor-pointer whitespace-nowrap"
              title="Download or Print PDF Invitation"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">PDF</span>
            </button>

            <button
              onClick={() => setIsEditorOpen(true)}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow cursor-pointer whitespace-nowrap"
              title="Customize Names, Dates, Photo, Music & Themes"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Customize</span>
            </button>
          </div>
        </div>
      </header>

      {/* Re-Open Envelope Floating Button if closed */}
      {isEnvelopeOpen && (
        <div className="fixed bottom-4 left-4 z-40 no-print">
          <button
            onClick={() => setIsEnvelopeOpen(false)}
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-stone-900/90 border border-amber-400/50 text-amber-200 text-xs font-semibold shadow-xl hover:bg-stone-800 transition-all cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-amber-400" />
            <span>View Envelope</span>
          </button>
        </div>
      )}

      {/* Interactive 3D Envelope Modal */}
      <EnvelopeModal
        isOpen={isEnvelopeOpen}
        onOpen={handleEnvelopeOpened}
        guestName={guestName}
        groomName={weddingData.groomName}
        brideName={weddingData.brideName}
        themeColor={currentTheme.envelopeColor}
        waxSealColor={currentTheme.waxSealColor}
        weddingDate={weddingData.mainWeddingDate}
      />

      {/* MAIN WEDDING INVITATION PRESENTATION */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Guest Welcoming Banner */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-200 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Honoring Our Respected Guest: <strong>{guestName}</strong></span>
          </div>
        </div>

        {/* PRIMARY INVITATION CARD (Luxury Royal Arch Container) */}
        <div
          id="invitation"
          className="relative rounded-3xl p-6 sm:p-12 border-2 shadow-[0_25px_70px_rgba(0,0,0,0.85)] backdrop-blur-md overflow-hidden text-center"
          style={{
            borderColor: currentTheme.accentGold,
            backgroundColor: currentTheme.cardBg
          }}
        >
          {/* Islamic Arabesque Corner Filigree */}
          <IslamicCornerOrnament position="top-left" />
          <IslamicCornerOrnament position="top-right" />
          <IslamicCornerOrnament position="bottom-left" />
          <IslamicCornerOrnament position="bottom-right" />

          {/* Top Crescent & Bismillah Calligraphy */}
          <div className="flex flex-col items-center">
            <CrescentStarBadge size={36} className="text-amber-400 mb-2" />
            <BismillahCalligraphy className="h-12 sm:h-14 my-2" />

            <div className="max-w-xl mx-auto my-3 px-4">
              <p className="font-amiri text-sm sm:text-base text-amber-200/90 italic leading-relaxed">
                {weddingData.quranicVerse}
              </p>
              <div className="text-[11px] font-sans text-amber-300/80 font-semibold tracking-wider mt-1">
                — {weddingData.quranicReference}
              </div>
            </div>
          </div>

          <IslamicDivider />

          {/* Host Family Invitation Request */}
          <div className="max-w-2xl mx-auto my-4 text-center">
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300/90 block mb-2">
              With The Grace of Allah (SWT)
            </span>

            <div className="text-sm sm:text-base font-medium text-amber-100">
              {weddingData.groomParents}
            </div>

            <div className="text-xs uppercase tracking-widest text-amber-400/80 font-bold my-1">
              &amp;
            </div>

            <div className="text-sm sm:text-base font-medium text-amber-100 mb-3">
              {weddingData.brideParents}
            </div>

            <p className="text-xs sm:text-sm text-amber-200/80 leading-relaxed max-w-lg mx-auto italic">
              {weddingData.invitationMessage}
            </p>
          </div>

          {/* Couple Photo Section with subtle breathing zoom animation */}
          <CouplePhotoSection
            photoUrl={weddingData.couplePhotoUrl}
            groomName={weddingData.groomName}
            brideName={weddingData.brideName}
            onPhotoUpload={(url) => handleUpdateWeddingData({ ...weddingData, couplePhotoUrl: url })}
            accentGold={currentTheme.accentGold}
            isEditable={true}
          />

          {/* Couple Names Lockup in Royal Serif */}
          <div className="my-6">
            <div className="font-cinzel text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 tracking-wide drop-shadow-md">
              {weddingData.groomPrefix && (
                <span className="text-xl sm:text-2xl text-amber-300 font-medium mr-2">
                  {weddingData.groomPrefix}
                </span>
              )}
              {weddingData.groomName}
            </div>

            <div className="flex items-center justify-center gap-3 my-2 text-amber-400 font-amiri text-2xl font-bold">
              <span>و</span>
            </div>

            <div className="font-cinzel text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 tracking-wide drop-shadow-md">
              {weddingData.bridePrefix && (
                <span className="text-xl sm:text-2xl text-amber-300 font-medium mr-2">
                  {weddingData.bridePrefix}
                </span>
              )}
              {weddingData.brideName}
            </div>
          </div>

          {/* Main Ceremony Highlight Badge */}
          <div className="inline-block my-3 px-5 py-2 rounded-xl bg-black/40 border border-amber-400/50 backdrop-blur-sm">
            <div className="font-cinzel text-sm sm:text-base font-bold text-amber-200">
              {weddingData.mainCeremonyTitle}
            </div>
            <div className="text-xs text-amber-300/80 font-amiri mt-0.5">
              {weddingData.hijriDate}
            </div>
          </div>

          {/* Date & Venue Section */}
          <div className="max-w-md mx-auto my-4 p-4 rounded-2xl bg-black/30 border border-amber-400/20 text-xs sm:text-sm text-amber-100">
            <div className="flex items-center justify-center gap-2 mb-1.5 font-semibold text-white">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>{weddingData.mainWeddingDate} &middot; {weddingData.mainWeddingTime}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-amber-200/90">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{weddingData.mainVenueName}, {weddingData.mainVenueAddress}</span>
            </div>
          </div>

          <IslamicDivider />

          {/* 1. PROMINENT REAL-TIME COUNTDOWN TIMER */}
          <section id="countdown">
            <CountdownTimer
              targetDate={weddingData.mainWeddingDate}
              targetTime={weddingData.mainWeddingTime}
              ceremonyTitle={weddingData.mainCeremonyTitle}
              venueName={weddingData.mainVenueName}
              venueAddress={weddingData.mainVenueAddress}
              accentGold={currentTheme.accentGold}
            />
          </section>

          {/* 2. HEART SCRATCH CARD TO REVEAL DATE */}
          <section id="reveal-date" className="my-10">
            <div className="text-center mb-2">
              <h3 className="font-cinzel text-2xl font-bold text-white tracking-wide">
                Interactive Heart Scratch Card
              </h3>
              <p className="text-xs text-amber-200/80">
                Scratch the golden heart with your finger or mouse to unveil the wedding date!
              </p>
            </div>

            <HeartScratchCard
              weddingDate={weddingData.mainWeddingDate}
              hijriDate={weddingData.hijriDate}
              ceremonyTitle={weddingData.mainCeremonyTitle}
              accentGold={currentTheme.accentGold}
            />
          </section>

          <IslamicDivider />

          {/* 3. CEREMONIES TIMELINE (Haldi, Mehendi, Nikah, Walima) */}
          <section id="ceremonies">
            <CeremoniesTimeline
              ceremonies={weddingData.ceremonies}
              accentGold={currentTheme.accentGold}
              isEditable={true}
              onEditCeremony={() => setIsEditorOpen(true)}
            />
          </section>

          <IslamicDivider />

          {/* 4. RSVP & DU'AS SECTION */}
          <section id="rsvp" className="my-8">
            <div className="p-6 sm:p-8 rounded-2xl bg-black/40 border border-amber-400/40 text-center max-w-xl mx-auto">
              <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-widest uppercase text-amber-300 mb-1">
                <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Blessings &amp; Confirmations</span>
                <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              </div>

              <h4 className="font-cinzel text-xl sm:text-2xl font-bold text-white mb-2">
                Kindly Grace Us With Your Presence
              </h4>

              <p className="text-xs text-amber-200/80 mb-5 leading-relaxed">
                Please confirm your attendance or send your heartful du&apos;as so we may welcome you with the warmest hospitality.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setIsRsvpOpen(true)}
                  type="button"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send RSVP via WhatsApp</span>
                </button>

                <button
                  onClick={() => setIsWhatsAppOpen(true)}
                  type="button"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 border border-amber-400/40 text-amber-200 hover:bg-slate-800 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Invite Link</span>
                </button>
              </div>

              <div className="mt-4 text-[11px] text-amber-300/70">
                <strong>RSVP Queries:</strong> {weddingData.rsvpContactPerson} &middot; {weddingData.rsvpPhone}
              </div>
            </div>
          </section>

          {/* Footer Islamic Dua */}
          <div className="mt-12 text-center text-xs text-amber-300/80 font-amiri text-lg">
            بارك الله لكما وبارك عليكما وجمع بينكما في خير
            <div className="font-sans text-[11px] text-amber-200/60 not-italic mt-1">
              &quot;May Allah bless for you, and shower His blessings upon you, and bring you together in goodness.&quot;
            </div>
          </div>
        </div>

        {/* Quiet Footer */}
        <footer className="mt-12 text-center text-xs text-amber-300/60 no-print pb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <RubElHizbStar size={12} className="text-amber-400/70" />
            <span className="font-cinzel tracking-wider text-amber-200">Noor-e-Nikah</span>
            <RubElHizbStar size={12} className="text-amber-400/70" />
          </div>
          <p>Created for Muslim &amp; Islamic Wedding Celebrations &middot; Shareable on WhatsApp &amp; PDF Export</p>
        </footer>
      </main>

      {/* Editor Drawer for Customization */}
      <EditorDrawer
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        weddingData={weddingData}
        onUpdateWeddingData={handleUpdateWeddingData}
      />

      {/* WhatsApp Share Modal */}
      <WhatsAppShareModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        weddingData={weddingData}
        appUrl={window.location.origin + window.location.pathname}
      />

      {/* PDF Export Modal */}
      <PdfExportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        weddingData={weddingData}
        currentTheme={currentTheme}
      />

      {/* RSVP Modal */}
      <RsvpModal
        isOpen={isRsvpOpen}
        onClose={() => setIsRsvpOpen(false)}
        weddingData={weddingData}
        guestName={guestName !== 'Our Honored Guest & Family' ? guestName : ''}
      />
    </div>
  );
}
