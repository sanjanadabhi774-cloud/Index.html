import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CalendarPlus } from 'lucide-react';
import { RubElHizbStar } from './IslamicOrnaments';

interface CountdownTimerProps {
  targetDate: string; // YYYY-MM-DD
  targetTime: string; // e.g. "06:30 PM"
  ceremonyTitle: string;
  venueName: string;
  venueAddress: string;
  accentGold?: string;
  countdownHeading?: string;
  countdownSubtitle?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  targetTime,
  ceremonyTitle,
  venueName,
  venueAddress,
  accentGold = '#d4af37',
  countdownHeading = 'Counting Every Blessed Moment',
  countdownSubtitle = 'Auspicious Countdown To Nikah'
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false
  });

  useEffect(() => {
    const parseTargetDateTime = (): Date => {
      try {
        // Parse time like "06:30 PM" or "18:30"
        let hours = 18;
        let minutes = 30;

        const match = targetTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
        if (match) {
          hours = parseInt(match[1], 10);
          minutes = parseInt(match[2], 10);
          const meridiem = match[3]?.toUpperCase();
          if (meridiem === 'PM' && hours < 12) hours += 12;
          if (meridiem === 'AM' && hours === 12) hours = 0;
        }

        const dateParts = targetDate.split('-');
        if (dateParts.length === 3) {
          return new Date(
            parseInt(dateParts[0], 10),
            parseInt(dateParts[1], 10) - 1,
            parseInt(dateParts[2], 10),
            hours,
            minutes,
            0
          );
        }
      } catch {
        // Fallback
      }
      return new Date(targetDate);
    };

    const updateCountdown = () => {
      const target = parseTargetDateTime();
      const now = new Date();
      const diffMs = target.getTime() - now.getTime();

      if (diffMs <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const totalSecs = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSecs / 86400);
      const hours = Math.floor((totalSecs % 86400) / 3600);
      const minutes = Math.floor((totalSecs % 3600) / 60);
      const seconds = totalSecs % 60;

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate, targetTime]);

  const handleAddToCalendar = () => {
    const startTimeStr = targetDate.replace(/-/g, '') + 'T120000Z';
    const endTimeStr = targetDate.replace(/-/g, '') + 'T160000Z';
    const title = encodeURIComponent(`${ceremonyTitle} - Wedding Celebration`);
    const details = encodeURIComponent(`You are cordially invited to celebrate the Nikah and wedding ceremony at ${venueName}.`);
    const location = encodeURIComponent(`${venueName}, ${venueAddress}`);

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTimeStr}/${endTimeStr}&details=${details}&location=${location}`;
    window.open(googleCalendarUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadIcs = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Noor-e-Nikah//Islamic Wedding Invitation//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${ceremonyTitle}`,
      `DESCRIPTION:Sacred Islamic Wedding Celebration at ${venueName}`,
      `LOCATION:${venueName}, ${venueAddress}`,
      `DTSTART:${targetDate.replace(/-/g, '')}T180000`,
      `DTEND:${targetDate.replace(/-/g, '')}T230000`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'wedding-invitation.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full my-8 px-2 sm:px-4">
      {/* Prominent Banner Card */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 sm:p-8 text-center border shadow-2xl backdrop-blur-md"
        style={{
          borderColor: `${accentGold}66`,
          background: 'radial-gradient(ellipse at top, rgba(212, 175, 55, 0.12) 0%, rgba(6, 40, 30, 0.75) 100%)'
        }}
      >
        {/* Subtle decorative arch top */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <RubElHizbStar size={16} className="text-amber-400" />
          <span className="text-xs font-semibold tracking-widest uppercase text-amber-300">
            {countdownSubtitle}
          </span>
          <RubElHizbStar size={16} className="text-amber-400" />
        </div>

        <h3 className="font-cinzel text-xl sm:text-2xl text-white font-bold tracking-wide mb-1">
          {countdownHeading}
        </h3>

        <p className="text-xs sm:text-sm text-amber-200/90 mb-6 flex items-center justify-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>{ceremonyTitle} &middot; {targetDate} at {targetTime}</span>
        </p>

        {timeLeft.isPast ? (
          <div className="py-4 text-amber-300 font-cinzel text-xl font-bold">
            ✨ Barakallahu Lakuma! The Sacred Union Has Commenced ✨
          </div>
        ) : (
          /* 4 Units Grid */
          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds }
            ].map((unit, index) => (
              <div
                key={unit.label}
                className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-black/40 border border-amber-400/30 shadow-inner group hover:border-amber-400/70 transition-all"
              >
                <div className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 tabular-nums">
                  {String(unit.value).padStart(2, '0')}
                </div>
                <div className="text-[10px] sm:text-xs tracking-wider uppercase text-amber-200/80 font-medium mt-1">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action button to add reminder */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleAddToCalendar}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-amber-950 bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-400 rounded-lg hover:brightness-110 active:scale-95 shadow transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Add To Google Calendar</span>
          </button>

          <button
            onClick={handleDownloadIcs}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-amber-200 bg-amber-950/60 border border-amber-400/40 rounded-lg hover:bg-amber-900/60 hover:text-white transition-all cursor-pointer"
          >
            <CalendarPlus className="w-3.5 h-3.5 text-amber-400" />
            <span>Save .ICS File</span>
          </button>
        </div>
      </div>
    </div>
  );
};
