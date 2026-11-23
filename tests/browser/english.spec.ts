import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import words from '../../src/data/english/vocabulary.json' with { type: 'json' };
import scenes from '../../src/data/english/scenes.json' with { type: 'json' };

test('English hub exposes working learning sections on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/english/');
  await expect(page.locator('.english-section-card')).toHaveCount(6);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('.english-section-card').filter({ hasText: '词汇记忆实验室' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('多方法词汇实验室');
});

test('word methods preserve an unsaved note, and saved notes stay attached to the word', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/english/vocabulary/');
  const current = page.locator('[data-word-panel="inspect"]');
  await expect(current.locator('[data-memory-panel="parts"]')).toBeVisible();
  await page.locator('#word-note').fill('I inspect my own application logs.');
  await page.getByRole('button', { name: '图像记忆', exact: true }).click();
  await expect(current.getByRole('img')).toBeVisible();
  await expect(page.locator('#word-note')).toHaveValue('I inspect my own application logs.');
  await page.getByRole('button', { name: '联想故事', exact: true }).click();
  await expect(current.locator('.memory-tag')).toContainText('不是词源');
  await page.locator('[data-save-word-note]').click();
  await page.locator('[data-word-select]').selectOption('receipt');
  await expect(page.locator('#word-note')).toHaveValue('');
  await page.locator('[data-word-select]').selectOption('inspect');
  await expect(page.locator('#word-note')).toHaveValue('I inspect my own application logs.');
  await page.reload();
  await expect(page.locator('#word-note')).toHaveValue('I inspect my own application logs.');
  expect(errors).toEqual([]);
});

test('word filtering and discard cancellation do not lose a draft', async ({ page }) => {
  await page.goto('/english/vocabulary/');
  await page.locator('[data-word-group]').selectOption('affixes');
  await expect(page.locator('[data-word-select]')).toHaveValue('review');
  await page.locator('#word-note').fill('Unsaved review example');
  page.once('dialog', dialog => dialog.dismiss());
  await page.locator('[data-word-group]').selectOption('roots');
  await expect(page.locator('[data-word-group]')).toHaveValue('affixes');
  await expect(page.locator('[data-word-select]')).toHaveValue('review');
  await expect(page.locator('#word-note')).toHaveValue('Unsaved review example');
  page.once('dialog', dialog => dialog.dismiss());
  await page.locator('[data-word-select]').selectOption('helpful');
  await expect(page.locator('[data-word-select]')).toHaveValue('review');
  await expect(page.locator('#word-note')).toHaveValue('Unsaved review example');
});

test('focused vocabulary review hides the answer and filters without changing other topics', async ({ page }) => {
  await page.goto('/review/?topic=vocabulary&card=vocab-receipt');
  await expect(page.locator('[data-review-topic]')).toHaveValue('vocabulary');
  await expect(page.locator('[data-deck-summary]')).toContainText(`剩余 ${words.length} 张`);
  await expect(page.locator('[data-card-cue]')).toContainText('小票');
  await expect(page.locator('[data-card-kind]')).not.toContainText('receipt');
  await expect(page.locator('[data-answer-panel]')).toBeHidden();
  await page.locator('[data-reveal]').click();
  await expect(page.locator('[data-card-answer]')).toContainText('receipt');
  await page.locator('[data-rate="remember"]').click();
  await page.locator('[data-review-topic]').selectOption('daily');
  await expect(page.locator('[data-deck-summary]')).toContainText(`剩余 ${scenes.length} 张`);
  await expect(page.locator('[data-card-cue]')).toContainText('拿铁');
});

test('daily scenes support language hiding, per-scene drafts and direct links', async ({ page }) => {
  await page.goto('/english/daily/?scene=housing');
  await expect(page.locator('[data-scene-select]')).toHaveValue('housing');
  const current = page.locator('[data-daily-scene="housing"]');
  await page.locator('[data-toggle-scene-english]').click();
  await expect(current.locator('.line-english').first()).toBeHidden();
  await page.locator('[data-toggle-scene-english]').click();
  await page.locator('[data-toggle-scene-chinese]').click();
  await expect(current.locator('.line-chinese').first()).toBeHidden();
  await page.locator('#scene-draft').fill('Are utilities included in the rent?');
  await page.locator('[data-save-scene]').click();
  await page.locator('[data-scene-select]').selectOption('cafe');
  await expect(page.locator('#scene-draft')).toHaveValue('');
  await page.locator('[data-scene-select]').selectOption('housing');
  await expect(page.locator('#scene-draft')).toHaveValue('Are utilities included in the rent?');
  await page.reload();
  await expect(page.locator('#scene-draft')).toHaveValue('Are utilities included in the rent?');
});

test('English notes and scenario drafts are included in the actual exported backup', async ({ page }) => {
  await page.goto('/english/vocabulary/');
  await page.locator('#word-note').fill('My inspection example');
  await page.locator('[data-save-word-note]').click();
  await page.goto('/english/daily/');
  await page.locator('#scene-draft').fill('A small tea to go, please.');
  await page.locator('[data-save-scene]').click();
  await page.goto('/review/');
  const event = page.waitForEvent('download');
  await page.locator('[data-export]').click();
  const download = await event;
  const backup = JSON.parse(await readFile((await download.path())!, 'utf8'));
  expect(backup.english.wordNotes.inspect).toBe('My inspection example');
  expect(backup.english.sceneDrafts.cafe).toBe('A small tea to go, please.');
});
