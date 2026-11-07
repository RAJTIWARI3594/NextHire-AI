import { NextRequest, NextResponse } from "next/server";
import { env } from "@/config/env";
import { createSecureErrorResponse } from "@/lib/security/api-security";

export const dynamic = "force-dynamic";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * POST /api/ai/chat
 * AI Assistant endpoint powering NextHire AI Career Coach.
 * Integrates with Google Gemini / OpenAI, with intelligent fallback.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      messages = [],
      context,
      prompt,
    } = body as {
      messages?: ChatMessage[];
      context?: { studentName?: string; course?: string; skills?: string[] };
      prompt?: string;
    };

    const userMessageText =
      prompt ||
      (messages.length > 0 ? messages[messages.length - 1].content : "") ||
      "";

    const studentName = context?.studentName || "Student";
    const geminiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    const geminiModel = env.GEMINI_MODEL || process.env.GEMINI_MODEL || "gemini-3.8-flash";
    const openaiKey = env.OPENAI_API_KEY || process.env.OPENAI_API_KEY;

    // 1. Try Google Gemini API if key is configured
    if (geminiKey && !geminiKey.includes("placeholder")) {
      try {
        const systemPrompt = `You are NextHire AI Career Coach, a world-class career mentor and technical interviewer for tech candidates. Candidate Name: ${studentName}. Course/Domain: ${context?.course || "Full Stack Engineering"}. Keep answers structured, highly actionable, concise, and professional.`;

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent`;

        const payload = {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${systemPrompt}\n\nCandidate Query: ${userMessageText}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        };

        const res = await fetch(geminiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": geminiKey,
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const geminiData = await res.json();
          const generatedText =
            geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

          if (generatedText) {
            const hasCode = generatedText.includes("```");
            let codeSnippet: string | undefined;
            let language: string | undefined;

            if (hasCode) {
              const codeMatch = generatedText.match(/```(\w+)?\n([\s\S]*?)```/);
              if (codeMatch) {
                language = codeMatch[1] || "typescript";
                codeSnippet = codeMatch[2].trim();
              }
            }

            return NextResponse.json({
              success: true,
              content: generatedText,
              codeSnippet,
              language,
              provider: "gemini-3.8-flash",
            });
          }
        }
      } catch (geminiErr) {
        console.warn("[AI Chat API] Gemini API call warning:", geminiErr);
      }
    }

    // 2. Try OpenAI API if key is configured
    if (openaiKey && !openaiKey.includes("placeholder")) {
      try {
        const openaiUrl = "https://api.openai.com/v1/chat/completions";
        const res = await fetch(openaiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: `You are NextHire AI Career Coach assisting ${studentName}. Provide concise, practical tech career advice.`,
              },
              ...messages,
            ],
            temperature: 0.7,
          }),
        });

        if (res.ok) {
          const openaiData = await res.json();
          const content = openaiData.choices?.[0]?.message?.content;
          if (content) {
            return NextResponse.json({
              success: true,
              content,
              provider: "openai-gpt-4o-mini",
            });
          }
        }
      } catch (openaiErr) {
        console.warn("[AI Chat API] OpenAI API call warning:", openaiErr);
      }
    }

    // 3. Fallback: Smart local response generator
    const queryLower = userMessageText.toLowerCase();

    if (queryLower.includes("resume") || queryLower.includes("ats")) {
      return NextResponse.json({
        success: true,
        content: `Hello ${studentName}! Here are 3 high-impact strategies to boost your resume's ATS score:
1. **Quantify Achievements**: Replace generic tasks with metrics (e.g., *"Improved Next.js SSR page load speeds by 40% with edge caching"*).
2. **Key Skill Keywords**: Ensure Next.js 15, React 19, TypeScript, and Supabase PostgreSQL RLS are listed in your skills section.
3. **Standard Section Headers**: Use clear headings ("Experience", "Projects", "Education") for seamless Taleo/Greenhouse parser ingestion.`,
        provider: "nexthire-fallback-engine",
      });
    }

    if (
      queryLower.includes("code") ||
      queryLower.includes("react") ||
      queryLower.includes("next")
    ) {
      return NextResponse.json({
        success: true,
        content: `Here is a production-ready Next.js 15 App Router example with Supabase Server Components:`,
        codeSnippet: `import { createClient } from "@/lib/supabase/server";

export default async function UserProfile() {
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("*").single();

  return (
    <div className="p-4 rounded-xl border bg-card text-card-foreground">
      <h3 className="font-bold">{profile?.full_name}</h3>
      <p className="text-xs text-primary">Role: {profile?.role}</p>
    </div>
  );
}`,
        language: "typescript",
        provider: "nexthire-fallback-engine",
      });
    }

    return NextResponse.json({
      success: true,
      content: `Great question, ${studentName}! As your NextHire AI Career Coach, I recommend focusing on end-to-end full stack projects using Next.js 15, TypeScript, and Supabase. Recruiters value candidates who demonstrate clean system design, strict RLS database security, and responsive UI interfaces. What goal would you like to tackle next?`,
      provider: "nexthire-fallback-engine",
    });
  } catch (error) {
    return createSecureErrorResponse(
      error,
      "Failed to generate response from AI Assistant API."
    );
  }
}
