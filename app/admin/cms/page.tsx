"use client";

import React, { useState } from "react";
import {
  Globe,
  Plus,
  Check,
  FileText,
  Sparkles,
  Eye,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSaaSStore } from "@/lib/store/use-saas-store";

export default function ContentManagementPage() {
  const { cmsPosts, addCMSPost } = useSaaSStore();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<
    "blog" | "announcement" | "career_tip" | "faq"
  >("blog");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const handlePublish = () => {
    if (title.trim()) {
      addCMSPost({
        id: `cms-${Date.now()}`,
        title: title.trim(),
        slug: title.toLowerCase().replace(/ /g, "-"),
        category,
        content: content.trim() || "Article content body...",
        status: "published",
        publishedAt: "Just now",
      });
      setTitle("");
      setContent("");
      setIsPublished(true);
      setTimeout(() => setIsPublished(false), 2000);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Content Management System (CMS)
        </h1>
        <p className="text-sm text-muted-foreground">
          Publish engineering blogs, career preparation guides, announcements,
          and FAQs.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* CMS Editor (6 cols) */}
        <Card className="space-y-4 border-border/60 p-6 shadow-sm lg:col-span-6">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <Plus className="h-4 w-4 text-primary" /> Create Content Post
          </h2>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold uppercase text-muted-foreground">
                Article Title
              </label>
              <Input
                placeholder="e.g. Next.js 15 App Router Technical Interview Guide"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold uppercase text-muted-foreground">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="blog">Engineering Blog</option>
                <option value="announcement">Platform Announcement</option>
                <option value="career_tip">Career Tip</option>
                <option value="faq">FAQ Entry</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold uppercase text-muted-foreground">
                Content Body
              </label>
              <textarea
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write rich markdown content..."
                className="w-full rounded-md border border-input bg-background p-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <Button
              variant="gradient"
              onClick={handlePublish}
              className="mt-2 w-full gap-2"
            >
              {isPublished ? "Published Article!" : "Publish CMS Article"}
            </Button>
          </div>
        </Card>

        {/* Published Content List (6 cols) */}
        <Card className="space-y-4 border-border/60 p-6 shadow-sm lg:col-span-6">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <Globe className="h-4 w-4 text-primary" /> Published CMS Articles (
            {cmsPosts.length})
          </h2>

          <div className="space-y-3 text-xs">
            {cmsPosts.map((post) => (
              <div
                key={post.id}
                className="space-y-2 rounded-xl border bg-card/60 p-4"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-bold text-foreground">
                    {post.title}
                  </h3>
                  <Badge variant="success" className="capitalize">
                    {post.category}
                  </Badge>
                </div>
                <p className="line-clamp-2 text-[11px] text-muted-foreground">
                  {post.content}
                </p>
                <p className="font-mono text-[10px] text-primary">
                  Slug: /{post.slug} • {post.publishedAt}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
