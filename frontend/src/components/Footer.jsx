import React from 'react';
import { Sparkles, Shield, Cpu, Code2, Heart, Award } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Branding & Description */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-accent-500 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg text-white tracking-tight">
                  WarrantyClarity<span className="text-brand-400">.AI</span>
                </span>
                <p className="text-xs text-slate-400">
                  Intelligent Product Photo Restoration & Enhancement System
                </p>
              </div>
            </div>
            
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              A specialized image restoration system engineered for consumer electronics warranty support.
              Restores degraded customer photographs containing defocus blur, severe underexposure, sensor noise, and low contrast to enable accurate defect assessments.
            </p>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Privacy Guarantee:</strong> Customer photographs are processed in-memory during active sessions without permanent storage or secondary usage.
              </span>
            </div>
          </div>

          {/* Col 2: Core Algorithms & Tech */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-brand-400" />
              <span>Technical Engine</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                Adaptive CLAHE Contrast (LAB Space)
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                Unsharp Masking (Gaussian Spatial Filter)
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                Bilateral & Non-Local Means Denoising
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                Laplacian Variance Blur Metric (\u03c3\u00b2)
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                Immerkaer Fast Noise Variance
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                Lanczos-4 Resolution Upscaling
              </li>
            </ul>
          </div>

          {/* Col 3: Academic & Project Info */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-accent-400" />
              <span>Academic Capstone</span>
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="font-medium text-slate-300">
                Bachelor of Technology (B.Tech)
              </p>
              <p>
                Department of Computer Science & Engineering
              </p>
              <p>
                Specialization: Computer Vision & Digital Image Processing
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setActivePage('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-brand-400 hover:text-brand-300 underline font-medium text-xs flex items-center gap-1"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>View Project Architecture & Formulas</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; 2026 WarrantyClarity AI. Developed for B.Tech Capstone Demonstration. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              Engineered with Python, FastAPI, OpenCV & React
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
