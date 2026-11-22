import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Split, 
  Columns, 
  FlipHorizontal, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';

export default function ComparisonSlider({
  originalUrl,
  enhancedUrl,
  originalMeta = {},
  enhancedMeta = {},
  appliedOps = []
}) {
  const [sliderPos, setSliderPos] = useState(50); // 0 to 100%
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState('slider'); // 'slider' | 'side-by-side' | 'toggle'
  const [toggleState, setToggleState] = useState('enhanced'); // 'original' | 'enhanced'
  const [zoomLevel, setZoomLevel] = useState(1); // 1x, 1.5x, 2x
  const containerRef = useRef(null);

  const handlePointerDown = useCallback((e) => {
    setIsDragging(true);
    updateSliderPos(e);
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging) return;
    updateSliderPos(e);
  }, [isDragging]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const updateSliderPos = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
    if (clientX === undefined) return;
    
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove);
      window.addEventListener('touchend', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
      {/* Comparison Header & Mode Switcher */}
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/60 flex flex-wrap items-center justify-between gap-3">
        
        {/* Title */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800 text-sm">
            Inspection Workspace
          </span>
          <span className="hidden sm:inline-block text-xs text-slate-400">|</span>
          <span className="text-xs text-slate-500 hidden sm:inline-block">
            Compare restored edges and surface details
          </span>
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg p-0.5 bg-slate-200/70 border border-slate-300/50">
            <button
              type="button"
              onClick={() => setViewMode('slider')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'slider'
                  ? 'bg-white text-brand-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Interactive Split Slider"
            >
              <Split className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Split Slider</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('side-by-side')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'side-by-side'
                  ? 'bg-white text-brand-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Side-by-Side Synchronized View"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Side by Side</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('toggle')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'toggle'
                  ? 'bg-white text-brand-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Quick Toggle View"
            >
              <FlipHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Flip View</span>
            </button>
          </div>

          {/* Zoom controls */}
          <div className="inline-flex items-center gap-1 pl-2 border-l border-slate-300">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-slate-500 w-8 text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(1, z - 0.25))}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            {zoomLevel > 1 && (
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className="p-1 rounded text-xs text-brand-600 hover:bg-brand-50"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative bg-slate-950 p-2 sm:p-4 min-h-[380px] sm:min-h-[460px] flex items-center justify-center overflow-hidden select-none">
        
        {/* MODE 1: Interactive Draggable Split Slider */}
        {viewMode === 'slider' && (
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            className="relative w-full max-w-4xl max-h-[520px] aspect-4/3 sm:aspect-16/10 rounded-xl overflow-hidden cursor-ew-resize bg-black shadow-2xl flex items-center justify-center"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.15s ease-out'
            }}
          >
            {/* Background: Enhanced Image (revealed on the right) */}
            <img
              src={enhancedUrl || originalUrl}
              alt="Enhanced Product Photo"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            />

            {/* Foreground: Original Image (clipped to sliderPos) */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={originalUrl}
                alt="Original Product Photo"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none max-w-none"
                style={{
                  width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                  height: containerRef.current ? `${containerRef.current.clientHeight}px` : '100%',
                }}
              />
            </div>

            {/* Draggable Divider Line & Knob */}
            <div
              className="absolute top-0 bottom-0 z-20 pointer-events-none"
              style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
            >
              {/* Vertical line with subtle glow */}
              <div className="w-[2px] h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />

              {/* Handle knob */}
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 w-8 h-8 rounded-full bg-white/95 text-slate-800 shadow-xl border-2 border-brand-500 flex items-center justify-center cursor-ew-resize pointer-events-auto hover:scale-110 active:scale-95 transition-transform">
                <Split className="w-4 h-4 text-brand-600" />
              </div>
            </div>

            {/* Overlaid Badges */}
            <div className="absolute top-3 left-3 z-10 pointer-events-none">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-black/75 text-amber-300 border border-amber-500/30 backdrop-blur-sm shadow-md">
                BEFORE (ORIGINAL)
              </span>
            </div>

            <div className="absolute top-3 right-3 z-10 pointer-events-none">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-brand-600/90 text-white border border-brand-400/40 backdrop-blur-sm shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                AFTER (ENHANCED)
              </span>
            </div>

            {/* Bottom percentage indicator */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-black/60 text-slate-300 backdrop-blur-sm">
                Split: {Math.round(sliderPos)}%
              </span>
            </div>
          </div>
        )}

        {/* MODE 2: Side-by-Side Synchronized View */}
        {viewMode === 'side-by-side' && (
          <div 
            className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-3"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'center center',
              transition: 'transform 0.15s ease-out'
            }}
          >
            {/* Left Card: Original */}
            <div className="relative rounded-xl overflow-hidden bg-black/90 aspect-4/3 border border-slate-800 flex items-center justify-center shadow-lg">
              <img
                src={originalUrl}
                alt="Original"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-black/75 text-amber-300 border border-amber-500/30">
                  ORIGINAL EVIDENCE
                </span>
              </div>
            </div>

            {/* Right Card: Enhanced */}
            <div className="relative rounded-xl overflow-hidden bg-black/90 aspect-4/3 border border-brand-500/40 flex items-center justify-center shadow-lg">
              <img
                src={enhancedUrl || originalUrl}
                alt="Enhanced"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-brand-600/90 text-white border border-brand-400/40 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  RESTORED
                </span>
              </div>
            </div>
          </div>
        )}

        {/* MODE 3: Flip / Toggle View */}
        {viewMode === 'toggle' && (
          <div 
            className="relative w-full max-w-4xl max-h-[520px] aspect-4/3 sm:aspect-16/10 rounded-xl overflow-hidden bg-black shadow-2xl flex items-center justify-center"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'center center',
              transition: 'transform 0.15s ease-out'
            }}
          >
            <img
              src={toggleState === 'enhanced' ? (enhancedUrl || originalUrl) : originalUrl}
              alt="Toggle View"
              className="w-full h-full object-contain"
            />

            {/* Toggle Badge */}
            <div className="absolute top-3 left-3">
              <span className={`px-3 py-1 rounded-md text-xs font-bold border backdrop-blur-sm ${
                toggleState === 'enhanced'
                  ? 'bg-brand-600/90 text-white border-brand-400'
                  : 'bg-black/80 text-amber-300 border-amber-400'
              }`}>
                {toggleState === 'enhanced' ? 'ENHANCED VIEW' : 'ORIGINAL VIEW'}
              </span>
            </div>

            {/* Toggle Action Pill */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1 rounded-xl bg-black/70 backdrop-blur-md border border-slate-700">
              <button
                type="button"
                onClick={() => setToggleState('original')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  toggleState === 'original'
                    ? 'bg-amber-400 text-slate-900 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Original
              </button>
              <button
                type="button"
                onClick={() => setToggleState('enhanced')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  toggleState === 'enhanced'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Enhanced
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Applied Operations Sub-bar */}
      {appliedOps && appliedOps.length > 0 && (
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-xs text-slate-600">
          <span className="font-semibold text-slate-700 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            Applied:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {appliedOps.map((op, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-medium text-[11px] shadow-2xs whitespace-nowrap"
              >
                {op}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
