import test from 'node:test';
import assert from 'node:assert/strict';
import { reviewCards, selectReviewCards } from '../src/data/review-cards.mjs';
import { normalizeProgress, dueCards, rateCard } from '../src/lib/progress.mjs';

test('old English recall does not mark new technical concepts as learned', () => {
  const p = normalizeProgress({ version: 1, completed: ['explain'], reviews: { permission: { level: 5, due: 9999999999999 }, 'vocab-inspect': { level: 3, due: 9999999999999 } } });
  assert.equal(dueCards(p, reviewCards, 0).length, reviewCards.length);
  assert.equal(p.completed.includes('evidence'), false);
  assert.equal(p.reviews['vocab-inspect'].level, 3);
  assert.throws(() => rateCard(p, 'vocab-inspect', true));
});

test('focused card cannot escape the selected technical topic', () => {
  const security = selectReviewCards(reviewCards, 'security', 'tech-delivery');
  assert(security.length > 0);
  assert(security.every(card => card.topic === 'security'));
  assert.equal(selectReviewCards(reviewCards, 'foundations', 'tech-isolation')[0].id, 'tech-isolation');
});
