import { sendNotification } from "../notify";
import type { HandlerContext } from "../types";

/** Release 发布后，把通知推送到配置的所有通道 */
export async function handleReleaseNotify(ctx: HandlerContext): Promise<void> {
  if (!ctx.config.releaseNotify.enabled) return;
  if (ctx.event !== "release") return;
  if (ctx.payload.action !== "published") return;

  const release = ctx.payload.release;
  const repo = ctx.payload.repository;
  await sendNotification(ctx.config, {
    title: `📦 ${repo.full_name} 发布 ${release.tag_name}`,
    body: release.body || release.name || "新版本发布",
    repo: repo.full_name,
    url: release.html_url,
  });
}
