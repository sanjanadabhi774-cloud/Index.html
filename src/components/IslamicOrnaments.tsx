import React from 'react';

export const BismillahCalligraphy: React.FC<{ className?: string; color?: string }> = ({
  className = "w-72 h-16",
  color = "#d4af37"
}) => {
  return (
    <div className={`flex items-center justify-center my-3 select-none ${className}`}>
      {/* Authentic decorative Arabic typography with gold shimmering styling */}
      <div className="text-center font-amiri font-bold text-2xl md:text-3xl tracking-wide leading-relaxed text-amber-300 drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]">
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </div>
    </div>
  );
};

export const CrescentStarBadge: React.FC<{ className?: string; size?: number }> = ({
  className = "w-8 h-8",
  size = 32
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`text-amber-400 drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] ${className}`}
    >
      <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c.4-.24.83-.43 1.28-.56A8.93 8.93 0 0 0 12 3z" />
      <polygon points="17.5,4.5 18.5,7 21,7.2 19,9 19.6,11.5 17.5,10.2 15.4,11.5 16,9 14,7.2 16.5,7" />
    </svg>
  );
};

export const IslamicCornerOrnament: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}> = ({ position, className = "w-16 h-16 md:w-24 md:h-24" }) => {
  const getRotation = () => {
    switch (position) {
      case 'top-left':
        return '';
      case 'top-right':
        return 'rotate-90';
      case 'bottom-right':
        return 'rotate-180';
      case 'bottom-left':
        return '-rotate-90';
    }
  };

  return (
    <div className={`pointer-events-none absolute text-amber-400/80 ${getRotation()} ${className}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Ornate Islamic Arabesque Corner Filigree */}
        <path
          d="M4 4 L4 50 C4 35 15 24 30 24 C45 24 56 35 56 50 C56 65 67 76 82 76 L96 76"
          stroke="url(#goldGrad)"
          strokeWidth="1.5"
        />
        <path
          d="M4 4 L50 4 C35 4 24 15 24 30 C24 45 35 56 50 56 C65 56 76 67 76 82 L76 96"
          stroke="url(#goldGrad)"
          strokeWidth="1.5"
        />
        <circle cx="28" cy="28" r="4" fill="url(#goldGrad)" />
        <circle cx="52" cy="18" r="2.5" fill="url(#goldGrad)" />
        <circle cx="18" cy="52" r="2.5" fill="url(#goldGrad)" />
        <path
          d="M8 8 L40 8 C40 18 32 26 22 26 C12 26 8 16 8 8 Z"
          stroke="url(#goldGrad)"
          strokeWidth="1"
          fill="none"
        />
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#aa7c11" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export const RubElHizbStar: React.FC<{ size?: number; className?: string }> = ({
  size = 24,
  className = "text-amber-400"
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="5" y="5" width="14" height="14" stroke="currentColor" strokeWidth="1.5" />
      <rect x="5" y="5" width="14" height="14" stroke="currentColor" strokeWidth="1.5" transform="rotate(45 12 12)" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    </svg>
  );
};

export const IslamicDivider: React.FC<{ className?: string }> = ({ className = "my-6" }) => {
  return (
    <div className={`flex items-center justify-center gap-3 w-full opacity-90 ${className}`}>
      <div className="h-[1px] flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-amber-400/80" />
      <div className="flex items-center gap-1.5 text-amber-400">
        <span className="w-1.5 h-1.5 rotate-45 bg-amber-400/70" />
        <RubElHizbStar size={18} className="text-amber-300" />
        <span className="w-1.5 h-1.5 rotate-45 bg-amber-400/70" />
      </div>
      <div className="h-[1px] flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-amber-400/80" />
    </div>
  );
};
