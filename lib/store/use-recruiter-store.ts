import { create } from "zustand";
import type {
  CandidateRanking,
  InterviewEvent,
  RecruiterMessage,
  OfferLetter,
} from "@/types/recruiter";

interface RecruiterStore {
  candidates: CandidateRanking[];
  interviews: InterviewEvent[];
  messages: RecruiterMessage[];
  offers: OfferLetter[];
  selectedCandidateId: string | null;
  setCandidates: (candidates: CandidateRanking[]) => void;
  setInterviews: (interviews: InterviewEvent[]) => void;
  toggleShortlist: (id: string) => void;
  addInterview: (interview: InterviewEvent) => void;
  addOffer: (offer: OfferLetter) => void;
  setSelectedCandidateId: (id: string | null) => void;
}

export const useRecruiterStore = create<RecruiterStore>((set) => ({
  candidates: [],
  interviews: [],
  messages: [],
  offers: [],
  selectedCandidateId: null,
  setCandidates: (candidates) => set({ candidates }),
  setInterviews: (interviews) => set({ interviews }),
  toggleShortlist: (id) =>
    set((state) => ({
      candidates: state.candidates.map((candidate) =>
        candidate.id === id
          ? { ...candidate, isShortlisted: !candidate.isShortlisted }
          : candidate
      ),
    })),
  addInterview: (interview) =>
    set((state) => ({ interviews: [interview, ...state.interviews] })),
  addOffer: (offer) => set((state) => ({ offers: [offer, ...state.offers] })),
  setSelectedCandidateId: (selectedCandidateId) => set({ selectedCandidateId }),
}));
