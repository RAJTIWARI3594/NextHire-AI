import React from "react";
import { Coins, Award, Trophy, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function StudentRewardsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Coins & Badges Rewards
        </h1>
        <p className="text-sm text-muted-foreground">
          Unlock premium AI mock interview sessions and profile highlights with
          your coins.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="space-y-2 border-amber-500/20 bg-amber-500/5 p-6 text-center">
          <Coins className="mx-auto h-8 w-8 fill-amber-400 text-amber-400" />
          <h2 className="text-3xl font-extrabold text-amber-400">350 Coins</h2>
          <p className="text-xs text-muted-foreground">Balance Available</p>
        </Card>

        <Card className="space-y-2 border-border/60 bg-primary/5 p-6 text-center">
          <Award className="mx-auto h-8 w-8 text-primary" />
          <h2 className="text-3xl font-extrabold text-primary">4 Badges</h2>
          <p className="text-xs text-muted-foreground">Earned Milestones</p>
        </Card>
      </div>
    </div>
  );
}
