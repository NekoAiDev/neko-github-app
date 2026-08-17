/**
 * 站点页面：官网首页（GET /）、文档主页（GET /docs）、文档内容页（GET /docs/start）
 * 设计参考：AstrBot（astrbot.app / docs.astrbot.app）
 * 风格：简洁专业、大量留白、浅色为主、深色高对比、带动画
 * 图标：AstrBot 风格（蓝底渐变 + 白色机器人轮廓）
 * 两页文档结构：/docs 文档主页 /docs/start 内容页
 * 只保留左侧导航，删除右侧 TOC
 * 含 GitHub Marketplace 三项必填填写指南 + 常见问题 FAQ
 */

/* ══════════════════════════════════════
   共享样式 —— AstrBot 风格（带动画）
   ══════════════════════════════════════ */
const CSS = `
:root{
  --bg:#ffffff; --bg-sub:#f7f8fa; --bg-hover:#f0f1f4;
  --text:#1a1d26; --text2:#3d4250; --muted:#6b7280; --muted2:#9ca3af;
  --primary:#2563eb; --primary-dark:#1d4ed8; --primary-light:#dbeafe;
  --border:#e5e7eb; --border2:#d1d5db;
  --radius:12px; --radius-lg:16px;
  --shadow-sm:0 1px 3px rgba(0,0,0,.06),0 1px 2px rgba(0,0,0,.04);
  --shadow:0 4px 14px rgba(0,0,0,.07);
  --shadow-lg:0 10px 40px rgba(0,0,0,.10);
  --maxw:1120px;
}
[data-theme="dark"]{
  --bg:#0d1117; --bg-sub:#161b22; --bg-hover:#1c2333;
  --text:#e6edf3; --text2:#c9d1d9; --muted:#8b949e; --muted2:#484f58;
  --primary:#58a6ff; --primary-dark:#79c0ff; --primary-light:rgba(88,166,255,.12);
  --border:#30363d; --border2:#21262d;
  --shadow-sm:0 1px 3px rgba(0,0,0,.30);
  --shadow:0 4px 14px rgba(0,0,0,.35);
  --shadow-lg:0 10px 40px rgba(0,0,0,.50);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{
  font-family:-apple-system,"PingFang SC","Microsoft YaHei","Noto Sans SC",system-ui,sans-serif;
  color:var(--text);background:var(--bg);line-height:1.65;
  -webkit-font-smoothing:antialiased;transition:color .3s,background .3s;
}
a{color:var(--primary);text-decoration:none;transition:color .15s}
a:hover{color:var(--primary-dark)}
img,svg{display:block}
code{
  font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  font-size:.85em;background:var(--bg-sub);padding:2px 6px;border-radius:6px;color:var(--primary-dark);
  [data-theme="dark"] & { color:var(--primary); }
}
pre{background:var(--bg-sub);border:1px solid var(--border);border-radius:var(--radius);padding:16px 18px;overflow-x:auto;font-size:.84;line-height:1.65}
pre code{background:none;padding:0;color:inherit;font-size:inherit}
.wrap{max-width:var(--maxw);margin:0 auto;padding:0 24px}

/* ── 动画 ── */
@keyframes fadeUp{
  from{opacity:0;transform:translateY(20px)}
  to{opacity:1;transform:translateY(0)}
}
@keyframes float{
  0%,100%{transform:translateY(0)}
  50%{transform:translateY(-6px)}
}
/* 不用 fill-mode —— 元素默认可见，动画只是入场装饰。
   即使动画不触发/JS 报错，内容仍然正常显示。 */
.animate-fadeUp{animation:fadeUp .6s ease-out}
.animate-fadeUp-d1{animation:fadeUp .6s ease-out .1s}
.animate-fadeUp-d2{animation:fadeUp .6s ease-out .2s}
.animate-fadeUp-d3{animation:fadeUp .6s ease-out .3s}
.animate-float{animation:float 3s ease-in-out infinite}

/* ── 文字轮播（JS 控制显隐，CSS 只管过渡动画）── */
.rotator,.card-rot{
  position:relative;display:inline-block;
  min-height:1.15em;vertical-align:baseline;
}
/* 默认全部隐藏，由 JS 在初始化时立即设置哪个显示 */
.rotator span,.card-rot span{
  display:none;position:absolute;left:0;top:0;width:100%;
  white-space:nowrap;opacity:0;transition:opacity .4s ease,transform .4s ease;
  transform:translateY(8px);pointer-events:none;
}
/* 第一个子元素 relative 撑开容器宽度 */
.rotator span:first-child,.card-rot span:first-child{
  position:relative;left:auto;top:auto;width:auto;
}
/* JS 添加 .active 时显示 */
.rotator span.active,.card-rot span.active{
  display:block!important;opacity:1!important;transform:translateY(0)!important;pointer-events:auto!important;
}
/* 卡片轮播允许描述文字换行 */
.card-rot{display:block;min-height:auto}
.card-rot span{white-space:normal}

/* ── 导航栏 ── */
.nav{
  position:sticky;top:0;z-index:100;
  background:rgba(255,255,255,.85);backdrop-filter:saturate(1.4) blur(14px);-webkit-backdrop-filter:saturate(1.4) blur(14px);
  border-bottom:1px solid var(--border);transition:background .3s,border-color .3s;
}
[data-theme="dark"] .nav{background:rgba(13,17,23,.85)}
.nav-inner{max-width:var(--maxw);margin:0 auto;display:flex;align-items:center;height:58px;padding:0 24px;gap:28px}
.brand{display:flex;align-items:center;gap:9px;font-size:1.05rem;font-weight:700;color:var(--text);flex-shrink:0}
.brand svg{width:28px;height:28px;border-radius:8px}
.nav-links{display:flex;align-items:center;gap:4px;margin-left:auto}
.nav-links a{
  padding:7px 14px;border-radius:8px;color:var(--muted);font-size:.9rem;font-weight:500;transition:color .12s,background .12s;
}
.nav-links a:hover{color:var(--text);background:var(--bg-hover)}
.nav-links a.active{color:var(--primary);background:var(--primary-light)}
.nav-btn{
  display:inline-flex;align-items:center;gap:6px;padding:7px 15px;border-radius:8px;
  font-size:.87rem;font-weight:600;cursor:pointer;border:1px solid var(--border);background:var(--bg);
  color:var(--text);transition:background .12s,border-color .12s;
}
.nav-btn:hover{background:var(--bg-hover)}
.lang-switch{display:inline-flex;align-items:center;border:1px solid var(--border);border-radius:8px;overflow:hidden;margin-left:2px;flex-shrink:0}
.lang-switch a{padding:6px 11px;font-size:.84rem;font-weight:600;color:var(--muted);transition:all .12s}
.lang-switch a:hover{color:var(--text);background:var(--bg-hover)}
.lang-switch a.active{color:#fff;background:var(--primary)}

/* ── 按钮 ── */
.btn{
  display:inline-flex;align-items:center;gap:8px;
  padding:11px 24px;border-radius:10px;font-size:.94rem;font-weight:600;
  border:1px solid transparent;cursor:pointer;transition:all .18s;
}
.btn svg{width:18px;height:18px}
.btn-primary{background:var(--primary);color:#fff;border-color:var(--primary)}
.btn-primary:hover{background:var(--primary-dark);transform:translateY(-1.5px);box-shadow:var(--shadow-lg)}
.btn-outline{background:var(--bg);color:var(--text);border-color:var(--border)}
.btn-outline:hover{border-color:var(--primary);color:var(--primary);transform:translateY(-1px)}

/* ── Hero ── */
.hero{text-align:center;padding:80px 0 56px}
.hero-badge{
  display:inline-flex;align-items:center;gap:8px;padding:6px 16px;border-radius:999px;
  background:var(--primary-light);border:1px solid var(--primary-light);
  font-size:.83rem;color:var(--primary);font-weight:600;margin-bottom:22px;
}
.hero h1{font-size:clamp(2.2rem,5.5vw,3.4rem);line-height:1.15;letter-spacing:-.03em;font-weight:800;color:var(--text)}
.hero h1 .hl{color:var(--primary)}
.hero p{margin:18px auto 0;max-width:580px;color:var(--muted);font-size:1.05rem;line-height:1.72}
.hero-actions{display:flex;gap:12px;justify-content:center;margin-top:32px;flex-wrap:wrap}

/* ── 卡片网格 ── */
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:18px}
.card{
  background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-lg);
  padding:26px 22px;transition:border-color .2s,box-shadow .2s,transform .2s;
  overflow:hidden
}
.card:hover{border-color:var(--primary);box-shadow:var(--shadow-lg);transform:translateY(-3px)}
.card-icon{width:44px;height:44px;border-radius:11px;display:grid;place-items:center;margin-bottom:16px;background:var(--primary-light);color:var(--primary)}
.card-icon svg{width:22px;height:22px}
.card h3{font-size:1.02rem;font-weight:700;margin-bottom:8px;color:var(--text)}
.card p{font-size:.89rem;color:var(--muted);line-height:1.65;overflow-wrap:break-word;word-break:break-word}

/* ── 区块 ── */
.section{padding:56px 0}
.section-title{font-size:1.5rem;font-weight:750;letter-spacing:-.02em;color:var(--text);margin-bottom:8px}
.section-sub{color:var(--muted);font-size:.95rem;margin-bottom:32px;max-width:560px}

/* ── 页脚 ── */
.footer{border-top:1px solid var(--border);padding:36px 0 48px;margin-top:48px}
.footer-inner{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px}
.footer-brand{display:flex;align-items:center;gap:8px;font-weight:600;color:var(--text);font-size:.92rem}
.footer-brand svg{width:22px;height:22px}
.footer-links{display:flex;gap:20px}
.footer-links a{color:var(--muted);font-size:.88rem}
.footer-links a:hover{color:var(--text)}
.footer-copy{color:var(--muted2);font-size:.8rem;width:100%;text-align:center;margin-top:16px}

/* ══════════════════════════════════════
   文档页样式 —— 左导航 + 内容（两栏，无右侧 TOC）
   ══════════════════════════════════════ */

/* 文档首页 Hero */
.docs-hero{text-align:center;padding:64px 0 48px}
.docs-hero-badge{
  display:inline-flex;align-items:center;gap:8px;padding:6px 16px;border-radius:999px;
  border:1px solid var(--border);font-size:.82rem;color:var(--muted);margin-bottom:20px;
  background:var(--bg-sub);
}
.docs-hero h1{font-size:clamp(1.8rem,4vw,2.6rem);line-height:1.18;letter-spacing:-.025em;font-weight:800;color:var(--text)}
.docs-hero h1 .hl{color:var(--primary)}
.docs-hero p{margin:14px auto 0;max-width:540px;color:var(--muted);font-size:1rem;line-height:1.7}

/* 两栏布局：左导航 | 内容（删掉右侧 TOC） */
.doc-layout{display:grid;grid-template-columns:260px 1fr;gap:40px;padding:32px 0 64px;align-items:start}

/* 左侧导航（加宽到 260px，可点击跳转） */
.doc-sidebar{position:sticky;top:76px;max-height:calc(100vh - 92px);overflow-y:auto;scrollbar-width:thin;scrollbar-color:var(--border) transparent}
.sidebar-group{margin-bottom:24px}
.sidebar-label{font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--muted2);padding:0 12px 10px}
.sidebar-link{
  display:block;padding:9px 14px;border-radius:8px;font-size:.9rem;color:var(--muted);
  transition:all .15s;border-left:3px solid transparent;
}
.sidebar-link:hover{color:var(--text);background:var(--bg-sub);border-left-color:var(--primary)}
.sidebar-link.active{color:var(--primary);background:var(--primary-light);border-left-color:var(--primary);font-weight:600}

/* 中间内容区 */
.doc-content{min-width:0;max-width:720px}
.doc-content h1{font-size:1.85rem;font-weight:800;letter-spacing:-.02em;margin-bottom:6px;color:var(--text)}
.doc-content .doc-sub{color:var(--muted);font-size:.96rem;margin-bottom:28px}
.doc-content h2{
  font-size:1.28rem;font-weight:700;margin:44px 0 14px;padding-top:24px;
  scroll-margin-top:80px;border-top:1px solid var(--border);letter-spacing:-.01em;color:var(--text);
}
.doc-content h2:first-of-type{border-top:none;padding-top:0;margin-top:0}
.doc-content h3{font-size:1.06rem;font-weight:600;margin:24px 0 10px;color:var(--text)}
.doc-content p,.doc-content li{color:var(--muted);font-size:.93rem;line-height:1.76}
.doc-content ul,.doc-content ol{padding-left:20px;margin:10px 0}
.doc-content li{margin:5px 0}
.doc-content strong{color:var(--text);font-weight:600}
.doc-content table{width:100%;border-collapse:collapse;margin:16px 0;font-size:.89rem;border-radius:var(--radius);overflow:hidden;border:1px solid var(--border)}
.doc-content th,.doc-content td{border:1px solid var(--border);padding:11px 15px;text-align:left}
.doc-content th{background:var(--bg-sub);font-weight:600;font-size:.86rem;color:var(--text)}
.doc-content tr:nth-child(even){background:var(--bg-sub)}
.doc-content .note{
  background:var(--primary-light);border:1px solid var(--primary);border-radius:var(--radius);
  padding:15px 20px;margin:18px 0;font-size:.9rem;line-height:1.68;
}
.doc-content .note strong{color:var(--primary-dark);[data-theme="dark"] &{color:var(--primary)}}
.doc-content .link-card{
  display:flex;align-items:flex-start;gap:12px;padding:14px 18px;border-radius:var(--radius);
  border:1px solid var(--border);margin:10px 0;transition:all .15s;
}
.doc-content .link-card:hover{border-color:var(--primary);box-shadow:var(--shadow-sm);transform:translateX(4px)}
.doc-content .link-card svg{width:20px;height:20px;color:var(--primary);flex-shrink:0;margin-top:2px}
.doc-content .link-card .lc-t{font-weight:600;color:var(--text);font-size:.92rem}
.doc-content .link-card .lc-d{color:var(--muted);font-size:.83rem;margin-top:3px;word-break:break-all}

@media(max-width:960px){
  .doc-layout{grid-template-columns:1fr}
  .doc-sidebar{display:none}
  .hero{padding:56px 0 38px}
  .docs-hero{padding:48px 0 36px}
  .section{padding:38px 0}
  .nav-links a:not(:first-child):not(.nav-btn){display:none}
}
`;

/* ══════════════════════════════════════
   Logo 图标 —— AstrBot 风格
   圆角方形蓝底渐变 + 白色机器人/猫脸轮廓
   用作 favicon + 导航品牌图标
   ══════════════════════════════════════ */
const LOGO_SVG = `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="120" height="120" rx="26" fill="url(#lg)"/>
  <!-- 机器人脸轮廓（白色描边填充） -->
  <g fill="#ffffff">
    <!-- 头部圆角矩形 -->
    <rect x="28" y="34" width="64" height="52" rx="16"/>
    <!-- 眼睛 -->
    <rect x="42" y="50" width="12" height="14" rx="4" fill="#2563eb"/>
    <rect x="66" y="50" width="12" height="14" rx="4" fill="#2563eb"/>
    <!-- 天线 -->
    <rect x="57" y="24" width="6" height="14" rx="3"/>
    <circle cx="60" cy="21" r="5"/>
    <!-- 嘴巴/显示屏 -->
    <rect x="44" y="72" width="32" height="6" rx="3" fill="#2563eb" opacity=".5"/>
  </g>
</svg>`;

/* 迷你版（导航栏用）—— 同风格缩小 */
const LOGO_MINI = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="4" width="20" height="16" rx="4" fill="#2563eb"/>
  <rect x="6" y="9" width="3" height="4" rx="1" fill="#fff"/>
  <rect x="15" y="9" width="3" height="4" rx="1" fill="#fff"/>
  <rect x="10" y="15" width="4" height="2" rx="1" fill="#fff" opacity=".6"/>
  <line x1="12" y1="2" x2="12" y2="4.5" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="12" cy="1.5" r="1.2" fill="#2563eb"/>
</svg>`;

/* 功能图标集 */
const ICONS = {
  tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0l-7-7A2 2 0 0 1 3 12.2V5a2 2 0 0 1 2-2h7.2a2 2 0 0 1 1.4.6l7 7a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="7.5" r="1.4"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.3 7.3L3 21l1.7-6.7A8 8 0 1 1 21 12Z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
  forward: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14l5-5-5-5"/><path d="M4 20v-6a4 4 0 0 1 4-4h12"/></svg>',
  rocket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2c.9-.9.9-2.3 0-3.2-.9-.9-2.3-.9-3.2 0Z"/><path d="M9 12 15 6m0 0 3.5-3.5M15 6l3.5 3.5M15 6 9 12"/><path d="M14 10c1.5-1.5 3.5-2 5-1.5.8 2.5.3 4.5-1.2 6L14 10Z"/></svg>',
  doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3.6 14H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 7a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 10 3.6V3a2 2 0 1 1 4 0v.1A1.6 1.6 0 0 0 17 4.6a1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V10a2 2 0 1 1 0 4h-.1Z"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>',
  monitor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
};

/* ══════════════════════════════════════
   i18n 双语字典：默认 en（满足 GitHub 审核员），可切换 zh（方便国人）
   长段落 HTML（文档内容页 / 隐私 / 条款）见下方 START_CONTENT / PRIVACY_HTML / TERMS_HTML
   ══════════════════════════════════════ */
type Lang = 'en' | 'zh';
const I18N: Record<Lang, any> = {
  en: {
    meta: {
      titleHome: 'Neko GitHub App',
      desc: 'Automated labeling, welcome replies, stale cleanup, release notifications, PR checks, and webhook forwarding for your GitHub repositories. Runs free on Cloudflare Workers.',
      titleDocs: 'Neko GitHub App · Docs',
      titleStart: 'Neko GitHub App · Documentation',
      titlePrivacy: 'Privacy Policy · Neko GitHub App',
      titleTerms: 'Terms of Service · Neko GitHub App',
    },
    nav: { home: 'Home', docs: 'Docs', privacy: 'Privacy', terms: 'Terms', lang: 'Language' },
    footer: { home: 'Home', docs: 'Docs', privacy: 'Privacy Policy', terms: 'Terms of Service', powered: 'Cloudflare Workers · Free to run' },
    home: {
      badge: 'Open Source GitHub Automation',
      rotator: ['Self-managing', 'Runs automatically', 'No repetitive work', 'On duty 24/7', 'Zero-cost hosting'],
      desc: 'Auto-labeling, smart replies, stale cleanup, release notifications, PR checks, and event forwarding — all bundled into one free GitHub App. Each repo is configured independently, ready to use out of the box.',
      install: 'Install App',
      viewDocs: 'View Docs',
      featuresTitle: 'Core Features',
      featuresSub: 'Six feature modules, each independently toggleable or customizable via the repository config file.',
      cards: [
        { t1: 'Auto Label', d1: 'Matches titles or bodies with regex and auto-applies labels like bug, feature, documentation to Issues / PRs.', t2: 'Smart Categorize', d2: 'Ships 5 built-in rules and supports fully custom regex. Existing labels are never added twice.' },
        { t1: 'Auto Reply', d1: 'Sends a welcome message automatically when a new Issue or PR is created. Skips bot accounts to avoid noise.', t2: 'Custom Greeting', d2: 'Reply text is customizable in the config file, with multi-line text and variable placeholders supported.' },
        { t1: 'Stale Cleanup', d1: 'Scans Issues with no activity for a long time, labels them stale and comments. Auto-removed when someone replies.', t2: 'Zero-cost Schedule', d2: 'Supports manual triggers or external free timers — periodic scanning without paid cron quotas.' },
        { t1: 'Release Notify', d1: 'Pushes notifications to WeCom, Feishu, DingTalk, or any webhook channel when a new release is published.', t2: 'Multi-channel', d2: 'Pushes in parallel across channels; one failure does not affect the others. Any service that accepts JSON POST works.' },
        { t1: 'PR Check', d1: 'Auto-comments on PRs about draft status, wrong target branch, or oversized diffs.', t2: 'Early Risk Detection', d2: 'Helps reviewers catch risks early and reduces post-merge rework and missed issues.' },
        { t1: 'Webhook Forward', d1: 'Forwards GitHub events as-is to any external system, with optional signature verification.', t2: 'Event Bridge', d2: 'Great for connecting to self-hosted platforms or aggregation services, with event whitelist filtering.' },
      ],
      whyTitle: 'Why Choose It',
      whySub: 'A lightweight automation solution built for individual developers and small teams.',
      whyCards: [
        { t: 'Free to Run', d: 'Deployed on Cloudflare Workers, the free tier is more than enough. No server to maintain, no ops.' },
        { t: 'Config-driven', d: 'Each repo is controlled independently via a YAML config file. No config means everything on by default — zero learning curve.' },
        { t: 'Secure & Controllable', d: 'Least-privilege: requests only the GitHub permissions it needs. All data flows between your repo and the Worker, with no third-party dependency.' },
        { t: 'Full Documentation', d: 'Documentation covering feature descriptions, config fields, and notification formats. Ready to use, quick to troubleshoot.' },
      ],
    },
    docs: {
      badge: 'GitHub Automation',
      h1a: 'Agentic GitHub assistant,',
      h1b: 'for every repository',
      sub: 'Auto-label / welcome reply / stale cleanup / release notify / PR check / event forward<br/>Config-driven · Free to run · Ready out of the box',
      install: 'Install App',
      start: 'Quick Start',
      qsTitle: 'Quick Start',
      qsCards: [
        { t: 'Step 1: Install', d: 'Click the "Install App" button above to install Neko GitHub App to your GitHub organization or repository. Grant the required permissions to start.' },
        { t: 'Step 2: Add config (optional)', d: 'Create <code>.github/neko-app.yml</code> in the target repo root to customize behavior. <strong>With no file, all features are on by default</strong> — zero learning curve.' },
        { t: 'Step 3: Verify', d: 'Create an Issue with "bug" in the title — it should be auto-labeled <code>bug</code> and receive a welcome comment. Done!' },
      ],
      featTitle: 'Feature Overview',
      featCards: [
        { t: 'Auto Label', d: 'Regex matches title/body, auto-applies bug / feature / documentation labels' },
        { t: 'Auto Reply', d: 'Auto welcome message on new Issue/PR, skips bots intelligently' },
        { t: 'Stale Cleanup', d: 'Marks long-inactive Issues, auto-revives on reply' },
        { t: 'Release Notify', d: 'Pushes to WeCom/Feishu/DingTalk/Webhook on new release' },
        { t: 'PR Check', d: 'Auto-warns about draft/target-branch/diff-size issues' },
        { t: 'Webhook Forward', d: 'Forwards events as-is to external systems, optional signature' },
      ],
      cta: 'Ready to dive deeper? Read the full documentation:',
      fullDocs: 'Read Full Docs',
    },
    start: {
      sidebar: [
        { label: 'Introduction', links: [{ t: 'What is this', href: '#intro' }, { t: 'Important Links', href: '#links' }, { t: 'Quick Start', href: '#quickstart' }] },
        { label: 'Configuration', links: [{ t: 'Config File', href: '#config' }, { t: 'Feature Details', href: '#features' }] },
        { label: 'Integration', links: [{ t: 'Notification Format', href: '#notify' }, { t: 'Forward Format', href: '#forward' }] },
        { label: 'Reference', links: [{ t: 'FAQ', href: '#faq' }] },
      ],
    },
  },
  zh: {
    meta: {
      titleHome: 'Neko GitHub App',
      desc: '自动标签、智能回复、陈旧清理、Release 通知、PR 体检、事件中转，一个 App 全搞定。运行于 Cloudflare Workers，免费使用。',
      titleDocs: 'Neko GitHub App · 文档',
      titleStart: 'Neko GitHub App · 使用文档',
      titlePrivacy: '隐私政策 · Neko GitHub App',
      titleTerms: '服务条款 · Neko GitHub App',
    },
    nav: { home: '主页', docs: '文档', privacy: '隐私', terms: '条款', lang: '语言' },
    footer: { home: '主页', docs: '文档', privacy: '隐私政策', terms: '服务条款', powered: 'Cloudflare Workers · 免费运行' },
    home: {
      badge: '开源 GitHub 自动化工具',
      rotator: ['自己打理自己', '自动运转起来', '告别重复劳动', '24 小时待命', '零成本托管'],
      desc: '自动标签、智能回复、陈旧清理、Release 通知、PR 体检、事件中转 —— 全部聚合到一个免费运行的 GitHub App。每个仓库独立配置，开箱即用。',
      install: '安装应用',
      viewDocs: '查看文档',
      featuresTitle: '核心能力',
      featuresSub: '六大功能模块，均可通过仓库配置文件单独开关或定制参数。',
      cards: [
        { t1: '自动打标签', d1: '按标题或正文正则匹配，自动给 Issue / PR 打上 bug、feature、documentation 等标签。', t2: '智能分类', d2: '内置 5 条默认规则，也支持完全自定义正则。已存在的标签不会重复添加。' },
        { t1: '自动回复', d1: '新 Issue 或 PR 创建时自动发送欢迎语。智能跳过机器人账号，避免噪音。', t2: '欢迎语定制', d2: '回复内容可在配置文件中自定义，支持多行文本和变量占位符。' },
        { t1: '陈旧清理', d1: '扫描长期无活动的 Issue 并标记 stale 标签加评论。有人回复时自动移除。', t2: '零成本定时', d2: '支持手动触发或外挂免费定时器，无需付费 cron 额度即可定期扫描。' },
        { t1: 'Release 通知', d1: '新版本发布时自动推送通知到企业微信、飞书、钉钉或任意 Webhook 通道。', t2: '多通道并行', d2: '多通道并行推送，单个失败不影响其他。支持任意能接收 JSON POST 的服务。' },
        { t1: 'PR 体检', d1: '在 PR 下自动提示草稿状态、目标分支异常、改动量过大等常见问题。', t2: '前置风险发现', d2: '帮助评审者前置发现风险，减少合并后的返工和问题遗漏。' },
        { t1: 'Webhook 中转', d1: '把 GitHub 事件原样转发到任意外部系统，可选签名校验。', t2: '事件桥接', d2: '适合对接自建平台或聚合服务，支持事件白名单过滤。' },
      ],
      whyTitle: '为什么选择它',
      whySub: '为个人开发者与小团队打造的轻量自动化方案。',
      whyCards: [
        { t: '免费运行', d: '部署在 Cloudflare Workers 上，免费额度内完全够用。无需自备服务器，无需运维。' },
        { t: '配置驱动', d: '每个仓库通过 YAML 配置文件独立控制行为。不写配置则全部默认开启，零学习成本。' },
        { t: '安全可控', d: '最小权限原则，只请求必要的 GitHub 权限。所有数据在你的仓库和 Worker 之间流转，无第三方依赖。' },
        { t: '完整文档', d: '中文文档覆盖功能说明、配置字段、通知格式等。开箱即用，遇到问题快速定位。' },
      ],
    },
    docs: {
      badge: 'GitHub 自动化',
      h1a: 'Agentic GitHub 助手，',
      h1b: '服务每一个仓库',
      sub: '自动标签 / 欢迎回复 / 陈旧清理 / Release 通知 / PR 体检 / 事件中转<br/>配置驱动 · 免费运行 · 开箱即用',
      install: '安装应用',
      start: '快速开始',
      qsTitle: '快速开始',
      qsCards: [
        { t: '第一步：安装应用', d: '点击上方「安装应用」按钮，将 Neko GitHub App 安装到你的 GitHub 组织或仓库。授权所需权限后即可开始使用。' },
        { t: '第二步：添加配置（可选）', d: '在目标仓库根目录创建 <code>.github/neko-app.yml</code>，按需定制行为。<strong>不创建则全部功能默认开启</strong>，零学习成本。' },
        { t: '第三步：验证效果', d: '新建一个标题含 "bug" 的 Issue —— 应自动被打上 <code>bug</code> 标签并收到欢迎评论。搞定！' },
      ],
      featTitle: '功能一览',
      featCards: [
        { t: '自动打标签', d: '正则匹配标题/正文，自动打 bug / feature / documentation 等标签' },
        { t: '自动回复', d: '新 Issue/PR 自动发送欢迎语，智能跳过机器人' },
        { t: '陈旧清理', d: '标记长期无活动的 Issue，有人回复自动复活' },
        { t: 'Release 通知', d: '新版本发布时推送到企业微信/飞书/钉钉/Webhook' },
        { t: 'PR 体检', d: '自动提示草稿/目标分支/改动量等问题' },
        { t: 'Webhook 中转', d: '事件原样转发到外部系统，可选签名校验' },
      ],
      cta: '准备好深入了解了？查看完整文档：',
      fullDocs: '阅读完整文档',
    },
    start: {
      sidebar: [
        { label: '简介', links: [{ t: '这是什么', href: '#intro' }, { t: '重要链接', href: '#links' }, { t: '快速开始', href: '#quickstart' }] },
        { label: '配置', links: [{ t: '配置文件', href: '#config' }, { t: '功能详解', href: '#features' }] },
        { label: '集成', links: [{ t: '通知格式', href: '#notify' }, { t: '中转格式', href: '#forward' }] },
        { label: '参考', links: [{ t: '常见问题', href: '#faq' }] },
      ],
    },
  },
};

/* 文档内容页正文（中文版） */
const START_CONTENT_ZH = `
<article class="doc-content">
<h1>使用文档</h1>
<p class="doc-sub">从安装到配置到集成，一站式配置指南。</p>

<!-- 简介 -->
<h2 id="intro">简介</h2>
<p><strong>Neko GitHub App</strong> 是一个运行在 Cloudflare Worker 上的 GitHub 应用。安装到你的组织或仓库后，它会接收 GitHub 推送的 Issue、PR、Release 等事件，并按你的配置执行自动化动作。</p>
<pre><code>GitHub 事件 (Webhook)
   │
   ▼ HTTPS POST
Cloudflare Worker (Hono + Octokit)
   ├── 校验 HMAC 签名
   ├── 读取 .github/neko-app.yml
   ├── 路由到对应功能模块
   │   ├── autoLabel       自动打标签
   │   ├── autoReply       自动欢迎回复
   │   ├── stale           陈旧 Issue 清理
   │   ├── releaseNotify   Release 推送通知
   │   ├── prChecks        PR 检查提示
   │   └── forward         Webhook 中转
   └── 返回响应</code></pre>
<div class="note"><strong>全程免费</strong> —— 运行于 Cloudflare Workers 免费额度内，无需自备服务器。每个仓库的行为由该仓库内的配置文件独立控制，互不影响。</div>

<!-- 重要链接 -->
<h2 id="links">重要链接</h2>
<div class="link-card">${ICONS.link}<div><div class="lc-t">官网</div><div class="lc-d"><a href="https://app.nekoaidev.top/" target="_blank" rel="noopener">https://app.nekoaidev.top/</a></div></div></div>
<div class="link-card">${ICONS.doc}<div><div class="lc-t">本文档</div><div class="lc-d"><a href="https://app.nekoaidev.top/docs/start" target="_blank" rel="noopener">https://app.nekoaidev.top/docs/start</a></div></div></div>
<div class="link-card">${ICONS.download}<div><div class="lc-t">安装地址</div><div class="lc-d"><a data-install href="#" onclick="event.preventDefault();window.open('https://github.com/apps/neko-github-app/installations/new','_blank')">点击跳转到 GitHub 安装页面</a></div></div></div>
<div class="link-card">${ICONS.check}<div><div class="lc-t">健康检查</div><div class="lc-d"><a href="https://app.nekoaidev.top/health" target="_blank" rel="noopener">https://app.nekoaidev.top/health</a> &nbsp;返回 <code>{"ok":true}</code></div></div></div>

<!-- 快速开始 -->
<h2 id="quickstart">快速开始</h2>
<ol>
  <li><strong>安装 App</strong>：点击上方「安装地址」的跳转链接，或访问 <code>https://github.com/apps/neko-github-app/installations/new</code>，将 Neko GitHub App 安装到你的组织或仓库。</li>
  <li><strong>添加配置</strong>（可选）：在目标仓库根目录创建 <code>.github/neko-app.yml</code>，按需定制行为。不创建则全部功能默认开启。</li>
  <li><strong>测试验证</strong>：新建一个标题含 "bug" 的 Issue —— 应自动被打上 <code>bug</code> 标签并收到欢迎评论。</li>
  <li><strong>定制通知</strong>（可选）：在配置文件的 <code>releaseNotify.channels</code> 中填入你的 Webhook 地址，即可接收 Release 发布通知。</li>
</ol>

<!-- 配置文件 -->
<h2 id="config">配置文件</h2>
<p>在每个仓库根目录创建 <code>.github/neko-app.yml</code> 即可覆盖默认行为。<strong>不写任何配置（或文件不存在）时，全部功能使用内置默认值且处于开启状态。</strong></p>
<table>
  <thead><tr><th>字段</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
  <tbody>
    <tr><td><code>enabled</code></td><td>bool</td><td><code>true</code></td><td>总开关。设为 <code>false</code> 则该仓库跳过所有处理。</td></tr>
    <tr><td><code>autoLabel.enabled</code></td><td>bool</td><td><code>true</code></td><td>自动打标签开关。</td></tr>
    <tr><td><code>autoLabel.rules</code></td><td>list</td><td>内置 5 条</td><td>匹配规则列表；写了则<b>完全替换</b>内置规则。每项含 <code>label</code> / <code>match</code>（正则）/ <code>field</code>（title|body|both）。</td></tr>
    <tr><td><code>autoReply.enabled</code></td><td>bool</td><td><code>true</code></td><td>自动回复开关。</td></tr>
    <tr><td><code>autoReply.template</code></td><td>string</td><td>默认欢迎语</td><td>自动回复的正文内容，支持多行文本。</td></tr>
    <tr><td><code>stale.enabled</code></td><td>bool</td><td><code>true</code></td><td>陈旧清理开关。</td></tr>
    <tr><td><code>stale.days</code></td><td>int</td><td><code>30</code></td><td>超过多少天无活动视为陈旧。</td></tr>
    <tr><td><code>stale.label</code></td><td>string</td><td><code>stale</code></td><td>打上的标签名称。</td></tr>
    <tr><td><code>stale.message</code></td><td>string</td><td>默认提示语</td><td>打标签时附加的评论内容。</td></tr>
    <tr><td><code>releaseNotify.enabled</code></td><td>bool</td><td><code>true</code></td><td>Release 通知开关。</td></tr>
    <tr><td><code>releaseNotify.channels</code></td><td>list</td><td><code>[]</code></td><td>通知通道列表，每项 <code>{ name, url }</code>；目标需能接收 JSON POST。</td></tr>
    <tr><td><code>prChecks.enabled</code></td><td>bool</td><td><code>true</code></td><td>PR 检查开关。</td></tr>
    <tr><td><code>forward</code></td><td>object|null</td><td><code>null</code></td><td>Webhook 中转配置；为 <code>null</code> 则不转发。包含 <code>url</code> / <code>secret</code>（可选签名）/ <code>events</code>（可选白名单）。</td></tr>
  </tbody>
</table>
<p>完整示例：</p>
<pre><code>enabled: true

autoLabel:
  enabled: true
  rules:
    - label: "bug"
      match: "bug|错误|崩溃|crash|exception"
      field: both
    - label: "enhancement"
      match: "feature|建议|功能|需求|enhancement"
      field: both

autoReply:
  enabled: true
  template: |
    感谢你的提交喵~ 我们已经收到，会尽快处理。

stale:
  enabled: true
  days: 30
  label: stale
  message: "此 Issue 已 30 天无活动，被标记为 stale。若有进展请评论，我们会移除标签。"

releaseNotify:
  enabled: true
  channels:
    - name: "feishu-bot"
      url: "https://open.feishu.cn/open-apis/bot/v2/hook/xxx"

prChecks:
  enabled: true

forward:
  url: "https://your-collector.example.com/github"
  secret: "your-signing-secret"</code></pre>

<!-- 功能详解 -->
<h2 id="features">功能详解</h2>

<h3>自动打标签（autoLabel）</h3>
<ul>
  <li><strong>触发时机</strong>：<code>issues</code> / <code>pull_request</code> 的 <code>opened</code>、<code>edited</code>、<code>reopened</code>、<code>synchronize</code> 事件。</li>
  <li>按 <code>title</code> / <code>body</code> / <code>both</code> 字段做正则匹配（大小写不敏感），命中的标签批量添加，已存在的不会重复添加。</li>
  <li>未配置 <code>rules</code> 时使用内置默认规则：
    <table style="margin-top:8px">
      <thead><tr><th>标签</th><th>匹配关键词</th></tr></thead>
      <tbody>
        <tr><td><code>bug</code></td><td>bug / 错误 / 崩溃 / crash / exception / 异常</td></tr>
        <tr><td><code>enhancement</code></td><td>feature / 建议 / 功能 / 增强 / enhancement / 需求</td></tr>
        <tr><td><code>documentation</code></td><td>doc / 文档 / readme</td></tr>
        <tr><td><code>question</code></td><td>question / 疑问 / 提问 / 怎么 / 如何 / 为什么</td></tr>
        <tr><td><code>good first issue</code></td><td>good first / 新手 / 入门 / easy</td></tr>
      </tbody>
    </table>
  </li>
</ul>

<h3>自动回复（autoReply）</h3>
<ul>
  <li><strong>触发时机</strong>：<code>issues</code> / <code>pull_request</code> 的 <code>opened</code> 动作。</li>
  <li>若创建者是机器人账号（如 Dependabot、renovate 等），<strong>自动跳过不回复</strong>。</li>
  <li>回复内容取自 <code>autoReply.template</code>，支持多行文本。</li>
</ul>

<h3>陈旧清理（stale）</h3>
<ul>
  <li><strong>实时部分</strong>（无需额外操作即可生效）：有人在 Issue 下评论（非机器人）→ 自动移除 <code>stale</code> 标签（复活）；Issue 被关闭或重开 → 自动移除 <code>stale</code> 标签。</li>
  <li><strong>批量扫描部分</strong>：需要手动触发或挂外部定时器：
    <pre><code>curl -X POST https://app.nekoaidev.top/tasks/stale \\
  -H "x-neko-task-key: &lt;你的 WEBHOOK_SECRET&gt;"</code></pre>
    触发后会遍历 App 所有安装下的仓库，把超过 <code>stale.days</code> 天无活动的开放 Issue 打上标签并评论。可挂到免费定时器（如 cron-job.org）实现每日自动扫描。
  </li>
</ul>

<h3>Release 通知（releaseNotify）</h3>
<ul>
  <li><strong>触发时机</strong>：<code>release</code> 事件且 <code>action === "published"</code>。</li>
  <li>向 <code>channels</code> 中每个 URL 发送 JSON POST（格式见下方「通知格式」）。单个通道失败不影响其他通道。</li>
</ul>

<h3>PR 检查（prChecks）</h3>
<ul>
  <li><strong>触发时机</strong>：<code>pull_request</code> 的 <code>opened</code>、<code>reopened</code>、<code>synchronize</code>。</li>
  <li>命中以下任意条件则在 PR 下发表评论提示：
    <ul>
      <li>PR 处于 Draft（草稿）状态</li>
      <li>目标分支不是仓库的默认分支</li>
      <li>改动总量（增 + 删）超过 1000 行</li>
    </ul>
  </li>
</ul>

<h3>Webhook 中转（forward）</h3>
<ul>
  <li>对所有收到的事件生效。<code>forward.url</code> 为空时不转发。</li>
  <li>若配置了 <code>forward.events</code> 白名单，只转发列表内的事件类型。</li>
  <li>若配置了 <code>forward.secret</code>，请求头附带 <code>x-neko-signature</code> 以便接收方校验来源。</li>
</ul>

<!-- 通知格式 -->
<h2 id="notify">通知通道接收格式</h2>
<p>当有新 Release 发布时，<code>releaseNotify.channels</code> 里的每个 URL 会收到如下 JSON POST：</p>
<pre><code>{
  "title": "owner/name v1.2.3 发布",
  "body": "本次更新内容……",
  "repo": "owner/name",
  "url": "https://github.com/owner/name/releases/tag/v1.2.3",
  "channel": "feishu-bot"
}</code></pre>
<p>请求头：<code>content-type: application/json</code>。可指向企业微信机器人、飞书群机器人、钉钉机器人或自建 Worker 服务。</p>

<!-- 中转格式 -->
<h2 id="forward">Webhook 中转接收格式</h2>
<p>配置了 <code>forward.url</code> 后，目标地址收到的数据：</p>
<pre><code>{
  "event": "issues",
  "payload": { ... 原始 GitHub Webhook payload ... }
}</code></pre>
<p>请求头：</p>
<ul>
  <li><code>content-type: application/json</code></li>
  <li><code>x-github-delivery</code>：GitHub 事件唯一 ID</li>
  <li><code>x-github-event</code>：事件名称（如 <code>issues</code>）</li>
  <li>若配置了 <code>forward.secret</code>，额外携带 <code>x-neko-signature</code> 头用于校验来源</li>
</ul>

<!-- FAQ -->
<h2 id="faq">常见问题</h2>
<ul>
  <li><strong>安装后没有反应？</strong> 确认已在目标仓库或组织上完成授权安装。在仓库新建一个标题含 "bug" 的 Issue 测试 —— 应自动被打上 <code>bug</code> 标签并收到欢迎评论。</li>
  <li><strong>想关闭某个功能？</strong> 在仓库的 <code>.github/neko-app.yml</code> 里把对应功能的 <code>enabled</code> 设为 <code>false</code> 即可。设顶层 <code>enabled: false</code> 可一次性关闭整个 App 对该仓库的处理。</li>
  <li><strong>标签没按预期打上？</strong> 检查 <code>autoLabel.rules</code> 里的 <code>field</code> 是否正确（<code>title</code> 只匹配标题、<code>body</code> 只匹配正文、<code>both</code> 都匹配）；确认正则包含了你的关键词。已存在的标签不会重复添加。</li>
  <li><strong>Release 通知没收到？</strong> 检查 <code>releaseNotify.channels</code> 里的 URL 是否公网可达、是否能接受 JSON POST。可在 App 设置的 Recent deliveries 里找到最近的 release 事件点击 Redeliver 重发测试。</li>
  <li><strong>stale 标签没有出现？</strong> 批量扫描需要手动触发（见上方 stale 章节的 curl 命令）。评论/关闭时的自动复活是实时的，不需要额外操作。确认 <code>stale.enabled: true</code> 且 <code>stale.days</code> 符合预期。</li>
  <li><strong>Webhook 中转收不到数据？</strong> 确认 <code>forward.url</code> 正确且公网可达；检查 <code>forward.events</code> 白名单是否包含你要转发的事件类型（不设置则转发全部事件）。</li>
  <li><strong>配置修改后多久生效？</strong> 配置文件随每次事件实时读取，修改后下一次触发对应功能时立即生效，无需重启或重新安装。</li>
  <li><strong>Marketplace 审核被拒怎么办？</strong> 最常见原因是安全隐私信息写得不够详细。确保说明了：数据如何处理、是否加密存储密钥、是否验证 Webhook 签名、第三方服务有哪些。参照上方「安全和隐私信息」模板补充后重新提交。</li>
  <li><strong>免费额度够用吗？</strong> Cloudflare Workers 免费额度每天 10 万次请求，对绝大多数仓库绰绰有余。即使你的组织有几十个仓库、每天几百个事件，也不会超出免费额度。</li>
</ul>
</article>`;

/* 文档内容页正文（英文版） */
const START_CONTENT_EN = `
<article class="doc-content">
<h1>Documentation</h1>
<p class="doc-sub">One-stop setup guide from install to config to integration.</p>

<!-- Introduction -->
<h2 id="intro">Introduction</h2>
<p><strong>Neko GitHub App</strong> is a GitHub App running on Cloudflare Workers. After you install it on your organization or repository, it receives GitHub events (Issues, PRs, Releases, etc.) via webhook and performs automation actions based on your configuration.</p>
<pre><code>GitHub Events (Webhook)
   │
   ▼ HTTPS POST
Cloudflare Worker (Hono + Octokit)
   ├── Verify HMAC signature
   ├── Read .github/neko-app.yml
   ├── Route to feature modules
   │   ├── autoLabel       Auto-labeling
   │   ├── autoReply       Auto welcome reply
   │   ├── stale           Stale issue cleanup
   │   ├── releaseNotify   Release push notification
   │   ├── prChecks        PR check hints
   │   └── forward         Webhook forwarding
   └── Return response</code></pre>
<div class="note"><strong>100% Free</strong> — Runs within the Cloudflare Workers free tier, no server required. Each repository's behavior is controlled independently by its own config file and does not affect others.</div>

<!-- Important Links -->
<h2 id="links">Important Links</h2>
<div class="link-card">${ICONS.link}<div><div class="lc-t">Official Site</div><div class="lc-d"><a href="https://app.nekoaidev.top/" target="_blank" rel="noopener">https://app.nekoaidev.top/</a></div></div></div>
<div class="link-card">${ICONS.doc}<div><div class="lc-t">This Documentation</div><div class="lc-d"><a href="https://app.nekoaidev.top/docs/start" target="_blank" rel="noopener">https://app.nekoaidev.top/docs/start</a></div></div></div>
<div class="link-card">${ICONS.download}<div><div class="lc-t">Install URL</div><div class="lc-d"><a data-install href="#" onclick="event.preventDefault();window.open('https://github.com/apps/neko-github-app/installations/new','_blank')">Open the GitHub installation page</a></div></div></div>
<div class="link-card">${ICONS.check}<div><div class="lc-t">Health Check</div><div class="lc-d"><a href="https://app.nekoaidev.top/health" target="_blank" rel="noopener">https://app.nekoaidev.top/health</a> &nbsp;returns <code>{"ok":true}</code></div></div></div>

<!-- Quick Start -->
<h2 id="quickstart">Quick Start</h2>
<ol>
  <li><strong>Install the App</strong>: Click the "Install URL" link above, or visit <code>https://github.com/apps/neko-github-app/installations/new</code>, and install Neko GitHub App to your organization or repository.</li>
  <li><strong>Add config</strong> (optional): Create <code>.github/neko-app.yml</code> in the target repo root to customize behavior. With no file, all features are on by default.</li>
  <li><strong>Test</strong>: Create an Issue with "bug" in the title — it should be auto-labeled <code>bug</code> and receive a welcome comment.</li>
  <li><strong>Custom notifications</strong> (optional): Fill your webhook URL into <code>releaseNotify.channels</code> in the config to receive release notifications.</li>
</ol>

<!-- Config File -->
<h2 id="config">Configuration File</h2>
<p>Create <code>.github/neko-app.yml</code> in each repo root to override defaults. <strong>With no config (or no file), all features use built-in defaults and are enabled.</strong></p>
<table>
  <thead><tr><th>Field</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
  <tbody>
    <tr><td><code>enabled</code></td><td>bool</td><td><code>true</code></td><td>Master switch. Set to <code>false</code> to skip all processing for this repo.</td></tr>
    <tr><td><code>autoLabel.enabled</code></td><td>bool</td><td><code>true</code></td><td>Auto-labeling switch.</td></tr>
    <tr><td><code>autoLabel.rules</code></td><td>list</td><td>5 built-in</td><td>List of matching rules; if provided it <b>completely replaces</b> the built-in rules. Each item has <code>label</code> / <code>match</code> (regex) / <code>field</code> (title|body|both).</td></tr>
    <tr><td><code>autoReply.enabled</code></td><td>bool</td><td><code>true</code></td><td>Auto-reply switch.</td></tr>
    <tr><td><code>autoReply.template</code></td><td>string</td><td>default greeting</td><td>Body text of the auto-reply, supports multi-line.</td></tr>
    <tr><td><code>stale.enabled</code></td><td>bool</td><td><code>true</code></td><td>Stale cleanup switch.</td></tr>
    <tr><td><code>stale.days</code></td><td>int</td><td><code>30</code></td><td>Days of inactivity before an issue is considered stale.</td></tr>
    <tr><td><code>stale.label</code></td><td>string</td><td><code>stale</code></td><td>Label name to apply.</td></tr>
    <tr><td><code>stale.message</code></td><td>string</td><td>default message</td><td>Comment text attached when labeling.</td></tr>
    <tr><td><code>releaseNotify.enabled</code></td><td>bool</td><td><code>true</code></td><td>Release notification switch.</td></tr>
    <tr><td><code>releaseNotify.channels</code></td><td>list</td><td><code>[]</code></td><td>Notification channel list, each <code>{ name, url }</code>; the target must accept JSON POST.</td></tr>
    <tr><td><code>prChecks.enabled</code></td><td>bool</td><td><code>true</code></td><td>PR check switch.</td></tr>
    <tr><td><code>forward</code></td><td>object|null</td><td><code>null</code></td><td>Webhook forward config; <code>null</code> means no forwarding. Contains <code>url</code> / <code>secret</code> (optional signing) / <code>events</code> (optional whitelist).</td></tr>
  </tbody>
</table>
<p>Full example:</p>
<pre><code>enabled: true

autoLabel:
  enabled: true
  rules:
    - label: "bug"
      match: "bug|error|crash|exception"
      field: both
    - label: "enhancement"
      match: "feature|enhancement"
      field: both

autoReply:
  enabled: true
  template: |
    Thanks for your submission, we have received it and will handle it soon.

stale:
  enabled: true
  days: 30
  label: stale
  message: "This issue has been inactive for 30 days and is marked stale. Comment if there is progress and we will remove the label."

releaseNotify:
  enabled: true
  channels:
    - name: "feishu-bot"
      url: "https://open.feishu.cn/open-apis/bot/v2/hook/xxx"

prChecks:
  enabled: true

forward:
  url: "https://your-collector.example.com/github"
  secret: "your-signing-secret"</code></pre>

<!-- Feature Details -->
<h2 id="features">Feature Details</h2>

<h3>Auto Label (autoLabel)</h3>
<ul>
  <li><strong>Trigger</strong>: <code>issues</code> / <code>pull_request</code> <code>opened</code>, <code>edited</code>, <code>reopened</code>, <code>synchronize</code> events.</li>
  <li>Regex matches the <code>title</code> / <code>body</code> / <code>both</code> field (case-insensitive); matched labels are added in batch, existing labels are never duplicated.</li>
  <li>If <code>rules</code> is not configured, built-in default rules are used:
    <table style="margin-top:8px">
      <thead><tr><th>Label</th><th>Keywords</th></tr></thead>
      <tbody>
        <tr><td><code>bug</code></td><td>bug / error / crash / exception</td></tr>
        <tr><td><code>enhancement</code></td><td>feature / enhancement</td></tr>
        <tr><td><code>documentation</code></td><td>doc / readme</td></tr>
        <tr><td><code>question</code></td><td>question / how / why</td></tr>
        <tr><td><code>good first issue</code></td><td>good first / easy</td></tr>
      </tbody>
    </table>
  </li>
</ul>

<h3>Auto Reply (autoReply)</h3>
<ul>
  <li><strong>Trigger</strong>: <code>issues</code> / <code>pull_request</code> <code>opened</code>.</li>
  <li>If the author is a bot account (e.g. Dependabot, renovate), it is <strong>automatically skipped</strong>.</li>
  <li>Reply text comes from <code>autoReply.template</code>, supports multi-line.</li>
</ul>

<h3>Stale Cleanup (stale)</h3>
<ul>
  <li><strong>Real-time part</strong> (works with no extra action): someone comments (non-bot) → auto-remove <code>stale</code> label (revive); Issue closed or reopened → auto-remove <code>stale</code> label.</li>
  <li><strong>Batch scan part</strong>: requires manual trigger or an external timer:
    <pre><code>curl -X POST https://app.nekoaidev.top/tasks/stale \\
  -H "x-neko-task-key: &lt;YOUR_WEBHOOK_SECRET&gt;"</code></pre>
    This scans all repos under the App's installations and labels open Issues inactive for more than <code>stale.days</code> days with a comment. You can attach it to a free timer (e.g. cron-job.org) for a daily scan.
  </li>
</ul>

<h3>Release Notify (releaseNotify)</h3>
<ul>
  <li><strong>Trigger</strong>: <code>release</code> event with <code>action === "published"</code>.</li>
  <li>Sends a JSON POST to each URL in <code>channels</code> (see format below). One channel failure does not affect others.</li>
</ul>

<h3>PR Check (prChecks)</h3>
<ul>
  <li><strong>Trigger</strong>: <code>pull_request</code> <code>opened</code>, <code>reopened</code>, <code>synchronize</code>.</li>
  <li>Comments on the PR if any of these conditions are met:
    <ul>
      <li>PR is in Draft state</li>
      <li>Target branch is not the repo default branch</li>
      <li>Total diff (additions + deletions) exceeds 1000 lines</li>
    </ul>
  </li>
</ul>

<h3>Webhook Forward (forward)</h3>
<ul>
  <li>Applies to all received events. No forwarding when <code>forward.url</code> is empty.</li>
  <li>If <code>forward.events</code> whitelist is configured, only listed event types are forwarded.</li>
  <li>If <code>forward.secret</code> is configured, the request carries an <code>x-neko-signature</code> header for the receiver to verify the source.</li>
</ul>

<!-- Notification Format -->
<h2 id="notify">Notification Receiving Format</h2>
<p>When a new Release is published, each URL in <code>releaseNotify.channels</code> receives a JSON POST like:</p>
<pre><code>{
  "title": "owner/name v1.2.3 released",
  "body": "What's new in this release……",
  "repo": "owner/name",
  "url": "https://github.com/owner/name/releases/tag/v1.2.3",
  "channel": "feishu-bot"
}</code></pre>
<p>Headers: <code>content-type: application/json</code>. Can point to a WeCom bot, Feishu group bot, DingTalk bot, or a self-hosted Worker service.</p>

<!-- Forward Format -->
<h2 id="forward">Webhook Forward Receiving Format</h2>
<p>After <code>forward.url</code> is configured, the target receives:</p>
<pre><code>{
  "event": "issues",
  "payload": { ... original GitHub webhook payload ... }
}</code></pre>
<p>Headers:</p>
<ul>
  <li><code>content-type: application/json</code></li>
  <li><code>x-github-delivery</code>: GitHub event unique ID</li>
  <li><code>x-github-event</code>: event name (e.g. <code>issues</code>)</li>
  <li>If <code>forward.secret</code> is configured, also carries an <code>x-neko-signature</code> header for source verification</li>
</ul>

<!-- FAQ -->
<h2 id="faq">FAQ</h2>
<ul>
  <li><strong>No reaction after install?</strong> Confirm you completed the authorized install on the target repo or org. Create an Issue with "bug" in the title to test — it should be auto-labeled <code>bug</code> and receive a welcome comment.</li>
  <li><strong>Want to disable a feature?</strong> Set that feature's <code>enabled</code> to <code>false</code> in the repo's <code>.github/neko-app.yml</code>. Set top-level <code>enabled: false</code> to disable the whole App for that repo at once.</li>
  <li><strong>Labels not applied as expected?</strong> Check the <code>field</code> in <code>autoLabel.rules</code> (<code>title</code> matches title only, <code>body</code> matches body only, <code>both</code> matches both); confirm your regex includes the keyword. Existing labels are never duplicated.</li>
  <li><strong>No release notification received?</strong> Check whether the URL in <code>releaseNotify.channels</code> is publicly reachable and accepts JSON POST. In App settings → Recent deliveries, find the latest release event and click Redeliver to resend a test.</li>
  <li><strong>Stale label not appearing?</strong> The batch scan needs a manual trigger (see the curl command in the stale section above). Auto-revive on comment/close is real-time and needs no extra action. Confirm <code>stale.enabled: true</code> and <code>stale.days</code> are as expected.</li>
  <li><strong>Webhook forward not receiving data?</strong> Confirm <code>forward.url</code> is correct and publicly reachable; check whether <code>forward.events</code> whitelist includes the event types you want (empty = forward all events).</li>
  <li><strong>How long until config changes take effect?</strong> The config file is read live on every event; changes take effect on the next trigger of the related feature, with no restart or reinstall needed.</li>
  <li><strong>Marketplace review rejected?</strong> The most common reason is insufficient security/privacy detail. Make sure you explain: how data is processed, whether keys are stored encrypted, whether webhook signatures are verified, and what third-party services are used. Supplement per the template and resubmit.</li>
  <li><strong>Is the free quota enough?</strong> The Cloudflare Workers free tier allows 100k requests/day, plenty for most repos. Even with dozens of repos and hundreds of events per day, you won't exceed the free quota.</li>
</ul>
</article>`;

/* 主题切换脚本 */
const THEME_JS = `(function(){
  var b=document.getElementById('thBtn');
  if(!b)return;
  var order=['system','light','dark'];
  var ic={system:'${ICONS.monitor}',light:'${ICONS.sun}',dark:'${ICONS.moon}'};
  function set(t){
    var d=t==='system'?(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'):t;
    document.documentElement.setAttribute('data-theme',d);
    if(b&&b.querySelector('.ti')) b.querySelector('.ti').innerHTML=ic[t]||'';
  }
  var s=localStorage.getItem('neko-theme')||'system';set(s);
  window.matchMedia('(prefers-color-scheme:dark)').addEventListener('change',function(){if((localStorage.getItem('neko-theme')||'system')==='system') set('system');});
  b.addEventListener('click',function(){var c=localStorage.getItem('neko-theme')||'system';var n=order[(order.indexOf(c)+1)%3];localStorage.setItem('neko-theme',n);set(n);});
})();`;

/* 安装链接自动生成脚本 —— 根据当前域名推断 App slug */
const INSTALL_JS = `(function(){
  var btns=document.querySelectorAll('[data-install]');
  btns.forEach(function(el){
    el.addEventListener('click',function(e){
      e.preventDefault();
      var slug='neko-github-app';
      window.open('https://github.com/apps/'+slug+'/installations/new','_blank');
    });
  });
})();
/* ── 清除页面游离文字 </> （增强版：递归+持续监控）── */
(function(){
  function sweep(root){
    if(!root)return;
    var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null,false);
    var nodes=[],n;
    while(n=walker.nextNode()){if(n.textContent.trim()==='</>')nodes.push(n);}
    for(var i=0;i<nodes.length;i++){if(nodes[i].parentNode)nodes[i].parentNode.removeChild(nodes[i]);}
  }
  sweep(document.body);
  var obs=new MutationObserver(function(){sweep(document.body);});
  obs.observe(document.body||document.documentElement,{childList:true,subtree:true,characterData:true});
})();

/* ── 文字轮播引擎（Hero + 卡片通用）──
   JS 完全控制显隐（display:none/block），CSS 只负责过渡动画。
   初始化时立即隐藏所有非活跃项，确保不会出现"全部显示"的崩坏。 */
(function(){
  function initRotator(el){
    if(!el)return;
    var items=[].slice.call(el.querySelectorAll('span'));
    if(items.length<=1){
      /* 只有一项或不存在的，确保显示 */
      items.forEach(function(it){it.style.display='block';it.style.opacity='1';it.style.position='relative';});
      return;
    }
    var cur=0;
    /* ★ 初始化：立即强制设置所有项的显隐状态 */
    items.forEach(function(it,i){
      if(i===0){
        it.classList.add('active');
        it.style.display='block';
        it.style.opacity='1';
        it.style.transform='translateY(0)';
        it.style.position='relative';
        it.style.left='auto';it.style.top='auto';it.style.width='auto';
      }else{
        it.classList.remove('active');
        it.style.display='none';
        it.style.opacity='0';
      }
    });
    /* 定时切换 */
    setInterval(function(){
      var out=items[cur];
      cur=(cur+1)%items.length;
      var inn=items[cur];
      /* 退出：淡出后隐藏 */
      out.classList.remove('active');
      out.style.opacity='0';
      out.style.transform='translateY(-8px)';
      setTimeout(function(){out.style.display='none';},400);
      /* 进入：显示后淡入 */
      inn.style.display='block';
      inn.style.position='relative';
      inn.style.left='auto';inn.style.top='auto';inn.style.width='auto';
      /* 强制回流后开始动画 */
      void inn.offsetWidth;
      inn.classList.add('active');
      inn.style.opacity='1';
      inn.style.transform='translateY(0)';
    },3200);
  }
  if(document.getElementById('heroRotator'))initRotator(document.getElementById('heroRotator'));
  document.querySelectorAll('.card-rot').forEach(initRotator);
})();`;

/* 左侧导航高亮脚本 —— 滚动时自动高亮当前章节 */
const SIDEBAR_JS = `(function(){
  var links=[].slice.call(document.querySelectorAll('.sidebar-link[href^="#"]'));
  if(!links.length)return;
  links.forEach(function(l){
    l.addEventListener('click',function(e){
      e.preventDefault();
      var target=document.querySelector(this.getAttribute('href'));
      if(target){target.scrollIntoView({behavior:'smooth',block:'start'});}
      links.forEach(function(x){x.classList.remove('active');});
      this.classList.add('active');
    });
  });
  var obs=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){
        links.forEach(function(l){l.classList.remove('active');});
        var a=document.querySelector('.sidebar-link[href="#'+e.target.id+'"]');
        if(a)a.classList.add('active');
      }
    });},{rootMargin:'-100px 0px -60% 0px'});
  links.forEach(function(l){
    var el=document.querySelector(l.getAttribute('href'));
    if(el)obs.observe(el);
  });
})();`;

/* ── 公共部件 ── */

function head(title: string, lang: Lang = 'en'): string {
  const desc = I18N[lang].meta.desc;
  return `<!doctype html>
<html lang="${lang === 'zh' ? 'zh-CN' : 'en'}">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${title}</title>
<link rel="icon" type="image/svg+xml" href="${LOGO_SVG.replace(/[\r\n]/g, '')}"/>
<meta name="description" content="${desc}"/>
<style>${CSS}</style>
</head>`;
}

function nav(active: 'home' | 'docs' | 'start' | 'privacy' | 'terms', lang: Lang = 'en'): string {
  const t = I18N[lang].nav;
  return `<header class="nav">
<div class="nav-inner">
  <a class="brand" href="/">${LOGO_MINI}<span>Neko GitHub App</span></a>
  <nav class="nav-links">
    <a href="/" class="${active === 'home' ? 'active' : ''}">${t.home}</a>
    <a href="/docs"${active === 'docs' || active === 'start' ? ' class="active"' : ''}>${t.docs}</a>
    <a href="/privacy"${active === 'privacy' ? ' class="active"' : ''}>${t.privacy}</a>
    <a href="/terms"${active === 'terms' ? ' class="active"' : ''}>${t.terms}</a>
    <div class="lang-switch" role="group" aria-label="${t.lang}">
      <a href="?lang=en" class="${lang === 'en' ? 'active' : ''}">EN</a>
      <a href="?lang=zh" class="${lang === 'zh' ? 'active' : ''}">中文</a>
    </div>
    <button class="nav-btn" id="thBtn" aria-label="主题切换"><span class="ti">${ICONS.monitor}</span></button>
  </nav>
</div>
</header>`;
}

function footer(lang: Lang = 'en'): string {
  const t = I18N[lang].footer;
  return `<footer class="footer">
<div class="wrap footer-inner">
  <div class="footer-brand">${LOGO_MINI}<span>Neko GitHub App</span></div>
  <div class="footer-links">
    <a href="/">${t.home}</a>
    <a href="/docs">${t.docs}</a>
    <a href="/privacy">${t.privacy}</a>
    <a href="/terms">${t.terms}</a>
  </div>
</div>
<div class="footer-copy">${t.powered}</div>
</footer>`;
}

/* ══════════════════════════════════════
   官网首页 —— 参考 astrbot.app
   ══════════════════════════════════════ */
export function homepage(lang: Lang): string {
  const s = I18N[lang].home;
  const h1a = lang === 'zh' ? '让 GitHub 仓库' : 'Let your GitHub repos';
  const cardIcons = [ICONS.tag, ICONS.chat, ICONS.clock, ICONS.bell, ICONS.check, ICONS.forward];
  const featureCards = s.cards.map((c: any, i: number) =>
    `<div class="card animate-fadeUp"><div class="card-icon">${cardIcons[i]}</div><div class="card-rot"><span class="active"><h3>${c.t1}</h3><p>${c.d1}</p></span><span><h3>${c.t2}</h3><p>${c.d2}</p></span></div></div>`
  ).join('');
  const whyIcons = [ICONS.rocket, ICONS.gear, ICONS.shield, ICONS.doc];
  const whyCards = s.whyCards.map((c: any, i: number) =>
    `<div class="card"><div class="card-icon">${whyIcons[i]}</div><h3>${c.t}</h3><p>${c.d}</p></div>`
  ).join('');
  const rotator = s.rotator.map((r: string, i: number) => `<span class="${i === 0 ? 'active' : ''}">${r}</span>`).join('');
  return `${head(I18N[lang].meta.titleHome, lang)}
<body>
${nav('home', lang)}
<main class="wrap">
  <section class="hero">
    <div class="hero-badge animate-fadeUp">${ICONS.shield} ${s.badge}</div>
    <h1 class="animate-fadeUp-d1">${h1a}<br/><span class="hl"><span id="heroRotator" class="rotator">${rotator}</span></span></h1>
    <p class="animate-fadeUp-d2">${s.desc}</p>
    <div class="hero-actions animate-fadeUp-d3">
      <a class="btn btn-primary" data-install href="#">${ICONS.download}<span>${s.install}</span></a>
      <a class="btn btn-outline" href="/docs">${ICONS.doc}<span>${s.viewDocs}</span></a>
    </div>
  </section>

  <section id="features" class="section">
    <h2 class="section-title">${s.featuresTitle}</h2>
    <p class="section-sub">${s.featuresSub}</p>
    <div class="grid">
      ${featureCards}
    </div>
  </section>

  <section class="section">
    <h2 class="section-title">${s.whyTitle}</h2>
    <p class="section-sub">${s.whySub}</p>
    <div class="grid">
      ${whyCards}
    </div>
  </section>
</main>
${footer(lang)}
<script>${THEME_JS}</script>
<script>${INSTALL_JS}</script>
</body></html>`;
}

/* ══════════════════════════════════════
   文档主页（GET /docs）
   Hero + 徽章 + 快速开始卡片 + 安装按钮
   参考 docs.astrbot.app 首页风格
   ══════════════════════════════════════ */
export function docsPage(lang: Lang): string {
  const s = I18N[lang].docs;
  const h1mid = lang === 'zh' ? '服务' : 'for ';
  const qsIcons = [ICONS.download, ICONS.gear, ICONS.check];
  const qsCards = s.qsCards.map((c: any, i: number) =>
    `<div class="card animate-fadeUp"><div class="card-icon">${qsIcons[i]}</div><h3>${c.t}</h3><p>${c.d}</p></div>`
  ).join('');
  const featIcons = [ICONS.tag, ICONS.chat, ICONS.clock, ICONS.bell, ICONS.check, ICONS.forward];
  const featCards = s.featCards.map((c: any, i: number) =>
    `<div class="card"><div class="card-icon">${featIcons[i]}</div><h3>${c.t}</h3><p>${c.d}</p></div>`
  ).join('');
  return `${head(I18N[lang].meta.titleDocs, lang)}
<body>
${nav('docs', lang)}
<main class="wrap">
  <section class="docs-hero">
    <div class="docs-hero-badge animate-fadeUp">${ICONS.shield} ${s.badge}</div>
    <h1 class="animate-fadeUp-d1">${s.h1a}<br/>${h1mid}<span class="hl">${s.h1b}</span></h1>
    <p class="animate-fadeUp-d2">${s.sub}</p>
    <div class="hero-actions animate-fadeUp-d3">
      <a class="btn btn-primary" data-install href="#">${ICONS.download}<span>${s.install}</span></a>
      <a class="btn btn-outline" href="/docs/start">${ICONS.doc}<span>${s.start}</span></a>
    </div>
  </section>

  <section class="section">
    <h2 class="section-title">${s.qsTitle}</h2>
    <div class="grid">
      ${qsCards}
    </div>
  </section>

  <section class="section">
    <h2 class="section-title">${s.featTitle}</h2>
    <div class="grid">
      ${featCards}
    </div>
  </section>

  <section class="section" style="text-align:center">
    <p style="color:var(--muted);font-size:1rem;margin-bottom:18px">${s.cta}</p>
    <a class="btn btn-primary" href="/docs/start">${ICONS.doc}<span>${s.fullDocs}</span></a>
  </section>
</main>
${footer(lang)}
<script>${THEME_JS}</script>
<script>${INSTALL_JS}</script>
</body></html>`;
}

/* ══════════════════════════════════════
   文档内容页（GET /docs/start）
   左侧导航（可点击跳转）+ 中间内容区
   删除右侧 TOC，删除发布指南和权限事件章节
   只保留用户需要的内容 + FAQ + Marketplace 填写指南
   ══════════════════════════════════════ */
export function docsStartPage(lang: Lang): string {

  /* 左侧导航（可点击跳转到对应章节） */
  const sidebar = `
<aside class="doc-sidebar">
${I18N[lang].start.sidebar.map((g: any, gi: number) => `
  <div class="sidebar-group">
    <div class="sidebar-label">${g.label}</div>
${g.links.map((l: any, li: number) => `    <a href="${l.href}" class="sidebar-link${gi === 0 && li === 0 ? ' active' : ''}">${l.t}</a>`).join('\n')}
  </div>`).join('\n')}
</aside>`;

  /* 主内容区 —— 删除了「权限与事件」章节，保留了 Marketplace 发布指南和 FAQ */
  const content = lang === 'zh' ? START_CONTENT_ZH : START_CONTENT_EN;

  return `${head(I18N[lang].meta.titleStart, lang)}
<body>
${nav('start', lang)}
<main class="wrap">
  <!-- 两栏布局：左导航 | 内容（无右侧 TOC）-->
  <div class="doc-layout">
    ${sidebar}
    ${content}
  </div>
</main>
${footer(lang)}
<script>${THEME_JS}</script>
<script>${SIDEBAR_JS}</script>
<script>${INSTALL_JS}</script>
</body></html>`;
}

/* ══════════════════════════════════════
   隐私政策（英文，符合 GitHub Marketplace 要求）
   GET /privacy
   ══════════════════════════════════════ */
const PRIVACY_CONTENT_EN = `
<article class="doc-content" style="max-width:820px;margin:48px auto">
<h1>Privacy Policy</h1>
<p class="doc-sub">Last updated: August 16, 2026</p>

<h2 id="overview">1. Overview</h2>
<p>Neko GitHub App (the "App", "we", "us") is a free, open-source GitHub application that automates routine repository tasks such as issue labeling, welcome replies, stale issue management, release notifications, pull request checks, and webhook forwarding. The App runs entirely on Cloudflare Workers and processes data only when you install it on a repository.</p>

<h2 id="data">2. Information We Process</h2>
<p>The App does <strong>not</strong> collect, store, or transmit any personally identifiable information (PII) about you or your users.</p>
<p>The only data the App touches is <strong>repository technical metadata</strong> delivered by GitHub through webhooks:</p>
<ul>
  <li>Issue and pull request titles, bodies, labels, comments, and statuses;</li>
  <li>Release metadata (version, name, notes, author);</li>
  <li>Repository name and the per-repository configuration file <code>.github/neko-app.yml</code>.</li>
</ul>
<p>This data belongs to the repository and is technical in nature; it is not personal data.</p>

<h2 id="processing">3. How We Process Data</h2>
<ul>
  <li>GitHub delivers event payloads to our endpoint over HTTPS (webhooks).</li>
  <li>All processing happens <strong>in-memory</strong> inside the Cloudflare Worker. We do not persist, log, or store any payload data. Data is discarded immediately after the response is generated.</li>
  <li>The App reads the per-repository config file <code>.github/neko-app.yml</code> on each event. It is never cached or stored by us.</li>
</ul>

<h2 id="sharing">4. Data Sharing and Sub-processors</h2>
<ul>
  <li>We do <strong>not</strong> sell, rent, or share any data with third parties.</li>
  <li>The App only sends data when <strong>you explicitly configure it</strong>:
    <ul>
      <li><code>releaseNotify.channels</code> — Release summaries are POSTed as JSON to URLs <em>you</em> provide (for example your own chat-bot webhook).</li>
      <li><code>forward.url</code> — GitHub event payloads are forwarded to a URL <em>you</em> specify.</li>
    </ul>
  </li>
  <li>Sub-processors we rely on:
    <ul>
      <li><strong>Cloudflare Workers</strong> — executes the App code and terminates TLS.</li>
      <li><strong>GitHub API</strong> (via the Octokit SDK) — reads and writes issues, pull requests, labels, and comments on your behalf, using only the permissions you granted.</li>
    </ul>
  </li>
</ul>

<h2 id="security">5. Security</h2>
<ul>
  <li>Every inbound webhook is verified using HMAC-SHA256 against the <code>X-Hub-Signature-256</code> header. Requests with invalid signatures are rejected with HTTP 401.</li>
  <li>Secrets (the App private key and the webhook secret) are stored encrypted via Cloudflare Workers Secrets and never appear in source code or logs.</li>
  <li>The App requests only the minimum GitHub permissions required (Issues and Pull Requests read &amp; write; Metadata, Contents, and Releases read).</li>
  <li>The App uses no cookies, no user sessions, and embeds no third-party analytics or tracking scripts.</li>
</ul>

<h2 id="retention">6. Data Retention</h2>
<p>We retain no user or repository data. Because processing is in-memory and ephemeral, no data persists after a request completes.</p>

<h2 id="rights">7. Your Rights and Choices</h2>
<ul>
  <li>You can stop all processing at any time by uninstalling the App or by setting <code>enabled: false</code> in <code>.github/neko-app.yml</code>.</li>
  <li>Because we do not store personal data, there is no personal data for us to access, correct, or delete.</li>
</ul>

<h2 id="compliance">8. Compliance</h2>
<p>The App does not process personal data as defined under the GDPR or the CCPA, because it operates only on repository technical metadata. If you believe any personal data is involved, contact us and we will address it promptly.</p>

<h2 id="contact">9. Contact</h2>
<p>For privacy questions, reach us through the GitHub App page or the project repository issues.</p>
</article>
`;

const PRIVACY_CONTENT_ZH = `
<article class="doc-content" style="max-width:820px;margin:48px auto">
<h1>隐私政策</h1>
<p class="doc-sub">最后更新：2026 年 8 月 16 日</p>

<h2 id="overview">1. 概述</h2>
<p>Neko GitHub App（简称「本应用」「我们」）是一款免费、开源的 GitHub 应用，用于自动化处理仓库的常规任务，如 Issue 标签、欢迎回复、陈旧 Issue 清理、Release 通知、Pull Request 检查以及 Webhook 转发。本应用完全运行于 Cloudflare Workers，仅在您将应用安装到仓库时才会处理数据。</p>

<h2 id="data">2. 我们处理的信息</h2>
<p>本应用<strong>不会</strong>收集、存储或传输任何关于您或您用户的个人身份信息（PII）。</p>
<p>本应用接触的唯一数据是 GitHub 通过 Webhook 推送的<strong>仓库技术元数据</strong>：</p>
<ul>
  <li>Issue 与 Pull Request 的标题、正文、标签、评论及状态；</li>
  <li>Release 元数据（版本、名称、说明、作者）；</li>
  <li>仓库名称以及各仓库的配置文件 <code>.github/neko-app.yml</code>。</li>
</ul>
<p>这些数据属于仓库且为技术性数据，并非个人数据。</p>

<h2 id="processing">3. 我们如何处理数据</h2>
<ul>
  <li>GitHub 通过 HTTPS（Webhook）将事件载荷投递到我们的接口。</li>
  <li>所有处理均在 Cloudflare Worker <strong>内存中</strong>完成。我们不会持久化、记录或存储任何载荷数据。数据在响应生成后立即丢弃。</li>
  <li>本应用会在每次事件时读取各仓库的配置文件 <code>.github/neko-app.yml</code>，我们不会对其进行缓存或存储。</li>
</ul>

<h2 id="sharing">4. 数据共享与子处理方</h2>
<ul>
  <li>我们<strong>不会</strong>向第三方出售、出租或共享任何数据。</li>
  <li>仅在<strong>您明确配置</strong>时，本应用才会发送数据：
    <ul>
      <li><code>releaseNotify.channels</code> —— Release 摘要以 JSON 形式 POST 到<em>您</em>提供的地址（例如您自己的聊天机器人 Webhook）。</li>
      <li><code>forward.url</code> —— GitHub 事件载荷会被转发到<em>您</em>指定的地址。</li>
    </ul>
  </li>
  <li>我们依赖的子处理方：
    <ul>
      <li><strong>Cloudflare Workers</strong> —— 执行应用代码并终结 TLS。</li>
      <li><strong>GitHub API</strong>（通过 Octokit SDK）—— 在您授权范围内读写 Issue、Pull Request、标签与评论。</li>
    </ul>
  </li>
</ul>

<h2 id="security">5. 安全</h2>
<ul>
  <li>每一个入站 Webhook 都会使用 HMAC-SHA256 对照 <code>X-Hub-Signature-256</code> 头进行校验。签名无效的请求将被拒绝（HTTP 401）。</li>
  <li>密钥（应用私钥与 Webhook 密钥）通过 Cloudflare Workers Secrets 加密存储，绝不会出现在源码或日志中。</li>
  <li>本应用仅申请运行所需的最小 GitHub 权限（Issues 与 Pull Requests 的读写；Metadata、Contents、Releases 的读取）。</li>
  <li>本应用不使用 Cookie、不建立用户会话，也不嵌入任何第三方分析或跟踪脚本。</li>
</ul>

<h2 id="retention">6. 数据保留</h2>
<p>我们不保留任何用户或仓库数据。由于处理是内存级、临时性的，请求完成后没有任何数据留存。</p>

<h2 id="rights">7. 您的权利与选择</h2>
<ul>
  <li>您可以随时通过卸载应用或在 <code>.github/neko-app.yml</code> 中设置 <code>enabled: false</code> 来停止全部处理。</li>
  <li>由于我们不存储个人数据，也就没有可供访问、更正或删除的个人数据。</li>
</ul>

<h2 id="compliance">8. 合规性</h2>
<p>由于本应用仅处理仓库技术元数据，不涉及 GDPR 或 CCPA 所定义的个人数据。如果您认为涉及任何个人数据，请联系我们，我们会及时处理。</p>

<h2 id="contact">9. 联系方式</h2>
<p>如有隐私相关问题，可通过 GitHub 应用页面或项目仓库的 Issue 联系我们。</p>
</article>
`;

export function privacyPage(lang: Lang): string {
  const content = lang === 'zh' ? PRIVACY_CONTENT_ZH : PRIVACY_CONTENT_EN;
  return `${head(I18N[lang].meta.titlePrivacy, lang)}
<body>
${nav('privacy', lang)}
<main class="wrap">
${content}
</main>
${footer(lang)}
<script>${THEME_JS}</script>
</body></html>`;
}

/* ══════════════════════════════════════
   服务条款（英文，符合 GitHub Marketplace 要求）
   GET /terms
   ══════════════════════════════════════ */
const TERMS_CONTENT_EN = `
<article class="doc-content" style="max-width:820px;margin:48px auto">
<h1>Terms of Service</h1>
<p class="doc-sub">Last updated: August 16, 2026</p>

<h2 id="acceptance">1. Acceptance of Terms</h2>
<p>By installing or using Neko GitHub App (the "Service"), you agree to be bound by these Terms of Service. If you do not agree, do not install or use the Service.</p>

<h2 id="description">2. Description of Service</h2>
<p>The Service is a free GitHub application that performs automation on the repositories where it is installed, including auto-labeling, welcome replies, stale issue management, release notifications, pull request checks, and webhook forwarding. The Service runs on Cloudflare Workers and is provided without charge.</p>

<h2 id="license">3. Use License</h2>
<p>The Service is provided free of charge. Your use of the Service must comply with the GitHub Terms of Service and GitHub Acceptable Use Policies. You are responsible for the content of the repositories where the Service is installed.</p>

<h2 id="acceptable">4. Acceptable Use</h2>
<p>You agree not to:</p>
<ul>
  <li>Use the Service for any unlawful purpose;</li>
  <li>Attempt to abuse, overload, reverse-engineer, or attack the Service, Cloudflare, or GitHub;</li>
  <li>Use the Service to send spam, malware, or malicious content through any configured webhook or notification channel;</li>
  <li>Impersonate any person or entity, or misrepresent your affiliation.</li>
</ul>

<h2 id="warranty">5. No Warranty</h2>
<p>The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, whether express or implied. We do not warrant that the Service will be uninterrupted, timely, secure, or error-free.</p>

<h2 id="liability">6. Limitation of Liability</h2>
<p>To the maximum extent permitted by law, in no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of data, arising out of or in connection with your use of the Service.</p>

<h2 id="changes">7. Changes to the Service or Terms</h2>
<p>We may modify the Service or these Terms at any time. Material changes will be reflected by the "Last updated" date above. Your continued use of the Service after changes constitutes acceptance of the new Terms.</p>

<h2 id="termination">8. Termination</h2>
<p>You may stop using the Service at any time by uninstalling the App from your repositories. We may suspend or discontinue the Service for any reason, including violation of these Terms.</p>

<h2 id="law">9. Governing Law</h2>
<p>These Terms are governed by the laws of the jurisdiction in which the operator is established, without regard to its conflict-of-law principles.</p>

<h2 id="contact">10. Contact</h2>
<p>Questions about these Terms can be directed to us through the GitHub App page or the project repository issues.</p>
</article>
`;

const TERMS_CONTENT_ZH = `
<article class="doc-content" style="max-width:820px;margin:48px auto">
<h1>服务条款</h1>
<p class="doc-sub">最后更新：2026 年 8 月 16 日</p>

<h2 id="acceptance">1. 条款的接受</h2>
<p>通过安装或使用 Neko GitHub App（简称「本服务」），即表示您同意受本服务条款约束。若您不同意，请勿安装或使用本服务。</p>

<h2 id="description">2. 服务说明</h2>
<p>本服务是一款免费的 GitHub 应用，对安装有它的仓库执行自动化操作，包括自动打标签、欢迎回复、陈旧 Issue 清理、Release 通知、Pull Request 检查以及 Webhook 转发。本服务运行于 Cloudflare Workers，不收取任何费用。</p>

<h2 id="license">3. 使用许可</h2>
<p>本服务免费提供。您对本服务的使用必须遵守 GitHub 服务条款及 GitHub 可接受使用政策。您需对安装有本服务的仓库内容负责。</p>

<h2 id="acceptable">4. 可接受的使用</h2>
<p>您同意不会：</p>
<ul>
  <li>将本服务用于任何非法目的；</li>
  <li>试图滥用、过载、逆向工程或攻击本服务、Cloudflare 或 GitHub；</li>
  <li>通过任何已配置的 Webhook 或通知通道发送垃圾信息、恶意软件或恶意内容；</li>
  <li>冒充任何个人或实体，或虚假陈述您的关联关系。</li>
</ul>

<h2 id="warranty">5. 无担保</h2>
<p>本服务按「现状」及「当前可用」提供，不附带任何明示或暗示的担保。我们不保证本服务不间断、及时、安全或无错误。</p>

<h2 id="liability">6. 责任限制</h2>
<p>在法律允许的最大范围内，对于因您使用本服务而引起的任何间接、偶然、特殊、后果性或惩罚性损害，或任何数据丢失，我们概不负责。</p>

<h2 id="changes">7. 服务或条款的变更</h2>
<p>我们可随时修改本服务或本条款。重大变更将通过上方的「最后更新」日期体现。变更后您继续使用本服务即视为接受新条款。</p>

<h2 id="termination">8. 终止</h2>
<p>您可随时通过在仓库中卸载应用来停止使用该服务。我们亦可出于任何原因（包括违反本条款）暂停或终止本服务。</p>

<h2 id="law">9. 管辖法律</h2>
<p>本条款受运营者所在司法辖区法律管辖，不适用其冲突法原则。</p>

<h2 id="contact">10. 联系方式</h2>
<p>有关本条款的问题，可通过 GitHub 应用页面或项目仓库的 Issue 联系我们。</p>
</article>
`;

export function termsPage(lang: Lang): string {
  const content = lang === 'zh' ? TERMS_CONTENT_ZH : TERMS_CONTENT_EN;
  return `${head(I18N[lang].meta.titleTerms, lang)}
<body>
${nav('terms', lang)}
<main class="wrap">
${content}
</main>
${footer(lang)}
<script>${THEME_JS}</script>
</body></html>`;
}
