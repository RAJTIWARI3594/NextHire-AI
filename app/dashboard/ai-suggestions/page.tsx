"use client";

import React, { useEffect, useState } from "react";
import {
  Sparkles,
  Zap,
  Award,
  Code2,
  ArrowRight,
  Lightbulb,
  Target,
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
import { fetchAISuggestions } from "@/services/career-service";
import type { AISuggestion } from "@/types/career";

export default function AISuggestionsPage() {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetchAISuggestions();
      setSuggestions(res);
    }
    load();
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          AI Career & Resume Recommendations
        </h1>
        <p className="text-sm text-muted-foreground">
          Autonomous suggestions powered by Gemini AI model analysis of active
          tech job postings.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {suggestions.map((item) => (
          <Card
            key={item.id}
            className="flex flex-col justify-between space-y-4 border-border/60 p-6 shadow-sm transition-all hover:border-primary/30"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge
                  variant={item.impact === "High" ? "accent" : "secondary"}
                >
                  {item.impact} Impact Recommendation
                </Badge>
                <Lightbulb className="h-4 w-4 text-amber-400" />
              </div>

              <div>
                <h3 className="text-base font-bold">{item.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 text-xs"
            >
              Apply Recommendation <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
