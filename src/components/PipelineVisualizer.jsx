import React from 'react';
import { Target, Brain, Network, Database, Activity, ChevronRight } from 'lucide-react';

export default function PipelineVisualizer() {
  const nodes = [
    { icon: Target, title: 'Goal Ingestion', sub: 'Objective & Constraints', color: 'node-input' },
    { icon: Brain, title: 'Planner Agent', sub: 'Autonomous Strategy & Reasoning', color: 'node-ai' },
    { icon: Network, title: 'Multi-Agent Swarm', sub: 'Tool Execution & Self-Correction', color: 'node-n8n' },
    { icon: Database, title: 'Enterprise CRM', sub: 'Persisted Action & State Sync', color: 'node-crm' }
  ];

  return (
    <div className="workflow-visualizer-card glass-panel">
      <div className="visualizer-header">
        <div className="visualizer-dots">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>
        <div className="visualizer-title">
          <Activity size={14} />
          <span>TRYAM AGENTIC REASONING ENGINE</span>
        </div>
        <div className="visualizer-status">
          <span className="live-pill">
            <span className="pulse-dot"></span>
            Autonomous Swarm Active
          </span>
        </div>
      </div>

      <div className="pipeline-diagram">
        {nodes.map((node, i) => {
          const Icon = node.icon;
          return (
            <React.Fragment key={i}>
              {i > 0 && (
                <div className="connector-line">
                  <ChevronRight size={14} className="connector-chevron" />
                  <div className={`pulse-particle p${i}`}></div>
                </div>
              )}
              <div className={`node ${node.color}`}>
                <div className="node-icon"><Icon size={18} /></div>
                <div className="node-info">
                  <span className="node-title">{node.title}</span>
                  <span className="node-sub">{node.sub}</span>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
