import { cp, rm, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { redirects } from "./redirects.mjs";
await rm("dist", { recursive: true, force: true });
await cp("out", "dist", { recursive: true });
for (const [from, to] of redirects) {
  const dir = path.join("dist", from);
  await mkdir(dir, { recursive: true });
  await writeFile(
    path.join(dir, "index.html"),
    `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=${to}"><link rel="canonical" href="https://luohaijiang789.github.io${to}"><title>页面已移动</title></head><body><a href="${to}">前往新地址</a></body></html>`,
  );
}
await writeFile("dist/.nojekyll", "");
console.log(`Static site prepared with ${redirects.size} legacy redirects.`);
