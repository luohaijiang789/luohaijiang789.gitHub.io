import { lessons } from '../data/english/curriculum.mjs';
import { reviewCards } from '../data/english/review-cards.mjs';
import vocabulary from '../data/english/vocabulary.json' with { type: 'json' };
import scenes from '../data/english/scenes.json' with { type: 'json' };
/** Browser-local, versioned learning state. Safe to import during static builds. */
export const STORAGE_KEY = 'haijiang-lab:v1';
export const STEP_IDS = ['http', 'boundary', 'explain', 'project'];
export const CARD_IDS = reviewCards.map(card => card.id);
const DAY = 86_400_000;
export function emptyProgress() { return { version: 1, completed: [], reviews: {}, notes: '', english: { wordNotes: {}, sceneDrafts: {}, completedLessons: [] } }; }
function cleanNotes(value, ids) {
  return Object.fromEntries(ids.filter(id => typeof value?.[id] === 'string').map(id => [id, value[id].slice(0, 4000)]));
}
export function normalizeProgress(value) {
  if (!value || typeof value !== 'object' || value.version !== 1) throw new Error('不支持的备份格式，请选择 Learning Lab 的 v1 备份。');
  const reviews = {};
  for (const id of CARD_IDS) {
    const r = value.reviews?.[id];
    if (r && Number.isFinite(r.due) && r.due >= 0 && Number.isInteger(r.level) && r.level >= 0 && r.level <= 5) reviews[id] = { due: r.due, level: r.level };
  }
  return { version: 1, completed: [...new Set((Array.isArray(value.completed) ? value.completed : []).filter(id => STEP_IDS.includes(id)))], reviews, notes: typeof value.notes === 'string' ? value.notes.slice(0, 20000) : '', english: { wordNotes: cleanNotes(value.english?.wordNotes, vocabulary.map(w => w.id)), sceneDrafts: cleanNotes(value.english?.sceneDrafts, scenes.map(s => s.id)), completedLessons: [...new Set((Array.isArray(value.english?.completedLessons) ? value.english.completedLessons : []).filter(id => lessons.some(lesson => lesson.slug === id)))] } };
}
export function readProgress(storage) {
  try { const target = storage ?? globalThis.localStorage; const raw = target?.getItem(STORAGE_KEY); return raw ? normalizeProgress(JSON.parse(raw)) : emptyProgress(); }
  catch { return emptyProgress(); }
}
export function writeProgress(progress, storage) {
  try { const target = storage ?? globalThis.localStorage; target.setItem(STORAGE_KEY, JSON.stringify(normalizeProgress(progress))); return true; }
  catch { return false; }
}
export function dueCards(progress, cards, now = Date.now()) { return cards.filter(card => !progress.reviews[card.id] || progress.reviews[card.id].due <= now); }
export function rateCard(progress, id, remembered, now = Date.now()) {
  if (!CARD_IDS.includes(id)) throw new Error('未知的复习卡片');
  const next = normalizeProgress(progress);
  const level = remembered ? Math.min((next.reviews[id]?.level || 0) + 1, 5) : 0;
  // A simple transparent schedule, not an adaptive memory model.
  const intervals = [10 / 1440, 1, 3, 7, 14, 30];
  next.reviews[id] = { level, due: now + intervals[level] * DAY };
  return next;
}
