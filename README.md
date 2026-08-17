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

### 1. Create the GitHub App
- **Way A (recommended)**: use `manifest.json` in this repo as a template at `https://github.com/settings/apps/new`.
- **Way B**: manually create at `GitHub → Settings → Developer settings → GitHub Apps → New GitHub App` (see `manifest.json` for permissions/events).

Note the **App ID** and the generated **private key (PEM)**, and set a **Webhook secret**.

### 2. Configure secrets
```bash
cd neko-github-app
# Put App ID into [vars] APP_ID in wrangler.toml (or use a secret)
wrangler secret put WEBHOOK_SECRET
cat private-key.pem | wrangler secret put PRIVATE_KEY
```

### 3. Deploy
```bash
npm install
wrangler deploy
```
After deploy you get a `*.workers.dev` address (or bind your own domain, e.g. `app.nekoaidev.top`). Set it as the GitHub App's **Webhook URL**.

### 4. Install
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

## Publish to GitHub Marketplace

1. Set **Public = true** in App settings, and fill in name, description, and logo.
2. Use a stable public **Webhook URL** (a custom domain is recommended).
3. Go to `Developer settings → GitHub Apps → Your App → Marketplace` and submit, choosing the **Free** plan.

---

## Local Dev

GitHub cannot deliver webhooks to `localhost`, so use [smee.io](https://smee.io) as a tunnel during development:

```bash
npm install -g smee-client
smee -u https://smee.io/your-channel -t http://localhost:8787/
wrangler dev   # in another terminal
```

Then set the smee forwarding URL as the App's Webhook URL for local debugging.

---

## Docs

Full documentation: `https://app.nekoaidev.top/docs/start` (English by default, with a Chinese toggle).

---

## License

MIT © NekoAiDev
