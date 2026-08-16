import type { HandlerContext } from "../types";

/** 新 Issue / PR 创建时，自动回复一段欢迎语（不回复机器人，如 Dependabot） */
export async function handleAutoReply(ctx: HandlerContext): Promise<void> {
  if (!ctx.config.autoReply.enabled) return;
  if (ctx.event !== "issues" && ctx.event !== "pull_request") return;
  if (ctx.payload.action !== "opened") return;

  const item = ctx.event === "issues" ? ctx.payload.issue : ctx.payload.pull_request;
  if (item.user?.type === "Bot") return;

  const owner = ctx.payload.repository.owner.login;
  const repo = ctx.payload.repository.name;
  const number = item.number;

  try {
    await ctx.octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: number,
      body: ctx.config.autoReply.template,
    });
  } catch (e) {
    console.error("[autoReply] failed:", e);
  }
}
