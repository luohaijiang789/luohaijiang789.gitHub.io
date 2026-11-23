import { test, expect } from '@playwright/test';
import { reviewCards } from '../../src/data/english/review-cards.mjs';

test('homepage, all six subjects and mobile navigation remain usable', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('走向世界');
  await expect(page.locator('.domain-card')).toHaveCount(6);
  await expect(page.locator('[data-due-count]')).toHaveText(String(reviewCards.length));
  await page.getByRole('combobox', { name: '选择主题' }).selectOption('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('combobox', { name: '选择主题' }).selectOption('light');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('.domain-card').filter({ hasText: '英语与沟通' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('英语学习手册');
  await page.getByRole('button', { name: '菜单' }).click();
  await expect(page.getByRole('link', { name: '学习工作台', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('path completion persists and updates the dashboard', async ({ page }) => {
  await page.goto('/paths/first-project/');
  await page.locator('[data-path-step="http"]').check();
  await expect(page.locator('[data-completion-label]')).toHaveText('1 / 4 步骤完成');
  await page.reload();
  await expect(page.locator('[data-path-step="http"]')).toBeChecked();
  await page.goto('/');
  await expect(page.locator('[data-path-progress]')).toHaveText('1 / 4 步骤已完成');
});

test('policy demo checks the actual action and resource', async ({ page }) => {
  await page.goto('/security/tool-boundaries/');
  await page.getByRole('button', { name: '检查权限', exact: true }).click();
  await expect(page.locator('[data-policy-result]')).toContainText('允许执行');
  await page.locator('[data-policy-resource]').selectOption('team-note');
  await page.getByRole('button', { name: '检查权限', exact: true }).click();
  await expect(page.locator('[data-policy-result]')).toContainText('拒绝执行');
  await page.locator('[data-policy-principal]').selectOption('editor');
  await page.getByRole('button', { name: '检查权限', exact: true }).click();
  await expect(page.locator('[data-policy-result]')).toContainText('允许执行');
  await page.locator('[data-policy-attack]').click();
  await expect(page.locator('[data-policy-result]')).toContainText('拒绝执行');
});

test('English practice supports hiding, drafting, and persistence', async ({ page }) => {
  await page.goto('/english/security-standup/');
  await page.locator('[data-toggle-transcript]').click();
  await expect(page.locator('[data-practice-text]')).toBeHidden();
  await page.locator('[data-toggle-transcript]').click();
  await expect(page.locator('[data-practice-text]')).toBeVisible();
  await page.locator('#practice-draft').fill('It tried to update a team note.');
  await page.locator('[data-save-draft]').click();
  await page.reload();
  await expect(page.locator('#practice-draft')).toHaveValue('It tried to update a team note.');
});

test('review schedules persist, export succeeds, and invalid imports are rejected', async ({ page }) => {
  await page.goto('/review/');
  await expect(page.locator('[data-answer-panel]')).toBeHidden();
  await page.locator('[data-reveal]').click();
  await expect(page.locator('[data-card-answer]')).toContainText('permission');
  await page.locator('[data-rate="remember"]').click();
  await expect(page.locator('[data-card-cue]')).toContainText('access');
  await page.reload();
  await expect(page.locator('[data-card-cue]')).toContainText('access');
  const downloadEvent = page.waitForEvent('download');
  await page.locator('[data-export]').click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toMatch(/haijiang-learning-.*\.json/);
  await page.locator('[data-import]').setInputFiles({ name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{"version":999}') });
  await expect(page.locator('[data-backup-status]')).toContainText('不支持');
  await page.goto('/');
  await expect(page.locator('[data-due-count]')).toHaveText(String(reviewCards.length - 1));
});

test('search finds Chinese lesson text in the production index', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '搜索', exact: true }).click();
  const input = page.getByRole('textbox', { name: '搜索', exact: true });
  await input.fill('权限');
  await expect(page.locator('.pagefind-ui__result').first()).toBeVisible({ timeout: 15000 });
});

test('legacy article URL leads to the archive page', async ({ page }) => {
  await page.goto('/posts/hello-ai/');
  await expect(page).toHaveURL(/\/archive\//);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('旧站内容存档');
});

test('valid backup import restores progress, reviews and draft', async ({ page }) => {
  await page.goto('/review/');
  page.on('dialog', dialog => dialog.accept());
  const backup = { version: 1, completed: ['http', 'boundary'], reviews: { permission: { level: 2, due: Date.now() + 86400000 } }, notes: 'Restored English draft.' };
  await page.locator('[data-import]').setInputFiles({ name: 'learning.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(backup)) });
  await expect(page.locator('[data-backup-status]')).toHaveText('备份已导入。');
  await page.goto('/paths/first-project/');
  await expect(page.locator('[data-completion-label]')).toHaveText('2 / 4 步骤完成');
  await page.goto('/english/security-standup/');
  await expect(page.locator('#practice-draft')).toHaveValue('Restored English draft.');
});

test('blocked local storage reports a useful failure without crashing', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => Object.defineProperty(window, 'localStorage', { configurable: true, get() { throw new Error('Storage blocked'); } }));
  await page.goto('/paths/first-project/');
  await page.locator('[data-path-step="http"]').click();
  await expect(page.locator('[data-save-status]')).toContainText('无法保存');
  await expect(page.locator('[data-path-step="http"]')).not.toBeChecked();
  expect(errors).toEqual([]);
});
