import { Hono } from "hono";
import { verify } from "@octokit/webhooks-methods";
import { dispatch } from "./webhook";
import { scanStale } from "./features/stale";
import { homepage, docsPage, docsStartPage, privacyPage, termsPage } from "./site";
import type { Env } from "./types";

const app = new Hono<{ Bindings: Env }>();

// 解析语言：优先 ?lang= 查询参数（并写入 cookie 记住选择），其次 cookie，默认英文
function getLang(c: any): "en" | "zh" {
  const q = c.req.query("lang");
  if (q === "zh" || q === "en") {
    c.header("Set-Cookie", `lang=${q}; path=/; max-age=31536000; samesite=lax`);
    return q;
  }
  const ck = c.req.header("cookie") || "";
  if (ck.includes("lang=zh")) return "zh";
  return "en";
}

// 官网主站：app.nekoaidev.top/ （默认英文，?lang=zh 切中文）
app.get("/", (c) => c.html(homepage(getLang(c))));

// 文档主页：app.nekoaidev.top/docs
app.get("/docs", (c) => c.html(docsPage(getLang(c))));

// 文档内容页：app.nekoaidev.top/docs/start
app.get("/docs/start", (c) => c.html(docsStartPage(getLang(c))));

// 隐私政策（默认英文，可切中文）
app.get("/privacy", (c) => c.html(privacyPage(getLang(c))));

// 服务条款（默认英文，可切中文）
app.get("/terms", (c) => c.html(termsPage(getLang(c))));

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
