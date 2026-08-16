import type { Octokit } from "octokit";

/** Worker 环境变量绑定（非敏感项写在 wrangler.toml，敏感项走 secret） */
export interface Env {
  APP_ID: string;
  WEBHOOK_SECRET: string;
  PRIVATE_KEY: string;
}

/** 自动打标签的单条规则 */
export interface AutoLabelRule {
  label: string;
  /** 正则（大小写不敏感） */
  match: string;
  /** 在哪个字段里匹配 */
  field?: "title" | "body" | "both";
}

export interface AutoLabelConfig {
  enabled: boolean;
  rules?: AutoLabelRule[];
}

export interface AutoReplyConfig {
  enabled: boolean;
  template: string;
}

export interface StaleConfig {
  enabled: boolean;
  /** 多少天无活动视为陈旧 */
  days: number;
  label: string;
  message: string;
}

export interface ReleaseNotifyConfig {
  enabled: boolean;
  /** 通知通道：每个通道是一个可接收 JSON POST 的 URL（如主人已有的 Worker / IM 机器人） */
  channels: { name: string; url: string }[];
}

export interface PrChecksConfig {
  enabled: boolean;
}

export interface ForwardConfig {
  url: string;
  /** 转发时附加的签名，方便接收方校验 */
  secret?: string;
  /** 只转发这些事件；为空则转发全部 */
  events?: string[];
}

/** 仓库级配置（.github/neko-app.yml 解析后的结构） */
export interface AppConfig {
  enabled: boolean;
  autoLabel: AutoLabelConfig;
  autoReply: AutoReplyConfig;
  stale: StaleConfig;
  releaseNotify: ReleaseNotifyConfig;
  prChecks: PrChecksConfig;
  forward: ForwardConfig | null;
}

/** 传给各功能 handler 的上下文 */
export interface HandlerContext {
  octokit: Octokit;
  event: string;
  payload: any;
  config: AppConfig;
}
