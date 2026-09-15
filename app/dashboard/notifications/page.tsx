"use client";

import React, { useState } from "react";
import {
  Bell,
  Check,
  Trash2,
  Sparkles,
  Briefcase,
  Bot,
  Trophy,
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

const initialNotifications = [
  {
    id: "notif-1",
    title: "Interview Invitation Received",
    message:
      "Vercel Partner Labs has scheduled a technical interview for Frontend Engineer.",
    date: "10 minutes ago",
    isRead: false,
    category: "jobs",
  },
  {
    id: "notif-2",
    title: "AI Resume Screening Report Ready",
    message:
      "Your resume ATS score has improved from 76 to 88 after adding Next.js 15 keywords.",
    date: "2 hours ago",
    isRead: false,
    category: "ai",
  },
  {
    id: "notif-3",
    title: "Coins Awarded!",
    message: "You earned +50 Coins for maintaining a 5-day coding streak.",
    date: "1 day ago",
    isRead: true,
    category: "rewards",
  },
];

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("all");

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotif = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const filteredNotifs = notifications.filter(
    (n) => filter === "all" || n.category === filter
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Notification Center
          </h1>
          <p className="text-sm text-muted-foreground">
            Stay updated on interview calls, AI feedback, and reward milestones.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={markAllRead}
          className="gap-1.5 text-xs"
        >
          <Check className="h-4 w-4" /> Mark All as Read
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-border/40 pb-3">
        {["all", "jobs", "ai", "rewards"].map((cat) => (
          <Button
            key={cat}
            variant={filter === cat ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter(cat)}
            className="rounded-full text-xs capitalize"
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <Card className="p-12 text-center text-sm text-muted-foreground">
            No notifications in this section.
          </Card>
        ) : (
          filteredNotifs.map((n) => (
            <Card
              key={n.id}
              className={`border-border/60 p-4 transition-all ${
                !n.isRead ? "border-l-4 border-l-primary bg-primary/5" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold">{n.title}</h3>
                    {!n.isRead && <Badge variant="accent">New</Badge>}
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {n.message}
                  </p>
                  <span className="text-[10px] text-muted-foreground">
                    {n.date}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteNotif(n.id)}
                  className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
