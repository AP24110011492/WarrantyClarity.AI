import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import About from './pages/About';

export default function App() {
  const [activePage, setActivePage] = useState('home'); // 'home' | 'dashboard' | 'how-it-works' | 'about'

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      <main className="flex-1">
        {activePage === 'home' && <Home setActivePage={setActivePage} />}
        {activePage === 'dashboard' && <Dashboard />}
        {activePage === 'how-it-works' && <Home setActivePage={setActivePage} />}
        {activePage === 'about' && <About setActivePage={setActivePage} />}
      </main>

      <Footer setActivePage={setActivePage} />
    </div>
  );
}
