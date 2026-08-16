import { getAppOctokit, getInstallationOctokit } from "../auth";
import { loadConfig } from "../config";
import type { Env, HandlerContext } from "../types";

function hasLabel(labels: any[], label: string): boolean {
  return (labels || []).some((l) => (typeof l === "string" ? l : l.name) === label);
}

async function removeStaleLabel(ctx: HandlerContext, number: number, label: string): Promise<void> {
  try {
    await ctx.octokit.rest.issues.removeLabel({
      owner: ctx.payload.repository.owner.login,
      repo: ctx.payload.repository.name,
      issue_number: number,
      name: label,
    });
  } catch (e) {
    console.error("[stale] remove failed:", e);
  }
}

/**
 * Webhook 场景下的陈旧标签处理：
 * - 人类在 Issue 下评论 → 视为复活，移除 stale 标签；
 * - Issue 被关闭 / 重开 → 移除 stale 标签。
 */
export async function handleStale(ctx: HandlerContext): Promise<void> {
  if (!ctx.config.stale.enabled) return;
  const label = ctx.config.stale.label;

  if (ctx.event === "issue_comment" && ctx.payload.action === "created") {
    const comment = ctx.payload.comment;
    if (comment.user?.type === "Bot") return; // 机器人评论不触发复活
    const issue = ctx.payload.issue;
    if (!issue || !hasLabel(issue.labels, label)) return;
    await removeStaleLabel(ctx, issue.number, label);
    return;
  }

  if (ctx.event === "issues" && (ctx.payload.action === "closed" || ctx.payload.action === "reopened")) {
    const issue = ctx.payload.issue;
    if (!hasLabel(issue.labels, label)) return;
    await removeStaleLabel(ctx, issue.number, label);
  }
}

/**
 * 定时场景（Cloudflare Cron）：遍历该 App 的所有安装与仓库，
 * 把超过阈值天数无活动的开放 Issue 标记为 stale。
 */
export async function scanStale(env: Env): Promise<void> {
  const appOctokit = await getAppOctokit(env);
  let installations;
  try {
    installations = await appOctokit.paginate(appOctokit.rest.apps.listInstallations);
  } catch (e) {
    console.error("[stale] list installations failed:", e);
    return;
  }

  for (const inst of installations) {
    const instId = inst.id;
    try {
      const octokit = await getInstallationOctokit(instId, env);
      // 用安装 token 列出该安装可见的仓库（等价于 GET /installation/repositories）
      const repos = (await octokit.paginate("GET /installation/repositories")) as Array<{
        owner: { login: string };
        name: string;
      }>;
      for (const repo of repos) {
        const config = await loadConfig(octokit, repo.owner.login, repo.name);
        if (!config.enabled || !config.stale.enabled) continue;
        const days = config.stale.days || 30;
        const threshold = Date.now() - days * 86400_000;
        const since = new Date(threshold).toISOString();
        const issues = await octokit.paginate(octokit.rest.issues.listForRepo, {
          owner: repo.owner.login,
          repo: repo.name,
          state: "open",
          since,
        });
        for (const issue of issues) {
          if ((issue as any).pull_request) continue; // 跳过 PR
          const updated = new Date(issue.updated_at).getTime();
          if (updated < threshold && !hasLabel(issue.labels as any[], config.stale.label)) {
            try {
              await octokit.rest.issues.addLabels({
                owner: repo.owner.login,
                repo: repo.name,
                issue_number: issue.number,
                labels: [config.stale.label],
              });
              if (config.stale.message) {
                await octokit.rest.issues.createComment({
                  owner: repo.owner.login,
                  repo: repo.name,
                  issue_number: issue.number,
                  body: config.stale.message,
                });
              }
            } catch (e) {
              console.error("[stale] label failed:", e);
            }
          }
        }
      }
    } catch (e) {
      console.error(`[stale] install ${instId} failed:`, e);
    }
  }
}
