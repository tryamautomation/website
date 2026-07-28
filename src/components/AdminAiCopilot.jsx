import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, Zap, CircleDot, RefreshCw
} from 'lucide-react';

const ADMIN_WEBHOOK = 'https://n8n.tryam193.in/webhook/tryam-ai-chat';

export default function AdminAiCopilot({ leads = [], chatLogs = [] }) {
  // --- Live DB stats ---
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'new').length;
  const closedLeads = leads.filter(l => l.status === 'closed').length;
  const processingLeads = leads.filter(l => l.status === 'processing' || l.status === 'contacted').length;

  const bottleneckCounts = leads.reduce((acc, l) => {
    const b = l.bottleneck || 'Unspecified';
    acc[b] = (acc[b] || 0) + 1;
    return acc;
  }, {});

  const topBottleneck = Object.entries(bottleneckCounts).sort((a, b) => b[1] - a[1])[0];
  const latestLead = leads[0];

  // --- Build admin system context string injected into every message ---
  const buildAdminContext = (userQuery) => {
    const leadsSummary = leads.slice(0, 5).map(l =>
      `[${l.name} | ${l.company || 'N/A'} | ${l.email} | status:${l.status} | bottleneck:${l.bottleneck || 'N/A'} | ${new Date(l.created_at).toLocaleDateString()}]`
    ).join('\n');

    return `[ADMIN SYSTEM CONTEXT - TRYAM INTELLIGENCE CORE]
You are the TRYAM Admin AI Copilot — an internal master agent for admin Shreyas Kumar Swamy at TRYAM Automations.
You have FULL ACCESS to real-time database context, company policies, and all tooling infrastructure.

=== LIVE DATABASE SNAPSHOT ===
- Total Leads in Supabase: ${totalLeads}
- New Inbound (unactioned): ${newLeads}
- Active Pipeline (processing/contacted): ${processingLeads}
- Closed / Won: ${closedLeads}
- Top Bottleneck Category: ${topBottleneck ? `${topBottleneck[0]} (${topBottleneck[1]} leads)` : 'N/A'}
${latestLead ? `- Latest Lead: ${latestLead.name} | ${latestLead.company} | ${latestLead.email} | ${latestLead.bottleneck}` : ''}

=== RECENT LEADS (last 5) ===
${leadsSummary || 'No leads yet.'}

=== DATABASE SCHEMA (Supabase PostgreSQL 15, RLS enabled) ===
- leads: id, name, company, email, phone, bottleneck, details, status (new/processing/contacted/closed), created_at
- chat_logs: id, session_id, sender (user/bot), message, created_at
- state_sync_events: multi-app CRM sync audit trail (Stripe, Salesforce, Zendesk)
- qualified_leads_audit: AI lead scoring log
- invoice_ledger: Vision OCR financial document records

=== N8N AUTOMATION ENGINE ===
- Webhook ID: B6S9YnLe3kx22Tgj
- Flow: Lead Submit → Supabase Insert → Gmail SMTP dual dispatch (to prospect + shreyaskumarswamy2007@gmail.com)
- Integrated APIs: Apollo V2, LinkedIn Enricher, Vision OCR, QuickBooks REST API, HubSpot CRM, Zendesk Tickets V2, Salesforce SOQL

=== COMPANY IDENTITY ===
- Company: TRYAM Automations | Inspired by Lord Shiva's Shanta (serene execution) & Raudra (fierce autonomy) avatars
- Founder & CEO: Shreyas Kumar Swamy
- Admin Email: shreyaskumarswamy2007@gmail.com | Agency: tryamautomation@gmail.com
- Phones: +91 8217037173, +91 6363703334
- Master Admin Passkey: TRYAM193
- Anti-bot scraping: Legal prohibition against Google, Meta, OpenAI crawlers. RLS enforced.

=== INSTRUCTIONS ===
Answer ONLY as the admin intelligence copilot. Be concise, professional, and data-driven.
Use the live database context above to answer accurately. If asked to draft an email, use the real lead data.
Admin's query: ${userQuery}`;
  };

  // --- Fallback for when n8n is offline ---
  const getFallback = (query) => {
    const q = query.toLowerCase();
    if (q.includes('lead') || q.includes('stat') || q.includes('summary') || q.includes('analytics')) {
      return `📊 **Live CRM Snapshot**\n\n- Total Leads: \`${totalLeads}\`\n- New Inbound: \`${newLeads}\`\n- Pipeline: \`${processingLeads}\`\n- Closed Won: \`${closedLeads}\`\n- Top Bottleneck: **${topBottleneck?.[0] || 'N/A'}**\n${latestLead ? `\nLatest: **${latestLead.name}** (${latestLead.company}) — \`${latestLead.email}\`` : ''}\n\n_n8n AI engine offline — serving local context._`;
    }
    if (q.includes('email') || q.includes('draft') || q.includes('outreach')) {
      const t = latestLead || { name: 'Prospect', company: 'Company', email: 'prospect@email.com', bottleneck: 'Manual Workflow' };
      return `✉️ **Draft Email**\n\nTo: \`${t.email}\`\nSubject: TRYAM Autonomous AI Swarms for ${t.company}\n\nHi ${t.name.split(' ')[0]},\n\nI saw your bottleneck: **${t.bottleneck}**. TRYAM's goal-driven AI swarms can resolve this in under 7 days.\n\nBook a 15-min audit: tryamautomation.com/#contact\n\n— Shreyas | TRYAM Automations | +91 8217037173`;
    }
    if (q.includes('tool') || q.includes('db') || q.includes('n8n') || q.includes('webhook')) {
      return `⚡ **Infrastructure Overview**\n\n**Supabase Tables:** leads, chat_logs, state_sync_events, qualified_leads_audit, invoice_ledger\n\n**n8n Webhook:** \`B6S9YnLe3kx22Tgj\`\n**APIs:** Apollo V2, LinkedIn Enricher, Vision OCR, QuickBooks, HubSpot, Zendesk, Salesforce\n\n_n8n AI engine offline — serving knowledge base._`;
    }
    return `⚠️ TRYAM AI Engine (n8n) is currently offline. I'm serving from local knowledge base.\n\nDB: **${totalLeads}** leads stored | Admin: shreyaskumarswamy2007@gmail.com\n\nAsk about: leads, emails, DB schema, n8n tools, company info.`;
  };

  // --- Chat state ---
  const [messages, setMessages] = useState([{
    sender: 'copilot',
    text: `🔱 **TRYAM Intelligence Core — Admin Access Granted**\n\nI have real-time access to your **Supabase database** (${totalLeads} leads), **n8n automation engine**, and complete **TRYAM knowledge base**.\n\nAsk me anything — lead analytics, email drafts, DB schemas, workflow details, or company policies.`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }]);
  const [inputMsg, setInputMsg] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const chatScrollRef = useRef(null);
  const sessionId = useRef(`admin_${Date.now()}`);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSend = async (text) => {
    const q = (text || inputMsg).trim();
    if (!q || isThinking) return;

    setMessages(prev => [...prev, {
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setInputMsg('');
    setIsThinking(true);

    let botResp = '';

    try {
      const adminPayload = buildAdminContext(q);
      const response = await fetch(ADMIN_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentType: 'TRYAM_ADMIN_COPILOT',
          audience: 'ADMIN_INTERNAL',
          sessionId: sessionId.current,
          message: adminPayload,
          adminPasskey: 'TRYAM193'
        })
      });

      if (response && response.ok) {
        const data = await response.json();
        botResp = data.output || data.aiResponse || data.text || data[0]?.output || '';
      }
    } catch (err) {
      console.warn('[TRYAM Admin] n8n offline, using fallback:', err.message);
    }

    if (!botResp) {
      botResp = getFallback(q);
    }

    setMessages(prev => [...prev, {
      sender: 'copilot',
      text: botResp,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setIsThinking(false);
  };

  // --- Markdown renderer ---
  const renderMd = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('### ')) return <h4 key={i} className="md-header">{line.slice(4)}</h4>;
      if (line.startsWith('## ')) return <h4 key={i} className="md-header">{line.slice(3)}</h4>;
      if (line.startsWith('#### ')) return <h5 key={i} className="md-sub-header">{line.slice(5)}</h5>;

      const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);
      const rendered = parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) return <strong key={j}>{part.slice(2, -2)}</strong>;
        if (part.startsWith('`') && part.endsWith('`')) return <code key={j} className="md-code">{part.slice(1, -1)}</code>;
        return <span key={j}>{part}</span>;
      });

      if (line.startsWith('- ')) return <p key={i} className="md-list-item">• {rendered.slice(1)}</p>;
      return <p key={i} className="md-paragraph">{rendered}</p>;
    });
  };

  return (
    <div className="premium-copilot-container">

      {/* LEFT PANEL: CHAT */}
      <div className="premium-chat-panel">
        <div className="p-copilot-header">
          <div className="p-header-left">
            <div className="p-avatar-pulse">
              <Bot size={22} className="bot-icon-glow" />
              <div className="pulse-ring"></div>
            </div>
            <div className="p-header-titles">
              <h3>TRYAM Intelligence Core</h3>
              <span>Autonomous Admin AI • Live n8n + DB Connected</span>
            </div>
          </div>
          <div className="p-header-status">
            <span className="live-dot-green"></span>
            <span>ONLINE</span>
          </div>
        </div>

        <div className="p-chat-scroll" ref={chatScrollRef}>
          {messages.map((m, idx) => (
            <div key={idx} className={`p-msg-wrapper ${m.sender === 'copilot' ? 'is-bot' : 'is-user'}`}>
              {m.sender === 'copilot' && (
                <div className="p-msg-avatar"><Bot size={15} /></div>
              )}
              <div className={`p-msg-bubble ${m.sender === 'copilot' ? 'bot-bubble' : 'user-bubble'}`}>
                {renderMd(m.text)}
                <div className="p-msg-time">{m.timestamp}</div>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="p-msg-wrapper is-bot">
              <div className="p-msg-avatar"><Bot size={15} /></div>
              <div className="p-msg-bubble bot-bubble thinking-bubble">
                <div className="thinking-dots"><span></span><span></span><span></span></div>
                <span className="thinking-text">Querying n8n AI engine + Supabase...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-chat-bottom">
          <div className="p-quick-chips">
            <button onClick={() => handleSend("Give me a full CRM analytics summary with all leads")}>📊 CRM Report</button>
            <button onClick={() => handleSend("Draft a personalized outreach email for the latest lead in the database")}>✉️ Draft Email</button>
            <button onClick={() => handleSend("List all database tables, n8n webhooks, and integrated API tools")}>⚡ DB & Tools</button>
            <button onClick={() => handleSend("What are the TRYAM company details, contacts, and security policies?")}>🏢 Company Info</button>
          </div>
          <div className="p-input-wrapper">
            <input
              type="text"
              className="p-chat-input"
              placeholder="Ask anything — leads, emails, DB schema, n8n tools, policies..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="p-send-btn" onClick={() => handleSend()} disabled={isThinking || !inputMsg.trim()}>
              {isThinking ? <RefreshCw size={16} className="spin" /> : <Send size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: LIVE TELEMETRY */}
      <div className="premium-telemetry-panel">
        <div className="telemetry-header">
          <Zap size={18} className="telemetry-icon-glow" />
          <h4>Live System Telemetry</h4>
        </div>

        <div className="telemetry-metrics-grid">
          <div className="t-metric-card">
            <span className="tm-label">Total Leads</span>
            <span className="tm-value">{totalLeads}</span>
          </div>
          <div className="t-metric-card">
            <span className="tm-label">New Inbound</span>
            <span className="tm-value highlight-cyan">{newLeads}</span>
          </div>
          <div className="t-metric-card">
            <span className="tm-label">Pipeline</span>
            <span className="tm-value highlight-purple">{processingLeads}</span>
          </div>
          <div className="t-metric-card">
            <span className="tm-label">Closed Won</span>
            <span className="tm-value highlight-green">{closedLeads}</span>
          </div>
        </div>

        <div className="telemetry-section">
          <h5 className="ts-title">SYSTEM TOOLS</h5>
          <div className="ts-tools-list">
            {[
              { label: 'n8n Webhook Engine', color: 'green' },
              { label: 'Supabase PostgreSQL', color: 'green' },
              { label: 'Gmail SMTP (Dual)', color: 'green' },
              { label: 'Apollo V2 API', color: 'yellow' },
              { label: 'LinkedIn Enricher', color: 'yellow' },
              { label: 'Vision OCR', color: 'blue' },
              { label: 'HubSpot CRM', color: 'blue' },
              { label: 'Salesforce SOQL', color: 'blue' },
            ].map(t => (
              <div key={t.label} className="ts-tool-item">
                <CircleDot size={11} className={`status-dot ${t.color}`} />
                <span>{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="telemetry-section">
          <h5 className="ts-title">CONTACTS</h5>
          <div className="ts-contact-card">
            <div className="tc-row"><span className="tc-label">Admin:</span><span className="tc-val">shreyaskumarswamy2007@gmail.com</span></div>
            <div className="tc-row"><span className="tc-label">Agency:</span><span className="tc-val">tryamautomation@gmail.com</span></div>
            <div className="tc-row"><span className="tc-label">Phone:</span><span className="tc-val">+91 8217037173</span></div>
          </div>
        </div>

        {topBottleneck && (
          <div className="telemetry-section">
            <h5 className="ts-title">TOP BOTTLENECK</h5>
            <div className="ts-bottleneck-card">
              <span className="tb-label">{topBottleneck[0]}</span>
              <span className="tb-count">{topBottleneck[1]} leads</span>
            </div>
          </div>
        )}

        {latestLead && (
          <div className="telemetry-section">
            <h5 className="ts-title">LATEST LEAD</h5>
            <div className="ts-contact-card">
              <div className="tc-row"><span className="tc-label">Name:</span><span className="tc-val">{latestLead.name}</span></div>
              <div className="tc-row"><span className="tc-label">Co:</span><span className="tc-val">{latestLead.company || 'N/A'}</span></div>
              <div className="tc-row"><span className="tc-label">Email:</span><span className="tc-val">{latestLead.email}</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
