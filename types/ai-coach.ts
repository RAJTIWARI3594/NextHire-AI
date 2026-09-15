export interface AIMessage {
  id: string;
  conversationId: string;
  sender: "user" | "assistant" | "system";
  content: string;
  codeSnippet?: string;
  language?: string;
  createdAt: string;
}

export interface AIConversation {
  id: string;
  title: string;
  modelUsed?: string;
  isPinned?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AIPromptTemplate {
  id: string;
  title: string;
  category: "Resume" | "Interview" | "DSA" | "Projects" | "Company Prep";
  promptText: string;
  description: string;
}

export interface RoadmapWeek {
  weekNumber: number;
  title: string;
  topics: string[];
  projectIdea: string;
  resources: string[];
}

export interface LearningRoadmap {
  id: string;
  roleTarget: string;
  durationWeeks: number;
  weeks: RoadmapWeek[];
}
