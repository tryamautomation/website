import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, Calculator, ArrowDown, Cpu } from 'lucide-react';
import PipelineVisualizer from './PipelineVisualizer';

const Counter = ({ end, suffix = '', prefix = '', isVisible }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!isVisible) return;
    let startTime;
    const duration = 2000; // 2 seconds
    
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      setCount(Math.floor(easeProgress * end));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(end); // Ensure we hit exact end
      }
    };
    
    requestAnimationFrame(step);
  }, [isVisible, end]);
  
  return <>{prefix}{count}{suffix}</>;
};

export default function Hero({ theme }) {
  const [typedText, setTypedText] = useState('');
  const fullText = "Autonomous Agentic AI.";
  
  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);
    return () => clearInterval(typingInterval);
  }, []);

  const [statsVisible, setStatsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    const element = document.getElementById('hero-stats');
    if (element) observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="hero" className="hero-section">
      <div className="container">
        <div className="hero-inner">
          <div className="hero-header-badge">
            <span className="badge-pulsing-dot"></span>
            <span className="badge-text">
              {theme === 'shanta'
                ? 'Shanta Avatar — Serene Agentic Execution'
                : 'Raudra Avatar — Fierce Autonomous AI Power'}
            </span>
          </div>

          <h1 className="hero-title">
            Beyond Linear Workflows.<br />
            <span className="gradient-text typewriter-glitch">{typedText}</span>
          </h1>

          <p className="hero-subtitle">
            TRYAM Automations architects goal-driven multi-agent swarms, custom reasoning engines, 
            and enterprise CRM backends. We go beyond static automation — empowering your business to run digitally fast.
          </p>

          <div className="hero-cta-group">
            <a href="#contact" className="btn btn-primary btn-lg float-bob-1">
              <Zap size={18} />
              <span>Free Agentic AI Audit</span>
            </a>
            <a href="#calculator" className="btn btn-secondary btn-lg float-bob-2">
              <Calculator size={18} />
              <span>Calculate Savings</span>
            </a>
          </div>
        </div>

        <PipelineVisualizer />

        <div id="hero-stats" className="hero-stats">
          <div className="stat-item">
            <span className="stat-number gradient-text">
              <Counter end={100} suffix="%" isVisible={statsVisible} />
            </span>
            <span className="stat-label">Goal-Driven Execution</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number gradient-text">
              <Counter end={10} suffix="x" isVisible={statsVisible} />
            </span>
            <span className="stat-label">Autonomous Speed</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number gradient-text">
              <Counter end={300} prefix="&lt; " suffix="ms" isVisible={statsVisible} />
            </span>
            <span className="stat-label">Agent Reasoning Latency</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number gradient-text">
              <Counter end={24} suffix="/7" isVisible={statsVisible} />
            </span>
            <span className="stat-label">Self-Healing AI Swarms</span>
          </div>
        </div>

        <div className="hero-scroll-hint">
          <a href="#solutions">
            <ArrowDown size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
