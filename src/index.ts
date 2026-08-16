import { Hono } from "hono";
import { verify } from "@octokit/webhooks-methods";
import { dispatch } from "./webhook";
import { scanStale } from "./features/stale";
import { homepage, docsPage, docsStartPage, privacyPage, termsPage } from "./site";
import type { Env } from "./types";

const app = new Hono<{ Bindings: Env }>();

// 官网主站：app.nekoaidev.top/
app.get("/", (c) => c.html(homepage()));

// 文档主页：app.nekoaidev.top/docs
app.get("/docs", (c) => c.html(docsPage()));

// 文档内容页：app.nekoaidev.top/docs/start
app.get("/docs/start", (c) => c.html(docsStartPage()));

// 隐私政策（英文，Marketplace 必填）
app.get("/privacy", (c) => c.html(privacyPage()));

// 服务条款（英文，Marketplace 必填）
app.get("/terms", (c) => c.html(termsPage()));

app.get("/health", (c) => c.json({ ok: true, ts: Date.now() }));

// 手动触发「陈旧 Issue 扫描」：不依赖 Cloudflare 付费 cron，
// 主人可用一条 curl 触发，或挂到免费外部定时器（cron-job.org 等）实现准定时效果。
app.post("/tasks/stale", async (c) => {
  const key = c.req.header("x-neko-task-key");
  if (!key || key !== c.env.WEBHOOK_SECRET) {
    return c.text("unauthorized", 401);
  }
  c.executionCtx?.waitUntil(scanStale(c.env) as Promise<void>);
  return c.json({ ok: true, message: "stale scan triggered" });
});

app.post("/", async (c) => {
  const sig = c.req.header("x-hub-signature-256");
  const event = c.req.header("x-github-event");
  const raw = await c.req.text();
  if (!sig || !event) {
    return c.text("missing headers", 400);
  }
  const valid = await verify(c.env.WEBHOOK_SECRET, raw, sig).catch(() => false);
  if (!valid) {
    return c.text("invalid signature", 401);
  }
  let payload: any;
  try {
    payload = JSON.parse(raw);
  } catch {
    return c.text("invalid json", 400);
  }
  return dispatch(c.env, event, payload);
});

export default {
  fetch: app.fetch,
  async scheduled(_controller: unknown, env: unknown, _ctx: unknown) {
    await scanStale(env as Env);
  },
};
