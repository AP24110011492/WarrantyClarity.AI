import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Sun, 
  Contrast, 
  Maximize2, 
  Sliders, 
  Layers, 
  FileCheck2, 
  Split, 
  Download,
  AlertTriangle,
  Cpu,
  Award,
  ChevronRight
} from 'lucide-react';
import ComparisonSlider from '../components/ComparisonSlider';

export default function Home({ setActivePage }) {
  // Sample demonstration preview for the landing page hero
  const sampleBeforeUrl = "/api/samples/sample-1/image";
  const sampleAfterUrl = "/api/samples/sample-1/image"; // Will be rendered with dynamic comparison or demo placeholder

  const features = [
    {
      title: "AI-Assisted Image Enhancement",
      description: "Automated parameter optimization detects lighting, blur, and noise levels to apply tailored restoration filters.",
      icon: Wand2,
      color: "bg-brand-50 text-brand-600 border-brand-200"
    },
    {
      title: "Adaptive Noise Reduction",
      description: "Edge-preserving bilateral filtering and non-local means smoothing eliminate sensor grain while keeping fine text sharp.",
      icon: ShieldCheck,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200"
    },
    {
      title: "Unsharp Mask Sharpening",
      description: "Spatial frequency filtering reconstructs out-of-focus edges, barcode lines, and tiny serial numbers.",
      icon: Zap,
      color: "bg-indigo-50 text-indigo-600 border-indigo-200"
    },
    {
      title: "Non-Linear Brightness Lift",
      description: "Intelligent gamma curves illuminate deep dark chassis shadows without blowing out already bright reflective surfaces.",
      icon: Sun,
      color: "bg-amber-50 text-amber-600 border-amber-200"
    },
    {
      title: "LAB-Space CLAHE Contrast",
      description: "Contrast Limited Adaptive Histogram Equalization applied strictly to lightness, preventing color distortion or halos.",
      icon: Contrast,
      color: "bg-purple-50 text-purple-600 border-purple-200"
    },
    {
      title: "Lanczos-4 Resolution Upscale",
      description: "High-order 2x and 4x super-sampling interpolation with directional edge reinforcement for microscopic defect inspection.",
      icon: Maximize2,
      color: "bg-sky-50 text-sky-600 border-sky-200"
    },
    {
      title: "Interactive Comparison Slider",
      description: "Inspect restorations in real-time using split-screen draggable dividers, synchronized side-by-side, or flip view.",
      icon: Split,
      color: "bg-rose-50 text-rose-600 border-rose-200"
    },
    {
      title: "Auditable Quality Report",
      description: "Objective Laplacian variance and RMS contrast indicators provide scientific evidence for warranty claim justification.",
      icon: FileCheck2,
      color: "bg-teal-50 text-teal-600 border-teal-200"
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Upload Customer Photo",
      desc: "Customer support agents receive and upload photographs submitted by customers during warranty claim filings (JPG, PNG, WEBP up to 20MB)."
    },
    {
      step: "02",
      title: "Intelligent Image Processing",
      desc: "FastAPI and OpenCV execute multi-stage restoration: noise reduction, CLAHE contrast boost, unsharp masking, and white balancing in sub-200ms."
    },
    {
      step: "03",
      title: "Inspect & Download Evidence",
      desc: "Compare before-and-after results, verify crack patterns or serial labels with objective metrics, and export high-resolution evidence files."
    }
  ];

  return (
    <div className="space-y-20 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-12 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-brand-100/40 via-accent-50/20 to-transparent pointer-events-none -z-10 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-50 border border-brand-200 text-brand-700 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Consumer Electronics Warranty Claim Optimization</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Transform Blurry Product Photos into <span className="bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent">Clear Evidence.</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
              AI-powered image restoration designed to help warranty support teams improve product photo clarity, verify physical defects, and accelerate claim assessments.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setActivePage('dashboard');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 shadow-lg shadow-brand-500/25 active:scale-[0.98] transition-all"
              >
                <Wand2 className="w-4 h-4" />
                <span>Get Started – Launch Enhancer</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActivePage('dashboard');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs transition-all"
              >
                <span>Upload Product Photo</span>
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left border-t border-slate-200/60 max-w-2xl mx-auto">
              <div>
                <span className="block text-xl font-extrabold text-slate-900">&lt; 200ms</span>
                <span className="text-xs text-slate-500">Pipeline Execution</span>
              </div>
              <div>
                <span className="block text-xl font-extrabold text-slate-900">100%</span>
                <span className="text-xs text-slate-500">In-Memory Privacy</span>
              </div>
              <div>
                <span className="block text-xl font-extrabold text-slate-900">CLAHE + USM</span>
                <span className="text-xs text-slate-500">Non-Destructive Ops</span>
              </div>
              <div>
                <span className="block text-xl font-extrabold text-slate-900">4x Super-Res</span>
                <span className="text-xs text-slate-500">Lanczos Sampling</span>
              </div>
            </div>

          </div>

          {/* Interactive Hero Showcase Banner */}
          <div className="mt-12 max-w-4xl mx-auto rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 p-3 sm:p-5 shadow-2xl border border-slate-800 text-white">
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 text-xs text-slate-400 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-slate-200">Live Demonstration Scenario: Blurry IMEI & Serial Number Label</span>
              </div>
              <span className="font-mono text-brand-400">RESTORED IN 121 MS</span>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-16/9 bg-black flex items-center justify-center">
              {/* Split teaser */}
              <div className="grid grid-cols-2 w-full h-full">
                
                {/* Left: Simulated Before */}
                <div className="relative bg-slate-900 p-6 flex flex-col justify-between border-r border-slate-700">
                  <span className="self-start px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    BEFORE: UNREADABLE BLUR & LOW CONTRAST
                  </span>
                  <div className="space-y-2 text-center py-8">
                    <p className="text-2xl font-mono text-slate-400 blur-[3px] select-none">
                      SN: 98421-E887-QC
                    </p>
                    <p className="text-sm font-mono text-slate-500 blur-[2px] select-none">
                      IMEI: 864920048194021
                    </p>
                    <div className="w-48 h-8 mx-auto bg-slate-700 blur-[2px] rounded" />
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Defocus Blur Metric: σ² = 5.0 (Severe Blur)
                  </span>
                </div>

                {/* Right: Simulated After */}
                <div className="relative bg-slate-950 p-6 flex flex-col justify-between">
                  <span className="self-start px-2.5 py-1 rounded-md text-[10px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-brand-300" />
                    AFTER: RESTORED FOR AUDIT APPROVAL
                  </span>
                  <div className="space-y-2 text-center py-8">
                    <p className="text-2xl font-mono font-bold text-white tracking-wider">
                      SN: 98421-E887-QC
                    </p>
                    <p className="text-sm font-mono text-brand-200 font-semibold">
                      IMEI: 864920048194021
                    </p>
                    <div className="w-48 h-8 mx-auto border-2 border-white flex items-center justify-center text-[10px] font-mono tracking-widest text-white">
                      ||||| ||| ||||||| |||| |||||
                    </div>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-semibold">
                    Restored Metric: σ² = 121.3 (Legible Crisp Edges)
                  </span>
                </div>

              </div>
            </div>

            <div className="mt-3 flex items-center justify-between px-3 text-xs text-slate-400">
              <span>Applied: CLAHE Contrast Boost &bull; Unsharp Masking &bull; Gray-World White Balance</span>
              <button
                type="button"
                onClick={() => {
                  setActivePage('dashboard');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
              >
                <span>Try this sample now</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 2. THREE-STEP WORKFLOW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
            Operational Workflow
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mt-1">
            How WarrantyClarity AI Works
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Seamlessly integrated into warranty support workflows without complex installations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="relative p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-extrabold text-brand-600/30 group-hover:text-brand-600/60 transition-colors font-mono">
                  {s.step}
                </span>
                <span className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center text-xs font-bold">
                  Step {idx + 1}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {s.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CORE FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
            Engineering Capabilities
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mt-1">
            Engineered for Industrial Image Restoration
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Combines classical computer vision algorithms and spatial filters to solve real-world warranty inspection challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all space-y-3"
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${f.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {f.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. REAL-WORLD WARRANTY CHALLENGES SOLVED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-brand-950 text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                Industry Impact
              </span>
              <h2 className="text-3xl font-bold tracking-tight">
                Why Standard Customer Photos Fail Warranty Audits
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Consumer electronics warranty teams process thousands of customer-submitted return requests monthly. Over 40% of claims are stalled due to unreadable serial numbers, poor lighting obscuring hair-line cracks, or high-ISO noise hiding water damage indicators.
              </p>

              <div className="space-y-2.5 pt-2">
                {[
                  "Disputed physical impact cracks resolved with edge-enhanced sharpening",
                  "Overexposed or dark chassis serial numbers brought to legible contrast",
                  "Burnt PCB power components highlighted by CLAHE micro-contrast",
                  "Fast sub-200ms processing eliminates customer service backlog"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setActivePage('dashboard');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 transition-colors shadow-sm"
                >
                  <Wand2 className="w-4 h-4 text-brand-600" />
                  <span>Launch Enhancement Workspace</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                <div className="flex items-center justify-between text-xs font-bold text-amber-400 mb-1">
                  <span>Common Issue #1: Defocus & Handshake Blur</span>
                  <span className="text-[10px] text-slate-400 font-mono">Laplacian &lt; 50</span>
                </div>
                <p className="text-xs text-slate-300">
                  Customers photograph tiny IMEI or barcode stickers with macro focus failure. WarrantyClarity AI applies unsharp masking and high-boost frequency reconstruction to restore legibility.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                <div className="flex items-center justify-between text-xs font-bold text-blue-400 mb-1">
                  <span>Common Issue #2: Dark Underexposed Lighting</span>
                  <span className="text-[10px] text-slate-400 font-mono">Luminance &lt; 50</span>
                </div>
                <p className="text-xs text-slate-300">
                  Indoor room lighting fails to expose internal headphone stress fractures or ports. Dynamic gamma lifting illuminates deep crevices without blowing out metallic highlights.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                <div className="flex items-center justify-between text-xs font-bold text-purple-400 mb-1">
                  <span>Common Issue #3: High-ISO Digital Grain</span>
                  <span className="text-[10px] text-slate-400 font-mono">Immerkaer &gt; 8.0</span>
                </div>
                <p className="text-xs text-slate-300">
                  Phone cameras in dim environments amplify sensor grain that masks micro-cracks. Bilateral filtering smooths noise while keeping physical crack edges crisp.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Ready to Test the Image Restoration Engine?
        </h2>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Explore the interactive enhancement workspace with our pre-loaded consumer electronics defect samples or upload your own product photos.
        </p>
        <button
          type="button"
          onClick={() => {
            setActivePage('dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 active:scale-[0.98] transition-all"
        >
          <Wand2 className="w-4 h-4" />
          <span>Open Enhancement Dashboard</span>
        </button>
      </section>

    </div>
  );
}
