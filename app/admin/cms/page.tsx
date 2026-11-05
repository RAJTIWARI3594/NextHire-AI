"use client";

import React, { useEffect, useState } from "react";
import { Globe, Plus, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  createAnnouncement,
  deleteAnnouncement,
  fetchAnnouncements,
  type AdminAnnouncement,
} from "@/services/admin-service";

export default function ContentManagementPage() {
  const [announcements, setAnnouncements] = useState<AdminAnnouncement[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [targetRole, setTargetRole] = useState<"all" | "student" | "recruiter" | "admin">("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setAnnouncements(await fetchAnnouncements());
    } catch (loadError: unknown) {
      setError((loadError as Error)?.message || "Announcements could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handlePublish = async () => {
    setError(null);
    setSuccess(null);
    setSaving(true);
    try {
      await createAnnouncement({
        title,
        content,
        targetRole: targetRole === "all" ? null : targetRole,
      });
      setTitle("");
      setContent("");
      setSuccess("Announcement published to the public announcements feed.");
      await load();
    } catch (saveError: unknown) {
      setError((saveError as Error)?.message || "Announcement could not be published.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    setDeletingId(id);
    try {
      await deleteAnnouncement(id);
      setAnnouncements((current) => current.filter((item) => item.id !== id));
    } catch (deleteError: unknown) {
      setError((deleteError as Error)?.message || "Announcement could not be deleted.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Public Announcements</h1>
        <p className="text-sm text-muted-foreground">
          Publish an announcement stored in Supabase. All announcements are
          immediately visible to visitors; audience targeting is recorded for
          clients that support it.
        </p>
      </div>

      {error && <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
      {success && <div role="status" className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700">{success}</div>}

      <Card className="space-y-4 border-border/60 p-6">
        <h2 className="flex items-center gap-2 text-sm font-bold"><Plus className="h-4 w-4 text-primary" /> Publish announcement</h2>
        <div className="space-y-3">
          <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Announcement title" maxLength={160} />
          <textarea
            rows={6}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write the announcement content..."
            maxLength={12000}
            className="w-full rounded-md border border-input bg-background p-3 text-sm"
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <select
              value={targetRole}
              onChange={(event) => setTargetRole(event.target.value as typeof targetRole)}
              className="rounded-md border border-input bg-background p-2 text-sm"
            >
              <option value="all">All users</option>
              <option value="student">Students</option>
              <option value="recruiter">Recruiters</option>
              <option value="admin">Admins</option>
            </select>
            <Button onClick={handlePublish} disabled={saving || title.trim().length < 3 || content.trim().length < 10}>
              {saving ? "Publishing..." : "Publish announcement"}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="space-y-4 border-border/60 p-6">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="flex items-center gap-2 text-sm font-bold"><Globe className="h-4 w-4 text-primary" /> Stored announcements ({announcements.length})</h2>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>
        {loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Loading announcements...</p>
        ) : announcements.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No announcements have been published.</p>
        ) : (
          <div className="space-y-3">
            {announcements.map((item) => (
              <div key={item.id} className="space-y-3 rounded-xl border bg-card/60 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold">{item.title}</h3>
                    <p className="text-[11px] text-muted-foreground">{item.createdAt} · Audience: {item.targetRole || "all users"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="success">Published</Badge>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)} disabled={deletingId !== null}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <p className="whitespace-pre-wrap text-xs text-muted-foreground">{item.content}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
