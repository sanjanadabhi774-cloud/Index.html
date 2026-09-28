import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, CheckCircle2, RotateCcw } from 'lucide-react';

interface HeartScratchCardProps {
  weddingDate: string;
  hijriDate: string;
  ceremonyTitle: string;
  accentGold?: string;
  onRevealed?: () => void;
  scratchCoverText?: string;
  scratchCoverSubtext?: string;
  scratchRevealedBadge?: string;
  cardHeading?: string;
}

export const HeartScratchCard: React.FC<HeartScratchCardProps> = ({
  weddingDate,
  hijriDate,
  ceremonyTitle,
  accentGold = '#d4af37',
  onRevealed,
  scratchCoverText = '✨ SCRATCH HERE ✨',
  scratchCoverSubtext = 'To Reveal The Wedding Date',
  scratchRevealedBadge = 'Date Revealed With Love!',
  cardHeading = 'Save The Sacred Date'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const [isScratching, setIsScratching] = useState(false);

  // Format date nicely
  const formattedDate = (() => {
    try {
      const d = new Date(weddingDate + 'T12:00:00');
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return weddingDate;
    }
  })();

  // Draw heart path on 2D context
  const drawHeartPath = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.beginPath();
    const topCurveHeight = height * 0.3;
    ctx.moveTo(width / 2, height / 5);
    // top left curve
    ctx.bezierCurveTo(
      width / 2, 0,
      0, 0,
      0, topCurveHeight
    );
    // bottom left curve
    ctx.bezierCurveTo(
      0, (height + topCurveHeight) / 2,
      width / 2, (height + topCurveHeight) / 1.4,
      width / 2, height - 10
    );
    // bottom right curve
    ctx.bezierCurveTo(
      width / 2, (height + topCurveHeight) / 1.4,
      width, (height + topCurveHeight) / 2,
      width, topCurveHeight
    );
    // top right curve
    ctx.bezierCurveTo(
      width, 0,
      width / 2, 0,
      width / 2, height / 5
    );
    ctx.closePath();
  };

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Save state for heart clipping
    ctx.save();
    drawHeartPath(ctx, width, height);
    ctx.clip();

    // Fill with rich gold metallic glitter gradient
    const grad = ctx.createRadialGradient(
      width / 2, height / 2, 10,
      width / 2, height / 2, width / 1.5
    );
    grad.addColorStop(0, '#fef08a');
    grad.addColorStop(0.3, '#f59e0b');
    grad.addColorStop(0.7, '#d97706');
    grad.addColorStop(1, '#78350f');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Decorative Islamic gold pattern / sparkles on top
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < 40; i++) {
      const rx = (Math.sin(i * 99) * 0.5 + 0.5) * width;
      const ry = (Math.cos(i * 37) * 0.5 + 0.5) * height;
      ctx.beginPath();
      ctx.arc(rx, ry, (i % 3) + 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Top text instruction inside heart
    ctx.fillStyle = '#451a03';
    ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(scratchCoverText, width / 2, height * 0.45);

    ctx.fillStyle = '#78350f';
    ctx.font = '11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(scratchCoverSubtext, width / 2, height * 0.56);

    ctx.restore();
    setScratchPercent(0);
  }, [scratchCoverText, scratchCoverSubtext]);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  const triggerReveal = () => {
    setIsRevealed(true);
    setScratchPercent(100);

    // Celebrate with confetti
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#fef08a', '#e5a93c', '#ffffff', '#10b981']
      });
    } catch {
      // Confetti fallback
    }

    if (onRevealed) {
      onRevealed();
    }
  };

  const calculateScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      let transparentPixels = 0;
      let totalSampled = 0;

      // Sample every 16th pixel for performance
      for (let i = 3; i < data.length; i += 64) {
        totalSampled++;
        if (data[i] < 128) {
          transparentPixels++;
        }
      }

      const percent = Math.round((transparentPixels / totalSampled) * 100);
      setScratchPercent(percent);

      if (percent >= 38 && !isRevealed) {
        triggerReveal();
      }
    } catch {
      // Ignored
    }
  };

  const handleScratch = (clientX: number, clientY: number) => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    calculateScratchPercentage();
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setIsScratching(true);
    handleScratch(e.clientX, e.clientY);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isScratching) return;
    handleScratch(e.clientX, e.clientY);
  };

  const onMouseUp = () => setIsScratching(false);

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      setIsScratching(true);
      handleScratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isScratching || e.touches.length === 0) return;
    handleScratch(e.touches[0].clientX, e.touches[0].clientY);
  };

  const onTouchEnd = () => setIsScratching(false);

  return (
    <div className="flex flex-col items-center justify-center my-6 select-none" ref={containerRef}>
      <div className="flex items-center gap-2 mb-2 text-xs tracking-widest uppercase text-amber-300 font-medium">
        <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
        <span>Heart Scratch To Reveal</span>
        <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
      </div>

      {/* Heart Container */}
      <div className="relative w-[300px] h-[270px] sm:w-[340px] sm:h-[300px] flex items-center justify-center">
        {/* Heart Outer Golden Glow & Border */}
        <div
          className="absolute inset-0 pointer-events-none drop-shadow-[0_0_20px_rgba(212,175,55,0.45)]"
          style={{ filter: `drop-shadow(0 0 15px ${accentGold}88)` }}
        >
          <svg viewBox="0 0 340 300" className="w-full h-full fill-none">
            <path
              d="M170,50 C170,0 20,0 20,90 C20,185 170,265 170,290 C170,265 320,185 320,90 C320,0 170,0 170,50 Z"
              stroke={accentGold}
              strokeWidth="3"
              fill="rgba(15, 23, 42, 0.9)"
            />
          </svg>
        </div>

        {/* Revealed Content underneath */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-0 pointer-events-none">
          <div className="w-[240px] flex flex-col items-center justify-center pt-3">
            <span className="text-[11px] font-semibold tracking-wider text-amber-300 uppercase">
              {cardHeading}
            </span>

            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mt-1 mb-1 tracking-wide">
              {formattedDate}
            </h3>

            <div className="inline-block px-3 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-amiri mt-1">
              {hijriDate}
            </div>

            <p className="text-xs text-amber-100/90 font-medium mt-2 max-w-[210px]">
              {ceremonyTitle}
            </p>

            {isRevealed && (
              <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-300 font-medium animate-bounce">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{scratchRevealedBadge}</span>
              </div>
            )}
          </div>
        </div>

        {/* Interactive Scratch Canvas on Top */}
        {!isRevealed && (
          <canvas
            ref={canvasRef}
            width={340}
            height={300}
            className="absolute inset-0 z-10 cursor-pointer touch-none"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          />
        )}
      </div>

      {/* Control Buttons */}
      <div className="mt-3 flex items-center gap-3">
        {!isRevealed ? (
          <button
            onClick={triggerReveal}
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-amber-950 bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-400 rounded-full hover:brightness-110 active:scale-95 shadow-md transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Reveal ({scratchPercent}%)</span>
          </button>
        ) : (
          <button
            onClick={() => {
              setIsRevealed(false);
              setTimeout(initCanvas, 50);
            }}
            type="button"
            className="flex items-center gap-1 px-3 py-1 text-xs text-amber-300 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Scratch Again</span>
          </button>
        )}
      </div>
    </div>
  );
};
