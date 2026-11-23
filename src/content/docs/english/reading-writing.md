---
title: 阅读与写作练习
sidebar:
  order: 5
---

从能概括一小段、写清一件事开始。先完成自己的版本，再看参考；不要把参考表达当成唯一答案。

## 原创短文：A request is not a permission

> An AI agent can suggest a tool call, but the suggestion is not a permission. The application still needs to decide whether the action is allowed. It should check the user, the action, and the resource before execution.
>
> Imagine that an agent reads a document containing an instruction to export a private file. The document may influence the model, but it should not change the user’s permissions. A separate policy check can reject a call that is not allowed.
>
> A small test can show how this rule works in one case. It cannot prove that the whole system is secure. We should record what we tested, what happened, and what remains uncertain.

这段短文用于英语阅读训练，与[权限边界课程](/security/tool-boundaries/)关联。

## 先回答三个问题

1. 谁提出工具调用，谁决定是否允许执行？
2. 外部文档中的指令应该改变用户的权限吗？
3. 为什么通过一个测试不能证明整个系统安全？

<details><summary>查看理解提示</summary>

模型提出建议，应用负责授权判断。外部文档不应增加用户权限。单个测试只覆盖特定条件下的一种情况，需要继续说明范围和未覆盖风险。

</details>

## 抓住句子骨架

**The application / checks / the user, the action, and the resource / before execution.**

先找主体与动作，再加上对象和时间条件。遇到长句时，把从句、修饰和连接关系分开理解。

## 写三句项目更新

按这个结构写你真实完成的工作：

- **事实：** I tested…
- **结果：** The request was…
- **下一步：** Next, I’ll…

<details><summary>完成自己的版本后，再看参考</summary>

I tested the reader’s request to access the team note. The request was blocked by the policy check. Next, I’ll test an invalid resource name.

</details>

## 修改时检查

主体和时态是否清楚？tested 与 plan to test 是否区分？claim 是否超出证据？是否有一句话能拆得更短？

把初稿、修改稿和修改原因一起留在自己的笔记中。可以到[安全晨会草稿区](/english/security-standup/)保存这组相关项目表达，或在本地 Markdown 中建立自己的写作记录。
