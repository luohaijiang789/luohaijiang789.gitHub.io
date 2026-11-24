# 海江的笔记

基于 **Next.js 16 + React 19 + TypeScript + MDX** 的个人笔记空间。单一笔记目录，支持全文搜索、主题筛选、手机阅读、文章目录、代码高亮与复制、深浅主题。纯静态导出，继续部署到 GitHub Pages。

## 开发与验证

Node.js 22.23.4+，依赖由 `package-lock.json` 固定。

```sh
npm ci
npm run dev
npm run verify
npx playwright install chromium
npm run test:e2e
npm run preview
```

`verify` 包含 TypeScript、授权与历史数据单元测试、Next.js 生产构建、站内链接/锚点检查。浏览器测试基于 `dist/`，运行前先构建。`preview` 监听 4321 端口。

## 架构

- `src/app/`：App Router 页面、全局布局和响应式样式。
- `src/components/`：React 客户端组件；Radix Dialog 负责搜索与移动菜单的焦点、键盘及可访问性。
- `src/content/docs/notes/`：Markdown / MDX 正文，首页、侧栏、搜索均从此生成。
- `src/lib/content.ts`：构建时读取内容、MDX 编译、标题目录和 Shiki 高亮。只接受仓库内可信内容，不执行访问者提供的 MDX。
- `src/lib/policy.mjs`：教学授权模型，演示与测试共用。
- `src/lib/progress.mjs`、`src/data/review-cards.*`：历史 v1 数据兼容，不驱动阅读界面。
- `scripts/postbuild.mjs`：将 Next.js 的 `out/` 整理成 `dist/`，生成旧地址跳转和 `.nojekyll`。
- `archive/legacy-jekyll/`：原始博客源码，保留但不参与构建。

## 添加笔记

在 `src/content/docs/notes/` 新建 `.md` 或 `.mdx`：

```md
---
title: 一个具体问题
description: 这篇笔记解决什么问题。
topic: 工程基础
sidebar:
  order: 8
---

## 问题与原理
## 示例与验证
## 局限与参考
```

普通文章不需要导入组件。MDX 可直接使用 `<PolicyDemo />`，其组件映射集中维护。代码块自动高亮、可复制；二三级标题自动生成目录。图片放 `public/illustrations/`，注明来源、尺寸与替代文字。

技术结论引用原始文档，不捏造已完成的实验。共享讨论导入记录见 `docs/sources/`。英语模块、课程、路径和打卡界面不恢复。

## 兼容与部署

旧笔记地址与博客地址由 `scripts/redirects.mjs` 维护静态跳转。关于页提供历史 `haijiang-lab:v1` 数据导入/导出，不自动删除本地记录，不上传个人数据。

`.github/workflows/pages-deploy.yml` 验证并发布 `dist/`；无需 Next.js 服务端或另一家托管服务。GitHub Pages 不支持请求时的数据库/API/登录逻辑，未来若需要再明确设计后端。

按维护者约定：阶段完成后先 fetch，检查通过后自动提交并推送，不强推；确认 GitHub Actions 和线上页面。地址为 `https://luohaijiang789.github.io`。

## 框架选型

2026-11-24 核对 GitHub：Next.js 143,630 Star，Nuxt 61,093，VitePress 18,521。这个比较针对完整网站框架，不把 React 这样的 UI 库混作同一类别，也不声称 Next.js 是所有开源项目中 Star 最多的项目。

- [Next.js 仓库](https://github.com/vercel/next.js)
- [官方静态导出说明](https://nextjs.org/docs/app/guides/static-exports)
- [MDX 编译器](https://mdxjs.com/packages/mdx/)
