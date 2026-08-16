import type { AppConfig } from "./types";

export interface NotifyPayload {
  title: string;
  body: string;
  repo: string;
  url?: string;
}

/**
 * 把通知推送到配置的所有通道。
 * 通道是一个能接收 JSON POST 的 URL（例如主人已有的 Worker、企业微信/飞书/钉钉机器人等）。
 * 单个通道失败不影响其它通道。
 */
export async function sendNotification(config: AppConfig, payload: NotifyPayload): Promise<void> {
  const channels = config.releaseNotify?.channels ?? [];
  for (const ch of channels) {
    if (!ch.url) continue;
    try {
      await fetch(ch.url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...payload, channel: ch.name }),
      });
    } catch (e) {
      console.error(`[notify] channel ${ch.name} failed:`, e);
    }
  }
}
