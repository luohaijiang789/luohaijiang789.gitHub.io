---
title: GitHub 项目怎么安装：从 npm、npx 到 Docker
description: 按交付物、依赖管理、命令执行和隔离边界，理解 GitHub 项目的安装与运行方式。
sidebar:
  order: 2
---

看到 README 同时出现 `git clone`、`npm ci`、`docker build`，先不要把它们当成三选一。**它们可能分别负责获取源码、安装依赖和构建镜像。**

本文整理自[自己的安装方式讨论与修正记录](https://chatgpt.com/share/6b03f80e-19cc-83ea-871f-807a0b2291ef)，采用会话后半段修正后的分类。命令是理解用途的示例，具体运行条件以目标仓库的说明为准。

## 先看交付物，再看命令

| 你拿到什么 | 常见入口 | 接下来做什么 |
|---|---|---|
| 源码和版本历史 | `git clone` | 读构建说明、安装依赖、构建或启动 |
| 源码快照 | Download ZIP | 解压后同样需要项目工具链；没有 Git 历史 |
| 语言包 | npm / PyPI 等包仓库 | 作为项目依赖，或执行包提供的 CLI |
| 预编译程序 | GitHub Releases 的资产 | 核对系统和 CPU 架构，安装或直接运行 |
| 系统软件包 | brew / apt / winget / scoop | 由相应包管理器安装、升级与卸载 |
| 容器镜像 | 镜像仓库或 Dockerfile | 配置端口、存储和权限，启动容器 |

这是**不同职责的分类**，不是封装程度依次升高的五层结构。包管理器也可能从源码构建；容器构建也可能调用语言包管理器。

## 安装与执行方式对比

### Node.js：安装依赖与运行命令

| 命令 | 核心职责 | 文件与环境 | 常见用途 |
|---|---|---|---|
| `npm install axios` | 添加项目依赖 | 更新项目清单和锁文件，安装到项目环境 | 代码里使用一个库 |
| `npm install` | 安装项目声明的依赖 | 使用清单和锁文件；可能更新锁文件 | 开发时安装与更新依赖 |
| `npm ci` | 根据已有锁文件安装完整项目 | 清除现有 node_modules；清单与锁文件不一致则报错；不改写清单或锁文件 | CI、干净的构建环境 |
| `npm install -g typescript` | 安装到 npm 的全局前缀 | 命令目录还需要在 PATH 中 | 长期使用的 CLI |
| `npx prettier --check .` | 运行包提供的命令 | 可以使用项目本地包；缺少时可能获取到 npm 缓存 | 项目工具、临时执行 |
| `pnpm install` / `yarn install` | 另一套 Node 项目包管理流程 | 使用各自锁文件和依赖布局 | 遵循仓库已有工具链 |
| `pnpm dlx` / `bunx` | 获取并执行 CLI | 有自己的缓存与执行规则 | 一次性工具或脚手架 |
| `bun install` / `bun run` | 安装依赖或运行脚本 | Bun 同时提供运行时等能力 | 明确支持 Bun 的项目 |

现代 `npx` 基于 `npm exec`。**“临时运行”通常表示无需全局安装，不表示零下载、零缓存或没有副作用。** 运行 npm 包仍会执行代码，不提供安全沙箱。[npm：npx](https://docs.npmjs.com/cli/v11/commands/npx/)

`npm ci` 固定依赖解析的依据，不保证操作系统、运行时、安装脚本结果和外部服务完全相同。需要同时保留相关配置和环境版本。[npm：npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci/)

项目已经使用哪一种包管理器，就先沿用其锁文件和 README。不要为了试命令在同一次安装中混用多套锁文件。

### Python：包、项目环境与工具环境

| 命令或工具 | 安装到哪里 / 做什么 | 与其他方式的区别 |
|---|---|---|
| `python -m pip install requests` | 安装到该 Python 解释器对应的环境 | 使用 `python -m pip` 明确解释器；是否隔离取决于环境 |
| `python -m venv .venv` | 创建 Python 虚拟环境 | 隔离包依赖，不隔离进程权限 |
| `pipx install httpie` | 为 CLI 建立独立虚拟环境并暴露命令 | 适合长期使用的 Python 应用，不用来给当前项目添加库 |
| `uv sync` | 同步 uv 项目的依赖环境 | 使用项目元数据与锁文件；CI 可按项目策略使用锁定选项 |
| `uv run python main.py` | 在项目环境中运行程序 | 不等于 npm 的脚本名称机制，只是用途上有相似之处 |
| `uvx ruff check .` | 在工具环境中运行 CLI | 是 `uv tool run` 的别名；环境会缓存 |

虚拟环境里的程序通常仍能以当前用户权限访问文件与网络。**依赖互不冲突，和恶意代码受到限制，是两个不同问题。** [Python：venv](https://docs.python.org/3/library/venv.html)、[uv：工具执行](https://docs.astral.sh/uv/guides/tools/)

### 系统包、成品程序与源码

| 方式 | 优势 | 需要自己确认 |
|---|---|---|
| brew / apt / winget / scoop | 安装、升级与卸载有统一入口 | 软件源、支持平台、实际版本与维护方式 |
| Release Binary | 作者提供已构建的程序，可能无需本机编译工具链 | CPU 架构、动态库、校验信息、升级方案；没有天然的进程隔离 |
| `go install` / `cargo install` | 使用语言工具链获取并构建 CLI | 工具链版本、包来源、构建依赖和命令所在路径 |
| `git clone` 后构建 | 可以修改、调试、固定源码版本 | 依赖、编译器、构建步骤；clone 本身不启动应用 |
| 安装脚本 | 自动执行一系列安装步骤 | 脚本内容、下载来源、提权、写入位置和卸载方式 |

Release 中的 **Source code.zip 不等于预编译资产**。二进制也不一定静态链接全部依赖，下载后仍可能缺少运行库。[GitHub：Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)

## Docker 和 Compose 分别负责什么？

**镜像是应用及运行依赖的打包产物；容器是基于镜像创建的运行实例。** Dockerfile 描述镜像构建步骤；`docker run` 创建并启动容器；Compose 用声明式配置管理服务、网络和卷，也可以只管理一个服务。

| 入口 | 管理对象 | 配置关注点 |
|---|---|---|
| `docker build` | 从构建上下文生成镜像 | 基础镜像、依赖安装、复制文件、启动命令 |
| `docker run` | 一个容器实例 | 端口、环境变量、卷、用户、网络与资源限制 |
| `docker compose up` | Compose 应用中的服务 | 服务之间的配置、网络、持久化与生命周期 |

Linux 容器共享其运行宿主的内核。Docker Desktop 在 macOS / Windows 上运行 Linux 容器通常涉及 Linux 虚拟机，不能把每个容器都理解成一台完整虚拟机。Compose 提供配置管理，不额外赋予“更高的安全隔离等级”。[Docker：容器概念](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/)、[Compose 应用模型](https://docs.docker.com/compose/intro/compose-application-model/)

### 多种工具怎样出现在同一个项目里？

```text
仓库源码 ── git clone ──→ 本地构建上下文
                             │
                     Dockerfile 描述步骤
                             │
                        docker build
                             │
                  构建时执行 npm ci 等步骤
                             │
                          应用镜像
                             │
                ┌────────────┴────────────┐
             docker run             docker compose up
                │                        │
             容器实例                配置中的服务
```

这是一个可能的交付流程。也可以直接拉取已经构建好的镜像，或者完全不使用容器。**选工具要看项目交付什么、维护者支持什么，以及你要修改还是运行。**

## 按自己的目标选一条路径

| 目标 | 先检查什么 | 可能适用的路径 |
|---|---|---|
| 偶尔运行 CLI | 是否发布了可信语言包，运行时是否可用 | npx / uvx，或现成二进制 |
| 经常使用 CLI | 官方支持的平台、升级与卸载方式 | 系统包管理器、pipx、Release 等 |
| 学习或二次开发 | 仓库的工具链、锁文件与测试说明 | clone + 项目工具链；也可使用开发容器 |
| 自托管服务 | 官方支持的部署方式、存储、端口和资源需求 | 原生程序 + 进程管理，或容器部署 |
| 管理多个配套服务 | 配置能否统一维护，服务如何持久化和备份 | 官方 Compose 配置或其他受支持方案 |

不要仅因为是服务就强行 Docker 化，也不要把 `npm run dev` 当作所有项目的生产部署方式。开发、构建和生产启动脚本应分别阅读。

## 安全检查：来源、权限、维护

1. **来源：** 核对发布者、包名、镜像来源与架构。哈希只有来自可信渠道时才有校验意义。
2. **依赖：** 记录版本与锁文件。锁定版本帮助复现，但不意味着该版本没有漏洞。
3. **执行：** 检查安装脚本及其权限；容器重点检查宿主目录挂载、特权模式、Docker socket 和网络暴露。
4. **维护：** 安装之前想清楚如何升级、备份、回滚和卸载，包括数据卷中的内容。

容器隔离取决于运行配置及宿主安全。把宿主敏感目录或 Docker socket 暴露给容器，会改变其可访问范围。[Docker Engine 安全说明](https://docs.docker.com/engine/security/)

## 用一个真实仓库检验理解

在本网站仓库中查看 `package.json`、`package-lock.json` 与 `.github/workflows/pages-deploy.yml`，回答：

- clone 以后，哪个命令安装依赖，哪个命令构建，哪个目录是最终产物？
- 为什么这里保留锁文件并在 CI 中使用 `npm ci`？
- 是否必须使用 Docker？依据来自哪里？

**参考：** `npm ci` 安装依赖，`npm run build` 生成 `dist/`，GitHub Actions 将静态产物部署到 Pages。当前流程不要求 Docker；这是本仓库的实现，不是所有 GitHub 项目的通用要求。

保留环境、命令与结果，再继续[工具调用的信任边界](/notes/tool-boundaries/)，将“运行一个工具”和“授权一个工具”联系起来。
