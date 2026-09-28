import React from 'react';
import { Ceremony } from '../types/wedding';
import { Calendar, Clock, MapPin, Sparkles, Navigation, Shirt, CalendarPlus } from 'lucide-react';
import { RubElHizbStar } from './IslamicOrnaments';

interface CeremoniesTimelineProps {
  ceremonies: Ceremony[];
  accentGold?: string;
  onEditCeremony?: (ceremony: Ceremony) => void;
  isEditable?: boolean;
  sectionHeading?: string;
  sectionSubheading?: string;
}

export const CeremoniesTimeline: React.FC<CeremoniesTimelineProps> = ({
  ceremonies,
  accentGold = '#d4af37',
  onEditCeremony,
  isEditable = false,
  sectionHeading = 'Sacred Ceremonies & Celebrations',
  sectionSubheading = 'Please grace every auspicious function with your heartfelt presence and du\'as'
}) => {
  const getIconBadge = (iconType: string) => {
    switch (iconType) {
      case 'haldi':
        return {
          bg: 'bg-amber-500/20 text-yellow-300 border-amber-400/50',
          symbol: '🟡',
          label: 'Haldi'
        };
      case 'mehendi':
        return {
          bg: 'bg-emerald-600/20 text-emerald-300 border-emerald-400/50',
          symbol: '🌿',
          label: 'Mehendi'
        };
      case 'sangeet':
        return {
          bg: 'bg-purple-600/20 text-purple-300 border-purple-400/50',
          symbol: '🎶',
          label: 'Qawwali'
        };
      case 'nikah':
        return {
          bg: 'bg-amber-400/25 text-amber-200 border-amber-300',
          symbol: '💍',
          label: 'Nikah'
        };
      case 'walima':
        return {
          bg: 'bg-rose-500/20 text-rose-300 border-rose-400/50',
          symbol: '👑',
          label: 'Walima'
        };
      default:
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-400/50',
          symbol: '✨',
          label: 'Function'
        };
    }
  };

  const handleAddToCalendar = (ceremony: Ceremony) => {
    const startTimeStr = ceremony.date.replace(/-/g, '') + 'T120000Z';
    const endTimeStr = ceremony.date.replace(/-/g, '') + 'T160000Z';
    const title = encodeURIComponent(`${ceremony.name} - Wedding Ceremony`);
    const details = encodeURIComponent(`${ceremony.description}\nDress Code: ${ceremony.dressCode || 'Traditional'}`);
    const location = encodeURIComponent(`${ceremony.venueName}, ${ceremony.venueAddress}`);

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTimeStr}/${endTimeStr}&details=${details}&location=${location}`;
    window.open(googleCalendarUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full my-10 px-2 sm:px-4">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-widest uppercase text-amber-300 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Wedding Itinerary & Functions</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </div>

        <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-white tracking-wide">
          Sacred Ceremonies & Celebrations
        </h3>

        <p className="text-xs sm:text-sm text-amber-200/80 mt-1 max-w-md mx-auto">
          Please grace every auspicious function with your heartfelt presence and du&apos;as
        </p>
      </div>

      {/* Timeline List */}
      <div className="relative max-w-3xl mx-auto space-y-6">
        {/* Subtle center golden line for md screens */}
        <div className="hidden md:block absolute left-8 top-4 bottom-4 w-[2px] bg-gradient-to-b from-amber-400/80 via-amber-300/40 to-transparent" />

        {ceremonies.map((ceremony, idx) => {
          const badge = getIconBadge(ceremony.iconType);
          const formattedDate = (() => {
            try {
              const d = new Date(ceremony.date + 'T12:00:00');
              return d.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });
            } catch {
              return ceremony.date;
            }
          })();

          return (
            <div
              key={ceremony.id}
              className="relative md:pl-20 group"
            >
              {/* Timeline Dot Indicator */}
              <div className="hidden md:flex absolute left-5 top-6 -translate-x-1/2 w-7 h-7 rounded-full bg-slate-900 border-2 border-amber-400 items-center justify-center text-xs shadow-lg group-hover:scale-110 transition-transform">
                <span>{badge.symbol}</span>
              </div>

              {/* Ceremony Card */}
              <div
                className="relative rounded-2xl p-5 sm:p-6 border backdrop-blur-md transition-all duration-300 hover:shadow-xl"
                style={{
                  borderColor: `${accentGold}55`,
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.4) 100%)'
                }}
              >
                {/* Top Row: Name, Arabic title & Badge */}
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-amber-400/20 pb-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="md:hidden text-lg">{badge.symbol}</span>
                      <h4 className="font-cinzel text-lg sm:text-xl font-bold text-amber-100 tracking-wide">
                        {ceremony.name}
                      </h4>
                    </div>

                    {ceremony.arabicSubtitle && (
                      <div className="font-amiri text-sm text-amber-300/90 mt-0.5">
                        {ceremony.arabicSubtitle}
                      </div>
                    )}
                  </div>

                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${badge.bg}`}>
                    {badge.label}
                  </span>
                </div>

                {/* Key Meta: Date, Time & Venue */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-amber-100/90 mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="font-medium text-white">{formattedDate}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{ceremony.time}</span>
                  </div>

                  <div className="flex items-start gap-2 sm:col-span-2">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white">{ceremony.venueName}</span>
                      <p className="text-xs text-amber-200/70">{ceremony.venueAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Dress Code Tag */}
                {ceremony.dressCode && (
                  <div className="flex items-center gap-2 text-xs text-amber-200/90 mb-3 p-2 rounded-lg bg-amber-400/10 border border-amber-400/20">
                    <Shirt className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span>
                      <strong className="text-amber-200">Dress Code:</strong> {ceremony.dressCode}
                    </span>
                  </div>
                )}

                {/* Description */}
                <p className="text-xs sm:text-sm text-amber-100/80 leading-relaxed mb-4">
                  {ceremony.description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-400/15">
                  {ceremony.mapsUrl && (
                    <a
                      href={ceremony.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-950 bg-gradient-to-r from-amber-200 to-amber-400 rounded-md hover:brightness-110 transition-all"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Directions</span>
                    </a>
                  )}

                  <button
                    onClick={() => handleAddToCalendar(ceremony)}
                    type="button"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-200 bg-black/40 border border-amber-400/30 rounded-md hover:bg-amber-400/20 transition-all cursor-pointer"
                  >
                    <CalendarPlus className="w-3.5 h-3.5 text-amber-300" />
                    <span>Add to Calendar</span>
                  </button>

                  {isEditable && onEditCeremony && (
                    <button
                      onClick={() => onEditCeremony(ceremony)}
                      type="button"
                      className="ml-auto text-xs text-amber-300 underline hover:text-white cursor-pointer"
                    >
                      Edit Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
