import React, { useState } from 'react';
import { Moon, Flame, ArrowRight, Menu, X } from 'lucide-react';

export default function Navbar({ theme, onToggleTheme }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="navbar" id="navbar">
      <div className="container nav-container">
        <a href="#hero" className="brand-logo">
          <div className="logo-symbol">
            <svg viewBox="0 0 40 40" className="logo-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4V36M20 4L12 14M20 4L28 14M8 16C8 24 12 28 20 28C28 28 32 24 32 16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="20" cy="20" r="3" fill="currentColor"/>
            </svg>
          </div>
          <div className="brand-name-group">
            <span className="logo-text">TRYAM</span>
            <span className="logo-tag">AUTOMATIONS</span>
          </div>
        </a>

        <nav className={`nav-links ${mobileOpen ? 'nav-open' : ''}`}>
          <a href="#playground" className="nav-link" onClick={() => setMobileOpen(false)}>AI Playground</a>
          <a href="#solutions" className="nav-link" onClick={() => setMobileOpen(false)}>Solutions</a>
          <a href="#calculator" className="nav-link" onClick={() => setMobileOpen(false)}>ROI Calculator</a>
          <a href="#integrations" className="nav-link" onClick={() => setMobileOpen(false)}>Ecosystem</a>
          <a href="#contact" className="nav-link nav-link-mobile" onClick={() => setMobileOpen(false)}>Book Audit</a>
        </nav>

        <div className="nav-actions">
          <button className="theme-switcher" onClick={onToggleTheme} title="Switch Avatar Theme">
            {theme === 'shanta' ? (
              <div className="theme-state state-shanta">
                <Moon size={14} />
                <span>Shanta</span>
              </div>
            ) : (
              <div className="theme-state state-raudra">
                <Flame size={14} />
                <span>Raudra</span>
              </div>
            )}
          </button>

          <a href="#contact" className="btn btn-primary nav-cta-btn">
            <span>Book a Call</span>
            <ArrowRight size={14} />
          </a>

          <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}
