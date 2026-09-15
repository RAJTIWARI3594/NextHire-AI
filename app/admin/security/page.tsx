"use client";

import React, { useState } from "react";
import {
  Shield,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Ban,
  Activity,
  UserX,
  Globe,
  Key,
  Smartphone,
  RefreshCw,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function SecurityCenterPage() {
  const [blockedIps, setBlockedIps] = useState<string[]>([
    "198.51.100.42",
    "203.0.113.195",
  ]);
  const [newIp, setNewIp] = useState("");
  const [captchaEnabled, setCaptchaEnabled] = useState(true);

  const securityEvents = [
    {
      id: "evt-1",
      type: "Rate Limit Exceeded",
      severity: "medium",
      ip: "198.51.100.42",
      time: "10 mins ago",
      details: "Exceeded 10 requests / min threshold on /api/ai/resume/parse",
    },
    {
      id: "evt-2",
      type: "Account Lockout",
      severity: "high",
      ip: "203.0.113.195",
      time: "42 mins ago",
      details:
        "5 consecutive failed login attempts on admin@nexthire.ai. Account locked for 15m.",
    },
    {
      id: "evt-3",
      type: "Bot Anomaly Detected",
      severity: "high",
      ip: "192.0.2.77",
      time: "2 hours ago",
      details:
        "Headless Chrome user-agent string attempting rapid credential stuffing.",
    },
  ];

  const deviceSessions = [
    {
      id: "dev-1",
      user: "raj.admin@nexthire.ai",
      device: "Chrome on macOS",
      ip: "104.28.19.1",
      active: "Just now",
      status: "Current Session",
    },
    {
      id: "dev-2",
      user: "sarah.recruiter@tech.com",
      device: "Safari on iOS",
      ip: "172.56.21.9",
      active: "12 mins ago",
      status: "Active",
    },
  ];

  const handleBlockIp = () => {
    if (newIp && !blockedIps.includes(newIp)) {
      setBlockedIps([...blockedIps, newIp]);
      setNewIp("");
    }
  };

  const handleUnblockIp = (ipToUnblock: string) => {
    setBlockedIps(blockedIps.filter((ip) => ip !== ipToUnblock));
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-8">
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="accent">Security Operations</Badge>
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="h-3 w-3" /> SAIF & SOC2 Compliant
          </Badge>
        </div>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
          Enterprise Security Center & Threat Defense
        </h1>
        <p className="text-sm text-muted-foreground">
          Audit threat feeds, inspect account lockouts, enforce CAPTCHA
          verification, manage active device sessions, and configure IP firewall
          blocklists.
        </p>
      </div>

      {/* Top Security Score Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="border-emerald-500/20 p-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            MFA & Auth Security
          </span>
          <p className="mt-2 text-2xl font-extrabold text-emerald-400">
            Enforced
          </p>
          <p className="mt-1 text-[10px] text-emerald-400">
            HttpOnly Cookies & 15m Timeout
          </p>
        </Card>

        <Card className="border-border/60 p-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Bot Defense (Turnstile)
          </span>
          <p className="mt-2 text-2xl font-extrabold text-primary">
            {captchaEnabled ? "Active" : "Disabled"}
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            Automated Challenge Defense
          </p>
        </Card>

        <Card className="border-amber-500/20 p-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Blocked IP Firewall
          </span>
          <p className="mt-2 text-2xl font-extrabold text-amber-400">
            {blockedIps.length} IPs
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            Auto & Manual Blacklist
          </p>
        </Card>

        <Card className="border-border/60 p-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Security Health Score
          </span>
          <p className="mt-2 text-2xl font-extrabold text-primary">99 / 100</p>
          <p className="mt-1 text-[10px] text-emerald-400">
            Zero Critical Vulnerabilities
          </p>
        </Card>
      </div>

      {/* Main Controls Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Security Audit Feed (7 cols) */}
        <Card className="space-y-4 border-border/60 p-6 shadow-sm lg:col-span-7">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <Shield className="h-4 w-4 text-primary" /> Real-time Security
              Event Stream
            </h2>
            <Badge variant="accent" className="font-mono text-[10px]">
              Live Audit Telemetry
            </Badge>
          </div>

          <div className="space-y-3 text-xs">
            {securityEvents.map((evt) => (
              <div
                key={evt.id}
                className="space-y-1.5 rounded-xl border bg-card/60 p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-foreground">{evt.type}</p>
                    <Badge
                      variant={
                        evt.severity === "high" ? "destructive" : "outline"
                      }
                    >
                      {evt.severity}
                    </Badge>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {evt.time}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {evt.details}
                </p>
                <div className="flex items-center justify-between border-t border-border/40 pt-1 text-[10px]">
                  <span className="font-mono text-primary">
                    Origin IP: {evt.ip}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-[10px] text-red-400 hover:text-red-300"
                    onClick={() => {
                      if (!blockedIps.includes(evt.ip))
                        setBlockedIps([...blockedIps, evt.ip]);
                    }}
                  >
                    Block IP
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* IP Firewall & Bot Settings (5 cols) */}
        <div className="space-y-6 lg:col-span-5">
          {/* IP Firewall Manager */}
          <Card className="space-y-4 border-amber-500/20 p-6">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="flex items-center gap-2 text-sm font-bold">
                <Ban className="h-4 w-4 text-amber-500" /> IP Firewall Rule
                Manager
              </h2>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. 198.51.100.42"
                value={newIp}
                onChange={(e) => setNewIp(e.target.value)}
                className="flex-1 rounded-lg border bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <Button size="sm" onClick={handleBlockIp} className="text-xs">
                Block IP
              </Button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-[11px] font-semibold text-muted-foreground">
                Currently Blacklisted IPs:
              </p>
              {blockedIps.map((ip) => (
                <div
                  key={ip}
                  className="flex items-center justify-between rounded-lg border bg-card/60 p-2"
                >
                  <span className="font-mono text-xs">{ip}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUnblockIp(ip)}
                    className="h-6 text-[10px] text-muted-foreground hover:text-foreground"
                  >
                    Unblock
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Active Device Sessions Manager */}
          <Card className="space-y-4 border-border/60 p-6">
            <div className="border-b pb-3">
              <h2 className="flex items-center gap-2 text-sm font-bold">
                <Smartphone className="h-4 w-4 text-primary" /> Active Session
                Inspector
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              {deviceSessions.map((session) => (
                <div
                  key={session.id}
                  className="space-y-1 rounded-lg border bg-card/60 p-3"
                >
                  <div className="flex justify-between">
                    <p className="font-bold text-foreground">{session.user}</p>
                    <Badge variant="outline" className="text-[9px]">
                      {session.status}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {session.device} • {session.ip}
                  </p>
                  <p className="text-[10px] text-primary">
                    Last Active: {session.active}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
