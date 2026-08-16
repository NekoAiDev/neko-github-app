# Neko GitHub App 创建与部署步骤

本文件面向**手动在 GitHub 网页创建 App** 的场景（猫猫无法替主人在网页点击登录，因此这一步需要主人自己操作）。整个过程免费、无需服务器。

---

## 第一步：在 GitHub 创建 App

1. 打开 **GitHub → 右上角头像 → Settings → Developer settings → GitHub Apps → New GitHub App**
   （直达链接：`https://github.com/settings/apps/new`）
2. 填写基本信息：
   - **GitHub App name**：`Neko GitHub App`（或你喜欢的名字，需全局唯一）
   - **Homepage URL**：`https://github.com/NekoAiDev/neko-github-app`
   - **Description**：`多功能 GitHub 自动化：自动标签 / 自动回复 / 陈旧关闭 / Release 通知 / PR 检查 / Webhook 中转`
3. **Callback URL / Redirect URL**：先填 `https://app.nekoaidev.top/`（部署后换成你的实际域名；本地开发可填 smee 地址）
4. **Webhook**：
   - 勾选 **Active**
   - **Webhook URL**：先填 `https://app.nekoaidev.top/`（部署后换成实际地址）
   - **Webhook secret**：点 `Generate a secret` 生成一段随机串，**复制保存好**（稍后要用 `wrangler secret put WEBHOOK_SECRET`）
5. **Repository permissions（权限）**，按以下设置：
   - Issues: **Read and write**
   - Pull requests: **Read and write**
   - Contents: **Read-only**
   - Metadata: **Read-only**
   - Releases: **Read-only**
6. **Subscribe to events（订阅事件）**，勾选：
   - `Issues`
   - `Issue comment`
   - `Pull request`
   - `Pull request review`
   - `Release`
   - `Push`（可选）
7. **Where can this GitHub App be installed?**：选 **Any account（公开上架用）** 或 **Only on this account（仅自用）**
8. 点击 **Create GitHub App**
9. 创建成功后：
   - 记下页面上的 **App ID**（形如 `123456`）
   - 在 **Private keys** 区点击 **Generate a private key**，会下载一个 `*.pem` 文件，**这就是 `PRIVATE_KEY`**
   - 记下 **Webhook secret**（第 4 步生成的）

> 💡 这些字段和仓库里的 `manifest.json` 完全对应，也可以直接照着 manifest 填。

---

## 第二步：把密钥注入 Cloudflare

```bash
cd neko-github-app

# 1) 把 App ID 写进 wrangler.toml 的 [vars] APP_ID（用编辑器打开替换 REPLACE_WITH_YOUR_APP_ID）
#    或者也用 secret：
wrangler secret put APP_ID

# 2) Webhook secret（第一步第 4 步生成的）
wrangler secret put WEBHOOK_SECRET

# 3) 私钥（从第一步第 9 步下载的 .pem 文件，注意用管道整体传入，保留换行）
cat ~/Downloads/你的-app.pem | wrangler secret put PRIVATE_KEY
```

> 私钥含换行，`cat file | wrangler secret put PRIVATE_KEY` 能完整保留。不要手动复制粘贴，容易丢换行。

---

## 第三步：部署到 Cloudflare

```bash
npm install
wrangler deploy
```

部署成功会返回类似 `https://neko-github-app.<subdomain>.workers.dev` 的地址。

**绑定自定义域名（推荐，国内可达、稳定）：**
编辑 `wrangler.toml`，取消注释并改成你的域名：
```toml
routes = [{ pattern = "app.nekoaidev.top", custom_domain = true }]
```
然后重新 `wrangler deploy`，并在 Cloudflare DNS 给该域名加一条 CNAME 指向 Worker（Cloudflare 会自动提示）。

部署后，把最终的公网地址（自定义域名或 `*.workers.dev`）填回：
- GitHub App 设置里的 **Webhook URL**
- （若用了 smee 本地开发）本地调试时填 smee 转发地址

---

## 第四步：安装并验证

1. 在 App 设置页点 **Install App**（或 `https://github.com/apps/<你的app-slug>/installations/new`）。
2. 选择要安装的组织 / 仓库，完成授权。
3. 触发一个动作验证：比如在某个仓库新建一个标题含“bug”的 Issue，应当自动被打上 `bug` 标签并收到欢迎评论。
4. 访问 `https://你的域名/health` 应返回 `{"ok":true,...}`；访问 `https://你的域名/` 应看到猫娘首页。

---

## 第五步（可选）：上架 Marketplace

1. App 设置里 **Public = true**，补全 Logo、中文/英文描述。
2. 确保 Webhook URL 是固定公网地址（自定义域名最佳）。
3. `Developer settings → GitHub Apps → 你的 App → Marketplace` 提交，价格选 **Free**。
4. 上架文案直接复用仓库 README 的中英文介绍即可。

---

## 常见问题

- **webhook 收不到？** 检查 Webhook URL 是否公网可达、`WEBHOOK_SECRET` 是否一致、Worker 日志（wrangler 开了 observability）。
- **token 报错 / 权限不足？** 回到 App 设置的 Permissions 确认 Issue/PR 是 write，重新安装让权限生效。
- **stale 不生效？** 陈旧扫描走 Worker Cron（每天一次），不是实时；检查 `stale.enabled` 与 `days` 配置。
- **本地调试？** 用 smee.io 把 GitHub webhook 转接到 `wrangler dev` 的本地端口（见 README 本地开发一节）。
