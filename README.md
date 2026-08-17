[English](README.md) · [中文](README.zh-CN.md)

# Neko GitHub App

> A free, open-source GitHub App that automates your repositories, running entirely on Cloudflare Workers.

**Neko GitHub App** is a GitHub App built on **Cloudflare Workers (free tier)**. It bundles several repository automation features into a single app and can be published to the GitHub Marketplace.

---

## Features

| Feature | Description |
| --- | --- |
| Auto-label | Label issues/PRs by regex matching on title/body (`bug`, `feature`, etc.) |
| Auto-reply | Post a welcome comment on new issues/PRs (skips bots) |
| Stale cleanup | Mark long-inactive issues with a `stale` label + comment |
| Release notify | Push release notices to your configured channels (Feishu/WeCom/DingTalk/Webhook) |
| PR checks | Comment on PRs that are draft, target the wrong branch, or are too large |
| Webhook forward | Forward raw GitHub events to any external system |

All features are configurable per repository via `.github/neko-app.yml`. With no config, everything is on by default.

---

## Architecture

```
GitHub ──webhook(HTTPS)──▶ Cloudflare Worker (Hono)
                              ├─ Verify HMAC signature (x-hub-signature-256)
                              ├─ Read .github/neko-app.yml config
                              ├─ Route to feature modules (auto-label / reply / stale / release / pr / forward)
                              └─ (optional) external timer scans stale issues daily
```

- **Runtime**: Cloudflare Workers (free tier is enough for personal/small-team use)
- **Framework**: Hono (lightweight, first-class Worker support)
- **GitHub SDK**: Octokit + `@octokit/auth-app` (App JWT / installation token)
- **Config**: per-repo YAML; no config means all defaults enabled

---

## Quick Start

### 1. Install
On the App settings page click **Install App** and choose the org/repo to install.

---

## Repository Config

Create `.github/neko-app.yml` in a repo (see `.github/neko-app.yml` in this repo for a full example):

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

With no config, all features use built-in defaults and are enabled.

---

## Docs

Full documentation: `https://app.nekoaidev.top/docs/start` (English by default, with a Chinese toggle).

---

## License

MIT © NekoAiDev
