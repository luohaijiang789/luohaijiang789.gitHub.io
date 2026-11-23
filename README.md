# 海江 · Learning Lab

面向计算机基础、AI 安全和可复现实验的技术学习网站。Astro + Starlight，部署到 GitHub Pages。

## 开发与验证

需要 Node.js 22.23.4+。

```sh
npm ci
npm run dev
npm run verify
npx playwright install chromium
npm run test:e2e
```

`verify` 运行类型检查、单元测试、生产构建和站内链接/锚点检查。浏览器测试基于生产构建，覆盖导航、手机布局、权限演示、进度、复习与备份。

## 内容与数据

- `src/content/docs/`：专业基础、AI 安全、思维、审美、海外职业、项目与路径；领域侧栏自动生成。
- `src/data/garden.ts`：首页入口和路径；步骤 ID 与 `src/lib/progress.mjs` 中的白名单保持一致。
- `src/data/review-cards.mjs`：技术复习卡片和专题；新卡片使用新 ID，避免继承旧课程的掌握状态。
- `src/lib/`：本地进度与教学权限规则。
- `public/illustrations/`：可自托管的图解。
- `archive/legacy-jekyll/`：原 Jekyll 源文件，不参与构建；旧文章链接跳转到 `/archive/`。

文章用 Markdown，需要交互时用 MDX。保留问题、原理、验证方法、局限和原始参考。内部链接用根路径和尾斜线；图像需要替代文字与来源。不要捏造学习成果。

英语模块按用户要求删除，不再发布课程、词表、场景或搜索条目。`haijiang-lab:v1` 存储键保持不变，旧草稿和记录仅在备份兼容层保留，不出现在当前复习卡片中。复习安排为 10 分钟或 1、3、7、14、30 天；不是个性化记忆预测。个人笔记、路径与卡片记录支持 JSON 导入/导出，无账号或远程同步。

## 发布

`.github/workflows/pages-deploy.yml` 对 PR 验证，对主分支推送验证并发布 `dist/`。Pages Source 使用 GitHub Actions。每个完成且验证通过的阶段自动提交和推送：先 fetch，不强推，之后检查工作流和线上页面。

根站点为 `https://luohaijiang789.github.io`。原 Chirpy Service Worker 的退出脚本只清理旧 `chirpy-` 缓存。
