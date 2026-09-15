"use client";

import React from "react";
import { Trophy, Coins, Award, Flame, Star, Sparkles } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

const leaderboardData = [
  {
    rank: 1,
    name: "Elena Rostova",
    college: "MIT",
    points: 1450,
    coins: 1200,
    avatar: "ER",
  },
  {
    rank: 2,
    name: "David Kim",
    college: "Stanford",
    points: 1380,
    coins: 1050,
    avatar: "DK",
  },
  {
    rank: 3,
    name: "Sarah Jenkins",
    college: "UC Berkeley",
    points: 1290,
    coins: 950,
    avatar: "SJ",
  },
  {
    rank: 14,
    name: "My Rank",
    college: "Anonymous",
    points: 880,
    coins: 350,
    avatar: "YOU",
    isUser: true,
  },
];

export default function StudentLeaderboardPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Gamification Leaderboard & Coins
        </h1>
        <p className="text-sm text-muted-foreground">
          Earn points by solving coding challenges, taking AI mock interviews,
          and optimizing your ATS resume.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-amber-500/20 bg-amber-500/5 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-500/10 p-3 text-amber-500">
              <Coins className="h-6 w-6 fill-amber-400" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Coins Balance
              </p>
              <p className="text-2xl font-extrabold text-amber-400">
                350 Coins
              </p>
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

        <Card className="border-border/60 bg-primary/5 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <Star className="h-6 w-6 fill-primary" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Badges Earned
              </p>
              <p className="text-2xl font-extrabold text-primary">4 Badges</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Leaderboard Table */}
      <Card className="space-y-4 border-border/60 p-6">
        <div className="border-b pb-3">
          <h2 className="flex items-center gap-2 text-base font-bold">
            <Trophy className="h-4 w-4 text-amber-500" /> Top Ranked Candidates
            This Month
          </h2>
        </div>

        <div className="space-y-2">
          {leaderboardData.map((user) => (
            <div
              key={user.name}
              className={`flex items-center justify-between rounded-xl border p-3.5 transition-all ${
                user.isUser
                  ? "border-primary/30 bg-primary/10 font-bold"
                  : "bg-card/60"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="w-6 text-center text-sm font-extrabold text-muted-foreground">
                  #{user.rank}
                </span>
                <Avatar fallback={user.avatar} size="sm" />
                <div>
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.college}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="text-primary">{user.points} pts</span>
                <Badge variant="accent" className="gap-1">
                  <Coins className="h-3 w-3 fill-amber-400 text-amber-400" />{" "}
                  {user.coins}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
