# GitHub Marketplace 发布指南

> **说明**：本指南已从线上文档 `/docs/start` 移除，整理为本地参考文档。
> Marketplace 审核已提交通过，以下内容留档备用。

要将 App 发布到 GitHub Marketplace 并公开上架，需要在 App 设置页面完成以下三项必填内容。以下是每项的**可直接复制粘贴**的填写模板：

## 1. 制定计划（Plan）⚠️ 必填

这一项要求你描述 App 的定价计划。由于本 App 完全免费，直接复制以下内容粘贴进去：

```
# 计划名称
Free

# 定价
$0 / 月（永久免费）

# 描述
Neko GitHub App 是一款完全免费的 GitHub 自动化工具。
它运行于 Cloudflare Workers 免费额度内，用户无需支付任何费用。
所有功能（自动标签、欢迎回复、陈旧清理、Release 通知、PR 检查、Webhook 中转）
均包含在 Free 计划中，无任何限制或付费墙。

# 试用
无需试用期。安装即用，全部功能立即可用。

# 付款方式
无需绑定付款方式。Free 计划不产生任何费用。
```

**关键点**：选 Free 计划类型，描述里明确说明免费原因（Cloudflare Workers 免费额度），不需要填写付款信息或试用期。

## 2. 安全和隐私信息（Security & Privacy）⚠️ 必填

这一项要求说明 App 如何处理用户数据和安全性。以下模板可直接复制粘贴：

```
## 数据收集声明
Neko GitHub App 不主动收集、存储或传输任何用户个人数据（PII）。
App 仅处理 GitHub 仓库元数据（Issue 标题、正文、标签名、PR 信息、Release 摘要），
这些数据属于仓库层面的技术信息，不涉及用户个人身份信息。

## 数据处理方式
- App 通过 GitHub Webhook 接收事件 payload（Issue/PR/Release 元数据的 JSON）
- 所有处理逻辑在 Cloudflare Worker 内存中完成，不落盘持久化用户数据
- 不访问、不存储用户姓名、邮箱、IP 地址、地理位置等个人信息
- 用户配置文件（.github/neko-app.yml）存储在用户自己的 GitHub 仓库中，
  App 仅在每次事件触发时读取，不做持久化缓存

## 第三方服务依赖
- Cloudflare Workers（计算平台）：用于运行 App 代码，处理 Webhook 请求
- GitHub API（通过 Octokit SDK）：用于读写 Issues/PR/Labels/Comments
- 用户自行配置的通知通道 URL（可选）：仅转发 Release 摘要 JSON，
  目标服务由用户自行选择和管理

## 安全措施
- Webhook 请求验证：通过 @octokit/webhooks-methods 库验证每个请求的
  X-Hub-Signature-256 头（HMAC-SHA256），确保请求确实来自 GitHub
- 密钥存储：App 私钥（PRIVATE_KEY）和 Webhook Secret（WEBHOOK_SECRET）
  通过 Cloudflare Workers Secrets 加密存储，不以明文出现在代码或日志中
- 最小权限原则：仅请求 Issues/Pull Requests 读写权限、
  Contents/Metadata/Releases 只读权限，不多求任何额外权限
- 无 Cookie / 无 Session / 无追踪：App 不使用 Cookie、不建立用户会话、
  不嵌入任何第三方分析代码或追踪脚本
- 无数据外传：除了用户显式配置的通知通道 URL 外，
  App 不会将任何数据发送到第三方服务器

## 合规声明
- App 不处理 GDPR（通用数据保护条例）适用范围内的个人数据，
  因为仅操作 GitHub 仓库的技术元数据（Issue 标题/正文/标签/PR 差异/Release 版本号），
  这些不属于 PII（个人身份信息）
- App 不处理 CCPA（加州消费者隐私法）定义的个人信息
- 用户可通过卸载 App 或设置 enabled: false 立即停止数据处理
- 如有数据安全问题反馈，请通过 GitHub App 页面联系维护者
```

**重点**：审核最看重的是「是否收集个人数据」「密钥如何存储」「是否验证 Webhook 签名」「第三方服务有哪些」。以上模板已覆盖所有审核要点。

## 3. 建立 webhook（Setup webhook）⚠️ 必填

这一项要求说明 App 的 Webhook 端点已正确配置并能正常接收事件。直接复制：

```
# Webhook URL（公网可达地址）
https://app.nekoaidev.top/

# Content Type
application/json

# Secret
已在部署时通过 wrangler secret put WEBHOOK_SECRET 注入 Cloudflare Workers Secrets。
请在下方填写你在 GitHub App 设置 → General → Webhook secret 中生成的那个 secret 值。
（就是那一串以 == 结尾的 base64 字符串）

# SSL/TLS
是。Cloudflare 自动提供有效的 TLS 证书（Let's Encrypt 或 DigiCert）。
App 强制使用 HTTPS，不支持明文 HTTP。

# 验证方式
App 使用 @octokit/webhooks-methods 库（GitHub 官方维护）验证每个入站请求：
- 读取请求头 X-Hub-Signature-256
- 用 WEBHOOK_SECRET 对原始请求体做 HMAC-SHA256 计算
- 对比签名是否一致
- 签名不匹配的请求直接返回 401，不做任何处理

# 测试方法（证明 webhook 正常工作）
方法 A —— 在线测试：
1. 登录 GitHub → 进入你的 App 设置页面
2. 找到 "Recent deliveries" 区域
3. 点击最近一条投递记录查看详情
4. 确认状态码为 200 或 201
5. 可点击 "Redeliver" 按钮重发测试

方法 B —— 实际操作测试：
1. 将 App 安装到一个测试仓库
2. 在该仓库新建一个 Issue（标题随便写）
3. 观察 Issue 是否自动被打了标签 + 收到了欢迎评论
4. 如果都有 → webhook 工作正常 ✓

方法 C —— 健康检查端点：
1. 浏览器打开 https://app.nekoaidev.top/health
2. 应看到 {"ok":true,"ts":...} 的 JSON 响应
3. 说明 Worker 在线且正常运行
```

**注意**：「建立 webhook」实际上是在确认你的 Worker 能正常接收 GitHub 推送的事件。只要你的 Worker 已部署（`wrangler deploy` 成功）、App 已安装到某个仓库、且 Recent deliveries 里能看到 2xx 状态码，这一项就算满足。把上面内容粘贴进去即可。

## 发布前最终检查清单

三项必填都完成后，还需要确认以下几点才能提交审核：

- **App 图标**：上传一张 512x512 的 PNG 图标（建议用网站 logo 的变体，保持视觉一致）。
- **简短描述**（Summary，不超过 125 字符）：
  `Automated issue labeling, welcome replies, stale cleanup, release notifications, PR checks, and webhook forwarding for GitHub repositories.`
- **详细描述**（Description）：可复制官网 Hero 区域的文字。
- **开源文件**：勾选此项，填写仓库地址（仓库创建后补上 URL 即可）。
- **隐私政策 URL**：`https://app.nekoaidev.top/privacy`（本页已部署，可直接填）。
- **服务条款 URL**：`https://app.nekoaidev.top/terms`（本页已部署，可直接填）。
- **勾选开发者政策确认**：确认 App 符合 GitHub Marketplace 政策。

全部完成后点击底部的**「Draft / Submit for review」**（草稿/提交审核）。GitHub 团队通常在 **2-4 个工作日**内完成审核。审核通过后 App 即在 GitHub Marketplace 公开展示。

> 如果审核被拒（常见原因：安全隐私信息不够详细），参照上方「安全和隐私信息」模板补充后重新提交即可。大部分被拒案例都是因为这一项写得不够具体。
