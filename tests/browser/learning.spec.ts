import { test, expect } from '@playwright/test';

test('single note directory works on desktop and mobile, with persistent theme', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('我的笔记');
  await expect(page.locator('.note-card')).toHaveCount(7);
  await expect(page.locator('a[href^="/paths/"], a[href="/review/"], .dashboard')).toHaveCount(0);
  await page.getByRole('button', { name: '切换到深色主题' }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: '切换到浅色主题' }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('.note-card').filter({ hasText: 'GitHub 项目怎么安装' }).click();
  await expect(page).toHaveURL(/\/notes\/software-delivery\//);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: '菜单' }).click();
  await expect(page.getByRole('link', { name: '全部笔记', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('all directory entries lead to readable articles', async ({ page }) => {
  await page.goto('/');
  const links = await page.locator('.note-card').evaluateAll(nodes => nodes.map(node => ({ href: node.getAttribute('href')!, title: node.querySelector('h2')!.textContent! })));
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
  await page.getByRole('button', { name: '搜索笔记', exact: true }).click();
  await page.getByRole('textbox', { name: '搜索笔记内容', exact: true }).fill('uvx');
  const result = page.locator('.search-result').filter({ hasText: 'GitHub 项目怎么安装' }).first();
  await expect(result).toBeVisible({ timeout: 15000 });
  await expect(result).toHaveAttribute('href', /\/notes\/software-delivery\//);
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


test('topic filtering and keyboard search support empty states and focus return', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'AI 安全', exact: true }).click();
  await expect(page.locator('.note-card')).toHaveCount(1);
  await expect(page.locator('.note-card')).toContainText('谁来授权');
  await page.getByRole('button', { name: '全部', exact: true }).click();
  await expect(page.locator('.note-card')).toHaveCount(7);
  await page.keyboard.press('Control+k');
  const search=page.getByRole('textbox', { name: '搜索笔记内容' });
  await expect(search).toBeFocused();
  await search.fill('不存在的关键词 xyz_314159');
  await expect(page.getByText('没有找到相关笔记，试试更短的关键词。')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('article headings, highlighted code, clipboard and theme are usable', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await page.setViewportSize({width:1440,height:1000});
  await page.goto('/notes/tool-guard/');
  await expect(page.locator('pre.shiki').first()).toBeVisible();
  await page.getByRole('button', {name:'复制代码',exact:true}).first().click();
  await expect.poll(()=>page.evaluate(()=>navigator.clipboard.readText())).toContain('npm ci');
  const toc=page.getByRole('navigation',{name:'本文目录',exact:true});
  await toc.getByRole('link',{name:'应满足的约束',exact:true}).click();
  await expect(page).toHaveURL(/#应满足的约束|#%E5%BA%94/);
  await page.getByRole('button',{name:'切换到深色主题'}).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await page.setViewportSize({width:390,height:844});
  await page.locator('.mobile-toc summary').click();
  await expect(page.getByRole('navigation',{name:'本文目录（移动端）'})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('long tables and code remain inside a mobile article', async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/notes/software-delivery/');
  await expect(page.locator('article table').first()).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const wideTable=page.locator('article table').first();
  expect(await wideTable.evaluate(el=>getComputedStyle(el).overflowX)).toBe('auto');
});
