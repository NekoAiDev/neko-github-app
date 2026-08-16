# Privacy Policy

**Last updated: August 16, 2026**

## 1. Overview

Neko GitHub App (the "App", "we", "us") is a free, open-source GitHub application that automates routine repository tasks such as issue labeling, welcome replies, stale issue management, release notifications, pull request checks, and webhook forwarding. The App runs entirely on Cloudflare Workers and processes data only when you install it on a repository.

## 2. Information We Process

The App does **not** collect, store, or transmit any personally identifiable information (PII) about you or your users.

The only data the App touches is **repository technical metadata** delivered by GitHub through webhooks:

- Issue and pull request titles, bodies, labels, comments, and statuses;
- Release metadata (version, name, notes, author);
- Repository name and the per-repository configuration file `.github/neko-app.yml`.

This data belongs to the repository and is technical in nature; it is not personal data.

## 3. How We Process Data

- GitHub delivers event payloads to our endpoint over HTTPS (webhooks).
- All processing happens **in-memory** inside the Cloudflare Worker. We do not persist, log, or store any payload data. Data is discarded immediately after the response is generated.
- The App reads the per-repository config file `.github/neko-app.yml` on each event. It is never cached or stored by us.

## 4. Data Sharing and Sub-processors

- We do **not** sell, rent, or share any data with third parties.
- The App only sends data when **you explicitly configure it**:
  - `releaseNotify.channels` — Release summaries are POSTed as JSON to URLs *you* provide (for example your own chat-bot webhook).
  - `forward.url` — GitHub event payloads are forwarded to a URL *you* specify.
- Sub-processors we rely on:
  - **Cloudflare Workers** — executes the App code and terminates TLS.
  - **GitHub API** (via the Octokit SDK) — reads and writes issues, pull requests, labels, and comments on your behalf, using only the permissions you granted.

## 5. Security

- Every inbound webhook is verified using HMAC-SHA256 against the `X-Hub-Signature-256` header. Requests with invalid signatures are rejected with HTTP 401.
- Secrets (the App private key and the webhook secret) are stored encrypted via Cloudflare Workers Secrets and never appear in source code or logs.
- The App requests only the minimum GitHub permissions required (Issues and Pull Requests read & write; Metadata, Contents, and Releases read).
- The App uses no cookies, no user sessions, and embeds no third-party analytics or tracking scripts.

## 6. Data Retention

We retain no user or repository data. Because processing is in-memory and ephemeral, no data persists after a request completes.

## 7. Your Rights and Choices

- You can stop all processing at any time by uninstalling the App or by setting `enabled: false` in `.github/neko-app.yml`.
- Because we do not store personal data, there is no personal data for us to access, correct, or delete.

## 8. Compliance

The App does not process personal data as defined under the GDPR or the CCPA, because it operates only on repository technical metadata. If you believe any personal data is involved, contact us and we will address it promptly.

## 9. Contact

For privacy questions, reach us through the GitHub App page or the project repository issues.

---

Live page: https://app.nekoaidev.top/privacy
