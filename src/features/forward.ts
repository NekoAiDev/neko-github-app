import type { HandlerContext } from "../types";

/**
 * Webhook 中转：把事件原样转发到任意外部系统（如主人已有的 Worker、消息队列等）。
 * - config.forward.url 为空则不转发；
 * - config.forward.events 非空时只转发列表内的事件；
 * - 若配置了 secret，会在请求头带上 x-neko-signature 便于接收方校验。
 */
export async function handleForward(ctx: HandlerContext): Promise<void> {
  const fwd = ctx.config.forward;
  if (!fwd || !fwd.url) return;
  if (fwd.events && fwd.events.length && !fwd.events.includes(ctx.event)) return;
  try {
    const headers: Record<string, string> = { "content-type": "application/json" };
    if (fwd.secret) headers["x-neko-signature"] = fwd.secret;
    await fetch(fwd.url, {
      method: "POST",
      headers,
      body: JSON.stringify({ event: ctx.event, payload: ctx.payload }),
    });
  } catch (e) {
    console.error("[forward] failed:", e);
  }
}
