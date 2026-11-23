import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('dist');
async function walk(dir) { const entries = await readdir(dir, { withFileTypes: true }); return (await Promise.all(entries.map(e => e.isDirectory() ? walk(path.join(dir, e.name)) : path.join(dir, e.name)))).flat(); }
const files = (await walk(root)).filter(p => p.endsWith('.html'));
const failures = [];
for (const file of files) {
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/(?:href|src)="([^"\s]+)"/g)) {
    const raw = match[1].replaceAll('&amp;', '&');
    if (/^(https?:|data:|mailto:|tel:|javascript:)/.test(raw)) continue;
    const url = new URL(raw, `https://local.test/${path.relative(root, file)}`);
    let target;
    try { target = path.join(root, decodeURIComponent(url.pathname)); } catch { failures.push(`${file}: invalid URL ${raw}`); continue; }
    if (!target.startsWith(root + path.sep) && target !== root) { failures.push(`${file}: escaped root ${raw}`); continue; }
    let data;
    try { const info = await stat(target); if (info.isDirectory()) target = path.join(target, 'index.html'); data = await readFile(target, 'utf8'); }
    catch { failures.push(`${path.relative(root, file)}: missing ${raw}`); continue; }
    if (url.hash && target.endsWith('.html')) {
      let id; try { id = decodeURIComponent(url.hash.slice(1)); } catch { id = url.hash.slice(1); }
      if (!data.includes(`id="${id}"`)) failures.push(`${path.relative(root, file)}: missing anchor ${raw}`);
    }
  }
}
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log(`Verified local links, assets and anchors across ${files.length} HTML pages.`);
