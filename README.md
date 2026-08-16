# 🐱 Neko GitHub App

> 一只住在 Cloudflare Worker 里的猫娘机器人，帮你自动打理 GitHub 仓库。
> A cat-girl bot living in a Cloudflare Worker that automates your GitHub repositories.

**Neko GitHub App** 是一个基于 **Cloudflare Worker（免费）** 运行的 GitHub App，把多种仓库自动化能力聚合到一个应用里，可公开发布到 GitHub Marketplace。

---

## ✨ 功能特性 / Features

| 功能 | 说明 | Feature |
| --- | --- | --- |
| 自动打标签 | 按标题/正文正则匹配，自动给 Issue / PR 打 `bug`、`feature` 等标签 | Auto-label issues/PRs by regex on title/body |
| 自动回复 | 新 Issue / PR 创建时自动回复欢迎语（不回复机器人） | Auto-reply welcome message on new issues/PRs |
| 陈旧清理 | 每日定时扫描，给长期无活动的 Issue 打 `stale` 标签 | Daily cron marks stale issues |
| Release 通知 | 新版本发布时推送到你配置的通知通道 | Push release notices to configured channels |
| PR 检查 | 提示草稿、目标分支异常、改动过大等情况 | PR health checks (draft/target branch/size) |
| Webhook 中转 | 把事件原样转发到任意外部系统 | Forward events to any external system |

全部能力均可通过仓库内 `.github/neko-app.yml` 配置开关与参数。

All features are configurable via `.github/neko-app.yml` in each repo.

---

## 🏗️ 架构 / Architecture

```
GitHub ──webhook(HTTPS)──▶ Cloudflare Worker (Hono)
                              ├─ 验证 HMAC 签名 (x-hub-signature-256)
                              ├─ 读取 .github/neko-app.yml 配置
                              ├─ 路由到功能模块 (auto-label / reply / stale / release / pr / forward)
                              └─ Cron Trigger 每日扫描陈旧 Issue
```

- **运行环境**：Cloudflare Workers（免费额度足够个人/小团队）
- **Web 框架**：Hono（轻量、对 Worker 一等支持）
- **GitHub SDK**：Octokit + `@octokit/auth-app`（App JWT / 安装 token）
- **配置**：仓库级 YAML，无配置时全部默认开启

**Runtime**: Cloudflare Workers · **Framework**: Hono · **SDK**: Octokit · **Config**: per-repo YAML.

---

## 🚀 快速开始 / Quick Start

### 1. 创建 GitHub App / Create the GitHub App
有两种方式 / Two ways:
- **方式 A（推荐）**：在仓库根目录的 `manifest.json` 基础上，访问 `https://github.com/settings/apps/new` 按 manifest 字段填写（见 `SETUP.md`）。
- **Way A (recommended)**: use `manifest.json` as a template at `https://github.com/settings/apps/new`.
- **方式 B**：在 `GitHub → Settings → Developer settings → GitHub Apps → New GitHub App` 手动填写，权限与事件见 `manifest.json`。
- **Way B**: manually create at `GitHub → Settings → Developer settings → GitHub Apps → New GitHub App` (see `manifest.json` for permissions/events).

记下 **App ID** 与生成的 **私钥 (PEM)**，并设置一个 **Webhook secret**。

### 2. 配置密钥 / Configure Secrets
```bash
cd neko-github-app
# 把 App ID 写进 wrangler.toml 的 [vars] APP_ID（或直接用 secret）
wrangler secret put WEBHOOK_SECRET
cat private-key.pem | wrangler secret put PRIVATE_KEY
```

### 3. 部署 / Deploy
```bash
npm install
wrangler deploy
```
部署后你会得到一个 `*.workers.dev` 地址（或绑定自己的域名，如 `app.nekoaidev.top`）。把它填回 GitHub App 的 **Webhook URL**。

### 4. 安装到仓库 / Install
在 App 设置页点击 **Install App**，选择要安装的组织/仓库即可。

---

## ⚙️ 仓库级配置 / Repo Config

在仓库创建 `.github/neko-app.yml`（示例见 `.github/neko-app.yml`）：

```yaml
enabled: true
autoLabel:
  enabled: true
  rules:
    - label: "bug"
      match: "bug|错误|崩溃"
      field: both
releaseNotify:
  enabled: true
  channels:
    - name: "my-worker"
      url: "https://your-notify.example.com/webhook"
forward:
  url: "https://another-system.example.com/github"
  secret: "可选签名"
  events: ["issues", "pull_request"]
```

不写任何配置时，全部功能使用内置默认值且开启。

---

## 🛒 上架 GitHub Marketplace / Publish to Marketplace

1. 在 App 设置中把 **Public** 设为 true，并完善名称、描述、Logo。
2. 固定一个公网可达的 **Webhook URL**（建议绑定自定义域名）。
3. 进入 `Developer settings → GitHub Apps → 你的 App → Marketplace` 提交上架，选择 **Free** 价格。
4. 填写上架文案（可直接复用本 README 的中英文介绍）。

---

## 🧪 本地开发 / Local Dev

GitHub 无法把 webhook 推到 `localhost`，开发期用 [smee.io](https://smee.io) 做隧道：

```bash
npm install -g smee-client
smee -u https://smee.io/你的频道 -t http://localhost:8787/
wrangler dev   # 另一个终端
```

然后把 smee 提供的转发地址填到 App 的 Webhook URL 即可本地调试。

---

## 📄 许可证 / License

MIT © NekoAiDev
