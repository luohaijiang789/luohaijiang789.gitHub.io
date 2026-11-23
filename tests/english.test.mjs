import test from 'node:test';
import assert from 'node:assert/strict';
import words from '../src/data/english/vocabulary.json' with { type: 'json' };
import scenes from '../src/data/english/scenes.json' with { type: 'json' };
import { reviewCards, selectReviewCards } from '../src/data/english/review-cards.mjs';
import { CARD_IDS } from '../src/lib/progress.mjs';

test('canonical learning data produces unique, complete, reviewable cards', () => {
  assert.equal(new Set(reviewCards.map(c => c.id)).size, reviewCards.length);
  assert.deepEqual(CARD_IDS, reviewCards.map(c => c.id));
  for (const word of words) {
    assert.ok(word.source.startsWith('https://www.merriam-webster.com/'));
    assert.ok(word.example && word.cue && word.answer && word.association && word.pictureCaption);
    assert.ok(reviewCards.some(card => card.id === `vocab-${word.id}` && card.answer === word.answer));
  }
  for (const scene of scenes) {
    assert.ok(scene.lines.length >= 3 && scene.lines.every(line => line.en && line.zh));
    assert.ok(scene.challenge && scene.goal && scene.cue);
    assert.ok(reviewCards.some(card => card.id === `daily-${scene.id}`));
  }
});
test('topic selection and a focused card cannot pull in a card from another topic', () => {
  const scoped = selectReviewCards(reviewCards, 'vocabulary', 'vocab-receipt');
  assert.equal(scoped[0].id, 'vocab-receipt');
  assert.equal(scoped.length, words.length);
  assert.ok(scoped.every(card => card.topic === 'vocabulary'));
  assert.ok(!selectReviewCards(reviewCards, 'daily', 'permission').some(c => c.id === 'permission'));
  assert.deepEqual(selectReviewCards(reviewCards, 'unknown'), []);
  assert.equal(selectReviewCards(reviewCards).length, reviewCards.length);
});
