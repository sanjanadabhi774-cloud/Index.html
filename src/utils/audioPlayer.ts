class AudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private volume: number = 0.5;
  private customAudio: HTMLAudioElement | null = null;
  private timerId: number | null = null;
  private currentPreset: string = 'nasheed-duff';

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playPreset(preset: string = 'nasheed-duff') {
    this.initContext();
    this.currentPreset = preset;
    this.stop();
    this.isPlaying = true;

    // Traditional Islamic / Oriental scale (Bayati / Hijaz inspired warm soothing pentatonic notes)
    // D4, Eb4, F#4, G4, A4, Bb4, C5, D5
    const notes = [293.66, 311.13, 369.99, 392.0, 440.0, 466.16, 523.25, 587.33];
    const duffBase = 73.42; // Deep warm duff drum frequency

    let step = 0;
    const playStep = () => {
      if (!this.isPlaying || !this.ctx) return;

      const now = this.ctx.currentTime;
      const effectiveVol = this.isMuted ? 0 : this.volume;

      // Soft Duff rhythm on beats 0, 2, 3
      if (step % 2 === 0 || step % 7 === 0) {
        this.playDuffHit(now, duffBase, effectiveVol * 0.4);
      }

      // Melodic plucking (Oud / Harp timbre)
      const noteIdx = [0, 2, 4, 3, 5, 4, 2, 7, 5, 4, 3, 2, 0, 4, 2, 0][step % 16];
      const freq = notes[noteIdx];
      this.playOudNote(now, freq, effectiveVol * 0.35);

      step++;
      this.timerId = window.setTimeout(playStep, 580);
    };

    playStep();
  }

  private playDuffHit(time: number, freq: number, vol: number) {
    if (!this.ctx || vol <= 0) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * 1.5, time);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.7, time + 0.3);

      gain.gain.setValueAtTime(vol * 0.8, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + 0.45);
    } catch {
      // Audio node cleanup
    }
  }

  private playOudNote(time: number, freq: number, vol: number) {
    if (!this.ctx || vol <= 0) return;
    try {
      // Primary string oscillator
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, time);

      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(freq * 1.002, time); // Subtle rich chorus detune

      // Warm wooden acoustic body filter
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, time);
      filter.frequency.exponentialRampToValueAtTime(450, time + 1.2);

      // Pluck envelope: sharp attack, gentle harmonic decay
      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(vol, time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.6);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + 1.6);
      osc2.stop(time + 1.6);
    } catch {
      // Audio node cleanup
    }
  }

  public playCustomAudio(url: string) {
    this.stop();
    if (!this.customAudio) {
      this.customAudio = new Audio();
      this.customAudio.loop = true;
    }
    this.customAudio.src = url;
    this.customAudio.volume = this.isMuted ? 0 : this.volume;
    this.customAudio.play().catch(() => {
      // Autoplay restriction fallback
    });
    this.isPlaying = true;
  }

  public play(customUrl?: string, preset: string = 'nasheed-duff') {
    if (customUrl) {
      this.playCustomAudio(customUrl);
    } else {
      this.playPreset(preset);
    }
  }

  public pause() {
    this.isPlaying = false;
    if (this.timerId) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.customAudio) {
      this.customAudio.pause();
    }
  }

  public stop() {
    this.pause();
    if (this.ctx && this.ctx.state !== 'closed') {
      try {
        // Stop synthesized voices
      } catch {
        // Context cleanup
      }
    }
  }

  public togglePlay(customUrl?: string, preset?: string): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play(customUrl, preset || this.currentPreset);
      return true;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.customAudio) {
      this.customAudio.volume = muted ? 0 : this.volume;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }
}

export const weddingAudio = new AudioEngine();
