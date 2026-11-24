import { test, expect } from '@playwright/test';

test('single note directory works on desktop and mobile, with persistent theme', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('笔记');
  await expect(page.locator('.notes-list li')).toHaveCount(7);
  await expect(page.locator('a[href^="/paths/"], a[href="/review/"], .dashboard')).toHaveCount(0);
  await page.getByRole('combobox', { name: '选择主题' }).selectOption('dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('combobox', { name: '选择主题' }).selectOption('light');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('.notes-list a').filter({ hasText: 'GitHub 项目怎么安装' }).click();
  await expect(page).toHaveURL(/\/notes\/software-delivery\//);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: '菜单' }).click();
  await expect(page.getByRole('link', { name: '全部笔记', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('all directory entries lead to readable articles', async ({ page }) => {
  await page.goto('/');
  const links = await page.locator('.notes-list a').evaluateAll(nodes => nodes.map(node => ({ href: node.getAttribute('href')!, title: node.querySelector('.note-title')!.textContent! })));
  for (const link of links) {
    const response = await page.goto(link.href);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(link.title);
  }
});

test('old technical articles and retired workspace URLs redirect', async ({ page }) => {
  await page.goto('/foundations/software-delivery/');
  await expect(page).toHaveURL(/\/notes\/software-delivery\//);
  await page.goto('/paths/first-project/');
  await expect(page).toHaveURL('http://127.0.0.1:4321/');
  await page.goto('/review/');
  await expect(page).toHaveURL(/\/about\/#historical-data/);
  await expect(page.getByRole('heading', { name: '历史本地数据' })).toBeVisible();
  const response = await page.goto('/english/');
  expect(response?.status()).toBe(404);
});

test('policy demonstration remains usable within a note', async ({ page }) => {
  await page.goto('/notes/tool-boundaries/');
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

test('search returns the unified note URL', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '搜索', exact: true }).click();
  await page.getByRole('textbox', { name: '搜索', exact: true }).fill('uvx');
  const result = page.locator('.pagefind-ui__result').filter({ hasText: 'GitHub 项目怎么安装' }).first();
  await expect(result).toBeVisible({ timeout: 15000 });
  await expect(result.locator('a').first()).toHaveAttribute('href', /\/notes\/software-delivery\//);
});

test('historical backups retain drafts and reject invalid imports', async ({ page }) => {
  const data = { version: 1, completed: ['http'], reviews: { permission: { level: 2, due: 123 } }, notes: '原始实验记录', english: { wordNotes: { inspect: '历史笔记' }, completedLessons: ['grammar/verbs/perfect'] } };
  await page.addInitScript(value => localStorage.setItem('haijiang-lab:v1', JSON.stringify(value)), data);
  await page.goto('/');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('haijiang-lab:v1')!).notes)).toBe(data.notes);
  await page.goto('/about/');
  const downloadEvent = page.waitForEvent('download');
  await page.locator('[data-export]').click();
  const download = await downloadEvent;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
  const exported = JSON.parse(Buffer.concat(chunks).toString());
  expect(exported.notes).toBe(data.notes);
  expect(exported.english.wordNotes.inspect).toBe('历史笔记');
  await page.locator('[data-import]').setInputFiles({ name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{"version":999}') });
  await expect(page.locator('[data-backup-status]')).toContainText('不支持');
  page.on('dialog', dialog => dialog.accept());
  await page.locator('[data-import]').setInputFiles({ name: 'valid.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ ...data, notes: '恢复的记录' })) });
  await expect(page.locator('[data-backup-status]')).toHaveText('历史备份已导入。');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('haijiang-lab:v1')!).notes)).toBe('恢复的记录');
});

test('blocked storage produces a clear backup failure without crashing', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, 'localStorage', { configurable: true, get() { throw new Error('Storage blocked'); } }));
  await page.goto('/about/');
  await page.locator('[data-export]').click();
  await expect(page.locator('[data-backup-status]')).toContainText('无法读取');
});

test('legacy blog article still reaches the archive', async ({ page }) => {
  await page.goto('/posts/hello-ai/');
  await expect(page).toHaveURL(/\/archive\//);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('旧站内容存档');
});
