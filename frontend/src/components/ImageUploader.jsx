import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileImage, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  FolderSearch,
  FileCheck,
  Eye
} from 'lucide-react';
import { getSamples, getSampleImageUrl } from '../services/api';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

export default function ImageUploader({
  selectedFile,
  selectedSample,
  originalPreviewUrl,
  imageMeta,
  onImageSelected,
  onClearImage,
  samples = []
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateAndProcessFile = (file) => {
    setErrorMessage(null);

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      setErrorMessage(`Unsupported format "${file.type || 'unknown'}". Please upload a JPG, JPEG, PNG, or WEBP file.`);
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setErrorMessage(`File size (${(file.size / 1024 / 1024).toFixed(1)} MB) exceeds the maximum 20 MB limit.`);
      return;
    }

    if (file.size === 0) {
      setErrorMessage('The selected file is empty (0 bytes).');
      return;
    }

    // Read image dimensions via Image object
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        onImageSelected({
          file,
          sampleId: null,
          previewUrl: e.target.result,
          meta: {
            filename: file.name,
            size: file.size,
            sizeFormatted: (file.size / 1024).toFixed(1) + ' KB',
            width: img.naturalWidth,
            height: img.naturalHeight,
            type: file.type.replace('image/', '').toUpperCase()
          }
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleSelectSample = (sample) => {
    setErrorMessage(null);
    const imageUrl = getSampleImageUrl(sample.id);
    
    // Create preview
    const img = new Image();
    img.onload = () => {
      onImageSelected({
        file: null,
        sampleId: sample.id,
        presetRecommended: sample.recommended_preset,
        previewUrl: imageUrl,
        meta: {
          filename: sample.filename,
          sizeFormatted: '~60 KB',
          width: img.naturalWidth,
          height: img.naturalHeight,
          type: 'JPEG',
          title: sample.title,
          defectType: sample.defect_type,
          isSample: true
        }
      });
    };
    img.src = imageUrl;
  };

  return (
    <div className="space-y-4">
      {/* If an image is selected, show file summary card */}
      {originalPreviewUrl ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 transition-all">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            {/* Thumbnail + Details */}
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-inner">
                <img 
                  src={originalPreviewUrl} 
                  alt="Active Upload" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 left-1 px-1 py-0.5 rounded bg-black/60 text-[9px] font-bold text-white uppercase">
                  {imageMeta?.type || 'IMG'}
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-slate-800 text-sm truncate max-w-[240px] sm:max-w-xs" title={imageMeta?.filename}>
                    {imageMeta?.filename}
                  </h4>
                  {imageMeta?.isSample && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-brand-50 text-brand-700 border border-brand-200 shrink-0">
                      Sample Case
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span>{imageMeta?.width} &times; {imageMeta?.height} px</span>
                  <span>&bull;</span>
                  <span>{imageMeta?.sizeFormatted}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <FolderSearch className="w-3.5 h-3.5" />
                <span>Replace</span>
              </button>
              <button
                type="button"
                onClick={onClearImage}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
                title="Remove this image"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Large Drop Zone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-brand-500 bg-brand-50/70 scale-[1.01]'
              : 'border-slate-300 hover:border-brand-400 bg-white hover:bg-slate-50/50 shadow-sm'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="max-w-md mx-auto space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shadow-xs">
              <UploadCloud className="w-7 h-7" />
            </div>

            <div>
              <p className="text-base font-semibold text-slate-800">
                Drag and drop customer product photo here
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Supports JPG, JPEG, PNG, and WEBP formats (up to 20 MB)
              </p>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-all"
            >
              <FileImage className="w-3.5 h-3.5" />
              <span>Browse Computer Files</span>
            </button>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Built-in Warranty Sample Cases Picker */}
      <div className="bg-slate-100/80 rounded-2xl p-4 border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Faculty / Evaluator Demo Cases
            </span>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Click any test case to load realistic degraded warranty photos
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {samples.map((s) => {
            const isSelected = selectedSample === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelectSample(s)}
                className={`p-2.5 rounded-xl text-left border transition-all duration-150 ${
                  isSelected
                    ? 'bg-brand-50 border-brand-400 shadow-xs ring-2 ring-brand-300'
                    : 'bg-white hover:bg-slate-50 border-slate-200/90 shadow-2xs hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <span className="font-semibold text-slate-900 text-xs truncate">
                    {s.title}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-slate-100 text-slate-600 shrink-0">
                    {s.category.split(' ')[0]}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                  {s.defect_type}
                </p>
                <div className="flex items-center gap-1 mt-2 text-[10px] text-brand-600 font-semibold">
                  <Eye className="w-3 h-3" />
                  <span>Click to Load</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
