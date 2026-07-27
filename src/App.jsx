import React, { useState, useEffect } from 'react';
import ParticleCanvas from './components/ParticleCanvas';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SolutionsGrid from './components/SolutionsGrid';
import RoiCalculator from './components/RoiCalculator';
import AgenticSandbox from './components/AgenticSandbox';
import EcosystemGrid from './components/EcosystemGrid';
import LeadIntakeForm from './components/LeadIntakeForm';
import AiChatWidget from './components/AiChatWidget';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';

export default function App() {
  const [theme, setTheme] = useState('shanta');
  const [showAdmin, setShowAdmin] = useState(false);

  const toggleTheme = () => {
    const nextTheme = theme === 'shanta' ? 'raudra' : 'shanta';
    setTheme(nextTheme);
    document.body.className = `theme-${nextTheme}`;
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  useEffect(() => {
    document.body.className = `theme-${theme}`;
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Check URL hash for direct #admin navigation
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setShowAdmin(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  return (
    <div className="app-root">
      <ParticleCanvas theme={theme} />
      <Navbar 
        theme={theme} 
        onToggleTheme={toggleTheme} 
        onOpenAdmin={() => setShowAdmin(true)} 
      />

      {showAdmin ? (
        <AdminDashboard onClose={() => { setShowAdmin(false); window.location.hash = '#hero'; }} />
      ) : (
        <main>
          <Hero theme={theme} />
          <SolutionsGrid />
          <RoiCalculator />
          <AgenticSandbox />
          <EcosystemGrid />
          <LeadIntakeForm />
        </main>
      )}

      {!showAdmin && <AiChatWidget />}
      <Footer />
    </div>
  );
}
