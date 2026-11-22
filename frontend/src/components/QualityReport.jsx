import React from 'react';
import { 
  BarChart3, 
  Clock, 
  Maximize2, 
  Zap, 
  Sun, 
  Contrast, 
  ShieldAlert, 
  CheckCircle2, 
  Download, 
  FileText, 
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  HardDrive
} from 'lucide-react';

export default function QualityReport({
  beforeMetrics,
  afterMetrics,
  processingTimeMs,
  appliedOps = [],
  filename = 'product_image.jpg',
  enhancedUrl,
  originalUrl,
  onDownload
}) {
  if (!beforeMetrics) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 text-center text-slate-500">
        <BarChart3 className="w-8 h-8 mx-auto text-slate-400 mb-2" />
        <p className="text-sm font-medium">Quality metrics will appear once an image is loaded.</p>
      </div>
    );
  }

  const bDim = beforeMetrics.dimensions || {};
  const aDim = afterMetrics?.dimensions || bDim;

  const bSharp = beforeMetrics.sharpness?.score || 0;
  const aSharp = afterMetrics?.sharpness?.score || bSharp;

  const bContrast = beforeMetrics.contrast?.rms_value || 0;
  const aContrast = afterMetrics?.contrast?.rms_value || bContrast;

  const bBright = beforeMetrics.brightness?.value || 0;
  const aBright = afterMetrics?.brightness?.value || bBright;

  const bNoise = beforeMetrics.noise?.sigma || 0;
  const aNoise = afterMetrics?.noise?.sigma || bNoise;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-6">
      
      {/* Header: Processing & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Image Quality Assessment & Technical Report
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Objective spatial and frequency domain analysis calculated via OpenCV
          </p>
        </div>

        {processingTimeMs !== undefined && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 self-start sm:self-auto shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-brand-600" />
            <span>Processing Time: {processingTimeMs} ms</span>
          </div>
        )}
      </div>

      {/* 4 Key Measured Metrics (Before vs After) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* Metric 1: Sharpness (Laplacian Variance) */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              Laplacian Sharpness
            </span>
            {afterMetrics && aSharp > bSharp && (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-0.5">
                <TrendingUp className="w-2.5 h-2.5" />
                +{(aSharp - bSharp).toFixed(1)}
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-slate-900">
              {afterMetrics ? aSharp.toFixed(1) : bSharp.toFixed(1)}
            </span>
            {afterMetrics && (
              <span className="text-xs text-slate-400 line-through">
                {bSharp.toFixed(1)}
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-500 truncate" title={afterMetrics ? afterMetrics.sharpness?.status : beforeMetrics.sharpness?.status}>
            {afterMetrics ? afterMetrics.sharpness?.status : beforeMetrics.sharpness?.status}
          </p>
        </div>

        {/* Metric 2: RMS Contrast */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
              <Contrast className="w-3.5 h-3.5 text-indigo-600" />
              RMS Contrast (σ_gray)
            </span>
            {afterMetrics && (
              <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded border border-brand-200">
                {aContrast > bContrast ? `+${(aContrast - bContrast).toFixed(1)}` : (aContrast - bContrast).toFixed(1)}
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-slate-900">
              {afterMetrics ? aContrast.toFixed(1) : bContrast.toFixed(1)}
            </span>
            {afterMetrics && (
              <span className="text-xs text-slate-400 line-through">
                {bContrast.toFixed(1)}
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-500 truncate">
            {afterMetrics ? afterMetrics.contrast?.status : beforeMetrics.contrast?.status}
          </p>
        </div>

        {/* Metric 3: Average Brightness */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              Mean Brightness
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              0-255 scale
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-slate-900">
              {afterMetrics ? aBright.toFixed(1) : bBright.toFixed(1)}
            </span>
            {afterMetrics && (
              <span className="text-xs text-slate-400 line-through">
                {bBright.toFixed(1)}
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-500 truncate">
            {afterMetrics ? afterMetrics.brightness?.status : beforeMetrics.brightness?.status}
          </p>
        </div>

        {/* Metric 4: Immerkaer Noise Variance */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
              Noise Sigma (σ_noise)
            </span>
            {afterMetrics && aNoise < bNoise && (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                Reduced
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-slate-900">
              {afterMetrics ? aNoise.toFixed(2) : bNoise.toFixed(2)}
            </span>
            {afterMetrics && (
              <span className="text-xs text-slate-400 line-through">
                {bNoise.toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-500 truncate">
            {afterMetrics ? afterMetrics.noise?.status : beforeMetrics.noise?.status}
          </p>
        </div>

      </div>

      {/* Resolution & Dimensions Comparison */}
      <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-2xs">
            <Maximize2 className="w-4 h-4 text-brand-600" />
          </div>
          <div>
            <span className="font-semibold text-slate-800">Spatial Dimensions:</span>
            <div className="text-slate-500 font-mono mt-0.5">
              {bDim.width} &times; {bDim.height} px ({bDim.megapixels} MP)
              {afterMetrics && (aDim.width !== bDim.width || aDim.height !== bDim.height) && (
                <span className="text-brand-600 font-semibold ml-2">
                  &rarr; {aDim.width} &times; {aDim.height} px ({aDim.megapixels} MP)
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-2xs">
            <HardDrive className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <span className="font-semibold text-slate-800">Encoded Payload:</span>
            <div className="text-slate-500 font-mono mt-0.5">
              {beforeMetrics.file_size_kb ? `${beforeMetrics.file_size_kb} KB` : 'N/A'}
              {afterMetrics?.file_size_kb && (
                <span className="text-indigo-600 font-semibold ml-2">
                  &rarr; {afterMetrics.file_size_kb} KB
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detected Claim Defect Issues Banner */}
      {beforeMetrics.detected_issues && beforeMetrics.detected_issues.length > 0 && (
        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/90 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Inspection Diagnosis (Initial Claim Intake):</span>
          </div>
          <ul className="text-xs text-amber-800 space-y-1 pl-6 list-disc">
            {beforeMetrics.detected_issues.map((issue, idx) => (
              <li key={idx}>{issue}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Applied Operations List */}
      {appliedOps && appliedOps.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Restoration Pipeline Operations Executed</span>
          </h4>
          <div className="space-y-1.5">
            {appliedOps.map((op, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-700"
              >
                <span className="w-5 h-5 rounded-md bg-brand-100 text-brand-700 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="font-medium">{op}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Download Actions Section */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Your uploaded product images are processed securely and are not used for unrelated purposes.</span>
        </div>

        <div className="flex items-center gap-2">
          {enhancedUrl && (
            <>
              <button
                type="button"
                onClick={() => onDownload('jpg')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                title="Download Enhanced photo as JPG"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save JPG</span>
              </button>
              
              <button
                type="button"
                onClick={() => onDownload('png')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-all"
                title="Download Lossless Enhanced photo as PNG"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Enhanced (PNG)</span>
              </button>
            </>
          )}
        </div>
      </div>

    </div>
  );
}
