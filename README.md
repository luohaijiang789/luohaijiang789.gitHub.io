# 海江的笔记

单一目录的个人笔记网站。首页列出全部笔记，正文统一放在 `src/content/docs/notes/`，支持全文搜索、深浅主题和手机阅读。基于 Astro + Starlight，继续使用 GitHub Pages。

## 开发与验证

需要 Node.js 22.23.4+。

```sh
npm ci
npm run dev
npm run verify
npx playwright install chromium
npm run test:e2e
```

`verify` 包含类型检查、单元测试、生产构建和站内链接/锚点检查。修改导航或交互后，在构建完成后运行浏览器测试。

## 添加笔记

在 `src/content/docs/notes/` 添加 `.md` 或 `.mdx`。侧栏与首页从同一内容集合生成，无需维护第二份目录。使用有意义的稳定文件名，必要时通过 `sidebar.order` 调整顺序。

```md
---
title: 一个具体问题
description: 这篇笔记解决什么问题。
sidebar:
  order: 8
---

## 问题与原理
## 示例与验证
## 局限与参考
```

图解保存在 `public/illustrations/`，需要替代文字与来源。技术说明保留原始参考，不捏造已完成的实验。共享讨论的导入记录在 `docs/sources/`。

## 历史兼容

原领域文章重定向到 `/notes/` 下的对应笔记，旧工作台入口跳转到目录。英语模块不恢复。原学习路径、卡片和打卡界面已移除。

`src/lib/progress.mjs` 与 `src/data/review-cards.*` 仅用于历史 v1 数据兼容，不再驱动阅读流程。关于页保留本地 JSON 导入/导出；不自动清理 `haijiang-lab:v1`，不上传数据。

`archive/legacy-jekyll/` 保留原博客源文件，不参与构建；旧文章跳转至 `/archive/`。

## 发布

每个验证通过的阶段自动提交并推送主分支，先 fetch、不强推，再检查 GitHub Actions 与线上页面。`.github/workflows/pages-deploy.yml` 构建并部署 `dist/`，保持根站点 `https://luohaijiang789.github.io`。
