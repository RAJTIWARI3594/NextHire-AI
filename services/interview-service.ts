import { createClient } from "@/lib/supabase/client";
import type {
  InterviewSetup,
  QuestionItem,
  FeedbackReport,
  EvaluationScore,
} from "@/types/interview";

export async function createInterviewSession(
  studentId: string,
  setup: InterviewSetup
) {
  const supabase = createClient();
  const { data: interview, error } = await supabase
    .from("interviews")
    .insert({
      student_id: studentId,
      interview_type: setup.interviewType,
      difficulty: setup.difficulty,
      job_role: setup.jobRole,
      company_name: setup.companyName,
      duration_minutes: setup.durationMinutes,
      language: setup.language,
      mode: setup.mode,
      status: "in_progress",
    })
    .select()
    .single();

  if (error) throw error;
  return interview.id as string;
}

export async function generateAIQuestions(
  jobRole: string,
  interviewType: string
): Promise<QuestionItem[]> {
  try {
    const res = await fetch("/api/ai/interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "questions", jobRole, interviewType }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.questions && Array.isArray(data.questions)) {
        return data.questions;
      }
    }
  } catch (err) {
    console.warn("[Interview Service] API fetch warning:", err);
  }

  const roleLower = jobRole.toLowerCase();

  if (
    interviewType === "Technical" ||
    roleLower.includes("engineer") ||
    roleLower.includes("developer")
  ) {
    return [
      {
        id: "q-1",
        questionText: `Can you explain the key architectural differences between Next.js 15 App Router and traditional React client-side rendering?`,
        category: "Technical Architecture",
      },
      {
        id: "q-2",
        questionText: `How do you implement Row Level Security (RLS) policies in PostgreSQL / Supabase to isolate multi-tenant candidate data?`,
        category: "Database Security",
      },
      {
        id: "q-3",
        questionText: `Describe a situation where you had to debug a complex asynchronous state leak in React 19 or Node.js. How did you resolve it?`,
        category: "Debugging & Problem Solving",
      },
      {
        id: "q-4",
        questionText: `What strategies do you use to optimize Web Workers, Turbopack builds, and edge caching for low-latency web applications?`,
        category: "Performance Optimization",
      },
    ];
  }

  return [
    {
      id: "q-1",
      questionText: `Tell me about yourself and why you are interested in joining our team as a ${jobRole}.`,
      category: "Introduction",
    },
    {
      id: "q-2",
      questionText: `Describe a time when you disagreed with a senior engineer on a critical design decision. How did you handle it?`,
      category: "Conflict Resolution",
    },
  ];
}

export async function fetchInterviewReport(
  interviewId: string
): Promise<FeedbackReport> {
  const scores: EvaluationScore = {
    communication: 88,
    confidence: 90,
    technicalKnowledge: 92,
    problemSolving: 89,
    grammar: 94,
    fluency: 91,
    answerRelevance: 93,
    leadership: 86,
    overallPerformance: 90,
  };

  return {
    id: "rep-1",
    interviewId,
    jobRole: "Senior Full Stack Engineer",
    companyName: "Vercel Partner Labs",
    interviewType: "Technical",
    date: "August 5, 2026",
    scores,
    strengths: [
      "Exceptional explanation of Next.js 15 Server Components and Supabase RLS security policies.",
      "Clear, confident articulation of asynchronous state management and performance tuning.",
      "Strong problem-solving methodology demonstrated during debugging questions.",
    ],
    weaknesses: [
      "Could elaborate more on edge case handling during database connection pooling spikes.",
      "Slight hesitation when explaining complex WebSockets synchronization under high concurrency.",
    ],
    mistakes: [
      "Briefly confused client-side hydration timing with initial server HTML streaming.",
    ],
    improvementPlan: [
      "Review PostgreSQL connection pooler (pgBouncer) configuration options.",
      "Practice mock sessions on WebSockets & WebRTC streaming architecture.",
    ],
    questionsCount: 4,
  };
}
