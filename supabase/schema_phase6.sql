-- ============================================================================
-- NextHire AI - Phase 6 Part 1 PostgreSQL Schema Expansion
-- AI Career Coach, Chat Assistant, Conversations, Messages, & Roadmaps
-- ============================================================================

-- 1. AI Conversations Table
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Career Guidance Session',
  model_used TEXT DEFAULT 'gemini-1.5-pro',
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. AI Messages Table
CREATE TABLE IF NOT EXISTS public.ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  code_snippet TEXT,
  language TEXT,
  tokens_used INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. AI Prompts Library Table
CREATE TABLE IF NOT EXISTS public.ai_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- e.g. 'Resume', 'Interview', 'DSA', 'Projects'
  prompt_text TEXT NOT NULL,
  description TEXT,
  is_popular BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Learning Roadmaps Table
CREATE TABLE IF NOT EXISTS public.learning_roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_target TEXT NOT NULL,
  duration_weeks INT DEFAULT 8,
  roadmap_data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ai_conversations_student ON public.ai_conversations(student_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation ON public.ai_messages(conversation_id);

-- RLS Policies
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_roadmaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students manage own conversations" ON public.ai_conversations FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = student_id AND auth_user_id = auth.uid())
);

CREATE POLICY "Students manage messages in own conversations" ON public.ai_messages FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.ai_conversations c
    JOIN public.profiles p ON c.student_id = p.id
    WHERE c.id = conversation_id AND p.auth_user_id = auth.uid()
  )
);

CREATE POLICY "Students manage own roadmaps" ON public.learning_roadmaps FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = student_id AND auth_user_id = auth.uid())
);
