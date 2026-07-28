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
      text: 'Namaste! I am the **TRYAM AI SDR** powered by TRYAM Autonomous Swarm Workflows. What manual bottleneck can we automate for your business today?'
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
    if (qLower.includes('book') || qLower.includes('call') || qLower.includes('appointment') || qLower.includes('schedule') || qLower.includes('demo') || qLower.includes('audit')) {
      return "📅 **I'd love to schedule a 1-on-1 Automation Audit Call with Founder Shreyas Kumar Swamy!**\n\nPlease share your **Phone / WhatsApp Number**, **Work Email**, and **Preferred Time**, and I will book your appointment into our Supabase CRM & send your confirmation!";
    } else if (qLower.includes('phone') || qLower.includes('contact') || qLower.includes('number') || /^\+?\d{8,15}$/.test(query.trim())) {
      return "✅ **Got your details!** I've logged your contact info into TRYAM Supabase Lead Intake. Our founder will call/WhatsApp you shortly to confirm your appointment time!";
    } else if (qLower.includes('automate') || qLower.includes('agentic') || qLower.includes('what can')) {
      return "TRYAM AI architects goal-driven Autonomous Agentic AI Swarms, multi-agent reasoning engines, custom Supabase CRMs, and enterprise orchestration mesh connecting your entire tech stack. Would you like to share your Phone Number & Email to book an appointment?";
    } else if (qLower.includes('crm') || qLower.includes('fast')) {
      return "Our custom high-throughput CRM architectures deploy in under 7 days! Built for infinite scale with zero bloat and Row Level Security. Share your Phone Number & Email to schedule a live demo call!";
    } else if (qLower.includes('price') || qLower.includes('cost')) {
      return "Our systems are custom tailored to your goals. Share your Phone Number & Email here, or fill out the 60-second form on the site to get an instant ROI quote & strategy call!";
    } else if (qLower.includes('hello') || qLower.includes('hi') || qLower.includes('hey')) {
      return "Namaste & Welcome! 👋 I'm TRYAM AI SDR. What manual objective should our AI swarms tackle first? Share your Phone Number & Email anytime to book a 1-on-1 strategy call!";
    }
    return "TRYAM AI architects goal-driven Agentic AI systems, multi-agent reasoning swarms, and custom enterprise CRMs designed to run your business digitally fast. Please share your **Phone Number** and **Email** to book your strategy call!";
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
      const response = await fetch('https://n8n.tryam193.in/webhook/tryam-ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentType: 'TRYAM_CLIENT_SDR',
          audience: 'CLIENT_PUBLIC',
          sessionId: sessionId || 'chat_web',
          message: query
        })
      });

      if (response.ok) {
        const data = await response.json();
        botResp = data.output || data.aiResponse || data.text || data[0]?.output;
      }
    } catch (err) {
      console.warn('[TRYAM] AI Engine connecting to local fallback:', err);
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
            <span className="teaser-title">TRYAM AI SDR</span>
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
                  Live TRYAM AI Engine
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
            <button className="quick-btn" onClick={() => handleSend("I want to book an appointment / strategy call")}>📅 Book Strategy Call</button>
            <button className="quick-btn" onClick={() => handleSend("What can TRYAM AI automate for my business?")}>What can you automate?</button>
            <button className="quick-btn" onClick={() => handleSend("How fast is CRM setup?")}>How fast is CRM setup?</button>
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
