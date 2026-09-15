"use client";

import React, { useState } from "react";
import { Sparkles, Star, Search, Check, Filter, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MARKETPLACE_TEMPLATES } from "@/services/career-service";
import { useResumeStore } from "@/lib/store/use-resume-store";

export default function TemplatesMarketplacePage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { setTemplate, activeTemplate } = useResumeStore();
  const [appliedTemplate, setAppliedTemplate] = useState<string | null>(null);

  const categories = [
    "All",
    "Software Engineer",
    "Data Analyst",
    "UI/UX Designer",
    "Marketing",
    "Business",
    "Fresher",
    "Creative",
  ];

  const filteredTemplates = MARKETPLACE_TEMPLATES.filter((t) => {
    const matchesCat =
      activeCategory === "All" || t.category === activeCategory;
    const matchesSearch = t.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleApplyTemplate = (tmplTitle: string) => {
    setAppliedTemplate(tmplTitle);
    setTimeout(() => setAppliedTemplate(null), 2000);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          ATS Resume Templates Marketplace
        </h1>
        <p className="text-sm text-muted-foreground">
          Choose from industry-verified, ATS-compliant resume layouts designed
          for high callback rates.
        </p>
      </div>

      {/* Search & Categories */}
      <div className="space-y-3">
        <Input
          placeholder="Search templates by role or style..."
          icon={<Search className="h-4 w-4" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="flex gap-2 overflow-x-auto border-b border-border/40 pb-3">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className="whitespace-nowrap rounded-full text-xs"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredTemplates.map((tmpl) => (
          <Card
            key={tmpl.id}
            className="group flex flex-col justify-between space-y-4 border-indigo-500/20 p-5 shadow-sm transition-all hover:border-indigo-500/50"
          >
            <div className="space-y-3">
              {/* Mock Template Preview Box */}
              <div className="flex h-36 flex-col justify-between space-y-2 rounded-lg border bg-muted/40 p-3 transition-colors group-hover:border-indigo-500/40">
                <div className="space-y-1">
                  <div className="h-2.5 w-1/2 rounded bg-indigo-500/40" />
                  <div className="h-1.5 w-3/4 rounded bg-muted-foreground/30" />
                </div>
                <div className="space-y-1">
                  <div className="h-1.5 w-full rounded bg-muted-foreground/20" />
                  <div className="h-1.5 w-5/6 rounded bg-muted-foreground/20" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold">{tmpl.title}</h3>
                  {tmpl.isFavorite && (
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {tmpl.category}
                </p>
              </div>
            </div>

            <Button
              variant="gradient"
              size="sm"
              onClick={() => handleApplyTemplate(tmpl.title)}
              className="w-full gap-1.5 text-xs"
            >
              {appliedTemplate === tmpl.title ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-300" /> Template
                  Activated
                </>
              ) : (
                <>
                  <Layers className="h-3.5 w-3.5" /> Use Template
                </>
              )}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
