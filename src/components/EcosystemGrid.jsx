import React from 'react';
import { Cpu, Sparkles, Database, Layers, Network, Code, Terminal, Zap, MessageSquare, Webhook } from 'lucide-react';

export default function EcosystemGrid() {
  const tools = [
    { icon: Network, name: 'LangGraph & Multi-Agent Swarms' },
    { icon: Terminal, name: 'Python Neural Microservices' },
    { icon: Cpu, name: 'OpenAI GPT-4o Engine' },
    { icon: Sparkles, name: 'Anthropic Claude 3.5 Sonnet' },
    { icon: Database, name: 'Supabase PostgreSQL DB' },
    { icon: Code, name: 'Custom REST & GraphQL Mesh' },
    { icon: Layers, name: 'Enterprise CRM Integrations' },
    { icon: MessageSquare, name: 'WhatsApp & Telephony APIs' },
    { icon: Zap, name: 'Self-Healing API Gateways' },
    { icon: Webhook, name: 'n8n Integration Mesh' }
  ];

  return (
    <section id="integrations" className="section-padding">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-badge">Universal Agentic Mesh</span>
          <h2 className="section-title">Powered by Cutting-Edge AI Technologies</h2>
          <p className="section-subtitle">
            Beyond basic linear tools. We architect full-stack Agentic AI systems using state-of-the-art frameworks, custom Python engines, and enterprise databases.
          </p>
        </div>

        <div className="ecosystem-grid">
          {tools.map((t, idx) => {
            const Icon = t.icon;
            return (
              <div key={idx} className="eco-badge">
                <Icon size={18} />
                <span>{t.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
