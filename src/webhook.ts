import { getInstallationOctokit } from "./auth";
import { loadConfig } from "./config";
import type { Env, HandlerContext } from "./types";
import { handleAutoLabel } from "./features/auto-label";
import { handleAutoReply } from "./features/auto-reply";
import { handleStale } from "./features/stale";
import { handleReleaseNotify } from "./features/release-notify";
import { handlePrChecks } from "./features/pr-checks";
import { handleForward } from "./features/forward";

/**
 * 事件分发中枢：
 * 1. 处理 ping（GitHub 创建 webhook 时的连通性测试）。
 * 2. 取出安装信息，构造安装级 Octokit。
 * 3. 读取仓库配置，按事件类型路由到对应功能模块。
 * 4. forward（Webhook 中转）对所有事件生效（受 events 过滤）。
 */
export async function dispatch(env: Env, event: string, payload: any): Promise<Response> {
  if (event === "ping") {
    return new Response(JSON.stringify({ ok: true, zen: payload?.zen ?? "meow" }), {
      headers: { "content-type": "application/json" },
    });
  }

  const installationId = payload?.installation?.id;
  if (!installationId) {
    return new Response("no installation", { status: 200 });
  }

  const owner = payload?.repository?.owner?.login;
  const repo = payload?.repository?.name;
  if (!owner || !repo) {
    return new Response("no repository", { status: 200 });
  }

  const octokit = await getInstallationOctokit(installationId, env);
  const config = await loadConfig(octokit, owner, repo);
  if (!config.enabled) {
    return new Response("app disabled for this repo", { status: 200 });
  }

  const ctx: HandlerContext = { octokit, event, payload, config };

  try {
    switch (event) {
      case "issues":
        await handleAutoLabel(ctx);
        await handleAutoReply(ctx);
        await handleStale(ctx);
        break;
      case "issue_comment":
        await handleStale(ctx);
        break;
      case "pull_request":
        await handleAutoLabel(ctx);
        await handlePrChecks(ctx);
        break;
      case "release":
        await handleReleaseNotify(ctx);
        break;
      default:
        break;
    }
    // Webhook 中转对所有事件生效（受 config.forward.events 过滤）
    await handleForward(ctx);
  } catch (e) {
    console.error("[dispatch] error:", e);
    return new Response("internal error", { status: 500 });
  }

  return new Response("ok", { status: 200 });
}
