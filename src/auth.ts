import { Octokit } from "octokit";
import { createAppAuth } from "@octokit/auth-app";
import type { Env } from "./types";

/** 安装级 token 缓存，减少重复签发 */
const installationTokenCache = new Map<number, { token: string; expires: number }>();
const TOKEN_TTL = 50 * 60 * 1000; // 略小于 GitHub 的 1 小时有效期

/**
 * 获取某个安装（installation）的 Octokit 客户端。
 * 安装级 token 只能操作该安装下的仓库，权限遵循 App 被授予的范围。
 */
export async function getInstallationOctokit(installationId: number, env: Env): Promise<Octokit> {
  const cached = installationTokenCache.get(installationId);
  const now = Date.now();
  let token: string;
  if (cached && cached.expires > now + 60_000) {
    token = cached.token;
  } else {
    const auth = createAppAuth({ appId: env.APP_ID, privateKey: env.PRIVATE_KEY });
    const result = await auth({ type: "installation", installationId });
    token = result.token;
    installationTokenCache.set(installationId, { token, expires: now + TOKEN_TTL });
  }
  return new Octokit({ auth: token });
}

/**
 * 获取 App 级（JWT）Octokit 客户端，用于列出安装、列出安装下的仓库等管理操作。
 * 注意：App 级 token 不能读写仓库内容，只能做安装管理。
 */
export async function getAppOctokit(env: Env): Promise<Octokit> {
  const auth = createAppAuth({ appId: env.APP_ID, privateKey: env.PRIVATE_KEY });
  const result = await auth({ type: "app" });
  return new Octokit({ auth: result.token });
}
