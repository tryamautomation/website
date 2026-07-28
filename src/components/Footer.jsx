import React, { useState } from 'react';
import { Mail, Phone, ShieldCheck, FileText, Lock, Bot } from 'lucide-react';
import LegalModal from './LegalModal';

export default function Footer() {
  const [legalModalTab, setLegalModalTab] = useState(null);

  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
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
          <p className="footer-desc">
            Destroying operational friction. Architecting goal-driven Agentic AI systems, multi-agent swarms, and resilient enterprise CRM infrastructure.
          </p>

          <div className="footer-direct-contact">
            <a href="mailto:tryamautomation@gmail.com" className="contact-chip">
              <Mail size={14} />
              <span>tryamautomation@gmail.com</span>
            </a>
            <a href="tel:8217037173" className="contact-chip">
              <Phone size={14} />
              <span>+91 8217037173</span>
            </a>
            <a href="tel:6363703334" className="contact-chip">
              <Phone size={14} />
              <span>+91 6363703334</span>
            </a>
          </div>
        </div>

        <div className="footer-links-grid">
          <div className="footer-col">
            <h4>Solutions</h4>
            <a href="#solutions">Agentic AI Swarms</a>
            <a href="#solutions">Custom Enterprise CRM</a>
            <a href="#solutions">Orchestration Mesh</a>
          </div>

          <div className="footer-col">
            <h4>Interactive Tools</h4>
            <a href="#playground">Agentic AI Playground</a>
            <a href="#calculator">ROI Calculator</a>
            <a href="#contact">Free System Audit</a>
          </div>

          <div className="footer-col">
            <h4>Legal & Governance</h4>
            <button className="footer-legal-btn" onClick={() => setLegalModalTab('terms')}>
              <FileText size={13} />
              <span>Terms of Service</span>
            </button>
            <button className="footer-legal-btn" onClick={() => setLegalModalTab('privacy')}>
              <Lock size={13} />
              <span>Privacy Policy</span>
            </button>
            <button className="footer-legal-btn legal-warning" onClick={() => setLegalModalTab('scraping')}>
              <Bot size={13} />
              <span>AI &amp; Bot Scraping Policy</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>&copy; 2026 TRYAM Automations. Built for Autonomous Scale. All Rights Reserved.</p>
        <div className="status-indicator">
          <span className="status-dot"></span>
          <span>TRYAM Agentic Core: Operational</span>
        </div>
      </div>

      <LegalModal
        isOpen={!!legalModalTab}
        onClose={() => setLegalModalTab(null)}
        initialTab={legalModalTab || 'terms'}
      />
    </footer>
  );
}
