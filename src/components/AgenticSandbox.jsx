import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play, CheckCircle2, Terminal, Cpu, Database,
  Zap, Activity, Layers, Users, Clock, Shield, Wifi
} from 'lucide-react';

const PRESETS = [
  {
    id: 'sdr-swarm',
    badge: 'SDR',
    title: 'Lead SDR & Qualification Swarm',
    agents: ['LeadParser', 'ApolloEnricher', 'ScoringAgent', 'SlackNotifier'],
    stepsData: [
      { step: 1, title: 'Goal & Constraint Parsing', log: { timestamp: '00:00.12', agent: 'ParserAgent', level: 'INFO', msg: 'Goal parsed. Target parameters extracted.', payload: { goal: 'Qualify SDR Leads', constraints: { minRevenue: '$10M+', stack: ['SaaS'], scoreThreshold: 85 }, priority: 'HIGH_LATENCY_SLO_200ms' }}},
      { step: 2, title: 'Agent Planning & Tool Selection', log: { timestamp: '00:01.35', agent: 'SwarmOrchestrator', level: 'PLAN', msg: 'DAG compiled. 4 sub-agents instantiated.', payload: { pipelineDAG: ['LeadParser -> ApolloEnricher', 'ApolloEnricher -> ScoringAgent'], selectedTools: ['apollo_v2', 'icp_scorer_nn', 'hubspot_api'], estimatedTokens: 1420 }}},
      { step: 3, title: 'Swarm Execution & Parallel Ops', log: { timestamp: '00:02.80', agent: 'ScoringAgent', level: 'EXEC', msg: 'Parallel enrichment complete. ICP Score: 94.8', payload: { lead: 'alex.v@hypergrowth.io', company: 'HyperGrowth Dynamics', enrichment: { employees: 450, revenue: '$25M', funding: 'Series C' }, icpScore: 94.8 }}},
      { step: 4, title: 'Verification & State Persistence', log: { timestamp: '00:04.10', agent: 'PersistenceBridge', level: 'SUCCESS', msg: 'State committed to Supabase. Notifications dispatched.', payload: { supabaseTable: 'qualified_leads_audit', rowId: 'sdr_lead_8849201f', crmSync: '200_OK', latencyMs: 384 }}}
    ]
  },
  {
    id: 'doc-extract',
    badge: 'FINANCE',
    title: 'Invoice & Document Extraction',
    agents: ['VisionOCR', 'TaxAuditor', 'LineItemValidator', 'ERPBridge'],
    stepsData: [
      { step: 1, title: 'Goal & Constraint Parsing', log: { timestamp: '00:00.08', agent: 'ParserAgent', level: 'INFO', msg: 'Ingestion params loaded. S3 Bucket verified.', payload: { sourceBucket: 's3://finance-inbound/2026/07/', fileTypes: ['.pdf', '.tiff'], mathTolerance: 0.05 }}},
      { step: 2, title: 'Agent Planning & Tool Selection', log: { timestamp: '00:01.10', agent: 'SwarmOrchestrator', level: 'PLAN', msg: 'Swarm bound to OCR engine & ERP endpoints.', payload: { activeAgents: ['VisionOCR', 'TaxAuditor', 'ERPBridge'], concurrencyLimit: 8 }}},
      { step: 3, title: 'Swarm Execution & Parallel Ops', log: { timestamp: '00:02.95', agent: 'VisionOCR', level: 'EXEC', msg: 'Document parsed. Zero arithmetic discrepancies.', payload: { vendor: 'Acme Corp', invoiceNumber: 'INV-2026-9912', subtotal: 145000, tax: 11600, total: 156600, poMatch: 'VERIFIED' }}},
      { step: 4, title: 'Verification & State Persistence', log: { timestamp: '00:04.30', agent: 'PersistenceBridge', level: 'SUCCESS', msg: 'Invoice synced to QuickBooks & Supabase audit ledger.', payload: { supabaseTable: 'invoice_ledger', recordHash: 'sha256_e891c94f', erpSync: 'QUICKBOOKS_200', duration: '1.42s' }}}
    ]
  },
  {
    id: 'crm-sync',
    badge: 'CRM',
    title: 'Enterprise CRM Multi-App Sync',
    agents: ['WebhookListener', 'StateResolver', 'SalesforceAgent', 'ZendeskBot'],
    stepsData: [
      { step: 1, title: 'Goal & Constraint Parsing', log: { timestamp: '00:00.15', agent: 'ParserAgent', level: 'INFO', msg: 'Multi-app state sync criteria initialized.', payload: { trigger: 'Stripe_Webhook_customer.subscription.deleted', targets: ['Salesforce', 'Zendesk'], syncPolicy: 'BI_DIRECTIONAL_IDEMPOTENT' }}},
      { step: 2, title: 'Agent Planning & Tool Selection', log: { timestamp: '00:01.40', agent: 'SwarmOrchestrator', level: 'PLAN', msg: 'State mapping matrix compiled. Consensus protocol active.', payload: { mappings: { 'stripe.customer_id': 'salesforce.Stripe_ID__c' }, consensusThreshold: '3_OF_3_NODES' }}},
      { step: 3, title: 'Swarm Execution & Parallel Ops', log: { timestamp: '00:03.10', agent: 'StateResolver', level: 'EXEC', msg: 'State resolved across 3 environments. CSM ticket dispatched.', payload: { account: 'Apex Logistics', previousState: 'HEALTHY', newState: 'AT_RISK_CHURN', zendeskTicket: 'ZD-884920' }}},
      { step: 4, title: 'Verification & State Persistence', log: { timestamp: '00:04.50', agent: 'PersistenceBridge', level: 'SUCCESS', msg: 'State consistency verified. Audit event stored.', payload: { supabaseTable: 'state_sync_events', stateHash: '0x99a4c81b', verification: 'CONSENSUS_MATCH', latencyMs: 290 }}}
    ]
  }
];

/* ─── NEURAL CANVAS ─── */
function NeuralCanvas({ currentStepIndex, isExecuting }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const nodesRef = useRef([]);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Agent nodes in diamond layout
    const cx = canvas.width / 2, cy = canvas.height / 2;
    const r = Math.min(cx, cy) * 0.65;
    const agentNodes = [
      { label: 'PARSE', x: cx, y: cy - r, baseX: cx, baseY: cy - r },
      { label: 'PLAN', x: cx + r, y: cy, baseX: cx + r, baseY: cy },
      { label: 'EXEC', x: cx, y: cy + r, baseX: cx, baseY: cy + r },
      { label: 'STATE', x: cx - r, y: cy, baseX: cx - r, baseY: cy },
    ];

    // Ambient floating particles
    const bgParticles = Array.from({ length: 35 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.15,
    }));
    nodesRef.current = bgParticles;

    // Data particles flowing between nodes
    const dataParticles = [];
    particlesRef.current = dataParticles;

    const handleMouse = (e) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    canvas.addEventListener('mousemove', handleMouse);

    let time = 0;
    function draw() {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Subtle radial gradient background
      const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.8);
      bgGrad.addColorStop(0, 'rgba(0, 240, 255, 0.03)');
      bgGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Ambient particles
      bgParticles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${p.opacity * 0.6})`;
        ctx.fill();
      });

      // Connect nearby ambient particles
      for (let i = 0; i < bgParticles.length; i++) {
        for (let j = i + 1; j < bgParticles.length; j++) {
          const dx = bgParticles[i].x - bgParticles[j].x;
          const dy = bgParticles[i].y - bgParticles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(bgParticles[i].x, bgParticles[i].y);
            ctx.lineTo(bgParticles[j].x, bgParticles[j].y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Connection lines between agent nodes
      const connections = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [1, 3]];
      connections.forEach(([a, b]) => {
        const n1 = agentNodes[a], n2 = agentNodes[b];
        const isActive = currentStepIndex >= Math.min(a, b);
        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        if (isActive && isExecuting) {
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
          ctx.lineWidth = 2;
          ctx.shadowColor = '#00F0FF';
          ctx.shadowBlur = 8;
        } else {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
          ctx.lineWidth = 1;
          ctx.shadowBlur = 0;
        }
        ctx.setLineDash(isActive ? [] : [4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.shadowBlur = 0;
      });

      // Data flow particles along connections
      if (isExecuting && Math.random() < 0.15) {
        const conn = connections[Math.floor(Math.random() * connections.length)];
        const src = agentNodes[conn[0]], dst = agentNodes[conn[1]];
        dataParticles.push({ x: src.x, y: src.y, tx: dst.x, ty: dst.y, progress: 0, speed: 0.015 + Math.random() * 0.01 });
      }

      for (let i = dataParticles.length - 1; i >= 0; i--) {
        const dp = dataParticles[i];
        dp.progress += dp.speed;
        if (dp.progress >= 1) { dataParticles.splice(i, 1); continue; }
        const px = dp.x + (dp.tx - dp.x) * dp.progress;
        const py = dp.y + (dp.ty - dp.y) * dp.progress;
        const alpha = dp.progress < 0.2 ? dp.progress * 5 : dp.progress > 0.8 ? (1 - dp.progress) * 5 : 1;
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${alpha * 0.9})`;
        ctx.shadowColor = '#00F0FF';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Agent nodes (the 4 big circles)
      agentNodes.forEach((node, idx) => {
        const isActive = currentStepIndex >= idx;
        const bob = Math.sin(time * 2 + idx * 1.5) * 3;
        const nx = node.baseX, ny = node.baseY + bob;
        node.x = nx; node.y = ny;

        // Outer glow ring
        if (isActive && isExecuting) {
          const pulseR = 28 + Math.sin(time * 3 + idx) * 4;
          ctx.beginPath();
          ctx.arc(nx, ny, pulseR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 + Math.sin(time * 4) * 0.08})`;
          ctx.lineWidth = 2;
          ctx.shadowColor = '#00F0FF';
          ctx.shadowBlur = 20;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        // Main circle
        ctx.beginPath();
        ctx.arc(nx, ny, 22, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, 22);
        if (isActive) {
          grad.addColorStop(0, 'rgba(0, 240, 255, 0.25)');
          grad.addColorStop(1, 'rgba(0, 240, 255, 0.05)');
        } else {
          grad.addColorStop(0, 'rgba(255, 255, 255, 0.06)');
          grad.addColorStop(1, 'rgba(255, 255, 255, 0.02)');
        }
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = isActive ? 'rgba(0, 240, 255, 0.7)' : 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = isActive ? 2 : 1;
        ctx.stroke();

        // Label
        ctx.fillStyle = isActive ? '#00F0FF' : 'rgba(255,255,255,0.3)';
        ctx.font = '600 9px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, nx, ny);

        // Step number below
        ctx.fillStyle = isActive ? 'rgba(0, 240, 255, 0.5)' : 'rgba(255,255,255,0.15)';
        ctx.font = '600 7px "JetBrains Mono", monospace';
        ctx.fillText(`STEP ${idx + 1}`, nx, ny + 32);
      });

      // Mouse proximity glow
      const mx = mouseRef.current.x, my = mouseRef.current.y;
      if (mx > 0 && my > 0) {
        ctx.beginPath();
        ctx.arc(mx, my, 60, 0, Math.PI * 2);
        const mGrad = ctx.createRadialGradient(mx, my, 0, mx, my, 60);
        mGrad.addColorStop(0, 'rgba(0, 240, 255, 0.08)');
        mGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = mGrad;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener('mousemove', handleMouse);
    };
  }, [currentStepIndex, isExecuting]);

  return <canvas ref={canvasRef} className="neural-inline-canvas" />;
}

/* ─── MATRIX RAIN ─── */
function MatrixRain({ width, height }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !width || !height) return;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const cols = Math.floor(width / 14);
    const drops = Array(cols).fill(1);
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF{}[]()';

    function draw() {
      ctx.fillStyle = 'rgba(2, 5, 10, 0.08)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = '11px "JetBrains Mono", monospace';

      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = `rgba(0, 240, 255, ${Math.random() * 0.12 + 0.03})`;
        ctx.fillText(char, i * 14, y * 14);
        if (y * 14 > height && Math.random() > 0.97) drops[i] = 0;
        drops[i]++;
      });
      animRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [width, height]);

  return <canvas ref={canvasRef} className="matrix-rain-canvas" />;
}

/* ─── TYPEWRITER LOG LINE ─── */
function TypewriterLog({ logItem, onComplete }) {
  const [displayText, setDisplayText] = useState('');
  const [showPayload, setShowPayload] = useState(false);
  const fullText = `[${logItem.timestamp}] [${logItem.level}] @${logItem.agent}: ${logItem.msg}`;

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      setDisplayText(fullText.slice(0, idx));
      if (idx >= fullText.length) {
        clearInterval(interval);
        setTimeout(() => {
          setShowPayload(true);
          onComplete?.();
        }, 100);
      }
    }, 8);
    return () => clearInterval(interval);
  }, [fullText]);

  const levelClass = logItem.level.toLowerCase();

  return (
    <div className={`term-log-entry level-${levelClass}`}>
      <div className="term-log-header">
        <span className="t-typed">{displayText}<span className="t-cursor">█</span></span>
      </div>
      {showPayload && logItem.payload && (
        <pre className="t-payload">
          {JSON.stringify(logItem.payload, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default function AgenticSandbox() {
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [logs, setLogs] = useState([]);
  const [latency, setLatency] = useState(0);
  const [tokens, setTokens] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [activeAgents, setActiveAgents] = useState(0);
  const [globalSwarms, setGlobalSwarms] = useState(10452);
  const [globalRows, setGlobalRows] = useState(142095);
  const terminalEndRef = useRef(null);
  const timersRef = useRef([]);
  const latencyRef = useRef(null);
  const terminalWrapRef = useRef(null);
  const [termDims, setTermDims] = useState({ w: 400, h: 500 });

  const currentPreset = PRESETS[activePresetIndex];

  // Measure terminal for matrix rain
  useEffect(() => {
    if (terminalWrapRef.current) {
      const { width, height } = terminalWrapRef.current.getBoundingClientRect();
      setTermDims({ w: width, h: height });
    }
  }, []);

  // Terminal auto-scroll (internal only, no page hijack)
  useEffect(() => {
    if (terminalEndRef.current) {
      const parent = terminalEndRef.current.parentElement;
      if (parent) parent.scrollTop = parent.scrollHeight;
    }
  }, [logs]);

  const cleanup = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (latencyRef.current) clearInterval(latencyRef.current);
  }, []);

  // Auto-run on mount and preset change
  useEffect(() => {
    const t = setTimeout(() => runSwarm(), 300);
    return () => { clearTimeout(t); cleanup(); };
  }, [activePresetIndex]);

  const runSwarm = () => {
    cleanup();
    setIsExecuting(true);
    setCurrentStepIndex(-1);
    setLogs([]);
    setLatency(0);
    setTokens(0);
    setConfidence(0);
    setActiveAgents(0);

    latencyRef.current = setInterval(() => setLatency(p => p + 12), 50);

    const steps = currentPreset.stepsData;

    timersRef.current.push(setTimeout(() => {
      setCurrentStepIndex(0);
      setLogs(p => [...p, steps[0].log]);
      setTokens(340); setActiveAgents(1); setConfidence(72);
    }, 600));

    timersRef.current.push(setTimeout(() => {
      setCurrentStepIndex(1);
      setLogs(p => [...p, steps[1].log]);
      setTokens(1420); setActiveAgents(4); setConfidence(86);
    }, 1800));

    timersRef.current.push(setTimeout(() => {
      setCurrentStepIndex(2);
      setLogs(p => [...p, steps[2].log]);
      setTokens(3150); setActiveAgents(4); setConfidence(95);
    }, 3000));

    timersRef.current.push(setTimeout(() => {
      setCurrentStepIndex(3);
      setLogs(p => [...p, steps[3].log]);
      setTokens(4280); setActiveAgents(4); setConfidence(100);
    }, 4200));

    timersRef.current.push(setTimeout(() => {
      setIsExecuting(false);
      if (latencyRef.current) clearInterval(latencyRef.current);
      setLogs(p => [...p, {
        timestamp: '00:04.80', agent: 'SwarmKernel', level: 'COMPLETE',
        msg: 'TRYAM Autonomous Swarm completed successfully. 0 errors.',
        payload: { status: 'EXECUTION_SUCCESS', totalAgents: 4, hash: '0xTRYAM_VERIFIED' }
      }]);
      setGlobalSwarms(p => p + 1);
      setGlobalRows(p => p + Math.floor(Math.random() * 5) + 1);

      // Auto-cycle
      timersRef.current.push(setTimeout(() => {
        setActivePresetIndex(p => (p + 1) % PRESETS.length);
      }, 2500));
    }, 5400));
  };

  const confDash = `${confidence}, 100`;
  const latDash = `${Math.min((latency / 500) * 100, 100)}, 100`;
  const tokDash = `${Math.min((tokens / 5000) * 100, 100)}, 100`;

  return (
    <section id="playground" className="section-padding bg-section-alt">
      <div className="container neural-engine-container">

        {/* HEADER */}
        <div className="ne-section-header">
          <div className="ne-title-group">
            <div className="ne-badge-live">
              <span className="ne-live-dot" />
              <span>LIVE NEURAL ENGINE</span>
            </div>
            <h2 className="section-title">Agentic AI <span className="gradient-text">Command Center</span></h2>
            <p className="ne-desc">Watch autonomous AI swarms execute real enterprise workflows in real-time.</p>
          </div>
        </div>

        {/* TOP CONTROL BAR */}
        <div className="neural-top-bar glass-panel">
          <div className="scenario-chips">
            {PRESETS.map((preset, idx) => (
              <button
                key={preset.id}
                className={`scenario-chip ${activePresetIndex === idx ? 'active' : ''}`}
                onClick={() => setActivePresetIndex(idx)}
              >
                <span className="chip-glow-dot" />
                <span className="chip-badge">{preset.badge}</span>
                {preset.title}
              </button>
            ))}
          </div>

          <div className="top-bar-center">
            <button
              className={`btn-execute-swarm ${isExecuting ? 'pulsing' : ''}`}
              onClick={runSwarm}
              disabled={isExecuting}
            >
              <div className="ring-anim" />
              <div className="ring-anim ring-2" />
              {isExecuting ? (
                <><span className="exec-spinner" /> EXECUTING...</>
              ) : (
                <><Zap size={16} /> EXECUTE SWARM</>
              )}
            </button>
          </div>

          <div className="live-status-indicators">
            <div className="status-item">
              <span className={`breathing-dot ${isExecuting ? 'active' : ''}`} />
              <span className={isExecuting ? 'status-active-text' : ''}>{isExecuting ? 'SWARM ACTIVE' : 'STANDBY'}</span>
            </div>
            <div className="status-item">
              <Users size={13} />
              <span className="status-val">{activeAgents}</span> AGENTS
            </div>
            <div className="status-item">
              <Wifi size={13} />
              <span className="status-val">{latency}</span>ms
            </div>
          </div>
        </div>

        <div className="neural-split-layout">
          {/* LEFT PANEL - NEURAL CANVAS */}
          <div className="neural-left-panel glass-panel">
            <div className="panel-header">
              <Activity size={16} className="text-glow" />
              <h4>Neural Execution Visualizer</h4>
              <div className="panel-header-right">
                {currentPreset.agents.map((a, i) => (
                  <span key={a} className={`agent-tag ${currentStepIndex >= i ? 'active' : ''}`}>{a}</span>
                ))}
              </div>
            </div>

            {/* CANVAS */}
            <div className="neural-canvas-wrapper">
              <NeuralCanvas currentStepIndex={currentStepIndex} isExecuting={isExecuting} />
            </div>

            {/* PROGRESS BARS */}
            <div className="neural-progress-bars">
              {currentPreset.stepsData.map((step, idx) => (
                <div key={idx} className={`progress-track ${currentStepIndex >= idx ? 'done' : currentStepIndex === idx - 1 ? 'next' : ''}`}>
                  <div className="progress-label">
                    <span className="progress-step-num">0{idx + 1}</span>
                    <span>{step.title}</span>
                    {currentStepIndex > idx && <CheckCircle2 size={12} className="text-success" />}
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: currentStepIndex > idx ? '100%' : currentStepIndex === idx ? '65%' : '0%',
                        transition: currentStepIndex === idx ? 'width 1.2s ease-out' : 'width 0.3s ease'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* METRICS ROW */}
            <div className="neural-metrics-row">
              <div className="n-metric">
                <div className="circular-chart-wrap">
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle gauge-path" strokeDasharray={latDash} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="chart-val">{latency}</div>
                </div>
                <div className="n-metric-lbl">LATENCY (ms)</div>
              </div>

              <div className="n-metric">
                <div className="circular-chart-wrap">
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle token-path" strokeDasharray={tokDash} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="chart-val">{(tokens / 1000).toFixed(1)}k</div>
                </div>
                <div className="n-metric-lbl">TOKENS</div>
              </div>

              <div className="n-metric">
                <div className="circular-chart-wrap">
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle success-path" strokeDasharray={confDash} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="chart-val text-success">{confidence}%</div>
                </div>
                <div className="n-metric-lbl">CONFIDENCE</div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL - TERMINAL */}
          <div className="neural-right-panel glass-panel" ref={terminalWrapRef}>
            <MatrixRain width={termDims.w} height={termDims.h} />
            <div className="scan-line" />

            <div className="terminal-header">
              <Terminal size={13} />
              <span>tryam-neural-kernel v3.0</span>
              <span className="term-status">{isExecuting ? '● STREAMING' : '○ IDLE'}</span>
            </div>

            <div className="terminal-body">
              <div className="term-init-line">
                <span className="t-muted">$</span> tryam swarm execute --preset="{currentPreset.id}" --mode=autonomous
              </div>
              {logs.map((logItem, idx) => (
                <TypewriterLog key={`${currentPreset.id}-${idx}`} logItem={logItem} />
              ))}
              <div ref={terminalEndRef} />
            </div>
          </div>
        </div>

        {/* BOTTOM METRICS */}
        <div className="neural-bottom-bar">
          <div className="bottom-metric-card glass-panel">
            <span className="bmc-title">TOTAL SWARMS EXECUTED</span>
            <span className="bmc-val">{globalSwarms.toLocaleString()}</span>
            <div className="sparkline" />
          </div>
          <div className="bottom-metric-card glass-panel">
            <span className="bmc-title">AVG LATENCY (MS)</span>
            <span className="bmc-val">215</span>
            <div className="sparkline" />
          </div>
          <div className="bottom-metric-card glass-panel">
            <span className="bmc-title">SUCCESS RATE</span>
            <span className="bmc-val text-success">100%</span>
            <div className="sparkline" />
          </div>
          <div className="bottom-metric-card glass-panel">
            <span className="bmc-title">SUPABASE ROWS WRITTEN</span>
            <span className="bmc-val">{globalRows.toLocaleString()}</span>
            <div className="sparkline" />
          </div>
        </div>

      </div>
    </section>
  );
}
