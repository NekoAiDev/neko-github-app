import type { HandlerContext } from "../types";

/** 内置默认打标签规则（仓库未配置 rules 时使用） */
const DEFAULT_RULES = [
  { label: "bug", match: "bug|错误|崩溃|crash|exception|异常", field: "both" },
  { label: "enhancement", match: "feature|建议|功能|增强|enhancement|需求", field: "both" },
  { label: "documentation", match: "doc|文档|readme", field: "both" },
  { label: "question", match: "question|疑问|提问|怎么|如何|为什么", field: "both" },
  { label: "good first issue", match: "good first|新手|入门|easy", field: "both" },
];

/** 根据标题/正文内容，自动给 Issue / PR 添加标签 */
export async function handleAutoLabel(ctx: HandlerContext): Promise<void> {
  if (!ctx.config.autoLabel.enabled) return;
  if (ctx.event !== "issues" && ctx.event !== "pull_request") return;
  const action = ctx.payload.action;
  if (!["opened", "edited", "reopened", "synchronize"].includes(action)) return;

  const item = ctx.event === "issues" ? ctx.payload.issue : ctx.payload.pull_request;
  const repo = ctx.payload.repository;
  const owner = repo.owner.login;
  const repoName = repo.name;
  const number = item.number;
  const title: string = item.title || "";
  const body: string = item.body || "";

  const rules =
    ctx.config.autoLabel.rules && ctx.config.autoLabel.rules.length
      ? ctx.config.autoLabel.rules
      : DEFAULT_RULES;

  const toAdd: string[] = [];
  for (const r of rules) {
    const field = r.field ?? "both";
    const haystack = field === "title" ? title : field === "body" ? body : `${title} ${body}`;
    if (new RegExp(r.match, "i").test(haystack)) toAdd.push(r.label);
  }
  if (toAdd.length === 0) return;

  const existing = new Set((item.labels || []).map((l: any) => (typeof l === "string" ? l : l.name)));
  const adds = Array.from(new Set(toAdd)).filter((l) => !existing.has(l));
  if (adds.length === 0) return;

  try {
    await ctx.octokit.rest.issues.addLabels({ owner, repo: repoName, issue_number: number, labels: adds });
  } catch (e) {
    console.error("[autoLabel] failed:", e);
  }
}
