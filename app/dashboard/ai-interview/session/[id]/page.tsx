"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Mic,
  MicOff,
  Clock,
  Square,
  ArrowRight,
  Bot,
  User,
  Volume2,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { useInterviewStore } from "@/lib/store/use-interview-store";

export default function LiveInterviewSessionPage() {
  const router = useRouter();
  const {
    setup,
    questions,
    currentQuestionIndex,
    isMicActive,
    toggleMic,
    nextQuestion,
    transcripts,
    addTranscript,
    timeLeftSeconds,
  } = useInterviewStore();

  const [studentInput, setStudentInput] = useState("");
  const [seconds, setSeconds] = useState(timeLeftSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainderSecs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${remainderSecs.toString().padStart(2, "0")}`;
  };

  const currentQ = questions[currentQuestionIndex] || {
    questionText: `Can you explain the key architectural differences between Next.js 15 App Router and traditional React client-side rendering?`,
    category: "Technical Architecture",
  };

  const handleSendAnswer = () => {
    if (studentInput.trim()) {
      addTranscript("student", studentInput.trim());
      setStudentInput("");

      if (currentQuestionIndex < questions.length - 1) {
        setTimeout(() => {
          nextQuestion();
        }, 1000);
      }
    }
  };

  const handleEndInterview = () => {
    router.push("/dashboard/ai-interview/report/latest");
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-7.5rem)] max-w-5xl flex-col justify-between space-y-6 overflow-hidden p-4 sm:p-6">
      {/* 1. Live Session Header Bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-border/40 pb-4">
        <div className="flex items-center gap-3">
          <Badge variant="accent" className="gap-1.5 px-3 py-1">
            <Sparkles className="h-3.5 w-3.5" /> Live {setup.interviewType}{" "}
            Interview
          </Badge>
          <span className="hidden text-xs text-muted-foreground sm:inline-block">
            {setup.jobRole} @ {setup.companyName}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-primary">
            <Clock className="h-4 w-4" /> {formatTimer(seconds)}
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleEndInterview}
            className="gap-1.5 text-xs"
          >
            <Square className="h-3.5 w-3.5 fill-current" /> End Session
          </Button>
        </div>
      </div>

      {/* 2. Main Live Center: Audio Waveform Visualizer & Current Question */}
      <div className="flex min-h-0 flex-1 flex-col justify-between space-y-6">
        {/* Active Question Box */}
        <Card className="shrink-0 space-y-3 border-border/60 bg-gradient-to-r from-primary/5 via-card to-transparent p-6 text-center shadow-lg">
          <Badge variant="outline" className="mx-auto">
            Question {currentQuestionIndex + 1} of {questions.length || 4} •{" "}
            {currentQ.category}
          </Badge>
          <h2 className="mx-auto max-w-3xl text-xl font-bold leading-relaxed text-foreground">
            &quot;{currentQ.questionText}&quot;
          </h2>
          <div className="flex items-center justify-center gap-2 text-xs font-medium text-primary">
            <Volume2 className="h-4 w-4 animate-pulse text-primary" />
            <span>AI Voice Assistant is listening to your answer...</span>
          </div>
        </Card>

        {/* Animated Audio Waveform Visualizer for Voice Mode */}
        {setup.mode === "voice" && (
          <div className="flex h-16 items-center justify-center gap-1.5 py-2">
            {[40, 70, 30, 90, 50, 80, 40, 100, 60, 30, 80, 50, 90, 40].map(
              (h, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: isMicActive
                      ? [`${h * 0.3}%`, `${h}%`, `${h * 0.3}%`]
                      : "20%",
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.8,
                    delay: i * 0.05,
                  }}
                  className={`w-2 rounded-full ${isMicActive ? "bg-primary shadow-sm" : "bg-muted-foreground/30"}`}
                />
              )
            )}
          </div>
        )}

        {/* Live Transcript Stream Scroll */}
        <div className="max-h-48 flex-1 space-y-3 overflow-y-auto rounded-xl border bg-card/60 p-4 text-xs">
          {transcripts.map((t, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${t.sender === "student" ? "font-semibold text-primary" : "text-foreground"}`}
            >
              <span className="w-12 shrink-0 text-[10px] font-bold uppercase text-muted-foreground">
                {t.sender}:
              </span>
              <p className="leading-relaxed">{t.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Controls Bar */}
      <div className="flex shrink-0 flex-col items-center justify-between gap-4 border-t border-border/40 pt-4 sm:flex-row">
        <div className="flex items-center gap-3">
          <Button
            variant={isMicActive ? "default" : "outline"}
            size="sm"
            onClick={toggleMic}
            className="gap-2 text-xs"
          >
            {isMicActive ? (
              <Mic className="h-4 w-4 text-emerald-400" />
            ) : (
              <MicOff className="h-4 w-4 text-destructive" />
            )}
            {isMicActive ? "Microphone Active" : "Microphone Muted"}
          </Button>
        </div>

        <div className="flex w-full items-center gap-3 sm:w-auto">
          <input
            type="text"
            placeholder="Type your response if using text mode..."
            value={studentInput}
            onChange={(e) => setStudentInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendAnswer()}
            className="h-9 flex-1 rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-80"
          />
          <Button
            variant="gradient"
            size="sm"
            onClick={handleSendAnswer}
            className="shrink-0 gap-1.5 text-xs"
          >
            Submit Answer <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
