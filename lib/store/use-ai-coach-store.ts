import { create } from "zustand";
import type { AIMessage, AIConversation } from "@/types/ai-coach";
import { generateAICoachResponse } from "@/services/ai-coach-service";

interface AICoachStore {
  conversations: AIConversation[];
  activeConversationId: string | null;
  messages: AIMessage[];
  isStreaming: boolean;
  searchQuery: string;

  setConversations: (conversations: AIConversation[]) => void;
  setActiveConversationId: (id: string) => void;
  setSearchQuery: (query: string) => void;
  sendMessage: (content: string, studentName?: string) => Promise<void>;
  createConversation: (title?: string) => void;
  deleteConversation: (id: string) => void;
}

export const useAICoachStore = create<AICoachStore>((set, get) => ({
  conversations: [
    {
      id: "conv-1",
      title: "Career Guidance & Placement Roadmap",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  activeConversationId: "conv-1",
  messages: [
    {
      id: "msg-1",
      conversationId: "conv-1",
      sender: "assistant",
      content:
        "Hello! I am your 24/7 AI Career Coach. How can I help you accelerate your tech career, optimize your ATS resume, or prepare for technical interviews today?",
      createdAt: new Date().toISOString(),
    },
  ],
  isStreaming: false,
  searchQuery: "",

  setConversations: (conversations) => set({ conversations }),
  setActiveConversationId: (activeConversationId) =>
    set({ activeConversationId }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  sendMessage: async (userContent: string, studentName?: string) => {
    const activeId = get().activeConversationId || "conv-1";

    const userMsg: AIMessage = {
      id: `msg-${Date.now()}`,
      conversationId: activeId,
      sender: "user",
      content: userContent,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, userMsg],
      isStreaming: true,
    }));

    try {
      const response = await generateAICoachResponse(userContent, {
        studentName,
      });

      const assistantMsg: AIMessage = {
        id: `msg-${Date.now() + 1}`,
        conversationId: activeId,
        sender: "assistant",
        content: response.content,
        codeSnippet: response.codeSnippet,
        language: response.language,
        createdAt: new Date().toISOString(),
      };

      set((state) => ({
        messages: [...state.messages, assistantMsg],
        isStreaming: false,
      }));
    } catch (error) {
      console.error("AI Response Generation Error:", error);
      set({ isStreaming: false });
    }
  },

  createConversation: (title = "New Career Session") => {
    const newConv: AIConversation = {
      id: `conv-${Date.now()}`,
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      conversations: [newConv, ...state.conversations],
      activeConversationId: newConv.id,
      messages: [
        {
          id: `msg-init-${Date.now()}`,
          conversationId: newConv.id,
          sender: "assistant",
          content: `Welcome to a new session! What career topics would you like to discuss?`,
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  },

  deleteConversation: (id: string) => {
    set((state) => {
      const nextConversations = state.conversations.filter((c) => c.id !== id);
      const nextActiveId = nextConversations[0]?.id || null;
      return {
        conversations: nextConversations,
        activeConversationId: nextActiveId,
      };
    });
  },
}));
