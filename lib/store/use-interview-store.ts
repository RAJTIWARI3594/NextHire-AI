import { create } from "zustand";
import type {
  InterviewSetup,
  QuestionItem,
  FeedbackReport,
} from "@/types/interview";
import {
  generateAIQuestions,
  fetchInterviewReport,
} from "@/services/interview-service";

interface InterviewStore {
  setup: InterviewSetup;
  sessionId: string | null;
  questions: QuestionItem[];
  currentQuestionIndex: number;
  isMicActive: boolean;
  isAiSpeaking: boolean;
  timeLeftSeconds: number;
  transcripts: { sender: "ai" | "student"; text: string }[];
  report: FeedbackReport | null;

  setSetup: (setup: Partial<InterviewSetup>) => void;
  startSession: (sessionId: string) => Promise<void>;
  toggleMic: () => void;
  nextQuestion: () => void;
  addTranscript: (sender: "ai" | "student", text: string) => void;
  loadReport: (interviewId: string) => Promise<void>;
}

export const useInterviewStore = create<InterviewStore>((set, get) => ({
  setup: {
    interviewType: "Technical",
    difficulty: "Intermediate",
    jobRole: "Senior Full Stack Engineer",
    companyName: "Vercel Partner Labs",
    durationMinutes: 20,
    language: "English",
    mode: "voice",
  },
  sessionId: null,
  questions: [],
  currentQuestionIndex: 0,
  isMicActive: false,
  isAiSpeaking: false,
  timeLeftSeconds: 1200, // 20 minutes
  transcripts: [],
  report: null,

  setSetup: (newSetup) =>
    set((state) => ({ setup: { ...state.setup, ...newSetup } })),

  startSession: async (sessionId: string) => {
    const { setup } = get();
    const questions = await generateAIQuestions(
      setup.jobRole,
      setup.interviewType
    );

    set({
      sessionId,
      questions,
      currentQuestionIndex: 0,
      isMicActive: setup.mode === "voice",
      timeLeftSeconds: setup.durationMinutes * 60,
      transcripts: [
        {
          sender: "ai",
          text: `Welcome to your ${setup.interviewType} Mock Interview for ${setup.jobRole} at ${setup.companyName}. Let's begin with our first question.`,
        },
        {
          sender: "ai",
          text:
            questions[0]?.questionText ||
            "Tell me about your technical background.",
        },
      ],
    });
  },

  toggleMic: () => set((state) => ({ isMicActive: !state.isMicActive })),

  nextQuestion: () => {
    const { questions, currentQuestionIndex } = get();
    const nextIdx = currentQuestionIndex + 1;

    if (nextIdx < questions.length) {
      set({
        currentQuestionIndex: nextIdx,
        transcripts: [
          ...get().transcripts,
          { sender: "ai", text: questions[nextIdx].questionText },
        ],
      });
    }
  },

  addTranscript: (sender, text) =>
    set((state) => ({
      transcripts: [...state.transcripts, { sender, text }],
    })),

  loadReport: async (interviewId: string) => {
    const report = await fetchInterviewReport(interviewId);
    set({ report });
  },
}));
