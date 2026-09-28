import React, { useRef } from 'react';
import { Camera, Sparkles, Heart } from 'lucide-react';
import { RubElHizbStar } from './IslamicOrnaments';

interface CouplePhotoSectionProps {
  photoUrl: string;
  groomName: string;
  brideName: string;
  onPhotoUpload?: (url: string) => void;
  accentGold?: string;
  isEditable?: boolean;
}

export const CouplePhotoSection: React.FC<CouplePhotoSectionProps> = ({
  photoUrl,
  groomName,
  brideName,
  onPhotoUpload,
  accentGold = '#d4af37',
  isEditable = true
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onPhotoUpload) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onPhotoUpload(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center my-8 px-4">
      {/* Decorative Top Accent */}
      <div className="flex items-center gap-2 mb-3">
        <RubElHizbStar size={14} className="text-amber-400" />
        <span className="text-[11px] font-semibold tracking-widest uppercase text-amber-300">
          The Blessed Couple
        </span>
        <RubElHizbStar size={14} className="text-amber-400" />
      </div>

      {/* Royal Arch Photo Frame with Subtle Floating Animation */}
      <div className="relative group max-w-[320px] sm:max-w-[360px] w-full">
        {/* Outer Glow Halo */}
        <div
          className="absolute -inset-2 rounded-t-[140px] rounded-b-2xl opacity-75 blur-md transition-opacity duration-1000 group-hover:opacity-100 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${accentGold}66 0%, transparent 75%)`
          }}
        />

        {/* Arch Frame */}
        <div
          className="relative overflow-hidden rounded-t-[140px] rounded-b-2xl border-4 p-1.5 shadow-2xl backdrop-blur-sm"
          style={{
            borderColor: accentGold,
            background: 'linear-gradient(180deg, rgba(212, 175, 55, 0.3) 0%, rgba(10, 10, 10, 0.8) 100%)'
          }}
        >
          {/* Inner Border Line */}
          <div className="relative w-full h-[380px] sm:h-[420px] overflow-hidden rounded-t-[130px] rounded-b-xl bg-black">
            {/* The Animated Image */}
            <img
              src={photoUrl}
              alt={`${groomName} and ${brideName}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transition-transform duration-[12000ms] ease-in-out hover:scale-105 animate-[pulse_10s_ease-in-out_infinite]"
              style={{
                animation: 'subtleBreathing 12s ease-in-out infinite alternate'
              }}
            />

            {/* Bottom Scrim Gradient for Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

            {/* Bottom Caption Inside Frame */}
            <div className="absolute bottom-4 inset-x-0 text-center px-4">
              <div className="flex items-center justify-center gap-1.5 text-amber-300 text-xs font-semibold mb-1">
                <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Two Souls, One Heart</span>
                <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              </div>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide drop-shadow-md">
                {groomName} & {brideName}
              </h3>
            </div>

            {/* Upload Button Overlay */}
            {isEditable && onPhotoUpload && (
              <button
                onClick={() => fileInputRef.current?.click()}
                type="button"
                className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-300/50 text-amber-200 text-xs font-medium hover:bg-amber-400 hover:text-amber-950 transition-all cursor-pointer shadow-lg"
                title="Upload Couple Photo"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Change Photo</span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes subtleBreathing {
          0% {
            transform: scale(1) translate(0, 0);
          }
          50% {
            transform: scale(1.04) translate(0, -4px);
          }
          100% {
            transform: scale(1) translate(0, 0);
          }
        }
      `}</style>
    </div>
  );
};
