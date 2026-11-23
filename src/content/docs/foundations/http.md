---
title: 图解一次 HTTP 请求与权限检查
description: 从浏览器请求理解身份认证、授权，以及服务器为什么要独立检查权限。
sidebar:
  order: 1
---

## 从一个问题开始

你已经登录了笔记网站，能否把地址中的文件编号换成另一个编号，就读到别人的笔记？**是否登录，与是否有权访问该资源，是两个问题。**

```text
浏览器发出请求
    │ GET /notes/team-note
    ▼
服务器核验会话 ── 无有效身份 ── 拒绝或进入登录流程
    │
    ▼
检查：这个用户能读取这份笔记吗？ ── 无授权 ── 拒绝
    │ 明确允许
    ▼
读取资源并返回响应
```

HTTP 用请求与响应传递信息。身份核验和资源授权由应用及其基础设施实现，不能仅靠页面上“有没有显示按钮”来保护数据。

## 身份认证与授权

| 概念 | 核心问题 | 例子 |
| --- | --- | --- |
| Authentication · 身份认证 | Who are you? | 核验登录会话对应的用户 |
| Authorization · 授权 | What are you allowed to do? | 判断该用户能否读取 team-note |

权限检查应针对当前调用者、操作和资源进行。知道一个文件名或编号，并不等于获得它的访问权。

## 动手练习

1. 在浏览器开发者工具的 Network 面板观察你自己网站的一次页面请求。
2. 找出请求方法、URL、响应状态和内容类型。
3. 画出“客户端 → 服务端 → 资源”，标出身份与授权检查位置。
4. 说明服务器在哪一步检查用户是否有权读取这条笔记。

本网站是公开静态站，内容无需登录即可阅读；这里讨论的权限流程用于理解带有受保护资源的应用。

## 检验理解

先自己回答，再展开。

<details><summary>前端隐藏“删除”按钮，能阻止未授权删除吗？</summary>

不能。调用者可能直接构造请求。服务端必须独立检查当前用户能否删除目标资源。

</details>

## 继续学习

把“服务器的检查”迁移到[智能体执行工具之前](/security/tool-boundaries/)。

参考：[MDN：HTTP 概览](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview)、[OWASP：授权检查指南](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)。
