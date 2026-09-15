import { createClient } from "@/lib/supabase/client";
import type {
  AIMessage,
  AIConversation,
  AIPromptTemplate,
  LearningRoadmap,
} from "@/types/ai-coach";

export async function fetchUserConversations(
  studentId: string
): Promise<AIConversation[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("ai_conversations")
    .select("*")
    .eq("student_id", studentId)
    .order("updated_at", { ascending: false });

  if (!data || data.length === 0) {
    return [
      {
        id: "conv-1",
        title: "Career Guidance & Placement Roadmap",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  return data.map((c) => ({
    id: c.id,
    title: c.title,
    modelUsed: c.model_used,
    isPinned: c.is_pinned,
    createdAt: c.created_at,
    updatedAt: c.updated_at,
  }));
}

export async function generateAICoachResponse(
  userQuery: string,
  context?: { studentName?: string; course?: string; skills?: string[] }
): Promise<{ content: string; codeSnippet?: string; language?: string }> {
  try {
    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: userQuery,
        context,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.content) {
        return {
          content: data.content,
          codeSnippet: data.codeSnippet,
          language: data.language,
        };
      }
    }
  } catch (err) {
    console.warn("[AI Coach Service] API fetch warning:", err);
  }

  // Local fallback
  const name = context?.studentName || "Student";
  return {
    content: `Great question, ${name}! As your 24/7 AI Career Coach, I recommend focusing on building end-to-end full stack projects with Next.js 15 and Supabase. Recruiters value candidates who demonstrate clean system design, strict RLS database security, and responsive UI interfaces. What specific goal would you like to target next?`,
  };
}

export const PROMPT_TEMPLATES: AIPromptTemplate[] = [
  {
    id: "p-1",
    title: "Improve My Resume ATS Score",
    category: "Resume",
    promptText:
      "Analyze my current skills and suggest top 5 high-impact bullet points to increase my ATS score for Senior Full Stack roles.",
    description: "Tailored bullet point recommendations for tech resumes.",
  },
  {
    id: "p-2",
    title: "Conduct Mock Technical Interview",
    category: "Interview",
    promptText:
      "Ask me 3 challenging questions on Next.js 15 App Router, React 19 Hooks, and PostgreSQL RLS security.",
    description: "Practice real-time technical questions.",
  },
  {
    id: "p-3",
    title: "Explain Graph & Tree DSA Algorithms",
    category: "DSA",
    promptText:
      "Explain Breadth-First Search (BFS) and Depth-First Search (DFS) with clean TypeScript code examples.",
    description: "Clear algorithmic explanations with code.",
  },
  {
    id: "p-4",
    title: "Generate Portfolio Project Ideas",
    category: "Projects",
    promptText:
      "Suggest 3 unique full stack project ideas that stand out to tech recruiters at top startups.",
    description: "High-impact project recommendations.",
  },
  {
    id: "p-5",
    title: "Deloitte / TCS Interview Prep",
    category: "Company Prep",
    promptText:
      "What are the core technical & behavioral questions asked in Deloitte / TCS recruitment drives?",
    description: "Company specific interview preparation.",
  },
];
