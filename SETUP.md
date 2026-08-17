# Neko GitHub App — Create & Deploy Guide

This guide is for creating the GitHub App manually on the GitHub website (the deploy/bot cannot click through the GitHub UI login for you, so this step is done by the repo owner). The whole process is free and requires no server.

---

## Step 1: Create the App on GitHub

1. Open **GitHub → top-right avatar → Settings → Developer settings → GitHub Apps → New GitHub App**
   (direct link: `https://github.com/settings/apps/new`)
2. Fill in the basics:
   - **GitHub App name**: `Neko GitHub App` (or any globally-unique name you like)
   - **Homepage URL**: `https://github.com/NekoAiDev/neko-github-app`
   - **Description**: `Multi-feature GitHub automation: auto-label / auto-reply / stale cleanup / release notify / PR checks / webhook forward`
3. **Callback URL / Redirect URL**: temporarily `https://app.nekoaidev.top/` (replace with your real domain after deploy; for local dev use the smee URL)
4. **Webhook**:
   - Check **Active**
   - **Webhook URL**: temporarily `https://app.nekoaidev.top/` (replace after deploy)
   - **Webhook secret**: click `Generate a secret` to create a random string, **copy and save it** (you will use it with `wrangler secret put WEBHOOK_SECRET`)
5. **Repository permissions**, set as follows:
   - Issues: **Read and write**
   - Pull requests: **Read and write**
   - Contents: **Read-only**
   - Metadata: **Read-only**
   - Releases: **Read-only**
6. **Subscribe to events**, check:
   - `Issues`
   - `Issue comment`
   - `Pull request`
   - `Pull request review`
   - `Release`
   - `Push` (optional)
7. **Where can this GitHub App be installed?**: choose **Any account** (for public Marketplace listing) or **Only on this account** (personal use only)
8. Click **Create GitHub App**
9. After creation:
   - Note the **App ID** on the page (looks like `123456`)
   - In the **Private keys** section click **Generate a private key**; a `*.pem` file downloads — **this is your `PRIVATE_KEY`**
   - Note the **Webhook secret** (generated in step 4)

> 💡 These fields map exactly to `manifest.json` in this repo; you can also just follow the manifest.

---

## Step 2: Inject secrets into Cloudflare

```bash
cd neko-github-app

# 1) Put App ID into [vars] APP_ID in wrangler.toml (open in an editor and replace REPLACE_WITH_YOUR_APP_ID)
#    or use a secret instead:
wrangler secret put APP_ID

# 2) Webhook secret (from step 4)
wrangler secret put WEBHOOK_SECRET

# 3) Private key (from the .pem downloaded in step 9; pipe the whole file to keep newlines)
cat ~/Downloads/your-app.pem | wrangler secret put PRIVATE_KEY
```

> The private key contains newlines; `cat file | wrangler secret put PRIVATE_KEY` preserves them. Do not copy-paste manually — newlines are easily lost.

---

## Step 3: Deploy to Cloudflare

```bash
npm install
wrangler deploy
```

On success you get an address like `https://neko-github-app.<subdomain>.workers.dev`.

**Bind a custom domain (recommended — reachable and stable from China):**

Edit `wrangler.toml`, uncomment and set your domain:
```toml
routes = [{ pattern = "app.nekoaidev.top", custom_domain = true }]
```
Then re-run `wrangler deploy`, and add a CNAME in Cloudflare DNS pointing the domain at the Worker (Cloudflare will prompt you).

After deploy, set the final public address (custom domain or `*.workers.dev`) back into:
- The GitHub App setting **Webhook URL**
- (if using smee for local dev) the smee forwarding URL for local debugging

---

## Step 4: Install & Verify

1. On the App settings page click **Install App** (or `https://github.com/apps/<your-app-slug>/installations/new`).
2. Choose the org/repo to install and complete authorization.
3. Trigger an action to verify: e.g. create an issue with "bug" in the title in some repo — it should be auto-labeled `bug` and receive a welcome comment.
4. Visiting `https://your-domain/health` should return `{"ok":true,...}`; visiting `https://your-domain/` should show the homepage.

---

## Step 5 (optional): List on Marketplace

1. Set **Public = true** in App settings, and complete the logo and description (English/Chinese).
2. Make sure the Webhook URL is a fixed public address (a custom domain is best).
3. Submit at `Developer settings → GitHub Apps → Your App → Marketplace`, choosing the **Free** plan.
4. Reuse the English/Chinese intro from this repo's README for the listing copy.

---

## FAQ

- **No webhook received?** Check that the Webhook URL is publicly reachable, that `WEBHOOK_SECRET` matches, and review the Worker logs (enable observability in wrangler).
- **Token / permission error?** Go back to App settings → Permissions and confirm Issues/PRs are write, then reinstall so permissions take effect.
- **Stale not working?** Stale scanning runs on a daily external timer, not in real time; check `stale.enabled` and `days`.
- **Local debugging?** Use smee.io to forward GitHub webhooks to your `wrangler dev` local port (see README "Local Dev").
