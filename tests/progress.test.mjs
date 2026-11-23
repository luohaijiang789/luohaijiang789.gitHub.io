import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyProgress, normalizeProgress, readProgress, writeProgress, rateCard, dueCards } from '../src/lib/progress.mjs';
const cards = [{ id: 'permission' }, { id: 'clarify' }];
test('corrupt, unsupported, or unavailable storage is safe to read', () => {
  assert.deepEqual(readProgress({ getItem: () => '{broken' }), emptyProgress());
  assert.deepEqual(readProgress({ getItem: () => '{"version":2}' }), emptyProgress());
  assert.deepEqual(readProgress({ getItem() { throw Error('blocked'); } }), emptyProgress());
});
test('import normalizes unknown IDs, duplicates and invalid review data', () => {
  const value = normalizeProgress({ version: 1, completed: ['http', 'http', 'unknown'], reviews: { permission: { level: 2, due: 100 }, clarify: { level: -1, due: 100 }, unknown: { level: 1, due: 100 } }, notes: '<script>not executed</script>' });
  assert.deepEqual(value.completed, ['http']);
  assert.deepEqual(Object.keys(value.reviews), ['permission']);
  assert.equal(value.notes, '<script>not executed</script>');
  assert.throws(() => normalizeProgress({ version: 5 }));
});
test('new cards are due, successful recall advances interval and failure resets it', () => {
  const now = 1_000_000_000;
  const p = emptyProgress();
  assert.equal(dueCards(p, cards, now).length, 2);
  const first = rateCard(p, 'permission', true, now);
  assert.equal(first.reviews.permission.due, now + 86400000);
  assert.equal(dueCards(first, cards, now).length, 1);
  assert.equal(dueCards(first, cards, now + 86400000).length, 2);
  const second = rateCard(first, 'permission', true, now);
  assert.equal(second.reviews.permission.due, now + 3 * 86400000);
  const failed = rateCard(second, 'permission', false, now);
  assert.equal(failed.reviews.permission.level, 0);
  assert.equal(failed.reviews.permission.due, now + 600000);
  assert.deepEqual(p, emptyProgress());
});
test('review interval caps at thirty days and unknown card IDs are rejected', () => {
  let p = emptyProgress();
  for (let i = 0; i < 10; i++) p = rateCard(p, 'permission', true, 0);
  assert.equal(p.reviews.permission.level, 5);
  assert.equal(p.reviews.permission.due, 30 * 86400000);
  assert.throws(() => rateCard(p, 'unknown', true));
});
test('write failure is visible and backup roundtrip preserves data', () => {
  assert.equal(writeProgress(emptyProgress(), { setItem() { throw Error('quota'); } }), false);
  let stored;
  const storage = { setItem: (_, value) => { stored = value; }, getItem: () => stored };
  const p = rateCard({ ...emptyProgress(), completed: ['http'], notes: 'My draft' }, 'permission', true, 0);
  assert.equal(writeProgress(p, storage), true);
  assert.deepEqual(readProgress(storage), p);
});
test('a throwing browser localStorage getter does not crash the page', () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  try {
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('SecurityError'); } });
    assert.deepEqual(readProgress(), emptyProgress());
    assert.equal(writeProgress(emptyProgress()), false);
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'localStorage', descriptor);
    else delete globalThis.localStorage;
  }
});
