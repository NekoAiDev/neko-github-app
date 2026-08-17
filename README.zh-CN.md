[English](README.md) · 中文

# Neko GitHub App（中文文档）

> 一个免费、开源的 GitHub App，自动化你的仓库，完全运行在 Cloudflare Workers 上。

**Neko GitHub App** 是一个基于 **Cloudflare Workers（免费额度）** 构建的 GitHub App。它将多个仓库自动化功能打包进一个 App，并可发布到 GitHub Marketplace。

---

## 功能特性

| 功能 | 说明 |
| --- | --- |
| 自动标签 | 按标题/正文的规则匹配，自动给 Issue / PR 打标签（如 `bug`、`feature` 等） |
| 自动回复 | 新建 Issue / PR 时自动发表欢迎评论（自动跳过机器人账号） |
| 陈旧清理 | 对长时间无活动的 Issue 打上 `stale` 标签并评论 |
| 发布通知 | 新版本发布时推送通知到你配置好的渠道（飞书 / 企业微信 / 钉钉 / Webhook） |
| PR 检查 | 对草稿态、目标分支错误、改动过大的 PR 自动评论 |
| Webhook 转发 | 将原始 GitHub 事件转发到任意外部系统 |

所有功能均可通过仓库内的 `.github/neko-app.yml` 单独配置。不写配置则全部默认开启。

---

## 架构

```
GitHub ──webhook(HTTPS)──▶ Cloudflare Worker (Hono)
                              ├─ 校验 HMAC 签名 (x-hub-signature-256)
                              ├─ 读取 .github/neko-app.yml 配置
                              ├─ 路由到功能模块 (auto-label / reply / stale / release / pr / forward)
                              └─ (可选) 外部定时器每日扫描陈旧 Issue
```

- **运行环境**：Cloudflare Workers（免费额度对个人 / 小团队足够）
- **框架**：Hono（轻量，对 Worker 支持一流）
- **GitHub SDK**：Octokit + `@octokit/auth-app`（App JWT / 安装令牌）
- **配置**：按仓库的 YAML，不配置则全部启用默认值

---

## 安装 GitHub App
在 App 设置页点击 **Install App**，选择要安装的组织 / 仓库。

---

## 仓库配置

在仓库内创建 `.github/neko-app.yml`（完整示例见本仓库的 `.github/neko-app.yml`）：

```yaml
enabled: true
autoLabel:
  enabled: true
  rules:
    - label: "bug"
      match: "bug|error|crash|exception"
      field: both
releaseNotify:
  enabled: true
  channels:
    - name: "my-worker"
      url: "https://your-notify.example.com/webhook"
forward:
  url: "https://another-system.example.com/github"
  secret: "optional-signing-secret"
  events: ["issues", "pull_request"]
```

不写配置时，所有功能使用内置默认值并全部开启。

---

## 完整文档

完整使用文档：`https://app.nekoaidev.top/docs/start?lang=zh`（网站默认可切换中文 / English）。

---

## 许可证

MIT © NekoAiDev
