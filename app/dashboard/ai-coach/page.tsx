"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Send,
  Plus,
  Trash2,
  Copy,
  Check,
  Search,
  Sparkles,
  MessageSquare,
  Code2,
  Terminal,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { useAuthStore } from "@/lib/store/use-auth-store";
import { useAICoachStore } from "@/lib/store/use-ai-coach-store";
import { PROMPT_TEMPLATES } from "@/services/ai-coach-service";

export default function AICoachPage() {
  const { profile, user } = useAuthStore();
  const {
    conversations,
    activeConversationId,
    messages,
    isStreaming,
    searchQuery,
    setSearchQuery,
    sendMessage,
    createConversation,
    deleteConversation,
    setActiveConversationId,
  } = useAICoachStore();

  const [inputQuery, setInputQuery] = useState("");
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const studentName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    (user?.email || "").split("@")[0] ||
    "Student";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim() || isStreaming) return;
    setInputQuery("");
    await sendMessage(text, studentName);
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-7.5rem)] min-h-0 flex-col overflow-hidden lg:flex-row">
      {/* 1. Conversation History Sidebar (Left Pane) */}
      <div className="flex w-full shrink-0 flex-col justify-between space-y-4 border-r border-border/40 bg-card/40 p-4 lg:w-72">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <MessageSquare className="h-4 w-4 text-primary" /> Career Sessions
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => createConversation()}
              className="h-7 gap-1 px-2 text-xs"
            >
              <Plus className="h-3.5 w-3.5" /> New
            </Button>
          </div>

          <Input
            placeholder="Search chats..."
            icon={<Search className="h-3.5 w-3.5" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 text-xs"
          />

          <div className="max-h-[calc(100vh-16rem)] space-y-1 overflow-y-auto">
            {filteredConversations.map((c) => {
              const isActive = c.id === activeConversationId;
              return (
                <div
                  key={c.id}
                  onClick={() => setActiveConversationId(c.id)}
                  className={`flex cursor-pointer items-center justify-between rounded-lg p-2.5 text-xs font-medium transition-all ${
                    isActive
                      ? "border border-border/60 bg-primary/10 font-semibold text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <span className="max-w-[170px] truncate">{c.title}</span>
                  {isActive && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(c.id);
                      }}
                      className="p-1 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Card */}
        <div className="space-y-1 rounded-xl border border-border/60 bg-gradient-to-br from-primary/5 to-transparent p-3 text-[11px]">
          <p className="flex items-center gap-1 font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Gemini 1.5 AI Model Active
          </p>
          <p className="text-muted-foreground">
            Context memory linked to student profile.
          </p>
        </div>
      </div>

      {/* 2. Main AI Chat Viewport (Right Pane) */}
      <div className="flex min-w-0 flex-1 flex-col justify-between bg-background/60">
        {/* Messages Scroll Area */}
        <div className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-6">
          {/* Prompt Templates Quick Chips */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Suggested AI Career Prompts
            </p>
            <div className="flex flex-wrap gap-2">
              {PROMPT_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => handleSend(tmpl.promptText)}
                  className="flex items-center gap-1.5 rounded-full border border-border/60 bg-primary/5 px-3 py-1 text-left text-xs font-medium text-primary transition-all hover:bg-primary/15"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>{tmpl.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Messages Stream */}
          <div className="space-y-4 border-t border-border/40 pt-4">
            {messages.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                >
                  <Avatar
                    fallback={isUser ? studentName.slice(0, 2) : "AI"}
                    className={
                      isUser
                        ? "bg-primary text-white"
                        : "bg-primary/80 text-white"
                    }
                    size="sm"
                  />

                  <div
                    className={`max-w-2xl space-y-2 text-xs ${isUser ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`whitespace-pre-wrap rounded-2xl p-4 leading-relaxed ${
                        isUser
                          ? "rounded-tr-none bg-primary text-white shadow-md"
                          : "rounded-tl-none border border-border/60 bg-card text-card-foreground shadow-sm"
                      }`}
                    >
                      {msg.content}
                    </div>

                    {/* Code Snippet Block if present */}
                    {msg.codeSnippet && (
                      <div className="overflow-hidden rounded-xl border bg-slate-950 font-mono text-[11px] text-slate-100 shadow-lg">
                        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/60 px-4 py-2">
                          <span className="flex items-center gap-1.5 font-sans text-xs text-primary">
                            <Terminal className="h-3.5 w-3.5" />{" "}
                            {msg.language || "typescript"}
                          </span>
                          <button
                            onClick={() =>
                              handleCopyCode(msg.codeSnippet!, msg.id)
                            }
                            className="flex items-center gap-1 text-[10px] text-slate-400 transition-colors hover:text-white"
                          >
                            {copiedCodeId === msg.id ? (
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                            <span>
                              {copiedCodeId === msg.id
                                ? "Copied!"
                                : "Copy Code"}
                            </span>
                          </button>
                        </div>
                        <pre className="overflow-x-auto p-4">
                          <code>{msg.codeSnippet}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {isStreaming && (
              <div className="flex items-center gap-2 text-xs font-medium text-primary">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-primary" />
                <span>AI Career Coach is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Bar */}
        <div className="border-t border-border/40 bg-card/40 p-4">
          <div className="mx-auto flex max-w-4xl gap-2">
            <Input
              placeholder="Ask your AI Career Coach anything about resumes, coding, or interviews..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1"
            />
            <Button
              variant="gradient"
              onClick={() => handleSend()}
              disabled={isStreaming || !inputQuery.trim()}
              className="shrink-0 gap-2"
            >
              <Send className="h-4 w-4" /> Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
