import React, { useState } from 'react';
import { Send, Copy, Check, Sparkles, MessageCircle, X } from 'lucide-react';
import { WeddingData } from '../types/wedding';

interface WhatsAppShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  weddingData: WeddingData;
  appUrl: string;
}

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({
  isOpen,
  onClose,
  weddingData,
  appUrl
}) => {
  const [guestName, setGuestName] = useState('Respected Guest & Family');
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = appUrl || window.location.origin + window.location.pathname;
  const encodedGuest = encodeURIComponent(guestName.trim());
  const personalizedLink = `${currentUrl}?guest=${encodedGuest}`;

  const messageText = `✨ *بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ* ✨
*As-salamu alaykum wa rahmatullahi wa barakatuh!*

Dear *${guestName.trim()}*,

With hearts filled with joy and gratitude to Allah (SWT), we cordially invite you with your beloved family to celebrate the auspicious wedding ceremony of:

✨ *${weddingData.groomPrefix || ''} ${weddingData.groomName}* ✨
&
✨ *${weddingData.bridePrefix || ''} ${weddingData.brideName}* ✨

🕌 *Main Ceremony:* ${weddingData.mainCeremonyTitle}
📅 *Date:* ${weddingData.mainWeddingDate} at ${weddingData.mainWeddingTime}
📍 *Venue:* ${weddingData.mainVenueName}, ${weddingData.mainVenueAddress}

Tap the link below to open your personalized royal envelope, view Haldi, Mehendi & Walima functions, scratch to reveal the date, and bless the couple:

💌 *Your Personal Royal Invitation:*
${personalizedLink}

Your gracious presence and precious du'as will be a tremendous blessing for us!

Warm regards,
*${weddingData.groomParents}* & *${weddingData.brideParents}*`;

  const handleShareWhatsApp = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(messageText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(personalizedLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-950 border border-amber-400/60 p-6 shadow-2xl text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-amber-300 hover:text-white p-1 rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-1">
            <MessageCircle className="w-4 h-4 fill-emerald-400 text-emerald-950" />
            <span>WhatsApp Guest Invitation</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>

          <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-amber-200">
            Send Royal Invite on WhatsApp
          </h3>

          <p className="text-xs text-slate-300 mt-1">
            Personalize each guest&apos;s name so their envelope opens with their name embossed!
          </p>
        </div>

        {/* Guest Name Input */}
        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1.5">
            Guest / Family Name (for personalized link):
          </label>
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="e.g. Uncle Rashid & Family, or Dr. Ayesha Siddiqui"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-amber-400/40 text-amber-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 text-sm"
          />
        </div>

        {/* Message Preview Box */}
        <div className="mb-5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1.5">
            WhatsApp Message Preview:
          </label>
          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-100 text-xs max-h-40 overflow-y-auto whitespace-pre-wrap font-sans leading-relaxed select-text">
            {messageText}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleShareWhatsApp}
            type="button"
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Send via WhatsApp</span>
          </button>

          <button
            onClick={handleCopyLink}
            type="button"
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-slate-900 border border-amber-400/40 text-amber-300 font-semibold text-xs hover:bg-slate-800 transition-all cursor-pointer whitespace-nowrap"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{isCopied ? 'Link Copied!' : 'Copy Guest Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
