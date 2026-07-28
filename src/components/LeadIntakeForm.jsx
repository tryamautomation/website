import React, { useState } from 'react';
import { ShieldCheck, Zap, ArrowRight, Send, CheckCircle2, AlertCircle, Layers } from 'lucide-react';
import CustomSelect from './CustomSelect';

export default function LeadIntakeForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    bottleneck: '',
    details: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const bottleneckOptions = [
    { value: 'ai-agent', label: 'Autonomous Agentic AI Swarm & Lead SDR', badge: 'Flagship' },
    { value: 'crm', label: 'Custom High-Throughput CRM Architecture (Supabase)' },
    { value: 'orchestration', label: 'Full-Stack Multi-Agent Orchestration Mesh' },
    { value: 'custom', label: 'Complete End-to-End Enterprise Transformation' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setError(null);
  };

  const handleNext = () => {
    if (!formData.name || !formData.company || !formData.email || !formData.phone) {
      setError('Please complete all required fields including your phone number before continuing.');
      return;
    }
    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // POST to n8n Lead Processor webhook — fires full pipeline:
      // Supabase insert → client email → admin email → client WhatsApp → admin WhatsApp
      const response = await fetch('https://n8n.tryam193.in/webhook/tryam-new-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          company: formData.company.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          bottleneck: formData.bottleneck || '',
          details: formData.details.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Webhook error: ${response.status}`);
      }

      setSubmitted(true);
    } catch (err) {
      console.error('[TRYAM] Lead submission error:', err);
      setError('Something went wrong. Please try again or WhatsApp us at +91 8217037173.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-section-alt">
      <div className="container">
        <div className="contact-wrapper glass-panel">
          <div className="contact-info">
            <span className="section-badge">Deploy TRYAM Engine</span>
            <h2>Ready to Automate Your Business Digitally Fast?</h2>
            <p>Fill out this 60-second assessment. Our automation architects will construct a custom strategy blueprint and live demo tailored to your company.</p>

            <div className="benefit-list">
              <div className="benefit-item">
                <div className="b-icon"><ShieldCheck size={22} /></div>
                <div>
                  <strong>Zero Risk Audit</strong>
                  <p>Comprehensive analysis of your manual bottlenecks with clear ROI projections.</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="b-icon"><Zap size={22} /></div>
                <div>
                  <strong>Rapid 7-Day Deployment</strong>
                  <p>Go live with your initial custom CRM and n8n workflow within 1 week.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-card">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="audit-form">
                {error && (
                  <div className="form-error">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                {step === 1 ? (
                  <div className="form-step active">
                    <div className="step-indicator">Step 1 of 2: Business Info</div>
                    <div className="form-group">
                      <label htmlFor="name">Your Name *</label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Alex Sharma"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="company">Company Name & Website *</label>
                      <input
                        type="text"
                        id="company"
                        required
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="e.g. Acme Tech (acme.com)"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Work Email *</label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="alex@acme.com"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone / WhatsApp Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. +91 9876543210 or +1 (555) 000-1234"
                      />
                    </div>
                    <button type="button" className="btn btn-primary btn-block" onClick={handleNext}>
                      <span>Next Step: Automation Goals</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="form-step active">
                    <div className="step-indicator">Step 2 of 2: Automation Blueprint</div>
                    <div className="form-group">
                      <label>What is your biggest manual bottleneck?</label>
                      <CustomSelect
                        options={bottleneckOptions}
                        value={formData.bottleneck}
                        onChange={(val) => setFormData({ ...formData, bottleneck: val })}
                        placeholder="Select Primary Bottleneck Focus..."
                        icon={Layers}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="details">Project Details / Goals</label>
                      <textarea
                        id="details"
                        rows={3}
                        value={formData.details}
                        onChange={handleChange}
                        placeholder="Tell us briefly about your current setup..."
                      ></textarea>
                    </div>
                    <div className="form-actions-row">
                      <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
                      <button type="submit" className="btn btn-primary btn-glow" disabled={submitting}>
                        <span>{submitting ? 'Submitting...' : 'Submit & Deploy'}</span>
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </form>
            ) : (
              <div className="form-success">
                <CheckCircle2 size={48} className="success-icon" />
                <h3>Audit Request Submitted!</h3>
                <p>Your lead has been saved to our system and the automation pipeline has been triggered. An automation specialist will contact you within 2 business hours.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
