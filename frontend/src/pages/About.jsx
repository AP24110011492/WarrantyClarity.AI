import React from 'react';
import { 
  Sparkles, 
  Cpu, 
  BookOpen, 
  Code2, 
  Layers, 
  ShieldCheck, 
  Award, 
  Activity, 
  Zap, 
  Sun, 
  Contrast, 
  Maximize2,
  FileCheck,
  CheckCircle2
} from 'lucide-react';

export default function About({ setActivePage }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-50 border border-brand-200 text-brand-700 shadow-2xs">
          <Award className="w-4 h-4 text-brand-600" />
          <span>B.Tech Final Year Engineering Project &bull; Computer Vision & DIP</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          WarrantyClarity AI – Academic Project Documentation
        </h1>
        
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Intelligent Product Photo Restoration and Quality Assessment System for Consumer Electronics Warranty Support
        </p>
      </div>

      {/* 1. Problem Statement & Motivation */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 text-brand-700 font-bold text-base border-b border-slate-100 pb-3">
          <BookOpen className="w-5 h-5 text-brand-600" />
          <h2>1. Executive Summary & Problem Formulation</h2>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          In consumer electronics warranty management, customer support teams are routinely tasked with evaluating return claims, physical damage disputes, and authenticity validations from customer-submitted digital photographs. However, photographs taken on diverse consumer smartphones suffer from severe optical and environmental degradation:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs text-slate-700">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <strong className="text-slate-900 block mb-1">Macro Defocus & Motion Blur:</strong>
            Camera lens failure to focus on microscopic serial number stickers or IMEI barcodes, causing severe edge softening.
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <strong className="text-slate-900 block mb-1">Underexposure & Shadow Occlusion:</strong>
            Dim indoor ambient lighting casting deep shadows over internal chassis fractures and connector pins.
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <strong className="text-slate-900 block mb-1">High-ISO Sensor Grain:</strong>
            Electronic sensor noise in low-light camera captures, masking hairline glass cracks and liquid contact indicator (LCI) coloration.
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <strong className="text-slate-900 block mb-1">Severe Color Casts & Low Dynamic Range:</strong>
            Warm incandescent lighting distorting motherboard component burn marks and PCB trace oxidation.
          </div>
        </div>

        <div className="p-4 rounded-xl bg-brand-50/70 border border-brand-200 text-xs text-brand-900 mt-4">
          <strong>The Solution:</strong> WarrantyClarity AI implements a mathematically rigorous, zero-destructive image processing pipeline combining <em>Contrast Limited Adaptive Histogram Equalization (CLAHE)</em>, <em>Unsharp Masking (USM)</em>, <em>Bilateral Edge-Preserving Denoising</em>, and <em>Lanczos-4 Resolution Super-Sampling</em> with real-time objective quality metrics.
        </div>
      </section>

      {/* 2. Mathematical Formulations & Algorithms */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 text-brand-700 font-bold text-base border-b border-slate-100 pb-3">
          <Cpu className="w-5 h-5 text-brand-600" />
          <h2>2. Algorithmic Formulations & Computer Vision Foundations</h2>
        </div>

        {/* Algorithm 1: CLAHE */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Contrast className="w-4 h-4 text-indigo-600" />
            <span>A. Contrast Limited Adaptive Histogram Equalization (CLAHE)</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Standard global histogram equalization causes excessive noise amplification in homogeneous dark regions. CLAHE subdivides the image into contextual rectangular tiles (e.g., 8&times;8 grids). The local histogram is clipped at a predetermined threshold N_clip:
          </p>
          <div className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto">
            {"N_clip = (M * N / L) * (1 + (clip_limit / 100) * (S_max - 1))"}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            In our system, CLAHE is executed exclusively on the Lightness (L) channel of the <strong>CIE LAB color space</strong>. This mathematical separation prevents any artificial hue or saturation distortion across customer product labels.
          </p>
        </div>

        <hr className="border-slate-100" />

        {/* Algorithm 2: Unsharp Masking */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-600" />
            <span>B. Unsharp Masking (USM) Edge Sharpening</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            To restore softened text and barcode boundaries, an unsharp mask is synthesized by subtracting a 2D Gaussian low-pass filtered representation G_sigma * I from the input image I:
          </p>
          <div className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto">
            {"I_sharp(x,y) = I(x,y) + alpha * [ I(x,y) - (G_sigma * I)(x,y) ]"}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Where alpha (0.2 to 2.0) modulates the high-frequency boost factor and sigma (1.0 to 2.5) controls the spatial kernel bandwidth.
          </p>
        </div>

        <hr className="border-slate-100" />

        {/* Algorithm 3: Bilateral Denoising */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>C. Edge-Preserving Bilateral Filtering</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Unlike standard Gaussian smoothing which blurs sharp crack lines, the bilateral filter calculates pixel weights using both geometric closeness in the spatial domain and photometric similarity in the radiometric domain:
          </p>
          <div className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto">
            {"I_filtered(x) = (1 / W_p) * SUM[ I(x_i) * exp(-||x_i - x||^2 / (2 * sigma_s^2)) * exp(-||I(x_i) - I(x)||^2 / (2 * sigma_r^2)) ]"}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            This guarantees that uniform camera sensor grain is smoothed away while high-gradient barcode edges and fracture boundaries remain preserved.
          </p>
        </div>

        <hr className="border-slate-100" />

        {/* Algorithm 4: Objective Quality Metrics */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-rose-600" />
            <span>D. Scientific Quality Analysis (Blur &amp; Noise Metrics)</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Instead of arbitrary subjective percentages, our system calculates valid computer vision metrics:
          </p>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-5">
            <li>
              <strong>Laplacian Variance Blur Metric (&sigma;&sup2;):</strong> Convolves the grayscale image with the discrete Laplacian operator. Unfocused blurred photos exhibit near-zero variance (&lt; 50), whereas sharp photos exhibit high edge variance (&gt; 250).
            </li>
            <li>
              <strong>Root-Mean-Square (RMS) Contrast:</strong> Standard deviation of pixel intensities measuring the dynamic range utilization of the scene.
            </li>
            <li>
              <strong>Immerkaer Blind Noise Variance (&sigma;_noise):</strong> Computes high-frequency residuals using a discrete 3&times;3 Laplacian mask without requiring ground truth.
            </li>
          </ul>
        </div>
      </section>

      {/* 3. System Architecture */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 text-brand-700 font-bold text-base border-b border-slate-100 pb-3">
          <Layers className="w-5 h-5 text-brand-600" />
          <h2>3. Software Architecture &amp; Technology Stack</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 block text-sm">Frontend Layer</span>
            <ul className="space-y-1 text-slate-600">
              <li>&bull; <strong>React 19 &amp; Vite:</strong> Single-Page Application (SPA) with fast HMR</li>
              <li>&bull; <strong>Tailwind CSS:</strong> Modern SaaS design system with responsive grid</li>
              <li>&bull; <strong>Lucide React:</strong> Consistent visual UI iconography</li>
              <li>&bull; <strong>Custom Canvas Draggable Slider:</strong> Pointer &amp; touch event sync</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 block text-sm">Backend Engine Layer</span>
            <ul className="space-y-1 text-slate-600">
              <li>&bull; <strong>Python 3.14 &amp; FastAPI:</strong> Asynchronous REST API service</li>
              <li>&bull; <strong>OpenCV 4.x / 5.x:</strong> C++ optimized spatial and frequency filters</li>
              <li>&bull; <strong>NumPy &amp; Pillow:</strong> Fast matrix calculations &amp; color conversions</li>
              <li>&bull; <strong>Privacy Guard:</strong> In-memory session processing (no persistent storage)</li>
            </ul>
          </div>
        </div>

        {/* Architecture flow diagram */}
        <div className="p-4 rounded-xl bg-slate-900 text-slate-300 font-mono text-xs space-y-1 overflow-x-auto">
          <p className="text-brand-400 font-bold">[CLIENT BROWSER]</p>
          <p>&nbsp;&nbsp;&darr; Multipart Form-Data (Image Bytes + Sliders / Preset)</p>
          <p className="text-brand-400 font-bold">[FASTAPI REST API: POST /api/enhance]</p>
          <p>&nbsp;&nbsp;&darr; Image Buffer Decoding via cv2.imdecode</p>
          <p className="text-brand-400 font-bold">[IMAGE PROCESSING PIPELINE]</p>
          <p>&nbsp;&nbsp;1. Pre-Analysis: cv2.Laplacian + RMS Contrast + Immerkaer Noise</p>
          <p>&nbsp;&nbsp;2. Super-Resolution: Lanczos-4 Upsampling (INTER_LANCZOS4)</p>
          <p>&nbsp;&nbsp;3. Denoising: cv2.bilateralFilter + fastNlMeansDenoisingColored</p>
          <p>&nbsp;&nbsp;4. Contrast: CIE LAB Color Space &rarr; CLAHE on L-channel</p>
          <p>&nbsp;&nbsp;5. Color: Gray-World Auto White Balance + HSV Saturation</p>
          <p>&nbsp;&nbsp;6. Sharpening: Gaussian Blur + High-Boost Unsharp Mask</p>
          <p>&nbsp;&nbsp;7. Post-Analysis: Objective quality metric verification</p>
          <p>&nbsp;&nbsp;&darr; Base64 Data URI + JSON Metric Audit Report</p>
          <p className="text-emerald-400 font-bold">[INTERACTIVE CLIENT DASHBOARD DISPLAY]</p>
        </div>
      </section>

      {/* 4. Academic Evaluation & Project Credits */}
      <section className="bg-slate-900 text-slate-300 rounded-2xl p-6 sm:p-8 space-y-4 border border-slate-800">
        <div className="flex items-center gap-2.5 text-white font-bold text-base border-b border-slate-800 pb-3">
          <Award className="w-4 h-4 text-brand-400" />
          <h2>4. Project Verification &amp; Demonstration Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Domain:</span>
            <span className="text-white font-semibold">Image Restoration &amp; Consumer Electronics</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Engineering Degree:</span>
            <span className="text-white font-semibold">Bachelor of Technology (B.Tech)</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Academic Year:</span>
            <span className="text-white font-semibold">Final Year Capstone Project</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed pt-2">
          This system was designed, implemented, and verified to demonstrate practical computer vision principles in an industrial customer-support context. All image processing operations perform actual mathematical transformations on live pixel data.
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              setActivePage('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors shadow-sm"
          >
            <span>Return to Enhancement Dashboard</span>
          </button>
        </div>
      </section>

    </div>
  );
}
