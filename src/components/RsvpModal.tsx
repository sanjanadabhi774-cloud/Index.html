import React, { useState } from 'react';
import { Send, Check, X, Heart, Sparkles } from 'lucide-react';
import { WeddingData } from '../types/wedding';

interface RsvpModalProps {
  isOpen: boolean;
  onClose: () => void;
  weddingData: WeddingData;
  guestName?: string;
}

export const RsvpModal: React.FC<RsvpModalProps> = ({
  isOpen,
  onClose,
  weddingData,
  guestName = ''
}) => {
  const [name, setName] = useState(guestName);
  const [attending, setAttending] = useState<'yes' | 'no'>('yes');
  const [guestCount, setGuestCount] = useState(2);
  const [selectedCeremonies, setSelectedCeremonies] = useState<string[]>(
    weddingData.ceremonies.map(c => c.name)
  );
  const [blessing, setBlessing] = useState('May Allah (SWT) bless your union with eternal love, barakah, and happiness!');

  if (!isOpen) return null;

  const toggleCeremony = (ceremonyName: string) => {
    if (selectedCeremonies.includes(ceremonyName)) {
      setSelectedCeremonies(selectedCeremonies.filter(n => n !== ceremonyName));
    } else {
      setSelectedCeremonies([...selectedCeremonies, ceremonyName]);
    }
  };

  const handleSendRsvp = () => {
    const rsvpMessage = `✨ *Wedding RSVP Confirmation* ✨

*As-salamu alaykum!*
This is *${name.trim() || 'A Guest'}*.

${attending === 'yes' ? '✅ *Joyfully Attending!*' : '❌ *Warmest Regrets (Unable to attend)*'}

${attending === 'yes' ? `👥 *Number of Guests Attending:* ${guestCount}
🎉 *Functions Attending:*
${selectedCeremonies.map(c => `  • ${c}`).join('\n')}` : ''}

💌 *Heartfelt Du'a & Message:*
"${blessing.trim()}"

_RSVP sent for the wedding of ${weddingData.groomName} & ${weddingData.brideName}_`;

    const cleanPhone = weddingData.rsvpPhone.replace(/[^0-9]/g, '');
    const waUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(rsvpMessage)}`
      : `https://wa.me/?text=${encodeURIComponent(rsvpMessage)}`;

    window.open(waUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-950 border border-amber-400/60 p-6 shadow-2xl text-white">
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-amber-300 hover:text-white p-1 rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-amber-400 mb-1">
            <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>RSVP &amp; Send Du&apos;as</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>

          <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-amber-200">
            Will You Grace The Union?
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Please let us know by sending your quick confirmation to the host family.
          </p>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Your Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1">
              Your Name / Family Name:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tariq Siddiqui & Family"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-amber-400/40 text-amber-100 placeholder:text-slate-500 text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Attendance Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1.5">
              Will you attend?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAttending('yes')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  attending === 'yes'
                    ? 'bg-emerald-600/30 border-emerald-400 text-emerald-200 shadow-md'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>Yes, Joyfully Attending</span>
              </button>

              <button
                type="button"
                onClick={() => setAttending('no')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  attending === 'no'
                    ? 'bg-rose-900/40 border-rose-400 text-rose-200 shadow-md'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                <X className="w-4 h-4" />
                <span>Regretfully Unable</span>
              </button>
            </div>
          </div>

          {attending === 'yes' && (
            <>
              {/* Number of guests */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1">
                  Total Guests Attending: ({guestCount})
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuestCount(num)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        guestCount === num
                          ? 'bg-amber-400 text-amber-950 border-amber-300'
                          : 'bg-slate-900 border-amber-400/30 text-amber-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ceremonies attending */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1">
                  Which functions will you join?
                </label>
                <div className="space-y-1.5">
                  {weddingData.ceremonies.map((c) => (
                    <label
                      key={c.id}
                      className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/80 border border-amber-400/20 text-xs text-amber-100 cursor-pointer hover:bg-slate-800"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCeremonies.includes(c.name)}
                        onChange={() => toggleCeremony(c.name)}
                        className="rounded border-amber-400 text-amber-500 focus:ring-amber-400"
                      />
                      <span className="font-medium">{c.name} ({c.date})</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Blessing message */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1">
              Your Du&apos;a &amp; Blessing Message for Couple:
            </label>
            <textarea
              rows={2}
              value={blessing}
              onChange={(e) => setBlessing(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-amber-400/40 text-amber-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-amber-400 leading-relaxed"
            />
          </div>
        </div>

        <div className="mt-5">
          <button
            onClick={handleSendRsvp}
            type="button"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Send RSVP via WhatsApp to Host</span>
          </button>
        </div>
      </div>
    </div>
  );
};
