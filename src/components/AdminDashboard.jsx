import React, { useState, useEffect } from 'react';
import { 
  Users, Bot, Search, Download, RefreshCw, X, Shield, 
  CheckCircle, Clock, AlertCircle, MessageSquare, ChevronRight, Lock, Key, Filter 
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import CustomSelect from './CustomSelect';

export default function AdminDashboard({ onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passError, setPassError] = useState(false);

  const [activeTab, setActiveTab] = useState('leads'); // 'leads' | 'chat_logs'
  const [leads, setLeads] = useState([]);
  const [chatLogs, setChatLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSession, setSelectedSession] = useState(null);

  const statusOptions = [
    { value: 'new', label: 'New Lead', badge: 'NEW', badgeColor: 'badge-amber' },
    { value: 'processing', label: 'Processing', badge: 'WORK', badgeColor: 'badge-sky' },
    { value: 'contacted', label: 'Contacted', badge: 'SENT', badgeColor: 'badge-purple' },
    { value: 'closed', label: 'Closed / Won', badge: 'WON', badgeColor: 'badge-emerald' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'new', label: 'New Leads', badge: 'NEW', badgeColor: 'badge-amber' },
    { value: 'processing', label: 'In Processing', badge: 'WORK', badgeColor: 'badge-sky' },
    { value: 'contacted', label: 'Contacted', badge: 'SENT', badgeColor: 'badge-purple' },
    { value: 'closed', label: 'Closed / Won', badge: 'WON', badgeColor: 'badge-emerald' }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === 'TRYAM2026' || passcode === 'admin') {
      setIsAuthenticated(true);
      setPassError(false);
    } else {
      setPassError(true);
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_logs')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setChatLogs(data || []);
    } catch (err) {
      console.error('Failed to fetch chat logs:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads();
      fetchChatLogs();
    }
  }, [isAuthenticated]);

  const updateLeadStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update lead status.');
    }
  };

  const exportCSV = () => {
    if (!leads.length) return;
    const headers = ['ID', 'Name', 'Company', 'Email', 'Bottleneck', 'Details', 'Status', 'Submitted At'];
    const rows = leads.map(l => [
      l.id,
      `"${l.name || ''}"`,
      `"${l.company || ''}"`,
      `"${l.email || ''}"`,
      `"${l.bottleneck || ''}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`,
      l.status,
      l.created_at
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TRYAM_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Group chat logs by session_id
  const chatSessions = chatLogs.reduce((acc, log) => {
    if (!acc[log.session_id]) acc[log.session_id] = [];
    acc[log.session_id].push(log);
    return acc;
  }, {});

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      (lead.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    processing: leads.filter(l => l.status === 'processing').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    closed: leads.filter(l => l.status === 'closed').length
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-modal-overlay">
        <div className="admin-auth-card glass-panel">
          <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
          <div className="auth-header text-center">
            <div className="auth-icon-badge">
              <Lock size={24} />
            </div>
            <h2>TRYAM Admin Portal</h2>
            <p>Enter passkey to access CRM leads and automation logs</p>
          </div>

          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label htmlFor="passcode">Admin Passkey</label>
              <div className="input-with-icon">
                <Key size={18} className="input-icon" />
                <input
                  type="password"
                  id="passcode"
                  placeholder="Enter passkey (e.g. TRYAM2026)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            {passError && (
              <div className="form-error">
                <AlertCircle size={16} />
                <span>Invalid passkey. Try <strong>TRYAM2026</strong></span>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-block btn-glow">
              <span>Authenticate Portal</span>
            </button>
          </form>

          <div className="auth-hint text-center">
            <span className="hint-pill" onClick={() => { setIsAuthenticated(true); }}>⚡ Quick Access (Demo Mode)</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-view">
      <header className="admin-header">
        <div className="container admin-nav-inner">
          <div className="admin-title-group">
            <Shield size={24} className="admin-icon" />
            <div>
              <h1>TRYAM CRM & Infrastructure Console</h1>
              <span className="admin-sub-tag">Supabase Database Sync · Real-time Automation Logs</span>
            </div>
          </div>

          <div className="admin-actions">
            <button className="btn btn-secondary btn-sm" onClick={fetchLeads} title="Refresh Data">
              <RefreshCw size={16} className={loading ? 'spin' : ''} />
              <span>Refresh</span>
            </button>
            <button className="btn btn-primary btn-sm" onClick={exportCSV}>
              <Download size={16} />
              <span>Export CSV</span>
            </button>
            <button className="btn btn-secondary btn-sm close-admin-btn" onClick={onClose}>
              <X size={18} />
              <span>Exit Admin</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container admin-content">
        {/* STATS OVERVIEW CARDS */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card glass-panel">
            <div className="stat-card-header">
              <span className="stat-title">Total Ingested Leads</span>
              <Users size={20} className="stat-icon cyan" />
            </div>
            <div className="stat-value">{stats.total}</div>
            <span className="stat-trend">Live Supabase Sync</span>
          </div>

          <div className="admin-stat-card glass-panel">
            <div className="stat-card-header">
              <span className="stat-title">New Inbound</span>
              <Clock size={20} className="stat-icon yellow" />
            </div>
            <div className="stat-value">{stats.new}</div>
            <span className="stat-trend warning">Awaiting Outreach</span>
          </div>

          <div className="admin-stat-card glass-panel">
            <div className="stat-card-header">
              <span className="stat-title">In Pipeline</span>
              <RefreshCw size={20} className="stat-icon blue" />
            </div>
            <div className="stat-value">{stats.processing + stats.contacted}</div>
            <span className="stat-trend info">Active Sales Cycle</span>
          </div>

          <div className="admin-stat-card glass-panel">
            <div className="stat-card-header">
              <span className="stat-title">Closed / Won</span>
              <CheckCircle size={20} className="stat-icon green" />
            </div>
            <div className="stat-value">{stats.closed}</div>
            <span className="stat-trend success">Converted Clients</span>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="admin-tabs-bar">
          <button 
            className={`admin-tab ${activeTab === 'leads' ? 'active' : ''}`}
            onClick={() => setActiveTab('leads')}
          >
            <Users size={16} />
            <span>Leads CRM ({leads.length})</span>
          </button>
          <button 
            className={`admin-tab ${activeTab === 'chat_logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat_logs')}
          >
            <MessageSquare size={16} />
            <span>AI SDR Chat Transcripts ({Object.keys(chatSessions).length})</span>
          </button>
        </div>

        {/* TAB 1: LEADS TABLE */}
        {activeTab === 'leads' && (
          <div className="admin-table-wrapper glass-panel">
            <div className="table-controls-row">
              <div className="search-box">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by name, company, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="filter-group">
                <CustomSelect
                  options={filterOptions}
                  value={statusFilter}
                  onChange={(val) => setStatusFilter(val)}
                  placeholder="Filter by status..."
                  className="filter-select-custom"
                  icon={Filter}
                  compact={true}
                />
              </div>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Lead Name</th>
                    <th>Company / Domain</th>
                    <th>Email Contact</th>
                    <th>Bottleneck Focus</th>
                    <th>Status</th>
                    <th>Submitted Date</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-6">
                        <RefreshCw size={24} className="spin text-muted" />
                        <p className="mt-2 text-muted">Fetching leads from Supabase...</p>
                      </td>
                    </tr>
                  ) : filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-6 text-muted">
                        No leads found matching query.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => (
                      <tr key={lead.id} className="table-row-hover">
                        <td>
                          <strong className="lead-name">{lead.name}</strong>
                          {lead.details && <p className="lead-details-preview">{lead.details}</p>}
                        </td>
                        <td>
                          <span className="company-pill">{lead.company}</span>
                        </td>
                        <td>
                          <a href={`mailto:${lead.email}`} className="email-link">{lead.email}</a>
                        </td>
                        <td>
                          <span className="bottleneck-tag">{lead.bottleneck || 'General'}</span>
                        </td>
                        <td>
                          <CustomSelect
                            options={statusOptions}
                            value={lead.status || 'new'}
                            onChange={(val) => updateLeadStatus(lead.id, val)}
                            compact={true}
                            className={`table-status-select status-${lead.status || 'new'}`}
                          />
                        </td>
                        <td className="date-cell">
                          {new Date(lead.created_at).toLocaleDateString()} {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: CHAT LOGS */}
        {activeTab === 'chat_logs' && (
          <div className="chat-logs-wrapper glass-panel">
            <div className="chat-logs-grid">
              <div className="session-list">
                <h3>Recorded AI SDR Sessions</h3>
                {Object.keys(chatSessions).length === 0 ? (
                  <p className="text-muted p-4">No chat sessions logged yet.</p>
                ) : (
                  Object.entries(chatSessions).map(([sessionId, logs]) => (
                    <div
                      key={sessionId}
                      className={`session-item ${selectedSession === sessionId ? 'selected' : ''}`}
                      onClick={() => setSelectedSession(sessionId)}
                    >
                      <div className="session-meta">
                        <Bot size={16} className="text-cyan" />
                        <span className="session-id">{sessionId}</span>
                      </div>
                      <div className="session-sub">
                        <span>{logs.length} messages</span>
                        <ChevronRight size={14} />
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="session-transcript-view">
                {selectedSession && chatSessions[selectedSession] ? (
                  <>
                    <div className="transcript-header">
                      <h4>Session Transcript: <code>{selectedSession}</code></h4>
                    </div>
                    <div className="transcript-body">
                      {chatSessions[selectedSession].map((msg, i) => (
                        <div key={i} className={`transcript-msg ${msg.sender}-msg`}>
                          <span className="msg-sender-label">{msg.sender === 'user' ? '👤 Visitor' : '🤖 TRYAM AI'}</span>
                          <p>{msg.message}</p>
                          <span className="msg-time">{new Date(msg.created_at).toLocaleTimeString()}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="transcript-placeholder text-center">
                    <MessageSquare size={40} className="text-muted mb-2" />
                    <p className="text-muted">Select a chat session on the left to inspect conversation transcript.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
