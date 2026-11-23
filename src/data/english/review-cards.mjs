import core from './core-cards.json' with { type: 'json' };
import vocabulary from './vocabulary.json' with { type: 'json' };
import scenes from './scenes.json' with { type: 'json' };
export const reviewTopics = [
  { id: 'all', label: '全部专题' },
  { id: 'project', label: '专业与职场' },
  { id: 'vocabulary', label: '词汇实验室' },
  { id: 'daily', label: '日常英语' },
];
export const reviewCards = [
  ...core.map(card => ({ ...card, topic: 'project' })),
  ...vocabulary.map(word => ({ id: `vocab-${word.id}`, topic: 'vocabulary', kind: '词汇 · 从场景回忆', cue: word.cue, answer: word.answer, note: word.contrast, speech: word.example })),
  ...scenes.map(scene => ({ id: `daily-${scene.id}`, topic: 'daily', kind: `日常 · ${scene.title}`, cue: scene.cue, answer: scene.answer, note: scene.tip, speech: scene.answer })),
];
export function selectReviewCards(cards, topic = 'all', focusId = '') {
  const filtered = cards.filter(card => topic === 'all' || card.topic === topic);
  const focus = filtered.find(card => card.id === focusId);
  return focus ? [focus, ...filtered.filter(card => card.id !== focusId)] : filtered;
}
