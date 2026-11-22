import React, { useState, useEffect, useCallback } from 'react';
import { 
  Sparkles, 
  Wand2, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  RotateCcw, 
  Download, 
  Sliders, 
  Info,
  Clock,
  HardDrive,
  FileImage,
  Layers,
  ArrowRight
} from 'lucide-react';

import ImageUploader from '../components/ImageUploader';
import ComparisonSlider from '../components/ComparisonSlider';
import EnhancementControls from '../components/EnhancementControls';
import QualityReport from '../components/QualityReport';
import SessionHistory from '../components/SessionHistory';

import { 
  getSamples, 
  getSampleImageUrl, 
  analyzeImage, 
  enhanceImage, 
  getHistory, 
  clearHistory 
} from '../services/api';

const DEFAULT_SLIDERS = {
  brightness: 0,
  contrast: 0,
  sharpness: 0,
  denoise: 0,
  saturation: 0,
  upscale: 1,
  autoWb: true,
};

export default function Dashboard() {
  // Image selection states
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedSample, setSelectedSample] = useState(null);
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState(null);
  const [enhancedUrl, setEnhancedUrl] = useState(null);
  const [imageMeta, setImageMeta] = useState(null);

  // Enhancement controls
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [sliderValues, setSliderValues] = useState(DEFAULT_SLIDERS);
  const [hasChanges, setHasChanges] = useState(false);

  // Metrics & Report
  const [beforeMetrics, setBeforeMetrics] = useState(null);
  const [afterMetrics, setAfterMetrics] = useState(null);
  const [processingTimeMs, setProcessingTimeMs] = useState(null);
  const [appliedOps, setAppliedOps] = useState([]);

  // Async States
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Sample catalog and session history
  const [samples, setSamples] = useState([]);
  const [historyItems, setHistoryItems] = useState([]);
  const [activeHistoryId, setActiveHistoryId] = useState(null);

  // 1. Initial Load: fetch samples and session history
  useEffect(() => {
    async function loadInitialData() {
      try {
        const samplesRes = await getSamples();
        if (samplesRes.samples) {
          setSamples(samplesRes.samples);
          // Auto-load first sample for immediate demonstration readiness
          if (samplesRes.samples.length > 0 && !originalPreviewUrl) {
            const firstSample = samplesRes.samples[0];
            handleSelectSample(firstSample);
          }
        }
      } catch (err) {
        console.error('Failed to load samples:', err);
      }

      try {
        const histRes = await getHistory();
        if (histRes.history) {
          setHistoryItems(histRes.history);
        }
      } catch (err) {
        console.error('Failed to load history:', err);
      }
    }

    loadInitialData();
  }, []);

  // 2. Handle Selecting a Sample
  const handleSelectSample = async (sample) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setSelectedFile(null);
    setSelectedSample(sample.id);

    const imageUrl = getSampleImageUrl(sample.id);
    setOriginalPreviewUrl(imageUrl);
    setEnhancedUrl(null);
    setAfterMetrics(null);
    setAppliedOps([]);
    setProcessingTimeMs(null);
    setSelectedPreset(sample.recommended_preset || 'auto');
    setSliderValues(DEFAULT_SLIDERS);
    setHasChanges(true);

    setImageMeta({
      filename: sample.filename,
      sizeFormatted: '~60 KB',
      width: 700,
      height: 500,
      type: 'JPEG',
      title: sample.title,
      defectType: sample.defect_type,
      isSample: true
    });

    // Run Quality Analysis on this sample
    setIsAnalyzing(true);
    try {
      const res = await analyzeImage({ sampleId: sample.id });
      setBeforeMetrics(res.analysis);
      
      // Auto-run enhancement using recommended preset for quick evaluation
      runEnhancement({
        sampleId: sample.id,
        preset: sample.recommended_preset || 'auto'
      });
    } catch (err) {
      setErrorMessage(err.message || 'Analysis error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 3. Handle File Upload
  const handleImageSelected = async ({ file, sampleId, previewUrl, meta, presetRecommended }) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setSelectedFile(file);
    setSelectedSample(sampleId);
    setOriginalPreviewUrl(previewUrl);
    setEnhancedUrl(null);
    setAfterMetrics(null);
    setAppliedOps([]);
    setProcessingTimeMs(null);
    setImageMeta(meta);
    setSelectedPreset(presetRecommended || 'auto');
    setSliderValues(DEFAULT_SLIDERS);
    setHasChanges(true);

    // Run Quality Analysis
    setIsAnalyzing(true);
    try {
      const res = await analyzeImage({ file, sampleId });
      setBeforeMetrics(res.analysis);
      
      // Automatically run Auto Enhance on new upload
      runEnhancement({
        file,
        sampleId,
        preset: presetRecommended || 'auto'
      });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to analyze image quality');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 4. Clear Image
  const handleClearImage = () => {
    setSelectedFile(null);
    setSelectedSample(null);
    setOriginalPreviewUrl(null);
    setEnhancedUrl(null);
    setImageMeta(null);
    setBeforeMetrics(null);
    setAfterMetrics(null);
    setAppliedOps([]);
    setProcessingTimeMs(null);
    setSelectedPreset(null);
    setSliderValues(DEFAULT_SLIDERS);
    setErrorMessage(null);
    setSuccessMessage(null);
    setActiveHistoryId(null);
  };

  // 5. Preset Selection
  const handleSelectPreset = (presetId) => {
    setSelectedPreset(presetId);
    setHasChanges(true);
    // Execute enhancement with this preset
    runEnhancement({ preset: presetId });
  };

  // 6. Slider Change
  const handleSliderChange = (key, value) => {
    setSliderValues((prev) => ({ ...prev, [key]: value }));
    setSelectedPreset(null); // Custom slider override
    setHasChanges(true);
  };

  // 7. Core Enhancement Execution
  const runEnhancement = async (overrideParams = {}) => {
    if (!originalPreviewUrl && !selectedFile && !selectedSample) {
      setErrorMessage('Please upload an image or choose a sample first.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const payload = {
      file: overrideParams.file !== undefined ? overrideParams.file : selectedFile,
      sampleId: overrideParams.sampleId !== undefined ? overrideParams.sampleId : selectedSample,
      preset: overrideParams.preset !== undefined ? overrideParams.preset : selectedPreset,
      brightness: overrideParams.brightness !== undefined ? overrideParams.brightness : sliderValues.brightness,
      contrast: overrideParams.contrast !== undefined ? overrideParams.contrast : sliderValues.contrast,
      sharpness: overrideParams.sharpness !== undefined ? overrideParams.sharpness : sliderValues.sharpness,
      denoise: overrideParams.denoise !== undefined ? overrideParams.denoise : sliderValues.denoise,
      saturation: overrideParams.saturation !== undefined ? overrideParams.saturation : sliderValues.saturation,
      upscale: overrideParams.upscale !== undefined ? overrideParams.upscale : sliderValues.upscale,
      autoWb: overrideParams.autoWb !== undefined ? overrideParams.autoWb : sliderValues.autoWb,
      outputFormat: 'jpeg'
    };

    try {
      const res = await enhanceImage(payload);
      setEnhancedUrl(res.enhanced_data_uri);
      setBeforeMetrics(res.before_metrics);
      setAfterMetrics(res.after_metrics);
      setProcessingTimeMs(res.processing_time_ms);
      setAppliedOps(res.applied_operations);
      setActiveHistoryId(res.id);
      setSuccessMessage(`Image successfully restored in ${res.processing_time_ms} ms!`);

      // Refresh session history
      const histRes = await getHistory();
      if (histRes.history) {
        setHistoryItems(histRes.history);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Image enhancement failed');
    } finally {
      setIsProcessing(false);
    }
  };

  // 8. Reset Sliders
  const handleResetAdjustments = () => {
    setSliderValues(DEFAULT_SLIDERS);
    setSelectedPreset(null);
    runEnhancement({
      preset: null,
      ...DEFAULT_SLIDERS
    });
  };

  // 9. Restore Original
  const handleRestoreOriginal = () => {
    setSliderValues(DEFAULT_SLIDERS);
    setSelectedPreset(null);
    setEnhancedUrl(originalPreviewUrl);
    setAfterMetrics(beforeMetrics);
    setAppliedOps(["Restored to unenhanced original"]);
  };

  // 10. Select Item from History
  const handleSelectHistoryItem = (item) => {
    setActiveHistoryId(item.id);
    setEnhancedUrl(item.thumbnail_data_uri);
    setAppliedOps(item.applied_operations || []);
    setProcessingTimeMs(item.processing_time_ms);
    setSuccessMessage(`Reloaded enhancement from session: ${item.filename}`);
  };

  // 11. Clear Session History
  const handleClearHistory = async () => {
    try {
      await clearHistory();
      setHistoryItems([]);
      setActiveHistoryId(null);
    } catch (err) {
      console.error(err);
    }
  };

  // 12. Download Functionality
  const handleDownload = (format = 'png') => {
    if (!enhancedUrl) return;

    const link = document.createElement('a');
    link.href = enhancedUrl;
    const baseName = (imageMeta?.filename || 'warranty_evidence').replace(/\.[^/.]+$/, "");
    link.download = `${baseName}_enhanced.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <Wand2 className="w-4 h-4" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Photo Restoration Workspace
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Consumer Electronics Warranty Claim Visual Assessment Engine
          </p>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-3">
          {isProcessing && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold">
              <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
              <span>Applying OpenCV Filters...</span>
            </div>
          )}

          {successMessage && !isProcessing && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      </div>

      {/* Upload & Sample Selector Area */}
      <ImageUploader
        selectedFile={selectedFile}
        selectedSample={selectedSample}
        originalPreviewUrl={originalPreviewUrl}
        imageMeta={imageMeta}
        onImageSelected={handleImageSelected}
        onClearImage={handleClearImage}
        samples={samples}
      />

      {/* Main Workspace Layout (when an image is active) */}
      {originalPreviewUrl && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left / Center Column: Comparison Canvas & Quality Report (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Interactive Before & After Canvas */}
            <ComparisonSlider
              originalUrl={originalPreviewUrl}
              enhancedUrl={enhancedUrl}
              originalMeta={imageMeta}
              appliedOps={appliedOps}
            />

            {/* Quality & Technical Metrics Report */}
            <QualityReport
              beforeMetrics={beforeMetrics}
              afterMetrics={afterMetrics}
              processingTimeMs={processingTimeMs}
              appliedOps={appliedOps}
              filename={imageMeta?.filename}
              enhancedUrl={enhancedUrl}
              originalUrl={originalPreviewUrl}
              onDownload={handleDownload}
            />

          </div>

          {/* Right Column: Enhancement Presets & Sliders (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <EnhancementControls
              selectedPreset={selectedPreset}
              sliderValues={sliderValues}
              isProcessing={isProcessing}
              onSelectPreset={handleSelectPreset}
              onSliderChange={handleSliderChange}
              onApplyChanges={() => runEnhancement()}
              onResetAdjustments={handleResetAdjustments}
              onRestoreOriginal={handleRestoreOriginal}
              hasChanges={hasChanges}
            />

          </div>

        </div>
      )}

      {/* Session History Strip */}
      <SessionHistory
        historyItems={historyItems}
        activeItemId={activeHistoryId}
        onSelectHistoryItem={handleSelectHistoryItem}
        onClearHistory={handleClearHistory}
      />

    </div>
  );
}
