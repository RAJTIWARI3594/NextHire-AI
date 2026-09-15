import { create } from "zustand";
import type {
  CandidateRanking,
  InterviewEvent,
  RecruiterMessage,
  OfferLetter,
} from "@/types/recruiter";
import { MOCK_RANKED_CANDIDATES } from "@/services/recruiter-service";

interface RecruiterStore {
  candidates: CandidateRanking[];
  interviews: InterviewEvent[];
  messages: RecruiterMessage[];
  offers: OfferLetter[];
  selectedCandidateId: string | null;

  setCandidates: (candidates: CandidateRanking[]) => void;
  toggleShortlist: (id: string) => void;
  addInterview: (interview: InterviewEvent) => void;
  addOffer: (offer: OfferLetter) => void;
  setSelectedCandidateId: (id: string | null) => void;
}

export const useRecruiterStore = create<RecruiterStore>((set) => ({
  candidates: MOCK_RANKED_CANDIDATES,
  interviews: [
    {
      id: "int-1",
      jobId: "job-1",
      studentId: "stud-1",
      candidateName: "Aarav Sharma",
      jobTitle: "Senior Full Stack Engineer",
      interviewType: "Technical",
      scheduledTime: "Aug 6, 2026 â€¢ 10:00 AM PST",
      durationMinutes: 45,
      interviewerName: "Sarah Connor (Tech Lead)",
      status: "scheduled",
    },
  ],
  messages: [
    {
      id: "m-1",
      recruiterId: "rec-1",
      studentId: "stud-1",
      senderRole: "recruiter",
      content:
        "Hi there! Your AI Candidate Ranking score of 96/100 stood out. We'd love to schedule a technical interview.",
      isRead: true,
      createdAt: new Date().toISOString(),
    },
  ],
  offers: [
    {
      id: "off-1",
      jobId: "job-1",
      studentId: "stud-1",
      candidateName: "Aarav Sharma",
      jobTitle: "Senior Full Stack Engineer",
      salaryPackage: 145000,
      joiningDate: "Sept 1, 2026",
      location: "San Francisco, CA (Remote)",
      status: "Sent",
      createdAt: "Aug 5, 2026",
    },
  ],
  selectedCandidateId: "rank-1",

  setCandidates: (candidates) => set({ candidates }),

  toggleShortlist: (id) =>
    set((state) => ({
      candidates: state.candidates.map((c) =>
        c.id === id ? { ...c, isShortlisted: !c.isShortlisted } : c
      ),
    })),

  addInterview: (interview) =>
    set((state) => ({ interviews: [interview, ...state.interviews] })),

  addOffer: (offer) => set((state) => ({ offers: [offer, ...state.offers] })),

  setSelectedCandidateId: (selectedCandidateId) => set({ selectedCandidateId }),
}));
