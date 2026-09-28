import React, { useState, useRef } from 'react';
import { Volume2, VolumeX, Music, Upload, Check } from 'lucide-react';
import { AUDIO_PRESETS } from '../constants/defaultData';
import { weddingAudio } from '../utils/audioPlayer';

interface AudioFloatingPlayerProps {
  currentTrackTitle: string;
  isCustomMusic: boolean;
  selectedPreset: string;
  customMusicUrl?: string;
  onUpdateMusic: (title: string, isCustom: boolean, preset: string, customUrl?: string) => void;
}

export const AudioFloatingPlayer: React.FC<AudioFloatingPlayerProps> = ({
  currentTrackTitle,
  isCustomMusic,
  selectedPreset,
  customMusicUrl,
  onUpdateMusic
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const togglePlay = () => {
    const nextState = weddingAudio.togglePlay(
      isCustomMusic ? customMusicUrl : undefined,
      selectedPreset
    );
    setIsPlaying(nextState);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    weddingAudio.setMuted(nextMuted);
  };

  const handleSelectPreset = (presetId: string, name: string) => {
    onUpdateMusic(name, false, presetId);
    weddingAudio.play(undefined, presetId);
    setIsPlaying(true);
    setIsMuted(false);
    weddingAudio.setMuted(false);
    setShowMenu(false);
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const title = file.name.replace(/\.[^/.]+$/, "");
      onUpdateMusic(title, true, '', url);
      weddingAudio.play(url);
      setIsPlaying(true);
      setIsMuted(false);
      weddingAudio.setMuted(false);
      setShowMenu(false);
    }
  };

  return (
    <>
      {/* Floating Audio Controller */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2 select-none no-print">
        {/* Main Floating Button */}
        <div className="relative flex items-center bg-black/80 backdrop-blur-md border border-amber-400/50 rounded-full px-3 py-1.5 shadow-xl text-amber-200 text-xs gap-2">
          {/* Audio Wave Indicator */}
          <button
            onClick={togglePlay}
            type="button"
            className="flex items-center gap-1.5 hover:text-amber-100 transition-colors cursor-pointer"
            title={isPlaying ? "Pause Music" : "Play Music"}
          >
            <div className="flex items-end gap-[2px] h-3 w-3.5">
              <span
                className={`w-[2.5px] bg-amber-400 rounded-full ${
                  isPlaying && !isMuted ? 'animate-[bounce_0.6s_ease-in-out_infinite] h-3' : 'h-1.5'
                }`}
              />
              <span
                className={`w-[2.5px] bg-amber-400 rounded-full ${
                  isPlaying && !isMuted ? 'animate-[bounce_0.8s_ease-in-out_infinite_0.2s] h-3.5' : 'h-2'
                }`}
              />
              <span
                className={`w-[2.5px] bg-amber-400 rounded-full ${
                  isPlaying && !isMuted ? 'animate-[bounce_0.7s_ease-in-out_infinite_0.4s] h-2.5' : 'h-1'
                }`}
              />
            </div>
            <span className="max-w-[110px] sm:max-w-[150px] truncate font-medium text-[11px]">
              {currentTrackTitle}
            </span>
          </button>

          {/* Mute Toggle */}
          <button
            onClick={toggleMute}
            type="button"
            className="p-1 hover:text-white transition-colors cursor-pointer text-amber-300"
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-amber-300" />
            )}
          </button>

          {/* Settings / Track Options */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            type="button"
            className="p-1 hover:text-white transition-colors cursor-pointer border-l border-amber-400/30 pl-2 text-amber-300"
            title="Choose Music Track / Upload Your Music"
          >
            <Music className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Music Dropdown Menu */}
        {showMenu && (
          <div className="absolute top-12 right-0 w-72 p-4 rounded-xl bg-slate-950/95 border border-amber-400/60 shadow-2xl text-white backdrop-blur-xl z-50">
            <div className="flex items-center justify-between border-b border-amber-400/20 pb-2 mb-3">
              <span className="font-cinzel text-xs font-bold text-amber-300 uppercase tracking-wider">
                Wedding Melodies
              </span>
              <button
                onClick={() => setShowMenu(false)}
                className="text-xs text-amber-300/70 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Presets */}
            <div className="space-y-1.5 mb-3">
              <div className="text-[10px] uppercase tracking-wider text-amber-200/60 font-semibold mb-1">
                Curated Halal Melodies:
              </div>
              {AUDIO_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id, preset.name)}
                  className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    !isCustomMusic && selectedPreset === preset.id
                      ? 'bg-amber-400/20 border border-amber-400/40 text-amber-200'
                      : 'hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <span className="truncate pr-2">{preset.name}</span>
                  {!isCustomMusic && selectedPreset === preset.id && (
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>

            {/* Upload Custom Audio File */}
            <div className="pt-2 border-t border-amber-400/20">
              <button
                onClick={() => fileInputRef.current?.click()}
                type="button"
                className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 font-semibold text-xs hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Mine Music (MP3 / Audio)</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleAudioUpload}
              />
              <p className="text-[10px] text-amber-200/60 text-center mt-1.5">
                Upload your favorite Nasheed or instrumental song
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
