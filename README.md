# 海江 · Learning Lab

面向 **AI × 安全专业发展、英语沟通与海外工作** 的个人学习网站。以学习路径连接知识、场景练习、项目与复盘。基于 Astro + Starlight，静态部署到 GitHub Pages。

## 本地开发

需要 Node.js **22.23.4+**（见 `.nvmrc`）。

```sh
npm ci
npm run dev
```

打开终端显示的本地地址，默认 `http://localhost:4321`。

```sh
npm run verify      # Astro 类型检查、规则与复习测试、生产构建、站内链接/锚点检查
npx playwright install chromium
npm run test:e2e    # 基于生产构建的桌面/手机交互测试；先运行 verify
npm run preview    # 预览 dist 中的生产构建
```

## 内容结构

```text
src/content/docs/
  foundations/     # 网络、系统、编程与工程基础
  security/        # AI 系统安全与 AI 辅助安全
  english/         # 图解场景、词族、听读与输出练习
  thinking/        # 推理、证据、沟通与复盘
  design/          # 审美、排版与技术图解
  global/          # 岗位研究与海外职业准备
  paths/           # 连接多个领域的学习路径
  projects/        # 可复现的实践题目与成果
  review.mdx       # 复习与备份
src/components/    # 工作台、图解练习与交互组件
src/data/garden.ts # 领域入口、路径步骤、复习卡片
src/lib/           # 本地进度与教学权限模型
public/illustrations/ # 自托管 SVG 图解
archive/legacy-jekyll/ # 原网站源文件，保留但不参与构建
```

## 添加笔记

在相应领域创建 `.md`；需要交互组件时使用 `.mdx`。领域内侧边栏自动生成。

```md
---
title: 一次具体的学习问题
description: 要解决什么，以及如何验证。
sidebar:
  order: 2
---

## 问题
## 我的理解
## 练习与证据
## 局限与下一步
## 原始参考
```

内部链接采用根路径并带尾斜线，如 `/security/tool-boundaries/`。添加图解时提供准确的替代说明。练习模板不写成作者已完成的职业经历。

英语内容优先采用场景、常用搭配、主动回忆与迁移练习。词根词缀只在构词关系可靠时使用；记忆联想与真实词源分开。英文朗读使用浏览器语音，取决于系统支持。

海外流程按国家/地区和目的区分，保留官方来源、适用条件、核验日期和不确定项。公开仓库不保存个人申请材料。

## 添加卡片或路径步骤

1. 修改 `src/data/garden.ts` 的卡片或步骤。
2. 在 `src/lib/progress.mjs` 的 `CARD_IDS` / `STEP_IDS` 中添加稳定 ID，保持向后兼容。
3. 补充相关测试并运行 `npm run verify`。

当前复习安排为：不熟悉时 10 分钟后；连续记住后依次 1、3、7、14、30 天。它是透明的简单安排，不是个性化记忆模型。

## 本地数据

使用 localStorage 键 `haijiang-lab:v1` 保存完成步骤、卡片时间和英语草稿。无账号、无远端进度同步。复习页支持导出/导入 JSON；导入前校验版本、数据与文件大小，覆盖前要求确认。禁用存储或配额不足时给出失败提示。切换设备前导出备份。

## 发布

`.github/workflows/pages-deploy.yml` 对 PR 运行验证，对 main/master 推送运行验证并发布 `dist/`。仓库 **Settings → Pages → Source** 应选择 **GitHub Actions**。构建依赖使用已提交的 `package-lock.json` 和 `npm ci`。

站点地址配置在 `astro.config.mjs`。如迁移到项目子路径，需要一起调整根路径链接与 Astro base；当前实现面向 `luohaijiang789.github.io` 根站点。

重构前的文章源文件完整保留在 `archive/legacy-jekyll/`。原文章路径和分类入口生成静态跳转到 `/archive/`。旧 Chirpy Service Worker 通过同名替换脚本退出，只清除 `chirpy-` 前缀缓存，避免旧站离线缓存遮住新站。

## 维护重点

- 先增加真实学习成果，再扩展功能；每条路径应有可检验的输出。
- 技术结论保留证据与局限，优先引用原始文档。
- 不给未实现功能放入口，不展示虚构的学习数据。
- 改交互后运行浏览器测试；改卡片排程或授权规则后运行相应单元测试。
- 发布前运行完整验证。旧新闻未经重新核验，不直接迁入知识库。
