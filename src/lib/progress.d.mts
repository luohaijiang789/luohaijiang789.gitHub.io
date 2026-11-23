export interface Progress { version: number; completed: string[]; reviews: Record<string, { due: number; level: number }>; notes: string; }
export const STORAGE_KEY: string;
export const STEP_IDS: string[];
export const CARD_IDS: string[];
export function emptyProgress(): Progress;
export function normalizeProgress(value: unknown): Progress;
export function readProgress(storage?: Storage): Progress;
export function writeProgress(progress: Progress, storage?: Storage): boolean;
export function dueCards<T extends { id: string }>(progress: Progress, cards: readonly T[], now?: number): T[];
export function rateCard(progress: Progress, id: string, remembered: boolean, now?: number): Progress;
