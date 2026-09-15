"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Copy,
  Download,
  Save,
  RefreshCw,
  CheckCircle2,
  FileText,
} from "lucide-react";
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
import {
  generateAICoverLetter,
  saveCoverLetter,
} from "@/services/career-service";
import { useAuthStore } from "@/lib/store/use-auth-store";

export default function AICoverLetterPage() {
  const { profile, user } = useAuthStore();
  const [jobTitle, setJobTitle] = useState("Senior Full Stack Engineer");
  const [companyName, setCompanyName] = useState("Vercel Partner Labs");
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState<"Professional" | "Friendly" | "Formal">(
    "Professional"
  );
  const [generatedLetter, setGeneratedLetter] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setCopied(false);
    setSaved(false);

    const letter = await generateAICoverLetter({
      jobTitle,
      companyName,
      jobDescription,
      tone,
      candidateName:
        profile?.full_name || (user?.email || "").split("@")[0] || "Candidate",
    });

    setGeneratedLetter(letter);
    setIsGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (profile?.id) {
      await saveCoverLetter({
        studentId: profile.id,
        jobTitle,
        companyName,
        jobDescription,
        tone,
        content: generatedLetter,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          AI Cover Letter Generator
        </h1>
        <p className="text-sm text-muted-foreground">
          Generate tailored, high-converting cover letters matching target job
          requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Input Controls Pane (5 cols) */}
        <Card className="space-y-4 border-border/60 p-6 shadow-sm lg:col-span-5">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <Sparkles className="h-4 w-4 text-primary" /> Target Job Parameters
          </h2>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold uppercase text-muted-foreground">
                Target Job Title
              </label>
              <Input
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Full Stack Engineer"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold uppercase text-muted-foreground">
                Company Name
              </label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Vercel Partner Labs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold uppercase text-muted-foreground">
                Tone of Voice
              </label>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {(["Professional", "Friendly", "Formal"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`rounded-lg border px-2 py-1.5 text-xs font-medium transition-all ${
                      tone === t
                        ? "border-primary bg-primary text-white"
                        : "bg-card hover:bg-muted"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold uppercase text-muted-foreground">
                Job Description (Optional)
              </label>
              <textarea
                rows={4}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste key job requirements to tailor skill highlights..."
                className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <Button
              variant="gradient"
              isLoading={isGenerating}
              onClick={handleGenerate}
              className="mt-2 w-full gap-2"
            >
              <Sparkles className="h-4 w-4" /> Generate Cover Letter
            </Button>
          </div>
        </Card>

        {/* Output & Editor Pane (7 cols) */}
        <Card className="flex flex-col justify-between space-y-4 border-border/60 p-6 shadow-sm lg:col-span-7">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <FileText className="h-4 w-4 text-primary" /> Generated Cover
              Letter
            </h2>

            {generatedLetter && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="gap-1 text-xs"
                >
                  {copied ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  className="gap-1 text-xs"
                >
                  {saved ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}
                  {saved ? "Saved" : "Save"}
                </Button>
              </div>
            )}
          </div>

          {generatedLetter ? (
            <textarea
              rows={16}
              value={generatedLetter}
              onChange={(e) => setGeneratedLetter(e.target.value)}
              className="w-full resize-none rounded-lg border border-input bg-background p-4 font-sans text-xs leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          ) : (
            <div className="space-y-2 py-20 text-center text-xs text-muted-foreground">
              <Sparkles className="mx-auto h-8 w-8 animate-pulse text-primary opacity-60" />
              <p>
                Click &quot;Generate Cover Letter&quot; to synthesize a
                personalized document.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
