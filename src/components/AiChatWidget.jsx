import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Bot, X, Send, MessageSquare, Zap, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

function generateSessionId() {
  return `chat_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

export default function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [showTeaser, setShowTeaser] = useState(true);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaste! I am the **TRYAM Autonomous SDR** powered by OpenAI & n8n workflows. What manual bottleneck can we automate for your business today?'
    }
  ]);

  useEffect(() => {
    if (isOpen && !sessionId) {
      setSessionId(generateSessionId());
      setShowTeaser(false);
    }
  }, [isOpen, sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const logToSupabase = async (sender, message) => {
    if (!sessionId) return;
    try {
      await supabase.from('chat_logs').insert({
        session_id: sessionId,
        sender,
        message
      });
    } catch (err) {
      console.warn('[TRYAM] Chat log failed:', err.message);
    }
  };

  const getFallbackResponse = (query) => {
    const qLower = query.toLowerCase();
    if (qLower.includes('automate') || qLower.includes('agentic') || qLower.includes('what can')) {
      return "We architect goal-driven Autonomous Agentic AI Swarms, multi-agent reasoning engines, custom Supabase CRMs, and enterprise orchestration mesh connecting your entire tech stack.";
    } else if (qLower.includes('crm') || qLower.includes('fast')) {
      return "Our custom high-throughput CRM architectures (Supabase/PostgreSQL) deploy in under 7 days! Built for infinite scale with zero bloat and Row Level Security.";
    } else if (qLower.includes('n8n') || qLower.includes('workflow') || qLower.includes('mesh')) {
      return "We go beyond linear workflows — orchestrating LangGraph, AutoGen, custom Python microservices, and n8n integration gateways with enterprise resilience.";
    } else if (qLower.includes('price') || qLower.includes('cost')) {
      return "Our systems are custom tailored to your goals. Fill out our 60-second assessment form on the site to get a custom strategy blueprint & ROI quote!";
    } else if (qLower.includes('hello') || qLower.includes('hi') || qLower.includes('hey')) {
      return "Namaste & Welcome! 👋 I'm your Autonomous AI SDR. What manual objective or workflow bottleneck should our AI swarms tackle first?";
    }
    return "TRYAM Automations architects goal-driven Agentic AI systems, multi-agent reasoning swarms, and custom enterprise CRMs designed to run your business digitally fast. Would you like to schedule a free 1-on-1 strategy audit?";
  };

  const handleSend = async (textToSend) => {
    const query = textToSend || inputMsg.trim();
    if (!query || isThinking) return;

    setMessages((prev) => [...prev, { sender: 'user', text: query }]);
    setInputMsg('');
    setIsThinking(true);

    logToSupabase('user', query);

    let botResp = '';

    try {
      // Call n8n OpenAI SDR LLM Webhook
      const response = await fetch('https://n8n.tryam193.in/webhook/tryam-ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionId || 'chat_web',
          message: query
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Support n8n AI Agent output or custom set output
        botResp = data.output || data.aiResponse || data.text || data[0]?.output;
      }
    } catch (err) {
      console.warn('[TRYAM] n8n AI LLM Webhook unreachable, using smart SDR engine:', err);
    }

    if (!botResp) {
      botResp = getFallbackResponse(query);
    }

    setMessages((prev) => [...prev, { sender: 'bot', text: botResp }]);
    setIsThinking(false);

    logToSupabase('bot', botResp);
  };

  const handleToggle = () => {
    if (!isOpen) {
      setSessionId(generateSessionId());
      setShowTeaser(false);
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="ai-widget">
      {/* COLLAPSED TEASER TOOLTIP */}
      {!isOpen && showTeaser && (
        <div className="chat-teaser-bubble glass-panel" onClick={handleToggle}>
          <div className="teaser-avatar">
            <Bot size={16} />
          </div>
          <div className="teaser-content">
            <span className="teaser-title">TRYAM AI SDR (OpenAI)</span>
            <span className="teaser-sub">Automate your business digitally fast ⚡</span>
          </div>
          <button className="teaser-close" onClick={(e) => { e.stopPropagation(); setShowTeaser(false); }}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* CHAT CONTAINER MODAL */}
      {isOpen && (
        <div className="widget-chat-box glass-panel">
          <div className="chat-header">
            <div className="chat-bot-info">
              <div className="bot-avatar"><Bot size={18} /></div>
              <div>
                <strong>TRYAM AI SDR</strong>
                <span className="bot-status">
                  <span className="pulse-dot"></span>
                  Live LLM (OpenAI GPT-4o)
                </span>
              </div>
            </div>
            <button className="chat-close" onClick={() => setIsOpen(false)}><X size={18} /></button>
          </div>

          <div className="chat-messages">
            {messages.map((m, idx) => (
              <div key={idx} className={`chat-msg ${m.sender}-msg`}>
                <p>{m.text}</p>
              </div>
            ))}

            {isThinking && (
              <div className="chat-msg bot-msg typing-msg">
                <div className="typing-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-quick-prompts">
            <button className="quick-btn" onClick={() => handleSend("What can TRYAM automate for my business?")}>What can you automate?</button>
            <button className="quick-btn" onClick={() => handleSend("How fast is CRM setup?")}>How fast is CRM setup?</button>
            <button className="quick-btn" onClick={() => handleSend("How does n8n integration work?")}>n8n Workflow details</button>
          </div>

          <div className="chat-input-row">
            <input
              type="text"
              placeholder="Ask TRYAM AI SDR anything..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="btn-send" onClick={() => handleSend()} disabled={isThinking}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* FLOATING TRIGGER ICON BUTTON */}
      <button 
        className={`widget-trigger-floating ${isOpen ? 'active' : ''}`} 
        onClick={handleToggle}
        title="Chat with TRYAM AI SDR"
      >
        <div className="floating-icon-wrapper">
          {isOpen ? (
            <X size={22} className="trigger-icon" />
          ) : (
            <>
              <MessageSquare size={22} className="trigger-icon" />
              <Sparkles size={14} className="sparkle-badge-icon" />
            </>
          )}
        </div>
        {!isOpen && <span className="unread-dot"></span>}
      </button>
    </div>
  );
}
