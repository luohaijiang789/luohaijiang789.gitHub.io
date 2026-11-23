export interface ReviewCard { id: string; topic: string; kind: string; cue: string; answer: string; note: string; }
export const reviewTopics: { id: string; label: string }[];
export const reviewCards: ReviewCard[];
export function selectReviewCards<T extends {id: string; topic: string}>(cards: readonly T[], topic?: string, focusId?: string): T[];
