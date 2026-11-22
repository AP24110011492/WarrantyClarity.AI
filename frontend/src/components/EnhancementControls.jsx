import React from 'react';
import { 
  Sparkles, 
  Sun, 
  Contrast, 
  Zap, 
  ShieldAlert, 
  Palette, 
  Maximize, 
  RotateCcw, 
  Wand2, 
  Check, 
  Loader2,
  Sliders,
  Flame,
  Info
} from 'lucide-react';

const PRESET_LIST = [
  {
    id: 'auto',
    name: 'Auto Enhance',
    badge: 'Recommended',
    description: 'Balanced CLAHE, mild bilateral denoise & unsharp mask.',
    icon: Wand2,
    color: 'text-brand-600 bg-brand-50 border-brand-200'
  },
  {
    id: 'low_light',
    name: 'Low Light Correction',
    badge: 'Gamma Lift',
    description: 'Lifts dark shadows, reveals obscured serials and chassis cracks.',
    icon: Sun,
    color: 'text-amber-600 bg-amber-50 border-amber-200'
  },
  {
    id: 'blurry',
    name: 'Blurry Improvement',
    badge: 'Edge Recovery',
    description: 'Aggressive unsharp masking for out-of-focus camera shots.',
    icon: Zap,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
  },
  {
    id: 'noise_removal',
    name: 'Noise Removal',
    badge: 'NLM Filter',
    description: 'Reduces sensor grain while preserving printed labels and edges.',
    icon: ShieldAlert,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
  },
  {
    id: 'detail_enhancement',
    name: 'Detail Enhancement',
    badge: 'Micro-Contrast',
    description: 'Micro-contrast boost (CLAHE 2.8) for hairline cracks and chips.',
    icon: Flame,
    color: 'text-purple-600 bg-purple-50 border-purple-200'
  },
  {
    id: 'balanced',
    name: 'Balanced Clean',
    badge: 'Natural',
    description: 'Authentic restoration preserving original product tones.',
    icon: Sparkles,
    color: 'text-sky-600 bg-sky-50 border-sky-200'
  }
];

export default function EnhancementControls({
  selectedPreset,
  sliderValues,
  isProcessing,
  onSelectPreset,
  onSliderChange,
  onApplyChanges,
  onResetAdjustments,
  onRestoreOriginal,
  hasChanges
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-6">
      
      {/* Section 1: Presets */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <h3 className="font-bold text-slate-800 text-sm">
              One-Click Restoration Presets
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Optimized for Warranty Workflows
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {PRESET_LIST.map((preset) => {
            const Icon = preset.icon;
            const isSelected = selectedPreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset(preset.id)}
                disabled={isProcessing}
                className={`p-3 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50/70 shadow-xs ring-2 ring-brand-300'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/70 shadow-2xs'
                } ${isProcessing ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className={`p-1.5 rounded-lg border ${preset.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-brand-600 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <h4 className="font-semibold text-slate-900 text-xs">
                    {preset.name}
                  </h4>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Section 2: Manual Sliders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-brand-600" />
            <h3 className="font-bold text-slate-800 text-sm">
              Fine-Tuning Controls
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Real-time parameter adjustment
          </span>
        </div>

        <div className="space-y-4">
          
          {/* Brightness */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                Brightness (Gamma Lift)
              </span>
              <span className="font-mono text-slate-500 text-[11px] font-semibold">
                {sliderValues.brightness > 0 ? `+${sliderValues.brightness}` : sliderValues.brightness}
              </span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              value={sliderValues.brightness}
              onChange={(e) => onSliderChange('brightness', parseFloat(e.target.value))}
              disabled={isProcessing}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>-100 (Darken)</span>
              <span>0 (Original)</span>
              <span>+100 (Lift Shadows)</span>
            </div>
          </div>

          {/* Contrast (CLAHE) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 flex items-center gap-1.5">
                <Contrast className="w-3.5 h-3.5 text-indigo-500" />
                Contrast (Adaptive CLAHE)
              </span>
              <span className="font-mono text-slate-500 text-[11px] font-semibold">
                {sliderValues.contrast}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValues.contrast}
              onChange={(e) => onSliderChange('contrast', parseFloat(e.target.value))}
              disabled={isProcessing}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0% (Standard)</span>
              <span>50% (Enhanced)</span>
              <span>100% (High Dynamic)</span>
            </div>
          </div>

          {/* Sharpness (Unsharp Mask) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-blue-500" />
                Sharpness (Unsharp Masking)
              </span>
              <span className="font-mono text-slate-500 text-[11px] font-semibold">
                {sliderValues.sharpness}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValues.sharpness}
              onChange={(e) => onSliderChange('sharpness', parseFloat(e.target.value))}
              disabled={isProcessing}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0% (Soft)</span>
              <span>50% (Clear Edges)</span>
              <span>100% (High Boost)</span>
            </div>
          </div>

          {/* Noise Reduction (Bilateral & NLM) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-500" />
                Denoising (Bilateral Filter)
              </span>
              <span className="font-mono text-slate-500 text-[11px] font-semibold">
                {sliderValues.denoise}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValues.denoise}
              onChange={(e) => onSliderChange('denoise', parseFloat(e.target.value))}
              disabled={isProcessing}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0% (Off)</span>
              <span>50% (Edge Preserving)</span>
              <span>100% (Heavy Grain)</span>
            </div>
          </div>

          {/* Saturation */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-purple-500" />
                Saturation (HSV Space)
              </span>
              <span className="font-mono text-slate-500 text-[11px] font-semibold">
                {sliderValues.saturation > 0 ? `+${sliderValues.saturation}` : sliderValues.saturation}%
              </span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              value={sliderValues.saturation}
              onChange={(e) => onSliderChange('saturation', parseFloat(e.target.value))}
              disabled={isProcessing}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
          </div>

          {/* Resolution Upscale Selector */}
          <div className="pt-2">
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Resolution Super-Sampling (Lanczos-4)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { factor: 1, label: '1x (Original)' },
                { factor: 2, label: '2x (Super Res)' },
                { factor: 4, label: '4x (Ultra HD)' },
              ].map((item) => (
                <button
                  key={item.factor}
                  type="button"
                  onClick={() => onSliderChange('upscale', item.factor)}
                  disabled={isProcessing}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                    sliderValues.upscale === item.factor
                      ? 'bg-brand-50 border-brand-400 text-brand-700 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Auto White Balance Checkbox */}
          <div className="pt-1 flex items-center justify-between">
            <label className="text-xs font-medium text-slate-700 flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sliderValues.autoWb}
                onChange={(e) => onSliderChange('autoWb', e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
              />
              <span>Gray-World Auto White Balance</span>
            </label>
            <span className="text-[10px] text-slate-400">Neutralizes light casts</span>
          </div>

        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Section 3: Action Buttons */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={onApplyChanges}
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 shadow-md shadow-brand-500/20 hover:shadow-brand-500/30 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing with OpenCV Engine...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              <span>Apply Image Enhancement</span>
            </>
          )}
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onResetAdjustments}
            disabled={isProcessing}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Sliders</span>
          </button>

          <button
            type="button"
            onClick={onRestoreOriginal}
            disabled={isProcessing}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            <span>Restore Original</span>
          </button>
        </div>
      </div>

    </div>
  );
}
