"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Send,
  User,
  FileText,
  CheckCircle2,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { useRecruiterStore } from "@/lib/store/use-recruiter-store";

export default function CandidateMessagingPage() {
  const { messages, candidates } = useRecruiterStore();
  const [inputMsg, setInputMsg] = useState("");
  const [chatThread, setChatThread] = useState(messages);

  const activeCandidate = candidates[0] || { studentName: "Candidate" };

  const handleSend = () => {
    if (inputMsg.trim()) {
      const newM = {
        id: `m-${Date.now()}`,
        recruiterId: "rec-1",
        studentId: "stud-1",
        senderRole: "recruiter" as const,
        content: inputMsg.trim(),
        isRead: true,
        createdAt: new Date().toISOString(),
      };
      setChatThread([...chatThread, newM]);
      setInputMsg("");
    }
  };

  return (
    <div className="flex h-[calc(100vh-7.5rem)] min-h-0 flex-col overflow-hidden lg:flex-row">
      {/* Threads Sidebar (3 cols) */}
      <div className="w-full shrink-0 space-y-3 border-r border-border/40 bg-card/40 p-4 lg:w-72">
        <h2 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <MessageSquare className="h-4 w-4 text-indigo-500" /> Candidate Chats
        </h2>

        <div className="space-y-1">
          {candidates.map((c) => (
            <div
              key={c.id}
              className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-3 text-xs font-semibold text-indigo-500"
            >
              <Avatar fallback={c.studentName.slice(0, 2)} size="sm" />
              <div>
                <p className="font-bold">{c.studentName}</p>
                <p className="text-[10px] font-normal text-muted-foreground">
                  {c.jobTitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Chat Viewport (9 cols) */}
      <div className="flex min-w-0 flex-1 flex-col justify-between bg-background/60">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/40 bg-card/40 p-4">
          <div className="flex items-center gap-3">
            <Avatar
              fallback={activeCandidate.studentName.slice(0, 2)}
              size="sm"
            />
            <div>
              <p className="text-xs font-bold">{activeCandidate.studentName}</p>
              <p className="text-[10px] text-muted-foreground">
                Candidate • Senior Full Stack Engineer
              </p>
            </div>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4 text-xs">
          {chatThread.map((m) => {
            const isRecruiter = m.senderRole === "recruiter";
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isRecruiter ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-md rounded-xl p-3 leading-relaxed ${
                    isRecruiter
                      ? "rounded-tr-none bg-indigo-600 text-white shadow-sm"
                      : "rounded-tl-none border bg-card text-card-foreground shadow-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <div className="border-t border-border/40 bg-card/40 p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Write message to candidate..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1"
            />
            <Button
              variant="gradient"
              onClick={handleSend}
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
