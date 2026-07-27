import React from 'react';
import { Database, Bot, Network, Check } from 'lucide-react';

export default function SolutionsGrid() {
  return (
    <section id="solutions" className="section-padding">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-badge">Core Pillars</span>
          <h2 className="section-title">Autonomous Agentic AI & Enterprise Infrastructure</h2>
          <p className="section-subtitle">
            Engineered with divine precision and raw execution power. We go beyond simple linear tools to build goal-driven AI systems.
          </p>
        </div>

        <div className="solutions-grid">
          <div className="solution-card glass-panel featured">
            <div className="card-badge">FLAGSHIP</div>
            <div className="card-icon">
              <Bot size={28} />
            </div>
            <h3>Autonomous Agentic AI Swarms</h3>
            <p>Deploy goal-oriented AI agents capable of complex reasoning, multi-step planning, dynamic tool selection, and autonomous execution 24/7.</p>
            <ul className="card-list">
              <li><Check size={18} /> Goal-Driven Strategy & Reasoning</li>
              <li><Check size={18} /> Self-Healing & Error Reflection</li>
              <li><Check size={18} /> Autonomous Lead SDR & Support</li>
            </ul>
          </div>

          <div className="solution-card glass-panel">
            <div className="card-icon">
              <Database size={28} />
            </div>
            <h3>Custom High-Throughput CRMs</h3>
            <p>Bespoke database architectures (Supabase/PostgreSQL) built specifically for your revenue operations. Zero bloat, instant load speeds.</p>
            <ul className="card-list">
              <li><Check size={18} /> Multi-channel Auto-Ingestion</li>
              <li><Check size={18} /> Row Level Security & Real-time Sync</li>
              <li><Check size={18} /> Deployed in Under 7 Days</li>
            </ul>
          </div>

          <div className="solution-card glass-panel">
            <div className="card-icon">
              <Network size={28} />
            </div>
            <h3>Enterprise Orchestration Mesh</h3>
            <p>Full-stack integration combining LangGraph, AutoGen, custom Python microservices, and high-performance API gateways for end-to-end scale.</p>
            <ul className="card-list">
              <li><Check size={18} /> LangGraph & Multi-Agent State Graph</li>
              <li><Check size={18} /> Custom Microservices & API Mesh</li>
              <li><Check size={18} /> Fail-safe Enterprise Resilience</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
