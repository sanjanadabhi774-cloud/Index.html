import React, { useState } from 'react';
import { Printer, Download, X, Sparkles, Check, FileText } from 'lucide-react';
import { WeddingData, WeddingTheme } from '../types/wedding';
import { BismillahCalligraphy, CrescentStarBadge, IslamicDivider, RubElHizbStar } from './IslamicOrnaments';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  weddingData: WeddingData;
  currentTheme: WeddingTheme;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  isOpen,
  onClose,
  weddingData,
  currentTheme
}) => {
  const [activeTab, setActiveTab] = useState<'card1' | 'card2'>('card1');

  if (!isOpen) return null;

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto select-none">
      <div className="relative w-full max-w-2xl rounded-2xl bg-stone-950 border border-amber-400/60 p-4 sm:p-6 shadow-2xl text-white my-auto max-h-[95vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-amber-300 hover:text-white p-1 rounded-full cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-4 shrink-0">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-widest uppercase text-amber-400 mb-1">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>High-Resolution Printable PDF</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>

          <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-amber-100">
            Export Wedding Invitation as PDF
          </h3>

          <p className="text-xs text-amber-200/70 mt-1">
            Click &quot;Save / Print as PDF&quot; and choose <strong>&quot;Save as PDF&quot;</strong> in your browser print window.
          </p>
        </div>

        {/* Tab switcher for preview */}
        <div className="flex items-center justify-center gap-2 mb-4 shrink-0">
          <button
            onClick={() => setActiveTab('card1')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'card1'
                ? 'bg-amber-400 text-amber-950 shadow-md'
                : 'bg-stone-900 text-stone-300 hover:text-white'
            }`}
          >
            Page 1: Royal Invitation Card
          </button>
          <button
            onClick={() => setActiveTab('card2')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'card2'
                ? 'bg-amber-400 text-amber-950 shadow-md'
                : 'bg-stone-900 text-stone-300 hover:text-white'
            }`}
          >
            Page 2: Functions & Ceremonies
          </button>
        </div>

        {/* Card Preview Container (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 rounded-xl bg-stone-900 border border-stone-800 flex justify-center">
          {activeTab === 'card1' ? (
            /* Page 1: Main Nikah Card */
            <div
              className="w-full max-w-[460px] rounded-xl p-6 sm:p-8 text-center text-stone-900 shadow-2xl relative border-4 border-double"
              style={{
                backgroundColor: '#fffdf7',
                borderColor: '#b8860b'
              }}
            >
              {/* Gold Filigree Inset Border */}
              <div className="absolute inset-2 border border-amber-600/40 rounded-lg pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center">
                <CrescentStarBadge size={28} className="text-amber-700 mb-2" />
                <BismillahCalligraphy className="h-10 my-1" color="#854d0e" />

                <div className="font-amiri text-xs text-amber-900/80 italic max-w-sm mt-1 mb-3">
                  {weddingData.quranicVerse}
                  <div className="text-[10px] font-sans not-italic text-amber-800 font-semibold mt-0.5">
                    — {weddingData.quranicReference}
                  </div>
                </div>

                <div className="text-[11px] uppercase tracking-widest text-amber-900 font-semibold">
                  With The Blessings of Allah (SWT)
                </div>

                <div className="text-xs text-stone-700 my-1 font-medium">
                  {weddingData.groomParents}
                </div>

                <div className="text-[10px] uppercase tracking-wider text-amber-800 my-0.5">
                  &amp;
                </div>

                <div className="text-xs text-stone-700 mb-3 font-medium">
                  {weddingData.brideParents}
                </div>

                <div className="text-xs text-stone-600 italic max-w-xs mb-4">
                  Request the honor of your gracious presence at the wedding ceremony of their children
                </div>

                {/* Couple Names */}
                <div className="my-2 py-2 border-y border-amber-600/30 w-full">
                  <h4 className="font-cinzel text-xl sm:text-2xl font-bold text-amber-950">
                    {weddingData.groomPrefix} {weddingData.groomName}
                  </h4>
                  <div className="text-sm font-amiri font-bold text-amber-800 my-0.5">
                    و
                  </div>
                  <h4 className="font-cinzel text-xl sm:text-2xl font-bold text-amber-950">
                    {weddingData.bridePrefix} {weddingData.brideName}
                  </h4>
                </div>

                {/* Date & Venue */}
                <div className="mt-3 text-xs text-stone-800 space-y-1">
                  <div className="font-bold text-sm text-amber-900 font-cinzel">
                    {weddingData.mainCeremonyTitle}
                  </div>
                  <div className="font-semibold text-stone-900">
                    {weddingData.mainWeddingDate} &middot; {weddingData.mainWeddingTime}
                  </div>
                  <div className="text-[11px] font-amiri text-amber-900">
                    {weddingData.hijriDate}
                  </div>
                  <div className="text-xs font-medium text-stone-700 mt-2">
                    {weddingData.mainVenueName}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    {weddingData.mainVenueAddress}
                  </div>
                </div>

                {/* RSVP Contact */}
                <div className="mt-4 pt-3 border-t border-amber-600/20 w-full text-[11px] text-stone-600">
                  <span><strong>RSVP:</strong> {weddingData.rsvpContactPerson} ({weddingData.rsvpPhone})</span>
                </div>
              </div>
            </div>
          ) : (
            /* Page 2: Functions & Ceremonies */
            <div
              className="w-full max-w-[460px] rounded-xl p-6 sm:p-8 text-stone-900 shadow-2xl relative border-4 border-double"
              style={{
                backgroundColor: '#fffdf7',
                borderColor: '#b8860b'
              }}
            >
              <div className="absolute inset-2 border border-amber-600/40 rounded-lg pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center">
                <h4 className="font-cinzel text-xl font-bold text-amber-950 text-center mb-1">
                  Celebration Itinerary
                </h4>
                <div className="text-[11px] text-amber-800 font-medium text-center mb-4">
                  Haldi &middot; Mehendi &middot; Nikah &middot; Walima
                </div>

                <div className="w-full space-y-3">
                  {weddingData.ceremonies.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 rounded-lg border border-amber-600/25 bg-amber-50/50 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <h5 className="font-cinzel text-sm font-bold text-amber-950">
                          {c.name}
                        </h5>
                        <span className="text-[11px] font-semibold text-amber-800">
                          {c.date}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-700 font-medium mt-0.5">
                        ⏰ {c.time} &middot; 📍 {c.venueName}
                      </div>
                      {c.dressCode && (
                        <div className="text-[10px] text-amber-900 mt-1">
                          👗 <strong>Dress Code:</strong> {c.dressCode}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-5 text-center text-xs text-stone-600 italic">
                  &quot;Your gracious presence and prayers are our most treasured gift.&quot;
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-3 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-stone-400">
            Tip: Enable &quot;Background graphics&quot; in the print dialog for full colors.
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintPdf}
              type="button"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 text-amber-950 font-bold text-xs sm:text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Save / Print as PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
