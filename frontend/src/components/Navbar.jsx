import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Layers, 
  HelpCircle, 
  BookOpen, 
  ArrowRight, 
  Activity, 
  Menu, 
  X,
  ShieldCheck
} from 'lucide-react';
import { checkHealth } from '../services/api';

export default function Navbar({ activePage, setActivePage }) {
  const [backendStatus, setBackendStatus] = useState('checking'); // 'online' | 'offline' | 'checking'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function verifyBackend() {
      try {
        const res = await checkHealth();
        if (isMounted) {
          setBackendStatus(res.status === 'healthy' ? 'online' : 'offline');
        }
      } catch (e) {
        if (isMounted) setBackendStatus('offline');
      }
    }
    verifyBackend();
    const interval = setInterval(verifyBackend, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'dashboard', label: 'Enhance Image' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'about', label: 'About Project' },
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                  WarrantyClarity<span className="text-brand-600">.AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                  B.Tech Capstone
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                Intelligent Product Photo Restoration
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  activePage === item.id
                    ? 'text-brand-700 bg-brand-50 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Header Controls */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Backend Connectivity Status Badge */}
            <div 
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                backendStatus === 'online'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : backendStatus === 'checking'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
              title={backendStatus === 'online' ? 'FastAPI & OpenCV Engine Connected' : 'Checking Backend Server'}
            >
              <span className={`w-2 h-2 rounded-full ${
                backendStatus === 'online' 
                  ? 'bg-emerald-500 animate-pulse' 
                  : backendStatus === 'checking' 
                  ? 'bg-amber-500' 
                  : 'bg-rose-500'
              }`} />
              <span className="capitalize">{backendStatus === 'online' ? 'Core Engine Online' : backendStatus}</span>
            </div>

            {/* Launch Enhancer Button */}
            <button
              onClick={() => handleNavClick('dashboard')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 shadow-md shadow-brand-500/20 hover:shadow-brand-500/30 active:scale-[0.98] transition-all"
            >
              <Wand2 className="w-4 h-4" />
              <span>Launch Enhancer</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activePage === item.id
                  ? 'text-brand-700 bg-brand-50 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-slate-500 py-1">
              <span>Backend API Engine:</span>
              <span className={`font-semibold ${backendStatus === 'online' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {backendStatus.toUpperCase()}
              </span>
            </div>
            <button
              onClick={() => handleNavClick('dashboard')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700"
            >
              <Wand2 className="w-4 h-4" />
              <span>Open Enhancement Dashboard</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
