import yaml from "js-yaml";
import { Octokit } from "octokit";
import type { AppConfig } from "./types";

/** 默认配置：未提供仓库级 neko-app.yml 时，全部功能开启（满足“功能全覆盖”需求） */
export const DEFAULT_CONFIG: AppConfig = {
  enabled: true,
  autoLabel: { enabled: true },
  autoReply: {
    enabled: true,
    template:
      "感谢你的提交喵~ 我们已经收到，会尽快处理。如有进展会在这里更新，请留意通知。\n\n" +
      "> 本回复由 Neko GitHub App 自动发送。",
  },
  stale: {
    enabled: true,
    days: 30,
    label: "stale",
    message:
      "此 Issue 已 30 天无活动，被标记为 stale（陈旧）。若有进展请评论，我们会移除标签；若长期无更新将关闭。喵~",
  },
  releaseNotify: { enabled: true, channels: [] },
  prChecks: { enabled: true },
  forward: null,
};

/** 把 base64（可能带换行/空格）解码成 UTF-8 文本，避免依赖 node Buffer */
function b64ToString(b64: string): string {
  const clean = b64.replace(/\s/g, "");
  const bin = atob(clean);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** 浅合并两个对象，后者覆盖前者（数组直接替换） */
function deepMerge<T>(base: T, override: Partial<T>): T {
  const out: any = Array.isArray(base) ? [...(base as any)] : { ...(base as any) };
  for (const key of Object.keys(override as any)) {
    const v = (override as any)[key];
    if (v === undefined) continue;
    if (
      v &&
      typeof v === "object" &&
      !Array.isArray(v) &&
      base &&
      typeof base === "object" &&
      (base as any)[key] &&
      typeof (base as any)[key] === "object" &&
      !Array.isArray((base as any)[key])
    ) {
      out[key] = deepMerge((base as any)[key], v);
    } else {
      out[key] = v;
    }
  }
  return out as T;
}

/**
 * 读取仓库内 .github/neko-app.yml 作为本仓库配置；
 * 读取失败（如文件不存在）时回退到默认配置。
 */
export async function loadConfig(octokit: Octokit, owner: string, repo: string): Promise<AppConfig> {
  try {
    const res = await octokit.rest.repos.getContent({ owner, repo, path: ".github/neko-app.yml" });
    if (!res.data || typeof res.data === "string" || !("content" in res.data)) {
      return DEFAULT_CONFIG;
    }
    const content = b64ToString((res.data as { content: string }).content);
    const parsed = yaml.load(content) as Partial<AppConfig> | null;
    if (!parsed) return DEFAULT_CONFIG;
    return deepMerge(DEFAULT_CONFIG, parsed);
  } catch {
    return DEFAULT_CONFIG;
  }
}
