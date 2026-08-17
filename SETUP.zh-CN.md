[English](SETUP.md) · 中文

# Neko GitHub App — 创建与部署指南（中文）

本指南用于在 GitHub 网站上手动创建 GitHub App（部署 / 机器人无法替你点击 GitHub 界面的登录流程，这一步需由仓库所有者本人完成）。整个过程免费，无需自备服务器。

---

## 第一步：在 GitHub 上创建 App

1. 打开 **GitHub → 右上角头像 → Settings → Developer settings → GitHub Apps → New GitHub App**
   （直达链接：`https://github.com/settings/apps/new`）
2. 填写基础信息：
   - **GitHub App name**：`Neko GitHub App`（或任何全局唯一的名称）
   - **Homepage URL**：`https://github.com/NekoAiDev/neko-github-app`
   - **Description**：`多功能的 GitHub 自动化：自动标签 / 自动回复 / 陈旧清理 / 发布通知 / PR 检查 / Webhook 转发`
3. **Callback URL / Redirect URL**：先填 `https://app.nekoaidev.top/`（部署后换成你的真实域名；本地开发用 smee 地址）
4. **Webhook**：
   - 勾选 **Active**
   - **Webhook URL**：先填 `https://app.nekoaidev.top/`（部署后替换）
   - **Webhook secret**：点击 `Generate a secret` 生成随机串，**复制并保存**（稍后配合 `wrangler secret put WEBHOOK_SECRET` 使用）
5. **Repository permissions**，按下设置：
   - Issues：**Read and write**
   - Pull requests：**Read and write**
   - Contents：**Read-only**
   - Metadata：**Read-only**
   - Releases：**Read-only**
6. **Subscribe to events**，勾选：
   - `Issues`
   - `Issue comment`
   - `Pull request`
   - `Pull request review`
   - `Release`
   - `Push`（可选）
7. **Where can this GitHub App be installed?**：选择 **Any account**（用于公开上架 Marketplace）或 **Only on this account**（仅自用）
8. 点击 **Create GitHub App**
9. 创建完成后：
   - 记下页面上的 **App ID**（形如 `123456`）
   - 在 **Private keys** 区域点击 **Generate a private key**，会下载一个 `*.pem` 文件——**这就是你的 `PRIVATE_KEY`**
   - 记下 **Webhook secret**（第 4 步生成）

> 这些字段与本仓库的 `manifest.json` 完全对应，你也可以直接照着 manifest 来填。

---

## 第二步：把密钥注入 Cloudflare

```bash
cd neko-github-app

# 1) 将 App ID 写入 wrangler.toml 的 [vars] APP_ID（用编辑器打开，替换 REPLACE_WITH_YOUR_APP_ID）
#    也可以改用 secret 方式：
wrangler secret put APP_ID

# 2) Webhook secret（来自第 4 步）
wrangler secret put WEBHOOK_SECRET

# 3) 私钥（来自第 9 步下载的 .pem；用管道传入以保留换行符）
cat ~/Downloads/your-app.pem | wrangler secret put PRIVATE_KEY
```

> 私钥含换行符；`cat file | wrangler secret put PRIVATE_KEY` 能保留换行。不要手动复制粘贴——换行极易丢失。

---

## 第三步：部署到 Cloudflare

```bash
npm install
wrangler deploy
```

成功后会得到类似 `https://neko-github-app.<subdomain>.workers.dev` 的地址。

**绑定自定义域名（推荐——国内可稳定访问）：**

编辑 `wrangler.toml`，取消注释并设置你的域名：
```toml
routes = [{ pattern = "app.nekoaidev.top", custom_domain = true }]
```
然后重新运行 `wrangler deploy`，并在 Cloudflare DNS 里添加一条 CNAME，把域名指向该 Worker（Cloudflare 会提示你操作）。

部署完成后，把最终公开地址（自定义域名或 `*.workers.dev`）回填到：
- GitHub App 设置里的 **Webhook URL**
- （若本地开发用 smee）本地调试用的 smee 转发地址

---

## 第四步：安装与验证

1. 在 App 设置页点击 **Install App**（或访问 `https://github.com/apps/<your-app-slug>/installations/new`）。
2. 选择要安装的组织 / 仓库并完成授权。
3. 触发一次动作来验证：例如在某个仓库新建一个标题含 "bug" 的 Issue——它应被自动打上 `bug` 标签并收到欢迎评论。
4. 访问 `https://your-domain/health` 应返回 `{"ok":true,...}`；访问 `https://your-domain/` 应显示首页。

---

## 第五步（可选）：上架 Marketplace

1. 在 App 设置中将 **Public** 设为 true，并补全图标与描述（中英文皆可）。
2. 确保 Webhook URL 是一个固定的公开地址（自定义域名最佳）。
3. 在 `Developer settings → GitHub Apps → Your App → Marketplace` 提交，选择 **Free** 方案。
4. 上架文案可直接复用本仓库 README 的中英文简介。

---

## 常见问题

- **收不到 webhook？** 检查 Webhook URL 是否公网可达、`WEBHOOK_SECRET` 是否一致，并查看 Worker 日志（在 wrangler 中开启可观测性）。
- **令牌 / 权限报错？** 回到 App 设置 → Permissions，确认 Issues / PRs 为可写，然后重新安装使权限生效。
- **陈旧清理不工作？** 陈旧扫描由外部定时器每日执行，并非实时；检查 `stale.enabled` 与 `days` 配置。
- **本地调试？** 用 smee.io 把 GitHub webhook 转发到你的 `wrangler dev` 本地端口（见 README 的「本地开发」）。
