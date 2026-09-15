export type InterviewType =
  "HR" | "Technical" | "Behavioral" | "Coding" | "Aptitude" | "Managerial";
export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";
export type InterviewMode = "voice" | "text";

export interface InterviewSetup {
  interviewType: InterviewType;
  difficulty: DifficultyLevel;
  jobRole: string;
  companyName: string;
  durationMinutes: number;
  language: string;
  mode: InterviewMode;
}

export interface QuestionItem {
  id: string;
  questionText: string;
  category: string;
}

export interface EvaluationScore {
  communication: number;
  confidence: number;
  technicalKnowledge: number;
  problemSolving: number;
  grammar: number;
  fluency: number;
  answerRelevance: number;
  leadership: number;
  overallPerformance: number;
}

export interface FeedbackReport {
  id: string;
  interviewId: string;
  jobRole: string;
  companyName: string;
  interviewType: string;
  date: string;
  scores: EvaluationScore;
  strengths: string[];
  weaknesses: string[];
  mistakes: string[];
  improvementPlan: string[];
  questionsCount: number;
}
