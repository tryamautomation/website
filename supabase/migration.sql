-- ============================================================
-- TRYAM Automations — Supabase Database Migration
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────
-- LEADS TABLE
-- Stores form submissions from the website
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  company     TEXT NOT NULL,
  email       TEXT NOT NULL,
  bottleneck  TEXT CHECK (bottleneck IN ('crm', 'ai-agent', 'n8n', 'custom', '')),
  details     TEXT DEFAULT '',
  status      TEXT DEFAULT 'new' CHECK (status IN ('new', 'processing', 'contacted', 'closed')),
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Index for fast status queries
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);

-- ─────────────────────────────────────────────
-- CHAT LOGS TABLE
-- Stores AI chat widget conversations
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id  TEXT NOT NULL,
  sender      TEXT NOT NULL CHECK (sender IN ('user', 'bot')),
  message     TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_session ON chat_logs(session_id);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────

-- Enable RLS on both tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_logs ENABLE ROW LEVEL SECURITY;

-- LEADS: Allow anonymous INSERT (public form submissions)
CREATE POLICY "Allow anonymous lead submissions"
  ON leads FOR INSERT
  TO anon
  WITH CHECK (true);

-- LEADS: Only authenticated users can SELECT (admin dashboard)
CREATE POLICY "Authenticated users can read leads"
  ON leads FOR SELECT
  TO authenticated
  USING (true);

-- LEADS: Only authenticated users can UPDATE status
CREATE POLICY "Authenticated users can update leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- CHAT LOGS: Allow anonymous INSERT (public chat widget)
CREATE POLICY "Allow anonymous chat logging"
  ON chat_logs FOR INSERT
  TO anon
  WITH CHECK (true);

-- CHAT LOGS: Only authenticated users can read
CREATE POLICY "Authenticated users can read chat logs"
  ON chat_logs FOR SELECT
  TO authenticated
  USING (true);
