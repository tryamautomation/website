import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export default function RoiCalculator() {
  const [teamSize, setTeamSize] = useState(10);
  const [manualHours, setManualHours] = useState(12);
  const [hourlyRate, setHourlyRate] = useState(40);

  // Business Logic: 80% Automation efficiency
  const totalHoursSavedMonthly = Math.round(teamSize * manualHours * 4 * 0.8);
  const monthlyMoneySaved = Math.round(totalHoursSavedMonthly * hourlyRate);
  const roiMultiplier = Math.max(3.5, (monthlyMoneySaved / 2500)).toFixed(1);

  return (
    <section id="calculator" className="section-padding bg-section-alt">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-badge">ROI Quantifier</span>
          <h2 className="section-title">Calculate Your Business Time & Cost Savings</h2>
          <p className="section-subtitle">Adjust the parameters below to see how much TRYAM Automations can save your team every month.</p>
        </div>

        <div className="calculator-wrapper glass-panel">
          <div className="calc-inputs">
            <div className="calc-group">
              <div className="label-row">
                <label>Team Size (Employees):</label>
                <span className="calc-val">{teamSize} employees</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="calc-slider"
              />
            </div>

            <div className="calc-group">
              <div className="label-row">
                <label>Manual Admin Hours/Week per Person:</label>
                <span className="calc-val">{manualHours} hrs/week</span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                value={manualHours}
                onChange={(e) => setManualHours(Number(e.target.value))}
                className="calc-slider"
              />
            </div>

            <div className="calc-group">
              <div className="label-row">
                <label>Average Hourly Employee Cost ($):</label>
                <span className="calc-val">${hourlyRate} / hr</span>
              </div>
              <input
                type="range"
                min="15"
                max="150"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="calc-slider"
              />
            </div>
          </div>

          <div className="calc-results">
            <div className="result-card">
              <span className="res-title">Monthly Money Liberated</span>
              <span className="res-amount gradient-text">${monthlyMoneySaved.toLocaleString()}</span>
              <span className="res-sub">Saved per month</span>
            </div>

            <div className="result-card">
              <span className="res-title">Hours Saved Monthly</span>
              <span className="res-amount gradient-text">{totalHoursSavedMonthly.toLocaleString()} hrs</span>
              <span className="res-sub">Reclaimed for growth</span>
            </div>

            <div className="result-card">
              <span className="res-title">Estimated ROI Multiplier</span>
              <span className="res-amount gradient-text">{roiMultiplier}x</span>
              <span className="res-sub">First-year return</span>
            </div>

            <a href="#contact" className="btn btn-primary btn-block btn-glow">
              <span>Claim This ROI Now</span>
              <ChevronRight size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
