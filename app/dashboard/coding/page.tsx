"use client";

import React from "react";
import {
  Code2,
  Flame,
  Trophy,
  CheckCircle2,
  Play,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const codingQuestions = [
  {
    id: "q-1",
    title: "Two Sum & Hash Maps",
    difficulty: "Easy",
    category: "Arrays & Hashes",
    acceptance: "84%",
    solved: true,
  },
  {
    id: "q-2",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "Sliding Window",
    acceptance: "68%",
    solved: true,
  },
  {
    id: "q-3",
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "Hard",
    category: "Trees & DFS",
    acceptance: "52%",
    solved: false,
  },
  {
    id: "q-4",
    title: "Design LRU Cache",
    difficulty: "Medium",
    category: "Design & Hash Maps",
    acceptance: "71%",
    solved: false,
  },
];

export default function StudentCodingPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          LeetCode Style Coding Practice
        </h1>
        <p className="text-sm text-muted-foreground">
          Sharpen algorithms and data structures to pass technical screening
          assessments.
        </p>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-amber-500/20 bg-amber-500/5 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-500/10 p-3 text-amber-500">
              <Flame className="h-6 w-6 fill-amber-500" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Active Streak
              </p>
              <p className="text-2xl font-extrabold text-amber-400">5 Days</p>
            </div>
          </div>
        </Card>

        <Card className="border-border/60 bg-primary/5 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <Code2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Solved Problems
              </p>
              <p className="text-2xl font-extrabold text-primary">42 / 150</p>
            </div>
          </div>
        </Card>

        <Card className="border-border/60 bg-primary/5 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Global Rank
              </p>
              <p className="text-2xl font-extrabold text-primary">#14</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Questions List */}
      <Card className="space-y-4 border-border/60 p-6">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="flex items-center gap-2 text-base font-bold">
            <Sparkles className="h-4 w-4 text-primary" /> Recommended Interview
            Problems
          </h2>
        </div>

        <div className="space-y-3">
          {codingQuestions.map((q) => (
            <div
              key={q.id}
              className="flex items-center justify-between gap-4 rounded-xl border bg-card/60 p-4 transition-all hover:border-primary/30"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">{q.title}</h3>
                  <Badge
                    variant={
                      q.difficulty === "Easy"
                        ? "success"
                        : q.difficulty === "Medium"
                          ? "accent"
                          : "destructive"
                    }
                  >
                    {q.difficulty}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Category: {q.category} • Acceptance Rate: {q.acceptance}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {q.solved ? (
                  <Badge variant="success" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Solved
                  </Badge>
                ) : (
                  <Button
                    variant="gradient"
                    size="sm"
                    className="gap-1 text-xs"
                  >
                    <Play className="h-3 w-3" /> Solve Challenge
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
