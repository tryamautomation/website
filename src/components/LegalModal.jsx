import React, { useState } from 'react';
import { X, ShieldAlert, FileText, Lock, Bot } from 'lucide-react';

export default function LegalModal({ isOpen, onClose, initialTab = 'terms' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  if (!isOpen) return null;

  return (
    <div className="legal-modal-overlay" onClick={onClose}>
      <div className="legal-modal-card glass-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>

        <div className="legal-modal-header">
          <div className="legal-icon-badge">
            <ShieldAlert size={24} />
          </div>
          <h2>TRYAM Automations — Legal & Governance</h2>
          <p>Terms of Service, Privacy Policy & Autonomous AI Scraping Disclaimers</p>
        </div>

        <div className="legal-tabs-bar">
          <button 
            className={`legal-tab ${activeTab === 'terms' ? 'active' : ''}`}
            onClick={() => setActiveTab('terms')}
          >
            <FileText size={15} />
            <span>Terms of Service</span>
          </button>
          <button 
            className={`legal-tab ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            <Lock size={15} />
            <span>Privacy Policy</span>
          </button>
          <button 
            className={`legal-tab ${activeTab === 'scraping' ? 'active' : ''}`}
            onClick={() => setActiveTab('scraping')}
          >
            <Bot size={15} />
            <span>AI Scraping & Bot Protection</span>
          </button>
        </div>

        <div className="legal-modal-body">
          {activeTab === 'terms' && (
            <div className="legal-content-section">
              <h3>1. Terms of Service & System Governance</h3>
              <p>Welcome to <strong>TRYAM Automations</strong> ("Agency", "We", "Us"). By accessing our platform, website, custom CRM builds, or engaging our autonomous AI swarms, you agree to comply with these binding terms.</p>
              
              <h4>2. Scope of Services</h4>
              <p>TRYAM Automations provides custom Agentic AI system architecture, multi-agent swarms, high-throughput Supabase/PostgreSQL CRM backends, and enterprise orchestration pipelines. All deliverables are built according to agreed service specifications.</p>

              <h4>3. Intellectual Property</h4>
              <p>All custom neural code, agentic architecture blueprints, custom UI components, and workflow code delivered to paying clients belong to the client upon final settlement. Core agency framework primitives remain proprietary to TRYAM Automations.</p>

              <h4>4. System Availability & SLOs</h4>
              <p>Our autonomous swarms and APIs operate under a 99.9% target uptime Service Level Objective (SLO). Scheduled maintenance will be communicated 48 hours in advance.</p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="legal-content-section">
              <h3>Privacy Policy & Data Security</h3>
              <p>At <strong>TRYAM Automations</strong>, client data privacy and enterprise cryptographic state security are paramount.</p>

              <h4>1. Data Collection & Usage</h4>
              <p>We collect contact information (name, company, email, phone numbers) submitted via our audit form solely for qualifying outreach, constructing custom AI blueprints, and executing automated workflows.</p>

              <h4>2. Supabase Database Security</h4>
              <p>All client data stored in our Supabase/PostgreSQL backend is governed by strict <strong>Row Level Security (RLS)</strong> policies and TLS 1.3 encryption in transit and AES-256 at rest. Anonymous visitors cannot read client records.</p>

              <h4>3. Third-Party API Sharing</h4>
              <p>We never sell or monetize client data. Data passed through AI model APIs (OpenAI, Anthropic, Gemini) is subject to enterprise zero-data-retention agreements where applicable.</p>
            </div>
          )}

          {activeTab === 'scraping' && (
            <div className="legal-content-section border-accent">
              <div className="scraping-warning-box">
                <ShieldAlert size={22} className="text-warning" />
                <strong>STRICT NOTICE REGARDING AUTOMATED BOT SCRAPING & AI CRAWLERS</strong>
              </div>

              <h3>AI Scraping, Web Crawler & Model Training Disclaimer</h3>
              <p>This website and all associated digital assets, visualizers, proprietary code, trade secrets, and content are protected under international copyright and intellectual property laws.</p>

              <h4>1. Prohibition of Unauthorized Web Scraping</h4>
              <p>Automated web scraping, data harvesting, screen scraping, or extraction of content by automated crawlers, bots, or AI scrapers operates strictly under prohibition without express written license from TRYAM Automations.</p>

              <h4>2. AI Model Training Restrictions (Google, Meta, OpenAI, Anthropic, ByteDance)</h4>
              <p>Permission is explicitly <strong>DENIED</strong> for automated web crawlers (including but not limited to <code>Google-Extended</code>, <code>GPTBot</code>, <code>CCBot</code>, <code>Meta-ExternalAgent</code>, <code>ClaudeBot</code>, <code>Bytespider</code>) to harvest, scrape, parse, or index this platform for the purpose of training foundational Large Language Models (LLMs) or generative AI systems without commercial licensing.</p>

              <h4>3. Enforcement & Legal Remedies</h4>
              <p>Any unauthorized scraping, IP harvesting, or automated crawling exceeding standard search engine indexing will result in immediate IP blocking, automated rate-limit drops, and legal enforcement under applicable computer fraud and intellectual property statutes.</p>
            </div>
          )}
        </div>

        <div className="legal-modal-footer">
          <div className="contact-direct">
            <span>Direct Inquiries: <a href="mailto:tryamautomation@gmail.com" className="email-accent">tryamautomation@gmail.com</a> | <strong>+91 8217037173</strong></span>
          </div>
          <button className="btn btn-primary btn-sm" onClick={onClose}>Acknowledge & Close</button>
        </div>
      </div>
    </div>
  );
}
