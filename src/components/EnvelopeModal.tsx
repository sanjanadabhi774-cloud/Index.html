import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Mail, Sparkles, Volume2 } from 'lucide-react';
import { CrescentStarBadge, RubElHizbStar } from './IslamicOrnaments';

interface EnvelopeModalProps {
  isOpen: boolean;
  onOpen: () => void;
  guestName?: string;
  groomName: string;
  brideName: string;
  themeColor?: string;
  waxSealColor?: string;
  weddingDate: string;
  envelopeGreeting?: string;
  envelopeInstruction?: string;
  bismillahText?: string;
}

export const EnvelopeModal: React.FC<EnvelopeModalProps> = ({
  isOpen,
  onOpen,
  guestName = 'Our Respected Guest & Family',
  groomName,
  brideName,
  themeColor = '#043527',
  waxSealColor = '#b45309',
  weddingDate,
  envelopeGreeting = 'Specially Invited',
  envelopeInstruction = 'Tap Wax Seal To Unfold Invitation',
  bismillahText = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'
}) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenEnvelope = () => {
    if (isOpening || isOpen) return;
    setIsOpening(true);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#d4af37', '#fef08a', '#10b981', '#f59e0b']
      });
    } catch {
      // Ignored
    }

    setTimeout(() => {
      onOpen();
      setIsOpening(false);
    }, 900);
  };

  if (isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
      <div className="flex flex-col items-center max-w-md w-full">
        {/* Helper subtitle */}
        <div className="flex items-center gap-2 mb-4 text-xs font-semibold tracking-widest uppercase text-amber-300 animate-pulse text-center">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{envelopeInstruction}</span>
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
        </div>

        {/* Envelope 3D Box */}
        <div
          onClick={handleOpenEnvelope}
          className="relative w-full aspect-[4/3] max-w-[380px] rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] cursor-pointer transform hover:scale-[1.02] transition-transform duration-300 perspective-1000 group"
          style={{
            backgroundColor: themeColor,
            border: '2px solid rgba(212, 175, 55, 0.45)'
          }}
        >
          {/* Subtle gold foil border insets */}
          <div className="absolute inset-2 rounded-lg border border-amber-400/25 pointer-events-none" />

          {/* Top Flap (Triangular) */}
          <div
            className={`absolute top-0 left-0 right-0 h-1/2 origin-top transition-transform duration-700 transform-style-3d z-30 ${
              isOpening ? '-rotate-x-180' : 'rotate-x-0'
            }`}
          >
            <svg
              viewBox="0 0 380 140"
              className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
              style={{ fill: themeColor }}
            >
              <polygon
                points="0,0 380,0 190,140"
                stroke="#d4af37"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
            </svg>
          </div>

          {/* Envelope Bottom Folds */}
          <div className="absolute inset-0 pointer-events-none z-10">
            <svg viewBox="0 0 380 285" className="w-full h-full opacity-60">
              <line x1="0" y1="285" x2="190" y2="140" stroke="#d4af37" strokeWidth="1" />
              <line x1="380" y1="285" x2="190" y2="140" stroke="#d4af37" strokeWidth="1" />
            </svg>
          </div>

          {/* Royal Wax Seal (Center of Flap) */}
          <div
            className={`absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 transition-all duration-500 ${
              isOpening ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
            }`}
          >
            {/* Glowing gold pulse ring */}
            <div className="absolute -inset-3 rounded-full border-2 border-amber-300/40 animate-ping pointer-events-none" />

            <div
              className="w-20 h-20 rounded-full flex flex-col items-center justify-center text-amber-200 shadow-2xl border-2 border-amber-300/80 cursor-pointer"
              style={{
                backgroundColor: waxSealColor,
                boxShadow: '0 0 25px rgba(212, 175, 55, 0.6), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -3px 6px rgba(0,0,0,0.6)'
              }}
            >
              <CrescentStarBadge size={22} className="text-amber-200" />
              <div className="font-cinzel text-[11px] font-black tracking-wider text-amber-100 mt-0.5">
                {groomName.charAt(0)} & {brideName.charAt(0)}
              </div>
            </div>
          </div>

          {/* Guest Label & Front Details (Lower portion of envelope) */}
          <div className="absolute bottom-5 left-4 right-4 z-20 text-center">
            <div className="text-[11px] font-amiri text-amber-300 tracking-wide mb-1">
              {bismillahText}
            </div>

            <div className="text-[10px] uppercase tracking-widest text-amber-200/70 font-semibold">
              {envelopeGreeting}
            </div>

            <h4 className="font-cinzel text-base sm:text-lg font-bold text-amber-100 tracking-wide mt-0.5 line-clamp-1">
              {guestName}
            </h4>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-amber-300/80 mt-1 font-medium">
              <RubElHizbStar size={12} className="text-amber-400" />
              <span>{groomName} & {brideName}</span>
              <RubElHizbStar size={12} className="text-amber-400" />
            </div>
          </div>
        </div>

        {/* Tap Prompt Button */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <button
            onClick={handleOpenEnvelope}
            type="button"
            className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-amber-950 bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 rounded-full shadow-[0_0_25px_rgba(212,175,55,0.6)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span>Open Royal Invitation</span>
            <Sparkles className="w-4 h-4" />
          </button>

          <span className="flex items-center gap-1.5 text-[11px] text-amber-200/70">
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Islamic wedding music will play on open</span>
          </span>
        </div>
      </div>
    </div>
  );
};
