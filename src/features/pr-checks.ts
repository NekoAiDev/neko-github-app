import type { HandlerContext } from "../types";

/** 对 PR 做基础体检，提示草稿、目标分支异常、改动过大等情况 */
export async function handlePrChecks(ctx: HandlerContext): Promise<void> {
  if (!ctx.config.prChecks.enabled) return;
  if (ctx.event !== "pull_request") return;
  const action = ctx.payload.action;
  if (!["opened", "reopened", "synchronize"].includes(action)) return;

  const pr = ctx.payload.pull_request;
  const owner = ctx.payload.repository.owner.login;
  const repo = ctx.payload.repository.name;
  const items: string[] = [];

  if (pr.draft) {
    items.push("这是一个草稿（Draft）PR，准备好后再请求评审喵~");
  }
  if (pr.base.ref !== pr.base.repo.default_branch) {
    items.push(
      `目标分支是 \`${pr.base.ref}\`（非默认分支 \`${pr.base.repo.default_branch}\`），请确认是否符合预期。`
    );
  }
  if ((pr.additions || 0) + (pr.deletions || 0) > 1000) {
    items.push("改动量较大（超过 1000 行），建议拆分成多个小 PR 便于评审。");
  }
  if (items.length === 0) return;

  const body = `🔍 **PR 自动检查提示**\n\n- ` + items.join("\n- ");
  try {
    await ctx.octokit.rest.issues.createComment({ owner, repo, issue_number: pr.number, body });
  } catch (e) {
    console.error("[prChecks] failed:", e);
  }
}
